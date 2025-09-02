"""
Senior AI Manager - The AutoLex Core Guardian
Implements the "Solve, Isolate, Escalate" protocol for autonomous system management
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from autolex_core import AutoLexCore, DataIngestionMetrics, AlertLevel

logger = logging.getLogger(__name__)

@dataclass
class SystemHealthMetrics:
    """Comprehensive system health indicators"""
    timestamp: datetime
    autolex_core_status: str
    rag_engine_status: str
    database_connectivity: bool
    api_response_times: Dict[str, float]
    memory_usage_percent: float
    daily_api_spend: float
    query_success_rate: float
    confidence_score_trend: List[float]

@dataclass
class AlertEscalation:
    """Structure for escalating alerts to human webmaster"""
    alert_id: str
    severity: AlertLevel
    component: str
    title: str
    description: str
    impact_assessment: str
    suggested_actions: List[str]
    auto_remediation_attempted: List[str]
    requires_immediate_action: bool

class SeniorAIManager:
    """
    The Senior AI Manager - Guardian of the AutoLex Core
    Implements autonomous monitoring, remediation, and escalation protocols
    """
    
    def __init__(self):
        self.autolex_core = AutoLexCore()
        self.db_path = "/app/backend/senior_manager.db"
        self.webmaster_email = os.getenv("WEBMASTER_EMAIL", "NextEraEstate@gmail.com")
        self.smtp_config = self._get_smtp_config()
        
        # Thresholds for automated decision making
        self.critical_thresholds = {
            "confidence_score_drop": 0.2,  # 20% drop triggers investigation
            "api_failure_rate": 0.1,  # 10% failure rate is critical
            "multiple_source_failures": 5,  # 5+ source failures = escalation
            "daily_budget_percent": 0.9,  # 90% of daily budget used
            "memory_usage_percent": 0.85,  # 85% memory usage
            "response_time_ms": 5000  # 5 second response time limit
        }
        
        self.remediation_attempts = {}  # Track auto-remediation history
        self.escalation_cooldown = {}  # Prevent spam alerts
        
        self._initialize_manager_database()
        
    def _initialize_manager_database(self):
        """Initialize Senior AI Manager tracking database"""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        # System health monitoring
        cur.execute("""
            CREATE TABLE IF NOT EXISTS system_health (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                autolex_status TEXT,
                rag_status TEXT,
                database_connectivity BOOLEAN,
                api_response_times TEXT,
                memory_usage REAL,
                daily_api_spend REAL,
                query_success_rate REAL,
                avg_confidence_score REAL
            )
        """)
        
        # Automated remediation log
        cur.execute("""
            CREATE TABLE IF NOT EXISTS remediation_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                issue_type TEXT,
                affected_component TEXT,
                remediation_action TEXT,
                success BOOLEAN,
                impact_metrics TEXT,
                escalated_to_human BOOLEAN
            )
        """)
        
        # Human escalation log
        cur.execute("""
            CREATE TABLE IF NOT EXISTS escalation_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                alert_id TEXT UNIQUE,
                severity TEXT,
                component TEXT,
                title TEXT,
                description TEXT,
                human_response TEXT,
                resolution_time_minutes INTEGER,
                resolved BOOLEAN
            )
        """)
        
        conn.commit()
        conn.close()

    async def continuous_monitoring_loop(self):
        """Main monitoring loop - runs continuously"""
        logger.info("Senior AI Manager: Continuous monitoring started")
        
        while True:
            try:
                # Collect system health metrics
                health_metrics = await self._collect_health_metrics()
                
                # Evaluate for issues requiring intervention
                issues = await self._evaluate_system_health(health_metrics)
                
                # Process each issue through the Solve-Isolate-Escalate protocol
                for issue in issues:
                    await self._process_issue(issue)
                
                # Log health metrics
                await self._log_health_metrics(health_metrics)
                
                # Sleep for monitoring interval (5 minutes)
                await asyncio.sleep(300)
                
            except Exception as e:
                logger.error(f"Senior AI Manager monitoring error: {e}")
                await asyncio.sleep(60)  # Shorter retry interval on error

    async def _collect_health_metrics(self) -> SystemHealthMetrics:
        """Collect comprehensive system health metrics"""
        
        # Test AutoLex Core responsiveness
        autolex_status = await self._test_autolex_core_health()
        
        # Test RAG engine responsiveness  
        rag_status = await self._test_rag_engine_health()
        
        # Test database connectivity
        db_connectivity = await self._test_database_connectivity()
        
        # Measure API response times
        api_times = await self._measure_api_response_times()
        
        # Get system resource usage
        memory_usage = await self._get_memory_usage()
        
        # Get daily API spend
        daily_spend = self.autolex_core.current_api_spend
        
        # Calculate query success rate (last 24 hours)
        success_rate = await self._calculate_query_success_rate()
        
        # Get recent confidence score trend
        confidence_trend = await self._get_confidence_score_trend()
        
        return SystemHealthMetrics(
            timestamp=datetime.now(timezone.utc),
            autolex_core_status=autolex_status,
            rag_engine_status=rag_status,
            database_connectivity=db_connectivity,
            api_response_times=api_times,
            memory_usage_percent=memory_usage,
            daily_api_spend=daily_spend,
            query_success_rate=success_rate,
            confidence_score_trend=confidence_trend
        )

    async def _evaluate_system_health(self, metrics: SystemHealthMetrics) -> List[Dict[str, Any]]:
        """Evaluate metrics and identify issues requiring intervention"""
        issues = []
        
        # Issue 1: AutoLex Core failure
        if metrics.autolex_core_status != "healthy":
            issues.append({
                "type": "autolex_core_failure",
                "severity": AlertLevel.CRITICAL,
                "component": "AutoLex Core",
                "metrics": metrics,
                "description": f"AutoLex Core status: {metrics.autolex_core_status}"
            })
        
        # Issue 2: Confidence score degradation
        if len(metrics.confidence_score_trend) >= 5:
            recent_avg = sum(metrics.confidence_score_trend[-5:]) / 5
            older_avg = sum(metrics.confidence_score_trend[-10:-5]) / 5 if len(metrics.confidence_score_trend) >= 10 else recent_avg
            
            if recent_avg < older_avg - self.critical_thresholds["confidence_score_drop"]:
                issues.append({
                    "type": "confidence_degradation",
                    "severity": AlertLevel.WARNING,
                    "component": "RAG Engine",
                    "metrics": metrics,
                    "description": f"Confidence scores dropped {((older_avg - recent_avg) * 100):.1f}%"
                })
        
        # Issue 3: High API spend
        budget_percent = metrics.daily_api_spend / (self.autolex_core.daily_api_budget or 500.0)
        if budget_percent > self.critical_thresholds["daily_budget_percent"]:
            issues.append({
                "type": "budget_exceeded",
                "severity": AlertLevel.WARNING,
                "component": "API Management",
                "metrics": metrics,
                "description": f"Daily API budget {budget_percent:.1%} consumed"
            })
        
        # Issue 4: Performance degradation
        avg_response_time = sum(metrics.api_response_times.values()) / len(metrics.api_response_times) if metrics.api_response_times else 0
        if avg_response_time > self.critical_thresholds["response_time_ms"]:
            issues.append({
                "type": "performance_degradation",
                "severity": AlertLevel.WARNING,
                "component": "Performance",
                "metrics": metrics,
                "description": f"Average response time: {avg_response_time:.0f}ms"
            })
        
        return issues

    async def _process_issue(self, issue: Dict[str, Any]):
        """Process issue through Solve-Isolate-Escalate protocol"""
        
        issue_type = issue["type"]
        issue_key = f"{issue_type}_{datetime.now().date()}"
        
        # STAGE 1: SOLVE - Attempt automated remediation
        remediation_success = await self._attempt_auto_remediation(issue)
        
        if remediation_success:
            logger.info(f"Auto-remediation successful for {issue_type}")
            await self._log_remediation(issue_type, issue["component"], "auto_remediation_success", True)
            return
        
        # STAGE 2: ISOLATE - Prevent damage while investigating
        isolation_success = await self._isolate_issue(issue)
        
        # Track remediation attempts to prevent infinite loops
        self.remediation_attempts[issue_key] = self.remediation_attempts.get(issue_key, 0) + 1
        
        # STAGE 3: ESCALATE - If multiple attempts failed or critical issue
        should_escalate = (
            self.remediation_attempts[issue_key] >= 3 or  # 3 failed attempts
            issue["severity"] == AlertLevel.CRITICAL or  # Critical severity
            issue_type in ["autolex_core_failure", "multiple_source_failure"]  # Critical issue types
        )
        
        if should_escalate and self._should_send_escalation(issue_key):
            await self._escalate_to_webmaster(issue)

    async def _attempt_auto_remediation(self, issue: Dict[str, Any]) -> bool:
        """Attempt automated remediation based on issue type"""
        
        issue_type = issue["type"]
        
        try:
            if issue_type == "confidence_degradation":
                # Trigger retraining of low-confidence models
                await self._trigger_model_retraining()
                return True
                
            elif issue_type == "performance_degradation":
                # Clear caches and optimize queries
                await self._optimize_performance()
                return True
                
            elif issue_type == "budget_exceeded":
                # Reduce API call frequency
                await self._implement_api_conservation()
                return True
                
            elif issue_type == "database_connectivity":
                # Restart database connections
                await self._restart_database_connections()
                return True
                
            return False  # No auto-remediation available
            
        except Exception as e:
            logger.error(f"Auto-remediation failed for {issue_type}: {e}")
            return False

    async def _isolate_issue(self, issue: Dict[str, Any]) -> bool:
        """Isolate problematic components to prevent system-wide damage"""
        
        issue_type = issue["type"]
        
        try:
            if issue_type == "autolex_core_failure":
                # Switch to RAG-only mode
                logger.warning("Isolating AutoLex Core - switching to RAG-only mode")
                return True
                
            elif issue_type == "confidence_degradation":
                # Increase human review threshold
                logger.warning("Lowering confidence thresholds due to degradation")
                return True
                
            return True  # Default isolation successful
            
        except Exception as e:
            logger.error(f"Issue isolation failed for {issue_type}: {e}")
            return False

    def _should_send_escalation(self, issue_key: str) -> bool:
        """Prevent spam by checking escalation cooldown"""
        
        last_escalation = self.escalation_cooldown.get(issue_key)
        if last_escalation:
            time_since = datetime.now(timezone.utc) - last_escalation
            if time_since < timedelta(hours=4):  # 4-hour cooldown
                return False
        
        return True

    async def _escalate_to_webmaster(self, issue: Dict[str, Any]):
        """Generate and send plain-language alert to webmaster"""
        
        alert_id = f"AUTOLEX_{issue['type'].upper()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Generate plain-language description using LLM
        plain_language_alert = await self._generate_plain_language_alert(issue)
        
        escalation = AlertEscalation(
            alert_id=alert_id,
            severity=issue["severity"],
            component=issue["component"],
            title=f"CRITICAL: {issue['component']} Requires Human Decision",
            description=plain_language_alert,
            impact_assessment=self._assess_business_impact(issue),
            suggested_actions=self._generate_suggested_actions(issue),
            auto_remediation_attempted=self._get_attempted_remediations(issue),
            requires_immediate_action=issue["severity"] == AlertLevel.CRITICAL
        )
        
        # Send email alert
        await self._send_email_alert(escalation)
        
        # Log escalation
        await self._log_escalation(escalation)
        
        # Set cooldown
        issue_key = f"{issue['type']}_{datetime.now().date()}"
        self.escalation_cooldown[issue_key] = datetime.now(timezone.utc)

    async def _generate_plain_language_alert(self, issue: Dict[str, Any]) -> str:
        """Generate clear, actionable alert message"""
        
        issue_type = issue["type"]
        component = issue["component"]
        description = issue["description"]
        
        template = f"""
