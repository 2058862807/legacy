# Multi-Provider AI Service (OpenAI, Claude, DeepSeek)
import os
import openai
import anthropic
import requests
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
import json

logger = logging.getLogger(__name__)

class MultiAIService:
    def __init__(self):
        # Initialize AI providers
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        self.default_provider = os.getenv("DEFAULT_AI_PROVIDER", "openai")
    
    def generate_grief_response(self, user_message: str, emotional_state: str = None, 
                              conversation_history: List[Dict] = None, provider: str = None) -> Dict:
        """Generate empathetic grief support response"""
        provider = provider or self.default_provider
        
        # Create context-aware prompt
        system_prompt = """You are a compassionate AI grief counselor with deep understanding of loss, trauma, and healing. 
        Your role is to provide empathetic, non-judgmental support to people experiencing grief.

        Key principles:
        - Always validate emotions and experiences
        - Provide gentle, healing-focused responses
        - Detect crisis situations and recommend professional help
        - Use therapeutic communication techniques
        - Be culturally sensitive and inclusive
        - Never minimize pain or rush healing process
        - Offer practical coping strategies when appropriate

        Emotional states to recognize:
        - Sadness/Depression: Validate pain, offer comfort
        - Anger: Normalize anger in grief, provide safe expression
        - Anxiety: Offer grounding techniques, reassurance
        - Guilt: Address common grief guilt gently
        - Numbness: Explain this as normal grief response
        - Hope: Encourage without invalidating ongoing pain

        Crisis indicators (require immediate professional referral):
        - Suicide ideation
        - Self-harm mentions
        - Complete hopelessness
        - Inability to function for extended periods"""

        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history if available
        if conversation_history:
            messages.extend(conversation_history[-10:])  # Last 10 messages for context
        
        messages.append({"role": "user", "content": user_message})
        
        try:
            if provider == "openai":
                response = self._openai_chat(messages)
            elif provider == "claude":
                response = self._claude_chat(messages)
            elif provider == "deepseek":
                response = self._deepseek_chat(messages)
            else:
                # Fallback to OpenAI
                response = self._openai_chat(messages)
            
            # Analyze emotional state and crisis risk
            emotional_analysis = self._analyze_emotional_state(user_message, response)
            
            return {
                "content": response,
                "emotional_state": emotional_analysis["emotional_state"],
                "crisis_detected": emotional_analysis["crisis_detected"],
                "confidence": emotional_analysis["confidence"],
                "recommendations": emotional_analysis["recommendations"],
                "provider_used": provider,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"AI grief response generation failed with {provider}: {str(e)}")
            
            # Fallback to pre-programmed responses
            return self._fallback_grief_response(user_message, emotional_state)
    
    def generate_will_guidance(self, user_data: Dict, state_code: str, provider: str = None) -> Dict:
        """Generate AI-powered will creation guidance"""
        provider = provider or self.default_provider
        
        system_prompt = f"""You are an expert estate planning attorney AI assistant specializing in {state_code} state law.
        Provide personalized, legally-informed guidance for will creation.

        Your expertise includes:
        - State-specific legal requirements for {state_code}
        - Asset distribution strategies
        - Tax optimization
        - Digital asset planning
        - Family dynamics considerations
        - Executor selection guidance

        Always:
        - Provide state-specific advice for {state_code}
        - Explain legal concepts in plain language
        - Suggest best practices
        - Highlight potential issues
        - Recommend professional review when needed
        - Consider family circumstances and relationships"""

        user_prompt = f"""Help me create my will with the following information:
        
        Personal Details: {json.dumps(user_data.get('personal_info', {}), indent=2)}
        Assets: {json.dumps(user_data.get('assets', {}), indent=2)}
        Beneficiaries: {json.dumps(user_data.get('beneficiaries', []), indent=2)}
        State: {state_code}
        
        Please provide:
        1. Personalized guidance for my situation
        2. State-specific requirements I must meet
        3. Recommendations for asset distribution
        4. Potential tax considerations
        5. Suggested executor qualities
        6. Any red flags or issues to address"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        try:
            if provider == "openai":
                response = self._openai_chat(messages, temperature=0.3)  # Lower temp for legal advice
            elif provider == "claude":
                response = self._claude_chat(messages)
            elif provider == "deepseek":
                response = self._deepseek_chat(messages)
            else:
                response = self._openai_chat(messages, temperature=0.3)
            
            return {
                "guidance": response,
                "provider_used": provider,
                "confidence": "high",
                "requires_review": True,  # Always recommend professional review
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Will guidance generation failed: {str(e)}")
            return {
                "guidance": "I'm having trouble generating personalized guidance right now. Please consult with a qualified estate planning attorney for your specific situation.",
                "provider_used": "fallback",
                "confidence": "low",
                "requires_review": True,
                "error": str(e)
            }
    
    def analyze_document_compliance(self, document_content: str, state_code: str, provider: str = None) -> Dict:
        """Analyze document for legal compliance"""
        provider = provider or self.default_provider
        
        system_prompt = f"""You are a legal document analysis AI specializing in {state_code} estate planning law.
        Analyze the provided document for legal compliance, completeness, and potential issues.

        Check for:
        - Required legal language and clauses
        - State-specific formalities
        - Missing essential elements
        - Ambiguous language
        - Potential legal challenges
        - Tax implications
        - Digital asset coverage"""

        user_prompt = f"""Analyze this estate planning document for {state_code} compliance:

        {document_content}

        Provide:
        1. Compliance score (0-100)
        2. Required elements present/missing
        3. Legal issues or concerns
        4. Recommendations for improvement
        5. Risk assessment"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        try:
            if provider == "openai":
                response = self._openai_chat(messages, temperature=0.2)
            elif provider == "claude":
                response = self._claude_chat(messages)
            elif provider == "deepseek":
                response = self._deepseek_chat(messages)
            else:
                response = self._openai_chat(messages, temperature=0.2)
            
            return {
                "analysis": response,
                "provider_used": provider,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Document compliance analysis failed: {str(e)}")
            return {
                "analysis": "Document analysis is temporarily unavailable. Please have your document reviewed by a qualified attorney.",
                "provider_used": "fallback",
                "error": str(e)
            }
    
    def _openai_chat(self, messages: List[Dict], temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """Generate response using OpenAI"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise
    
    def _claude_chat(self, messages: List[Dict], max_tokens: int = 1000) -> str:
        """Generate response using Claude"""
        try:
            # Convert messages format for Claude
            system_message = next((msg["content"] for msg in messages if msg["role"] == "system"), "")
            user_messages = [msg for msg in messages if msg["role"] != "system"]
            
            response = self.anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=max_tokens,
                system=system_message,
                messages=user_messages
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Claude API error: {str(e)}")
            raise
    
    def _deepseek_chat(self, messages: List[Dict], temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """Generate response using DeepSeek"""
        try:
            headers = {
                "Authorization": f"Bearer {self.deepseek_api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "deepseek-chat",
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            
            response = requests.post(self.deepseek_url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"DeepSeek API error: {str(e)}")
            raise
    
    def _analyze_emotional_state(self, user_message: str, ai_response: str) -> Dict:
        """Analyze emotional state and crisis risk"""
        message_lower = user_message.lower()
        
        # Crisis detection
        crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'not worth living', 
            'better off dead', 'want to die', 'can\'t go on', 'no point',
            'harm myself', 'hurt myself'
        ]
        crisis_detected = any(keyword in message_lower for keyword in crisis_keywords)
        
        # Emotional state detection
        emotional_indicators = {
            'sad': ['sad', 'crying', 'tears', 'miss', 'lonely', 'empty', 'hurt', 'pain', 'heartbroken'],
            'angry': ['angry', 'mad', 'furious', 'rage', 'unfair', 'hate', 'frustrated', 'livid'],
            'anxious': ['worried', 'scared', 'anxious', 'nervous', 'afraid', 'overwhelmed', 'panic'],
            'hopeful': ['better', 'healing', 'hope', 'forward', 'strength', 'grateful', 'thankful'],
            'guilty': ['guilty', 'fault', 'should have', 'blame myself', 'regret'],
            'numb': ['numb', 'empty', 'nothing', 'disconnected', 'hollow', 'void']
        }
        
        detected_states = []
        for state, keywords in emotional_indicators.items():
            if any(keyword in message_lower for keyword in keywords):
                detected_states.append(state)
        
        primary_state = detected_states[0] if detected_states else 'neutral'
        
        # Confidence scoring
        confidence = 0.8 if detected_states else 0.5
        if crisis_detected:
            confidence = 0.95
        
        # Recommendations based on state
        recommendations = []
        if crisis_detected:
            recommendations.extend([
                "Immediate professional support recommended",
                "Crisis hotline: 988 or text HOME to 741741",
                "Emergency services: 911"
            ])
        elif primary_state == 'sad':
            recommendations.extend([
                "Allow yourself to feel and express sadness",
                "Consider grief counseling",
                "Connect with supportive friends/family"
            ])
        elif primary_state == 'angry':
            recommendations.extend([
                "Find healthy ways to express anger",
                "Physical exercise can help",
                "Consider anger management techniques"
            ])
        elif primary_state == 'anxious':
            recommendations.extend([
                "Practice deep breathing exercises",
                "Try grounding techniques",
                "Consider anxiety management strategies"
            ])
        
        return {
            "emotional_state": primary_state,
            "crisis_detected": crisis_detected,
            "confidence": confidence,
            "recommendations": recommendations,
            "detected_states": detected_states
        }
    
    def _fallback_grief_response(self, user_message: str, emotional_state: str) -> Dict:
        """Fallback response when AI services fail"""
        fallback_responses = {
            'sad': "I can hear the pain in your words. Grief is incredibly difficult, and your feelings are completely valid. You don't have to go through this alone. Would you like to talk more about what you're experiencing?",
            'angry': "Anger is a natural part of grief, and it's okay to feel this way. Your emotions are valid. Sometimes grief brings up feelings we didn't expect. What's been the most challenging part for you?",
            'anxious': "It's completely understandable to feel anxious during grief. Loss can make everything feel uncertain. You're safe here, and we can take this conversation at whatever pace feels right for you.",
            'hopeful': "I'm glad to hear some hope in your words. Healing is possible, even though it doesn't erase the love or the loss. What's been helping you feel more hopeful?",
            'neutral': "Thank you for sharing with me. I'm here to listen and support you through whatever you're experiencing. Grief is deeply personal, and there's no right or wrong way to feel. What would be most helpful to talk about right now?"
        }
        
        # Crisis detection in fallback
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead']
        crisis_detected = any(keyword in user_message.lower() for keyword in crisis_keywords)
        
        if crisis_detected:
            response = "I'm very concerned about what you've shared. Your life has value, and there are people who want to help. Please reach out to the Crisis Text Line (text HOME to 741741) or call 988 right away. You don't have to go through this alone."
        else:
            response = fallback_responses.get(emotional_state, fallback_responses['neutral'])
        
        return {
            "content": response,
            "emotional_state": emotional_state or 'neutral',
            "crisis_detected": crisis_detected,
            "confidence": 0.6,
            "recommendations": ["Consider professional grief counseling", "Connect with support groups"],
            "provider_used": "fallback",
            "timestamp": datetime.utcnow().isoformat()
        }