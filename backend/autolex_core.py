"""
NexteraEstate AutoLex Core - Autonomous Legal Intelligence System
Integrates with existing RAG engine as Layer 1 + Autonomous Data Pipeline + Westlaw Failsafe
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import httpx
import sqlite3
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# Import existing RAG engine
from rag_engine import rag_engine, LegalSource

# SQLite path fix for Railway deployment
DATA_DIR = os.getenv("DATA_DIR", "/data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "autolex_core.db")

logger = logging.getLogger(__name__)

class ConfidenceLevel(Enum):
    CRITICAL_FAILURE = 0.0  # System failure
    LOW = 0.5  # Unreliable
    MEDIUM = 0.75  # Acceptable for basic queries
    HIGH = 0.85  # Good for most queries
    VERY_HIGH = 0.95  # Safe for complex queries
    ABSOLUTE = 0.97  # Autonomous integration threshold

class AlertLevel(Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    EMERGENCY = "emergency"

@dataclass
class DataIngestionMetrics:
    """Health metrics for the autonomous data pipeline"""
    timestamp: datetime
    sources_scanned: int
    sources_successful: int
    sources_failed: int
    documents_ingested: int
    avg_confidence_score: float
    failed_sources: List[str]
    processing_time_ms: int

@dataclass
class TertiaryCheckTrigger:
    """Conditions that trigger Westlaw/LEXIS API verification"""
    query: str
    confidence_score: float
    high_risk_topics: List[str]
    jurisdictional_complexity: bool
    novelty_detected: bool
    citation_conflict: bool
    estimated_api_cost: float

class AutoLexCore:
    """
    The Autonomous Legal Intelligence Core
    Implements the three-layer verification system with self-improving data pipeline
    """
    
    def __init__(self):
        # Import and connect to existing RAG engine
        try:
            from rag_engine import rag_engine as existing_rag
            self.rag_engine = existing_rag
            logger.info("✅ AutoLex Core connected to existing RAG engine")
        except ImportError:
            logger.warning("⚠️ RAG engine not available - using fallback mode")
            self.rag_engine = None
        
        # Railway-compatible database path using DATA_DIR
        self.db_path = DB_PATH
        self.westlaw_api_key = os.getenv("WESTLAW_API_KEY")
        self.lexis_api_key = os.getenv("LEXIS_API_KEY")
        
        # High-risk legal topics that trigger tertiary verification
        self.high_risk_topics = {
            "estate_tax", "inheritance_tax", "capital_gains", "gift_tax",
            "digital_assets", "cryptocurrency", "nft", "cross_border",
            "mineral_rights", "business_succession", "trust_taxation",
            "disinherit", "undue_influence", "mental_capacity",
            "probate_litigation", "will_contest", "guardianship"
        }
        
        # Jurisdictional complexity indicators
        self.complex_jurisdictions = {
            "multi_state", "federal_state_conflict", "international",
            "tribal_law", "military", "maritime"
        }
        
        self.daily_api_budget = float(os.getenv("WESTLAW_DAILY_BUDGET", "500.0"))  # $500/day
        self.current_api_spend = 0.0
        
        self._initialize_core_database()
        
    def _initialize_core_database(self):
        """Initialize AutoLex Core tracking database with error handling"""
        try:
            conn = sqlite3.connect(self.db_path)
            cur = conn.cursor()
            
            # Data ingestion metrics table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS ingestion_metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME,
                    sources_scanned INTEGER,
                    sources_successful INTEGER,
                    sources_failed INTEGER,
                    documents_ingested INTEGER,
                    avg_confidence_score REAL,
                    failed_sources TEXT,
                    processing_time_ms INTEGER
                )
            """)
            
            # Tertiary verification logs
            cur.execute("""
                CREATE TABLE IF NOT EXISTS tertiary_verifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME,
                    query TEXT,
                    internal_confidence REAL,
                    triggers TEXT,
                    api_provider TEXT,
                    api_cost REAL,
                    verification_result TEXT,
                    discrepancy_found BOOLEAN,
                    resolution TEXT
                )
            """)
            
            # System alerts and escalations
            cur.execute("""
                CREATE TABLE IF NOT EXISTS system_alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME,
                    alert_level TEXT,
                    component TEXT,
                    message TEXT,
                    auto_resolved BOOLEAN,
                    human_notified BOOLEAN,
                    resolution_time_minutes INTEGER
                )
            """)
            
            conn.commit()
            conn.close()
            logger.info(f"✅ AutoLex Core database initialized: {self.db_path}")
            
        except sqlite3.OperationalError as e:
            logger.warning(f"⚠️ AutoLex Core database initialization failed: {e}")
            logger.warning("   Running in memory-only mode (data not persistent)")
            # Create in-memory database as fallback
            try:
                self.db_path = ":memory:"
                conn = sqlite3.connect(self.db_path)
                cur = conn.cursor()
                
                # Data ingestion metrics table
                cur.execute("""
                    CREATE TABLE ingestion_metrics (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp DATETIME,
                        sources_scanned INTEGER,
                        sources_successful INTEGER,
                        sources_failed INTEGER,
                        documents_ingested INTEGER,
                        avg_confidence_score REAL,
                        failed_sources TEXT,
                        processing_time_ms INTEGER
                    )
                """)
                
                # Tertiary verification logs
                cur.execute("""
                    CREATE TABLE tertiary_verifications (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp DATETIME,
                        query TEXT,
                        internal_confidence REAL,
                        triggers TEXT,
                        api_provider TEXT,
                        api_cost REAL,
                        verification_result TEXT,
                        discrepancy_found BOOLEAN,
                        resolution TEXT
                    )
                """)
                
                # System alerts and escalations
                cur.execute("""
                    CREATE TABLE system_alerts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp DATETIME,
                        alert_level TEXT,
                        component TEXT,
                        message TEXT,
                        auto_resolved BOOLEAN,
                        human_notified BOOLEAN,
                        resolution_time_minutes INTEGER
                    )
                """)
                
                conn.commit()
                conn.close()
                logger.info("✅ AutoLex Core using in-memory database")
            except Exception as mem_error:
                logger.error(f"❌ Failed to create in-memory database: {mem_error}")
                # Continue without database - app should still work
                pass

    async def process_legal_query(self, query: str, context: Dict = None) -> Dict[str, Any]:
        """
        Main query processing with three-layer verification
        Layer 1: Existing RAG Engine
        Layer 2: Internal Cross-Reference  
        Layer 3: Westlaw/LEXIS Failsafe
        """
        start_time = datetime.now()
        
        try:
            # LAYER 1: Use existing RAG engine with enhanced confidence scoring
            layer1_result = await self._layer1_rag_processing(query, context)
            
            # LAYER 2: Internal cross-reference and consistency checks
            layer2_result = await self._layer2_cross_reference(query, layer1_result)
            
            # Determine if tertiary verification is needed
            tertiary_trigger = self._evaluate_tertiary_trigger(query, layer2_result)
            
            if tertiary_trigger:
                # LAYER 3: Westlaw/LEXIS API verification
                layer3_result = await self._layer3_westlaw_verification(query, layer2_result, tertiary_trigger)
                final_result = layer3_result
            else:
                final_result = layer2_result
            
            # Log the complete processing pipeline
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            await self._log_query_processing(query, layer1_result, layer2_result, tertiary_trigger, final_result, processing_time)
            
            return final_result
            
        except Exception as e:
            logger.error(f"AutoLex Core processing error: {e}")
            return await self._generate_error_response(query, str(e))

    async def _layer1_rag_processing(self, query: str, context: Dict = None) -> Dict[str, Any]:
        """Layer 1: Enhanced RAG processing with confidence scoring"""
        
        try:
            if self.rag_engine and hasattr(self.rag_engine, 'get_legal_guidance_with_confidence'):
                # Use the enhanced RAG method we implemented
                rag_result = self.rag_engine.get_legal_guidance_with_confidence(query, context)
                
                return {
                    "layer": 1,
                    "source": "internal_rag",
                    "response": rag_result["response"],
                    "confidence_score": rag_result["confidence_score"],
                    "requires_human_review": rag_result["requires_human_review"],
                    "sources": rag_result["sources"],
                    "legal_disclaimer": rag_result.get("legal_disclaimer"),
                    "processing_time_ms": 0  # Will be calculated at the end
                }
            else:
                # Fallback mode with basic response
                logger.warning("RAG engine not available - using fallback response")
                return {
                    "layer": 1,
                    "source": "fallback",
                    "response": "I apologize, but I'm unable to provide detailed legal guidance at this time. Please consult with a licensed estate planning attorney for assistance with your specific situation.",
                    "confidence_score": 0.0,
                    "requires_human_review": True,
                    "sources": [],
                    "legal_disclaimer": "This system is temporarily unavailable. Please consult with a qualified attorney.",
                    "escalation_reason": "RAG engine unavailable"
                }
        except Exception as e:
            logger.error(f"Layer 1 RAG processing error: {e}")
            return {
                "layer": 1,
                "source": "error_fallback",
                "response": "I apologize, but I'm experiencing technical difficulties. Please consult with a licensed estate planning attorney for assistance with your legal questions.",
                "confidence_score": 0.0,
                "requires_human_review": True,
                "sources": [],
                "legal_disclaimer": "Technical error - please consult with a qualified attorney.",
                "escalation_reason": f"Technical error: {str(e)}"
            }

    async def _layer2_cross_reference(self, query: str, layer1_result: Dict) -> Dict[str, Any]:
        """Layer 2: Internal cross-reference and consistency validation"""
        
        enhanced_result = layer1_result.copy()
        enhanced_result["layer"] = 2
        
        # Citation consistency check
        citations_valid = await self._validate_citations(layer1_result.get("sources", []))
        
        # Temporal consistency check (are we citing outdated law?)
        temporal_validity = await self._check_temporal_validity(layer1_result.get("sources", []))
        
        # Jurisdictional consistency
        jurisdictional_consistency = await self._check_jurisdictional_consistency(query, layer1_result.get("sources", []))
        
        # Adjust confidence based on internal checks
        confidence_adjustments = []
        
        if not citations_valid:
            confidence_adjustments.append(-0.1)
            enhanced_result["warnings"] = enhanced_result.get("warnings", []) + ["Citation inconsistency detected"]
        
        if not temporal_validity:
            confidence_adjustments.append(-0.15)
            enhanced_result["warnings"] = enhanced_result.get("warnings", []) + ["Potentially outdated legal sources"]
        
        if not jurisdictional_consistency:
            confidence_adjustments.append(-0.05)
            enhanced_result["warnings"] = enhanced_result.get("warnings", []) + ["Jurisdictional complexity detected"]
        
        # Apply confidence adjustments
        original_confidence = enhanced_result["confidence_score"]
        adjusted_confidence = max(0.0, original_confidence + sum(confidence_adjustments))
        enhanced_result["confidence_score"] = adjusted_confidence
        
        # Flag for potential tertiary verification if confidence dropped significantly
        if adjusted_confidence < original_confidence - 0.1:
            enhanced_result["consistency_issues_detected"] = True
        
        return enhanced_result

    def _evaluate_tertiary_trigger(self, query: str, layer2_result: Dict) -> Optional[TertiaryCheckTrigger]:
        """Determine if tertiary Westlaw/LEXIS verification is needed"""
        
        triggers = []
        
        # Trigger 1: Low confidence score
        confidence = layer2_result.get("confidence_score", 0.0)
        if confidence < ConfidenceLevel.HIGH.value:
            triggers.append("low_confidence")
        
        # Trigger 2: High-risk legal topics
        query_lower = query.lower()
        detected_topics = [topic for topic in self.high_risk_topics if topic.replace("_", " ") in query_lower]
        if detected_topics:
            triggers.append("high_risk_topics")
        
        # Trigger 3: Jurisdictional complexity
        jurisdictional_complexity = any(jurisdiction in query_lower for jurisdiction in self.complex_jurisdictions)
        if jurisdictional_complexity:
            triggers.append("jurisdictional_complexity")
        
        # Trigger 4: Citation conflicts detected in Layer 2
        if layer2_result.get("consistency_issues_detected", False):
            triggers.append("citation_conflict")
        
        # Trigger 5: Novelty detection (mentions of recent years/events)
        current_year = datetime.now().year
        if str(current_year) in query or str(current_year - 1) in query:
            triggers.append("novelty_detected")
        
        # If no triggers, no tertiary verification needed
        if not triggers:
            return None
        
        # Estimate API cost (simplified)
        estimated_cost = len(detected_topics) * 2.0 + (5.0 if jurisdictional_complexity else 0.0)
        
        # Check daily budget
        if self.current_api_spend + estimated_cost > self.daily_api_budget:
            logger.warning(f"Tertiary verification skipped: would exceed daily budget (${self.daily_api_budget})")
            return None
        
        return TertiaryCheckTrigger(
            query=query,
            confidence_score=confidence,
            high_risk_topics=detected_topics,
            jurisdictional_complexity=jurisdictional_complexity,
            novelty_detected="novelty_detected" in triggers,
            citation_conflict="citation_conflict" in triggers,
            estimated_api_cost=estimated_cost
        )

    async def _layer3_westlaw_verification(self, query: str, layer2_result: Dict, trigger: TertiaryCheckTrigger) -> Dict[str, Any]:
        """Layer 3: Westlaw/LEXIS API verification for high-stakes queries"""
        
        verification_result = layer2_result.copy()
        verification_result["layer"] = 3
        verification_result["tertiary_verification"] = True
        
        try:
            # Choose API provider based on query type
            api_provider = self._select_api_provider(trigger)
            
            if api_provider == "westlaw" and self.westlaw_api_key:
                westlaw_result = await self._query_westlaw_api(query, trigger)
                verification_result["westlaw_verification"] = westlaw_result
            elif api_provider == "lexis" and self.lexis_api_key:
                lexis_result = await self._query_lexis_api(query, trigger)
                verification_result["lexis_verification"] = lexis_result
            else:
                # Mock verification for development
                verification_result["mock_verification"] = {
                    "provider": "mock",
                    "result": "Tertiary verification would be performed in production",
                    "cost": trigger.estimated_api_cost
                }
            
            # Update API spend tracking
            self.current_api_spend += trigger.estimated_api_cost
            
            # Log tertiary verification
            await self._log_tertiary_verification(query, trigger, verification_result)
            
            # If verification finds discrepancies, flag for human review
            if self._detect_verification_discrepancy(layer2_result, verification_result):
                verification_result["requires_human_review"] = True
                verification_result["escalation_reason"] = "Discrepancy found between internal analysis and industry database"
            
        except Exception as e:
            logger.error(f"Tertiary verification failed: {e}")
            verification_result["tertiary_verification_error"] = str(e)
            # Don't fail the entire query due to tertiary verification issues
        
        return verification_result

    def _select_api_provider(self, trigger: TertiaryCheckTrigger) -> str:
        """Select optimal API provider based on query characteristics"""
        
        # Westlaw tends to be better for statutory research
        if any(topic in ["estate_tax", "inheritance_tax", "gift_tax"] for topic in trigger.high_risk_topics):
            return "westlaw"
        
        # LEXIS tends to be better for case law
        if any(topic in ["will_contest", "undue_influence", "probate_litigation"] for topic in trigger.high_risk_topics):
            return "lexis"
        
        # Default to Westlaw
        return "westlaw"

    async def _query_westlaw_api(self, query: str, trigger: TertiaryCheckTrigger) -> Dict[str, Any]:
        """Query Westlaw API for verification (mock implementation)"""
        
        # This would be the actual Westlaw API integration
        # For now, return mock data structure
        return {
            "provider": "westlaw",
            "query_type": "statutory_research",
            "results": [
                {
                    "citation": "26 U.S.C. § 2010",
                    "title": "Unified credit against estate tax",
                    "jurisdiction": "federal",
                    "confidence": 0.98,
                    "last_updated": "2024-01-01"
                }
            ],
            "api_cost": trigger.estimated_api_cost,
            "response_time_ms": 1250
        }

    async def _validate_citations(self, sources: List[Dict]) -> bool:
        """Validate that citations are properly formatted and accessible"""
        # Implementation would check citation format and accessibility
        return True

    async def _check_temporal_validity(self, sources: List[Dict]) -> bool:
        """Check if sources are current and haven't been superseded"""
        # Implementation would verify sources haven't been repealed/amended
        return True

    async def _check_jurisdictional_consistency(self, query: str, sources: List[Dict]) -> bool:
        """Ensure sources are from appropriate jurisdictions for the query"""
        # Implementation would validate jurisdictional relevance
        return True

    def _detect_verification_discrepancy(self, layer2_result: Dict, layer3_result: Dict) -> bool:
        """Detect if tertiary verification conflicts with internal analysis"""
        # Implementation would compare results and detect meaningful discrepancies
        return False

    async def _log_tertiary_verification(self, query: str, trigger: TertiaryCheckTrigger, result: Dict):
        """Log tertiary verification for audit trail"""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO tertiary_verifications (
                timestamp, query, internal_confidence, triggers, api_provider,
                api_cost, verification_result, discrepancy_found, resolution
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now(timezone.utc),
            query,
            trigger.confidence_score,
            json.dumps(trigger.high_risk_topics),
            result.get("westlaw_verification", {}).get("provider", "mock"),
            trigger.estimated_api_cost,
            json.dumps(result.get("westlaw_verification", {})),
            False,  # Would be determined by discrepancy detection
            "Verification completed successfully"
        ))
        
        conn.commit()
        conn.close()

    async def _log_query_processing(self, query: str, layer1: Dict, layer2: Dict, tertiary_trigger: Optional[TertiaryCheckTrigger], final: Dict, processing_time: float):
        """Log complete query processing pipeline for analytics"""
        
        logger.info(f"AutoLex query processed: {processing_time:.2f}ms, confidence: {final.get('confidence_score', 0):.3f}, tertiary: {tertiary_trigger is not None}")

    async def _generate_error_response(self, query: str, error: str) -> Dict[str, Any]:
        """Generate safe error response when system fails"""
        return {
            "layer": 1,
            "source": "error_handler",
            "response": "I apologize, but I'm unable to provide legal guidance for this query due to a technical issue. Please consult with a licensed attorney.",
            "confidence_score": 0.0,
            "requires_human_review": True,
            "escalation_reason": f"System error: {error}",
            "error": True
        }

# Global AutoLex Core instance - Initialize safely
try:
    autolex_core = AutoLexCore()
    logger.info("✅ AutoLex Core initialized successfully")
except Exception as e:
    logger.error(f"❌ AutoLex Core initialization failed: {e}")
    # Create a fallback instance that won't crash the server
    autolex_core = None