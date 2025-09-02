#!/usr/bin/env python3
"""
NexteraEstate AI Team Communication - Windows Version
Talk to your AI team from Windows desktop
"""
import requests
import json
import sys
import os
from datetime import datetime

def talk_to_ai_team(message, recipient="team", priority="normal"):
    """Send message to AI team and display response"""
    
    # Try different possible URLs for your Docker setup
    possible_urls = [
        "http://localhost:8001/api/ai-team/communicate",
        "http://127.0.0.1:8001/api/ai-team/communicate",
        "http://host.docker.internal:8001/api/ai-team/communicate"
    ]
    
    payload = {
        "message": message,
        "recipient": recipient,
        "priority": priority
    }
    
    print(f"\n🤖 Sending message to {recipient}...")
    print(f"💬 Message: {message}")
    print("⏳ Processing...")
    
    for url in possible_urls:
        try:
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"\n✅ Connected to AI team!")
                print(f"🆔 Communication ID: {data.get('communication_id', 'Unknown')}")
                print(f"🕐 Time: {datetime.now().strftime('%I:%M:%S %p')}")
                print("\n" + "="*80)
                
                # Display responses from each AI agent
                responses = data.get('responses', {})
                
                for agent_name, response_data in responses.items():
                    agent = response_data.get('agent', agent_name)
                    response_text = response_data.get('response', 'No response')
                    confidence = response_data.get('confidence', 0)
                    
                    print(f"\n🤖 {agent}")
                    print(f"📊 Confidence: {confidence:.1%}")
                    print(f"💭 Response:")
                    print("-" * 60)
                    print(response_text)
                    print("-" * 60)
                    
                    # Show recommendations if available
                    recommendations = response_data.get('recommendations', [])
                    if recommendations:
                        print(f"💡 Recommendations:")
                        for rec in recommendations:
                            print(f"   • {rec}")
                    
                    print()
                
                return True
                
        except requests.exceptions.ConnectionError:
            continue
        except Exception as e:
            print(f"❌ Error with {url}: {str(e)}")
            continue
    
    print("❌ Could not connect to AI team. Please check:")
    print("   1. Docker Desktop is running")
    print("   2. NexteraEstate backend container is running")
    print("   3. Backend is accessible on port 8001")
    return False

def main():
    """Main interactive loop"""
    os.system('title NexteraEstate AI Team Chat')
    os.system('color 0A')
    
    print("🚀 NexteraEstate AI Team Communication")
    print("="*60)
    print("Available team members:")
    print("  • autolex        - Legal intelligence & development help")
    print("  • senior_manager - System monitoring & optimization")  
    print("  • team           - Full coordinated team response")
    print("="*60)
    
    if len(sys.argv) > 1:
        # Command line mode
        message = " ".join(sys.argv[1:])
        talk_to_ai_team(message)
        input("\nPress Enter to close...")
    else:
        # Interactive mode
        print("\n🎯 Interactive Mode - Type 'quit' to exit")
        
        while True:
            try:
                print("\n" + "-"*50)
                message = input("💬 Your message: ").strip()
                
                if message.lower() in ['quit', 'exit', 'q', 'bye']:
                    print("👋 Goodbye!")
                    break
                    
                if not message:
                    print("Please enter a message or 'quit' to exit.")
                    continue
                
                # Ask for recipient
                print("\n👥 Who do you want to talk to?")
                print("1. AutoLex Core (Legal + Development)")
                print("2. Senior AI Manager (System Management)")
                print("3. Full AI Team (Everyone)")
                
                choice = input("\nChoice (1-3, or Enter for Full Team): ").strip()
                
                recipient_map = {
                    '1': 'autolex',
                    '2': 'senior_manager', 
                    '3': 'team',
                    '': 'team'
                }
                
                recipient = recipient_map.get(choice, 'team')
                
                # Ask for priority
                priority = input("⚡ Priority (normal/high/urgent, or Enter for normal): ").strip()
                if not priority:
                    priority = 'normal'
                
                success = talk_to_ai_team(message, recipient, priority)
                
                if not success:
                    retry = input("\n🔄 Try again? (y/n): ").strip().lower()
                    if retry != 'y':
                        break
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
                input("Press Enter to continue...")

if __name__ == "__main__":
    main()