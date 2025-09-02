#!/usr/bin/env python3
"""
NexteraEstate AI Team Communication - Standalone Version
Download this file and run it directly on Windows

Requirements: Python 3.6+ with requests library
Installation: pip install requests

Usage: 
  Double-click this file, or
  python NexteraEstate_AI_Chat.py
"""

import json
import sys
import os
from datetime import datetime

# Try to import requests, install if missing
try:
    import requests
except ImportError:
    print("Installing required library...")
    os.system("pip install requests")
    import requests

class NexteraAIChat:
    def __init__(self):
        self.base_urls = [
            "http://localhost:8001",
            "http://127.0.0.1:8001", 
            "http://host.docker.internal:8001"
        ]
        self.connected_url = None
        
    def test_connection(self):
        """Test connection to AI team"""
        for url in self.base_urls:
            try:
                response = requests.get(f"{url}/api/ai-team/test-connection", timeout=5)
                if response.status_code == 200:
                    self.connected_url = url
                    data = response.json()
                    print(f"✅ Connected to AI team at {url}")
                    print(f"📡 Status: {data.get('status', 'Unknown')}")
                    return True
            except:
                continue
        
        print("❌ Cannot connect to AI team")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Docker Desktop is running")
        print("2. Make sure NexteraEstate backend container is running")
        print("3. Check if port 8001 is accessible:")
        print("   Open browser: http://localhost:8001/api/health")
        return False
    
    def send_message(self, message, recipient="team", priority="normal"):
        """Send message to AI team"""
        if not self.connected_url:
            if not self.test_connection():
                return False
        
        url = f"{self.connected_url}/api/ai-team/communicate"
        payload = {
            "message": message,
            "recipient": recipient,
            "priority": priority
        }
        
        try:
            print(f"\n🤖 Sending to {recipient}...")
            print(f"💬 Message: {message}")
            print("⏳ Processing...")
            
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                self.display_response(data)
                return True
            else:
                print(f"❌ Error: HTTP {response.status_code}")
                print(response.text)
                return False
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return False
    
    def display_response(self, data):
        """Display AI team response nicely"""
        print(f"\n✅ Response received!")
        print(f"🆔 ID: {data.get('communication_id', 'Unknown')}")
        print(f"🕐 Time: {datetime.now().strftime('%I:%M:%S %p')}")
        print("\n" + "="*80)
        
        responses = data.get('responses', {})
        
        for agent_name, response_data in responses.items():
            if agent_name == 'team_coordination':
                continue  # Skip team coordination as it's usually empty
                
            agent = response_data.get('agent', agent_name)
            response_text = response_data.get('response', 'No response')
            confidence = response_data.get('confidence', 0)
            escalation = response_data.get('escalation_needed', False)
            
            print(f"\n🤖 {agent}")
            print(f"📊 Confidence: {confidence:.1%}")
            if escalation:
                print("⚠️  Escalation needed - complex query")
            print(f"💭 Response:")
            print("-" * 60)
            print(response_text)
            print("-" * 60)
            
            # Show recommendations
            recommendations = response_data.get('recommendations', [])
            if recommendations:
                print(f"💡 Recommendations:")
                for rec in recommendations:
                    print(f"   • {rec}")
            
            print()

def main():
    """Main program"""
    # Set console title and color (Windows only)
    if os.name == 'nt':
        os.system('title NexteraEstate AI Team Chat')
        os.system('color 0A')
    
    print("🚀 NexteraEstate AI Team Communication")
    print("="*60)
    print("💻 Standalone Windows Version")
    print("🔗 Connecting to your Docker container...")
    print("="*60)
    
    chat = NexteraAIChat()
    
    # Test connection first
    if not chat.test_connection():
        input("\n❌ Connection failed. Press Enter to exit...")
        return
    
    print("\n👥 Available AI team members:")
    print("  🧠 AutoLex Core      - Legal intelligence & development help")
    print("  👔 Senior AI Manager - System monitoring & optimization")  
    print("  👥 Full AI Team      - Coordinated team response")
    print("="*60)
    
    # Check for command line arguments
    if len(sys.argv) > 1:
        message = " ".join(sys.argv[1:])
        chat.send_message(message)
        input("\nPress Enter to exit...")
        return
    
    # Interactive mode
    print("\n🎯 Interactive Chat Mode")
    print("💡 Tips:")
    print("   • Type 'help' for example questions")
    print("   • Type 'quit' to exit") 
    print("   • Ask about deployment issues, system status, code help, etc.")
    
    while True:
        try:
            print("\n" + "-"*50)
            message = input("💬 Ask your AI team: ").strip()
            
            if message.lower() in ['quit', 'exit', 'q', 'bye']:
                print("👋 Goodbye!")
                break
            
            if message.lower() == 'help':
                print("\n📖 Example questions you can ask:")
                print("   • 'Help me fix my Vercel deployment errors'")
                print("   • 'What's my system performance status?'")
                print("   • 'Debug my Railway backend startup issues'")
                print("   • 'Optimize my database queries'")
                print("   • 'Review my API response times'")
                print("   • 'Help me plan new features'")
                continue
                
            if not message:
                print("💡 Please enter a message or 'quit' to exit")
                continue
            
            # Ask which team member
            print("\n👥 Who should handle this?")
            print("1. AutoLex Core (Legal + Development)")
            print("2. Senior AI Manager (System Monitoring)")
            print("3. Full AI Team (Everyone - recommended)")
            
            choice = input("\nChoice (1-3 or Enter for Full Team): ").strip()
            
            recipient_map = {
                '1': 'autolex',
                '2': 'senior_manager',
                '3': 'team',
                '': 'team'
            }
            
            recipient = recipient_map.get(choice, 'team')
            
            # Ask priority
            priority = input("⚡ Priority (normal/high/urgent or Enter): ").strip()
            if not priority:
                priority = 'normal'
            
            # Send message
            success = chat.send_message(message, recipient, priority)
            
            if not success:
                retry = input("\n🔄 Connection failed. Try again? (y/n): ").strip().lower()
                if retry != 'y':
                    break
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            input("Press Enter to continue...")

if __name__ == "__main__":
    main()