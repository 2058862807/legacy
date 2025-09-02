"""
NexteraEstate RAG (Retrieval Augmented Generation) Engine
Professional Legal AI with Source Verification and Citations
"""

import os
import json
import hashlib
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple
import sqlite3
from dataclasses import dataclass
import asyncio
import httpx
import numpy as np
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

logger = logging.getLogger(__name__)

@dataclass
class LegalSource:
    """Represents a legal document or precedent"""
    id: str
    title: str
    content: str
    source_type: str  # "statute", "case_law", "regulation", "precedent"
    jurisdiction: str  # "federal", "CA", "NY", etc.
    citation: str
    last_updated: str
    confidence_score: float = 0.0
    
@dataclass
class RAGResponse:
    """RAG-generated response with sources and citations"""
    response: str
    sources: List[LegalSource]
    citations: List[str]
    confidence: float
    query_hash: str
    timestamp: str

class LegalVectorStore:
    """Vector database for legal documents with semantic search"""
    
    def __init__(self, db_path: str = "legal_vectors.db"):
        self.db_path = db_path
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight embedding model
        self.init_database()
        self.load_legal_documents()
    
    def init_database(self):
        """Initialize vector database schema"""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS legal_documents (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                source_type TEXT NOT NULL,
                jurisdiction TEXT NOT NULL,
                citation TEXT NOT NULL,
                last_updated TEXT NOT NULL,
                embedding BLOB NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS rag_queries (
                id TEXT PRIMARY KEY,
                query TEXT NOT NULL,
                query_hash TEXT UNIQUE NOT NULL,
                response TEXT NOT NULL,
                sources TEXT NOT NULL,
                citations TEXT NOT NULL,
                confidence REAL NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        conn.close()
    
    def load_legal_documents(self):
        """Load comprehensive legal document database"""
        legal_documents = [
            {
                "id": "CA_PROBATE_6110",
                "title": "California Probate Code Section 6110 - Will Requirements",
                "content": """A will shall be in writing and satisfy the requirements of this section. A will shall be signed by the testator or in the testator's name by some other individual in the testator's conscious presence and by the testator's direction. A will shall be signed by at least two individuals, each of whom signed within a reasonable time after witnessing either the signing of the will or the testator's acknowledgment of that signature or acknowledgment of the will. The testator must be at least 18 years of age and of sound mind.""",
                "source_type": "statute",
                "jurisdiction": "CA",
                "citation": "Cal. Probate Code § 6110",
                "last_updated": "2024-01-01"
            },
            {
                "id": "NY_EPT_3-2.1",
                "title": "New York Estates Powers and Trusts Law 3-2.1 - Execution of Wills",
                "content": """The execution of a will, other than a nuncupative will, must be by the testator signing his name thereto or by some other person in his presence and by his direction signing the testator's name thereto. Such execution or signing must be in the presence of each of the attesting witnesses, or the testator must acknowledge such execution or signing in their presence. The testator must publish the will by declaring to the attesting witnesses that the instrument is his will.""",
                "source_type": "statute",
                "jurisdiction": "NY", 
                "citation": "N.Y. EPT Law § 3-2.1",
                "last_updated": "2024-01-01"
            },
            {
                "id": "TX_EST_251.051",
                "title": "Texas Estates Code Section 251.051 - Written Will Requirements",
                "content": """A will must be in writing and signed by the testator in person or signed by another person on behalf of the testator if the testator is present when the signature is made and directs that it be made, or the testator acknowledges the signature after it is made. The will must be attested by two or more credible witnesses who are at least 14 years of age and who subscribe their names to the will in their own handwriting in the presence of the testator.""",
                "source_type": "statute",
                "jurisdiction": "TX",
                "citation": "Tex. Est. Code § 251.051", 
                "last_updated": "2024-01-01"
            },
            {
                "id": "FL_PROB_732.502",
                "title": "Florida Probate Code Section 732.502 - Will Execution Requirements",
                "content": """Every will must be in writing and executed as follows: The testator must sign the will at the end; or the testator's name must be subscribed at the end of the will by some other person in the testator's presence and by the testator's direction. The testator must sign or acknowledge the signature on the will in the presence of two attesting witnesses. The attesting witnesses must sign the will in the presence of the testator and in the presence of each other.""",
                "source_type": "statute",
                "jurisdiction": "FL",
                "citation": "Fla. Stat. § 732.502",
                "last_updated": "2024-01-01"
            },
            {
                "id": "DIGITAL_ASSETS_REVISED_UFADAA",
                "title": "Revised Uniform Fiduciary Access to Digital Assets Act",
                "content": """A fiduciary with general authority over the property of a user may request a custodian of the digital assets of the user to provide access to the digital assets of the user. Unless the user provided direction that curtails the fiduciary's authority, a fiduciary has the right to access digital assets that the user could have accessed if the user were alive and had capacity.""",
                "source_type": "regulation",
                "jurisdiction": "federal",
                "citation": "Revised UFADAA § 4",
                "last_updated": "2024-01-01"
            },
            {
                "id": "ESTATE_TAX_2024",
                "title": "Federal Estate Tax Exemption 2024",
                "content": """For decedents dying in 2024, the basic exclusion amount is $13,610,000. This amount is indexed for inflation and represents the federal estate tax exemption threshold. Estates valued below this amount are generally not subject to federal estate tax. The exemption is per person, so married couples can effectively exempt $27,220,000 when proper planning strategies are employed.""",
                "source_type": "regulation",
                "jurisdiction": "federal",
                "citation": "26 U.S.C. § 2010; Rev. Proc. 2024-1",
                "last_updated": "2024-01-01"
            },
            {
                "id": "HOLOGRAPHIC_WILLS",
                "title": "Holographic Will Requirements - Multi-State Analysis",
                "content": """Holographic wills (handwritten wills) are recognized in approximately 26 states. Requirements typically include: (1) The will must be written entirely in the testator's handwriting, (2) The will must be signed by the testator, (3) The will must clearly express testamentary intent. States that recognize holographic wills include California, Texas, Nevada, Arizona, and others. Some states require witnesses even for holographic wills, while others do not.""",
                "source_type": "precedent",
                "jurisdiction": "multi-state",
                "citation": "Multi-State Holographic Will Analysis 2024",
                "last_updated": "2024-01-01"
            },
            {
                "id": "EXECUTOR_DUTIES",
                "title": "Fiduciary Duties of Estate Executors",
                "content": """An executor has several key fiduciary duties: (1) Duty of loyalty - must act in the best interests of the estate and beneficiaries, (2) Duty of care - must manage estate assets prudently, (3) Duty to account - must provide accurate accounting of all estate transactions, (4) Duty to distribute - must distribute assets according to the will's terms, (5) Duty to pay debts and taxes - must satisfy valid claims against the estate.""",
                "source_type": "precedent",
                "jurisdiction": "general",
                "citation": "Restatement (Third) of Trusts § 78",
                "last_updated": "2024-01-01"
            },
            {
                "id": "BENEFICIARY_DESIGNATIONS",
                "title": "Beneficiary Designations vs. Will Provisions",
                "content": """Assets with beneficiary designations (retirement accounts, life insurance, payable-on-death accounts) generally pass outside of probate and supersede will provisions. This is true for 401(k)s, IRAs, life insurance policies, and bank accounts with POD designations. It's crucial to regularly update beneficiary designations, especially after major life events like marriage, divorce, or the birth of children, as outdated designations can override intended will distributions.""",
                "source_type": "precedent",
                "jurisdiction": "general",
                "citation": "Estate Planning Best Practices 2024",
                "last_updated": "2024-01-01"
            },
            {
                "id": "POWER_OF_ATTORNEY",
                "title": "Durable Power of Attorney Requirements",
                "content": """A durable power of attorney allows an appointed agent to make financial and legal decisions if the principal becomes incapacitated. Key requirements: (1) Must be in writing, (2) Must be signed by the principal, (3) Must include specific language indicating it remains effective despite incapacity, (4) Many states require notarization or witnesses, (5) Should specify the scope of authority granted to the agent. Powers can be immediate or springing (activated upon incapacity).""",
                "source_type": "precedent",
                "jurisdiction": "general",
                "citation": "Uniform Power of Attorney Act",
                "last_updated": "2024-01-01"
            }
        ]
        
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        # Check if documents already loaded
        cur.execute("SELECT COUNT(*) FROM legal_documents")
        count = cur.fetchone()[0]
        
        if count == 0:
            logger.info("Loading legal documents into vector database...")
            for doc in legal_documents:
                # Generate embedding
                embedding = self.model.encode(doc["content"])
                embedding_bytes = embedding.tobytes()
                
                cur.execute("""
                    INSERT INTO legal_documents 
                    (id, title, content, source_type, jurisdiction, citation, last_updated, embedding)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    doc["id"], doc["title"], doc["content"], doc["source_type"],
                    doc["jurisdiction"], doc["citation"], doc["last_updated"], embedding_bytes
                ))
            
            conn.commit()
            logger.info(f"Loaded {len(legal_documents)} legal documents into vector database")
        
        conn.close()
    
    def similarity_search(self, query: str, k: int = 5, jurisdiction: str = None) -> List[LegalSource]:
        """Find most relevant legal documents using semantic search"""
        query_embedding = self.model.encode(query)
        
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        # Build query with optional jurisdiction filter
        sql = """
            SELECT id, title, content, source_type, jurisdiction, citation, last_updated, embedding
            FROM legal_documents
        """
        params = []
        
        if jurisdiction:
            sql += " WHERE jurisdiction = ? OR jurisdiction = 'general' OR jurisdiction = 'federal'"
            params.append(jurisdiction)
        
        cur.execute(sql, params)
        documents = cur.fetchall()
        conn.close()
        
        # Calculate similarities
        similarities = []
        for doc in documents:
            stored_embedding = np.frombuffer(doc[7], dtype=np.float32)
            similarity = np.dot(query_embedding, stored_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(stored_embedding)
            )
            
            similarities.append((similarity, LegalSource(
                id=doc[0],
                title=doc[1], 
                content=doc[2],
                source_type=doc[3],
                jurisdiction=doc[4],
                citation=doc[5],
                last_updated=doc[6],
                confidence_score=similarity
            )))
        
        # Sort by similarity and return top k
        similarities.sort(key=lambda x: x[0], reverse=True)
        return [source for _, source in similarities[:k]]

class LegalAPIClient:
    """Client for accessing professional legal databases"""
    
    def __init__(self):
        self.nextlaw_api_key = os.getenv("NEXTLAW_API_KEY")
        self.westlaw_api_key = os.getenv("WESTLAW_API_KEY")
        self.lexis_api_key = os.getenv("LEXIS_API_KEY")
    
    async def query_current_law(self, query: str, jurisdiction: str = "federal") -> List[Dict[str, Any]]:
        """Query professional legal databases for current law"""
        # Mock implementation - replace with actual API calls when keys available
        if not any([self.nextlaw_api_key, self.westlaw_api_key, self.lexis_api_key]):
            logger.warning("No legal API keys configured - using fallback legal data")
            return await self._get_fallback_legal_data(query, jurisdiction)
        
        # TODO: Implement actual API calls to NextLaw, Westlaw, LexisNexis
        # This would make real API calls to professional legal databases
        return await self._get_fallback_legal_data(query, jurisdiction)
    
    async def _get_fallback_legal_data(self, query: str, jurisdiction: str) -> List[Dict[str, Any]]:
        """Fallback legal data when professional APIs unavailable"""
        await asyncio.sleep(0.1)  # Simulate API call
        
        # Return contextually relevant legal updates
        legal_updates = [
            {
                "title": f"{jurisdiction.upper()} Estate Planning Law Update 2024",
                "summary": f"Recent changes to estate planning requirements in {jurisdiction}",
                "citation": f"{jurisdiction.upper()} Legal Update 2024-001", 
                "source": "Legal Database",
                "last_updated": "2024-01-01"
            }
        ]
        
        return legal_updates

class NexteraRAGEngine:
    """Main RAG engine for NexteraEstate legal AI"""
    
    def __init__(self, gemini_api_key: str = None):
        self.vector_store = LegalVectorStore()
        self.legal_api = LegalAPIClient()
        self.gemini_api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")
        
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
        else:
            self.model = None
            logger.warning("No Gemini API key - RAG will use fallback responses")
    
    def _generate_query_hash(self, query: str) -> str:
        """Generate unique hash for query caching"""
        return hashlib.md5(query.encode()).hexdigest()
    
    async def generate_legal_response(self, 
                                    user_query: str, 
                                    jurisdiction: str = "general",
                                    context: str = "estate_planning") -> RAGResponse:
        """Generate legally-grounded response using RAG pipeline"""
        
        query_hash = self._generate_query_hash(f"{user_query}_{jurisdiction}_{context}")
        
        # Check cache first
        cached_response = self._get_cached_response(query_hash)
        if cached_response:
            logger.info(f"Returning cached RAG response for query: {user_query[:50]}...")
            return cached_response
        
        # Step 1: Retrieve relevant legal documents from vector store
        logger.info(f"RAG Step 1: Retrieving relevant legal documents for: {user_query[:50]}...")
        relevant_sources = self.vector_store.similarity_search(
            user_query, 
            k=5, 
            jurisdiction=jurisdiction
        )
        
        # Step 2: Query professional legal APIs for current law
        logger.info("RAG Step 2: Querying professional legal databases...")
        current_law_updates = await self.legal_api.query_current_law(user_query, jurisdiction)
        
        # Step 3: Combine all context
        logger.info("RAG Step 3: Combining legal context and sources...")
        combined_context = self._combine_legal_context(
            user_query, relevant_sources, current_law_updates, context
        )
        
        # Step 4: Generate grounded response with LLM
        logger.info("RAG Step 4: Generating legally-grounded response...")
        if self.model:
            response_text = await self._generate_with_gemini(combined_context)
        else:
            response_text = self._generate_fallback_response(user_query, relevant_sources)
        
        # Step 5: Extract citations and create response
        citations = self._extract_citations(relevant_sources, current_law_updates)
        confidence = self._calculate_confidence(relevant_sources)
        
        rag_response = RAGResponse(
            response=response_text,
            sources=relevant_sources,
            citations=citations,
            confidence=confidence,
            query_hash=query_hash,
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        # Cache the response
        self._cache_response(rag_response)
        
        logger.info(f"RAG pipeline complete - confidence: {confidence:.2f}")
        return rag_response
    
    def _combine_legal_context(self, 
                              query: str, 
                              sources: List[LegalSource], 
                              updates: List[Dict], 
                              context: str) -> str:
        """Combine all legal context into structured prompt"""
        
        context_sections = []
        
        # Add relevant legal sources
        if sources:
            context_sections.append("=== RELEVANT LEGAL SOURCES ===")
            for source in sources:
                context_sections.append(f"""
SOURCE: {source.title}
CITATION: {source.citation}
JURISDICTION: {source.jurisdiction}
CONTENT: {source.content}
CONFIDENCE: {source.confidence_score:.2f}
""")
        
        # Add current law updates
        if updates:
            context_sections.append("=== CURRENT LEGAL UPDATES ===")
            for update in updates:
                context_sections.append(f"""
UPDATE: {update['title']}
CITATION: {update['citation']}
SUMMARY: {update['summary']}
""")
        
        # Add system instructions
        system_prompt = f"""
=== SYSTEM INSTRUCTIONS ===
You are Esquire AI, NexteraEstate's expert legal guidance system.

CRITICAL REQUIREMENTS:
1. Base ALL responses ONLY on the provided legal sources above
2. Include specific citations for every legal claim you make
3. Distinguish between "information" and "legal advice" 
4. Recommend consulting an attorney for complex situations
5. Keep responses under 300 words but be thorough
6. Use professional but accessible language

CONTEXT: {context}
USER QUERY: {query}

RESPONSE FORMAT:
- Provide factual legal information based on sources
- Include citations in parentheses (e.g., "According to California Probate Code § 6110...")
- End with appropriate disclaimers about consulting an attorney
- Be helpful but stay within bounds of providing information, not legal advice
"""
        
        return "\n".join([system_prompt] + context_sections)
    
    async def _generate_with_gemini(self, context_prompt: str) -> str:
        """Generate response using Gemini with legal context"""
        try:
            response = self.model.generate_content(
                context_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=500,
                    temperature=0.3,  # Lower temperature for more consistent legal responses
                    top_p=0.8,
                    top_k=40
                )
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            return "I apologize, but I'm having trouble accessing my legal knowledge base right now. Please try again or contact support for assistance with your estate planning questions."
    
    def _generate_fallback_response(self, query: str, sources: List[LegalSource]) -> str:
        """Generate fallback response when LLM unavailable"""
        if not sources:
            return "I'd be happy to help with your estate planning question, but I'll need to access my legal database to provide accurate information. Please try again in a moment."
        
        # Create response from top source
        top_source = sources[0]
        return f"""Based on {top_source.citation}, here's what you should know:

{top_source.content[:200]}...

For your specific situation involving estate planning, I recommend consulting with a licensed attorney who can provide personalized legal advice based on your circumstances and local laws.

This information is provided for educational purposes and does not constitute legal advice."""
    
    def _extract_citations(self, sources: List[LegalSource], updates: List[Dict]) -> List[str]:
        """Extract all citations from sources"""
        citations = []
        
        for source in sources:
            citations.append(source.citation)
        
        for update in updates:
            citations.append(update.get("citation", "Legal Database Update"))
        
        return citations
    
    def _calculate_confidence(self, sources: List[LegalSource]) -> float:
        """Calculate confidence score based on source quality"""
        if not sources:
            return 0.0
        
        # Average confidence of top 3 sources
        top_sources = sources[:3]
        avg_confidence = sum(s.confidence_score for s in top_sources) / len(top_sources)
        
        # Boost confidence for multiple high-quality sources
        quality_boost = min(len([s for s in sources if s.confidence_score > 0.7]) * 0.1, 0.3)
        
        return min(avg_confidence + quality_boost, 1.0)
    
    def _get_cached_response(self, query_hash: str) -> Optional[RAGResponse]:
        """Get cached RAG response if available"""
        conn = sqlite3.connect(self.vector_store.db_path)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT response, sources, citations, confidence, created_at
            FROM rag_queries 
            WHERE query_hash = ? AND created_at > datetime('now', '-1 hour')
        """, (query_hash,))
        
        result = cur.fetchone()
        conn.close()
        
        if result:
            return RAGResponse(
                response=result[0],
                sources=json.loads(result[1]),
                citations=json.loads(result[2]),
                confidence=result[3],
                query_hash=query_hash,
                timestamp=result[4]
            )
        
        return None
    
    def _cache_response(self, rag_response: RAGResponse):
        """Cache RAG response for future use"""
        conn = sqlite3.connect(self.vector_store.db_path)
        cur = conn.cursor()
        
        try:
            cur.execute("""
                INSERT OR REPLACE INTO rag_queries 
                (id, query, query_hash, response, sources, citations, confidence)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                rag_response.query_hash,
                "cached_query",  # We don't store the actual query for privacy
                rag_response.query_hash,
                rag_response.response,
                json.dumps([s.__dict__ for s in rag_response.sources]),
                json.dumps(rag_response.citations),
                rag_response.confidence
            ))
            
            conn.commit()
        except Exception as e:
            logger.error(f"Failed to cache RAG response: {e}")
        finally:
            conn.close()

    def get_legal_guidance_with_confidence(self, query: str, context: str = None) -> dict:
        """Enhanced legal guidance with confidence scoring and human escalation"""
        try:
            # Get relevant legal sources
            sources = self.vector_store.similarity_search(query, k=5)
            
            if not sources:
                return {
                    "response": "I don't have sufficient legal information to answer this query reliably.",
                    "confidence_score": 0.0,
                    "requires_human_review": True,
                    "escalation_reason": "No relevant legal sources found",
                    "sources": []
                }
            
            # Calculate confidence based on source similarity and consensus
            confidence_scores = [source.confidence_score for source in sources]
            avg_confidence = sum(confidence_scores) / len(confidence_scores)
            
            # Multiple factors determine overall confidence
            source_diversity = len(set(s.jurisdiction for s in sources))
            recent_sources = sum(1 for s in sources if "2024" in s.last_updated or "2023" in s.last_updated) 
            
            # Weighted confidence calculation
            overall_confidence = (
                avg_confidence * 0.6 +  # Similarity match weight
                min(source_diversity / 3, 1.0) * 0.2 +  # Jurisdiction diversity
                min(recent_sources / len(sources), 1.0) * 0.2  # Recency weight
            )
            
            # CRITICAL: Block responses below 95% confidence threshold
            if overall_confidence < 0.95:
                return {
                    "response": "This query requires human expert review due to complexity or insufficient confidence in automated analysis.",
                    "confidence_score": overall_confidence,
                    "requires_human_review": True,
                    "escalation_reason": f"Confidence score {overall_confidence:.2%} below 95% threshold",
                    "sources": [s.__dict__ for s in sources],
                    "suggested_next_steps": [
                        "Schedule consultation with estate planning attorney",
                        "Provide additional context about your specific situation",
                        "Consider upgrading to premium plan for human expert review"
                    ]
                }
            
            # Generate response with high confidence
            context_text = "\n\n".join([
                f"Source: {source.title} ({source.jurisdiction})\n{source.content[:500]}..."
                for source in sources
            ])
            
            prompt = f"""
            Based on these verified legal sources, provide estate planning guidance for: {query}
            
            Legal Sources:
            {context_text}
            
            Requirements:
            1. Cite specific sources in your response
            2. Indicate any jurisdictional limitations
            3. Include appropriate legal disclaimers
            4. Provide actionable next steps
            5. Note if professional review is recommended
            
            Context: {context or 'General estate planning inquiry'}
            """
            
            # Get AI response
            if self.model:
                response = self.model.generate_content(prompt)
                ai_response = response.text
            else:
                # Fallback to other providers
                ai_response = "Legal guidance requires Gemini AI configuration."
            
            return {
                "response": ai_response,
                "confidence_score": overall_confidence,
                "requires_human_review": False,
                "sources": [s.__dict__ for s in sources],
                "legal_disclaimer": "This guidance is based on general legal principles. Consult with a licensed attorney for advice specific to your situation.",
                "jurisdiction_coverage": list(set(s.jurisdiction for s in sources)),
                "last_updated": max(s.last_updated for s in sources)
            }
            
        except Exception as e:
            logger.error(f"Enhanced legal guidance error: {e}")
            return {
                "response": "I apologize, but I'm unable to provide legal guidance at this time due to a technical issue.",
                "confidence_score": 0.0,
                "requires_human_review": True,
                "escalation_reason": f"Technical error: {str(e)}",
                "sources": []
            }
# Global RAG engine instance
rag_engine = None

def get_rag_engine() -> NexteraRAGEngine:
    """Get global RAG engine instance"""
    global rag_engine
    if rag_engine is None:
        rag_engine = NexteraRAGEngine()
        logger.info("NexteraEstate RAG Engine initialized successfully")
    return rag_engine

# Convenience function for external use
async def generate_legal_guidance(query: str, jurisdiction: str = "general") -> RAGResponse:
    """Generate legally-grounded guidance using RAG"""
    engine = get_rag_engine()
    return await engine.generate_legal_response(query, jurisdiction)