#!/usr/bin/env python3
"""
Test script to verify Railway wallet configuration
"""
import requests
import json

def test_railway_wallet():
    """Test the Railway deployed wallet configuration"""
    
    # Replace with your actual Railway backend URL
    # Example: https://your-backend-name.up.railway.app
    RAILWAY_URL = input("Enter your Railway backend URL (e.g., https://your-app.up.railway.app): ").strip()
    
    if not RAILWAY_URL:
        print("❌ No URL provided")
        return
    
    try:
        print(f"🔍 Testing wallet configuration on {RAILWAY_URL}...")
        
        # Test wallet status
        response = requests.get(f"{RAILWAY_URL}/api/gasless-notary/wallet-status", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Wallet Status Response:")
            print(json.dumps(data, indent=2))
            
            # Check if configuration is correct
            if data.get("addresses_match"):
                print("\n🎉 SUCCESS: Private key matches expected address!")
                print(f"✅ Master Address: {data.get('master_address')}")
                print(f"✅ Network: {data.get('network')}")
                print(f"✅ Chain ID: {data.get('chain_id')}")
                
                if data.get("balance_matic") is not None:
                    print(f"💰 MATIC Balance: {data.get('balance_matic')} MATIC")
                    
                    if float(data.get("balance_matic", 0)) > 0.01:
                        print("✅ Sufficient balance for transactions")
                    else:
                        print("⚠️  Low balance - consider adding MATIC for transactions")
                        
            else:
                print("\n❌ ISSUE: Private key doesn't match expected address")
                print(f"Expected: {data.get('expected_address')}")
                print(f"Got: {data.get('master_address')}")
                
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing Railway wallet: {e}")
        print("\nPossible issues:")
        print("- Railway app not deployed")
        print("- Wrong URL provided") 
        print("- Private key environment variable not set")
        print("- Network connectivity issues")

if __name__ == "__main__":
    test_railway_wallet()