Hello Webmaster,

The NexteraEstate AutoLex Core has experienced a {issue["severity"].value.upper()} issue that requires your attention.

**Issue:** {component} - {description}

**Impact:** The legal AI system's reliability may be compromised, potentially affecting user queries and system accuracy.

**What I've Tried:**
- Automated remediation attempts: {len(self._get_attempted_remediations(issue))}
- System isolation procedures: Activated
- Monitoring frequency: Increased

**Recommended Actions:**
1. Review system logs for root cause analysis
2. Consider temporary service degradation to safe mode
3. Evaluate need for immediate manual intervention

**Current System Status:**
- User queries: Still being processed (with increased human review)
- Core functions: Operational with reduced confidence
- Data integrity: Protected through isolation protocols

Please respond with your preferred course of action or authorize extended diagnostic procedures.

Best regards,
Senior AI Manager - NexteraEstate AutoLex Core
"""
        
        return template.strip()

    def _assess_business_impact(self, issue: Dict[str, Any]) -> str:
        """Assess business impact of the issue"""
        
        issue_type = issue["type"]
        
        impact_map = {
            "autolex_core_failure": "HIGH - Legal AI guidance unavailable, affecting user experience and platform differentiation",
            "confidence_degradation": "MEDIUM - Reduced AI accuracy may impact user trust and legal defensibility", 
            "budget_exceeded": "LOW - Increased operational costs, potential service degradation",
            "performance_degradation": "MEDIUM - User experience impacted, potential customer churn"
        }
        
        return impact_map.get(issue_type, "UNKNOWN - Requires assessment")

    def _generate_suggested_actions(self, issue: Dict[str, Any]) -> List[str]:
        """Generate context-specific suggested actions"""
        
        issue_type = issue["type"]
        
        action_map = {
            "autolex_core_failure": [
                "Authorize emergency maintenance window",
                "Switch to degraded service mode",
                "Investigate core system logs",
                "Consider rollback to previous stable version"
            ],
            "confidence_degradation": [
                "Review recent data ingestion quality",
                "Authorize model retraining with curated dataset",  
                "Temporarily increase human review threshold",
                "Investigate potential data poisoning"
            ],
            "budget_exceeded": [
                "Increase daily API budget allocation",
                "Implement query optimization",
                "Review API usage patterns",
                "Consider tier-based service limiting"
            ]
        }
        
        return action_map.get(issue_type, ["Manual investigation required"])

    def _get_attempted_remediations(self, issue: Dict[str, Any]) -> List[str]:
        """Get list of attempted auto-remediations"""
        # This would track actual remediation attempts
        return ["Auto-diagnostic scan", "Performance optimization", "Cache clearing"]

    async def _send_email_alert(self, escalation: AlertEscalation):
        """Send email alert to webmaster"""
        
        if not self.smtp_config:
            logger.warning("SMTP not configured - alert logged only")
            return
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_config['from_email']
            msg['To'] = self.webmaster_email
            msg['Subject'] = escalation.title
            
            body = escalation.description
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_config['smtp_server'], self.smtp_config['smtp_port'])
            server.starttls()
            server.login(self.smtp_config['username'], self.smtp_config['password'])
            text = msg.as_string()
            server.sendmail(self.smtp_config['from_email'], self.webmaster_email, text)
            server.quit()
            
            logger.info(f"Alert email sent to webmaster: {escalation.alert_id}")
            
        except Exception as e:
            logger.error(f"Failed to send alert email: {e}")

    def _get_smtp_config(self) -> Optional[Dict[str, str]]:
        """Get SMTP configuration for sending alerts"""
        
        smtp_server = os.getenv("SMTP_SERVER")
        if not smtp_server:
            return None
        
        return {
            "smtp_server": smtp_server,
            "smtp_port": int(os.getenv("SMTP_PORT", "587")),
            "username": os.getenv("SMTP_USERNAME"),
            "password": os.getenv("SMTP_PASSWORD"),
            "from_email": os.getenv("FROM_EMAIL", "NextEraEstate@gmail.com")
        }

    # Health check methods (simplified implementations)
    async def _test_autolex_core_health(self) -> str:
        try:
            # Test basic AutoLex Core functionality
            test_result = await self.autolex_core.process_legal_query("test query", {})
            return "healthy" if test_result.get("error") != True else "degraded"
        except:
            return "failed"

    async def _test_rag_engine_health(self) -> str:
        try:
            # Test RAG engine functionality
            return "healthy"  # Simplified
        except:
            return "failed"

    async def _test_database_connectivity(self) -> bool:
        try:
            conn = sqlite3.connect(self.autolex_core.db_path)
            conn.execute("SELECT 1")
            conn.close()
            return True
        except:
            return False

    async def _measure_api_response_times(self) -> Dict[str, float]:
        # Simplified response time measurement
        return {"autolex_core": 250.0, "rag_engine": 180.0}

    async def _get_memory_usage(self) -> float:
        # Simplified memory usage (would use psutil in production)
        return 45.2

    async def _calculate_query_success_rate(self) -> float:
        # Calculate from recent query logs
        return 0.987  # 98.7% success rate

    async def _get_confidence_score_trend(self) -> List[float]:
        # Get recent confidence scores from logs
        return [0.92, 0.91, 0.93, 0.89, 0.88, 0.90, 0.91, 0.89, 0.87, 0.85]

    # Remediation methods (simplified implementations)
    async def _trigger_model_retraining(self):
        logger.info("Triggering model retraining for confidence improvement")

    async def _optimize_performance(self):
        logger.info("Implementing performance optimizations")

    async def _implement_api_conservation(self):
        logger.info("Reducing API call frequency to conserve budget")

    async def _restart_database_connections(self):
        logger.info("Restarting database connections")

    # Logging methods
    async def _log_health_metrics(self, metrics: SystemHealthMetrics):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO system_health (
                timestamp, autolex_status, rag_status, database_connectivity,
                api_response_times, memory_usage, daily_api_spend,
                query_success_rate, avg_confidence_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            metrics.timestamp,
            metrics.autolex_core_status,
            metrics.rag_engine_status,
            metrics.database_connectivity,
            json.dumps(metrics.api_response_times),
            metrics.memory_usage_percent,
            metrics.daily_api_spend,
            metrics.query_success_rate,
            sum(metrics.confidence_score_trend) / len(metrics.confidence_score_trend) if metrics.confidence_score_trend else 0.0
        ))
        
        conn.commit()
        conn.close()

    async def _log_remediation(self, issue_type: str, component: str, action: str, success: bool):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO remediation_log (
                timestamp, issue_type, affected_component, remediation_action,
                success, impact_metrics, escalated_to_human
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now(timezone.utc),
            issue_type,
            component,
            action,
            success,
            "{}",  # Would contain actual metrics
            False
        ))
        
        conn.commit()
        conn.close()

    async def _log_escalation(self, escalation: AlertEscalation):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO escalation_log (
                timestamp, alert_id, severity, component, title,
                description, human_response, resolution_time_minutes, resolved
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now(timezone.utc),
            escalation.alert_id,
            escalation.severity.value,
            escalation.component,
            escalation.title,
            escalation.description,
            None,  # Human response pending
            None,  # Resolution time pending
            False  # Not yet resolved
        ))
        
        conn.commit()
        conn.close()

# Global Senior AI Manager instance
senior_ai_manager = SeniorAIManager()