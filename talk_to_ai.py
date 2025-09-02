#!/usr/bin/env python3
"""
Simple AI Team Communication Script
Talk to your AI team directly from command line
"""
import requests
import json
import sys

def talk_to_ai_team(message, recipient="team", priority="normal"):
    """Send message to AI team and display response"""
    
    url = "http://localhost:8001/api/ai-team/communicate"
    
    payload = {
        "message": message,
        "recipient": recipient,
        "priority": priority
    }
    
    try:
        print(f"\n🤖 Sending message to {recipient}...")
        print(f"💬 Message: {message}")
        print("⏳ Processing...")
        
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"\n✅ Communication ID: {data.get('communication_id', 'Unknown')}")
            print(f"🕐 Timestamp: {data.get('timestamp', 'Unknown')}")
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
            
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to AI team. Make sure backend is running:")
        print("   sudo supervisorctl restart backend")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def main():
    """Main interactive loop"""
    print("🚀 NexteraEstate AI Team Communication")
    print("="*60)
    print("Available team members:")
    print("  • autolex      - Legal intelligence & development help")
    print("  • senior_manager - System monitoring & optimization")  
    print("  • team         - Full coordinated team response")
    print("="*60)
    
    if len(sys.argv) > 1:
        # Command line mode
        message = " ".join(sys.argv[1:])
        talk_to_ai_team(message)
    else:
        # Interactive mode
        print("\nInteractive mode - Type 'quit' to exit")
        
        while True:
            try:
                print("\n" + "-"*40)
                message = input("💬 Your message: ").strip()
                
                if message.lower() in ['quit', 'exit', 'q']:
                    print("👋 Goodbye!")
                    break
                    
                if not message:
                    continue
                
                # Ask for recipient
                print("\nWho do you want to talk to?")
                print("1. autolex (Legal + Development)")
                print("2. senior_manager (System Management)")
                print("3. team (Everyone)")
                
                choice = input("\nChoice (1-3, or press Enter for team): ").strip()
                
                recipient_map = {
                    '1': 'autolex',
                    '2': 'senior_manager', 
                    '3': 'team',
                    '': 'team'
                }
                
                recipient = recipient_map.get(choice, 'team')
                
                # Ask for priority
                priority = input("Priority (normal/high/urgent, or press Enter for normal): ").strip()
                if not priority:
                    priority = 'normal'
                
                talk_to_ai_team(message, recipient, priority)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()