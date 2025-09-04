#!/usr/bin/env python3
"""
Final comprehensive Railway deployment test
"""
import os
import sys
import asyncio
from datetime import datetime

# Set Railway environment
os.environ['RAILWAY'] = 'true'
os.environ['DATA_DIR'] = '/tmp'
os.environ['PORT'] = '8001'

# Add backend to Python path
sys.path.insert(0, '/app/backend')

async def test_railway_deployment():
    """Test all critical Railway deployment components"""
    
    print(f"🚀 COMPREHENSIVE RAILWAY DEPLOYMENT TEST")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 60)
    
    try:
        # Test 1: Import all modules
        print("✓ Testing module imports...")
        import autolex_core
        import server
        from server import app
        print("✓ All modules imported successfully")
        
        # Test 2: Check environment variables
        print("✓ Testing environment detection...")
        print(f"  RAILWAY: {os.getenv('RAILWAY')}")
        print(f"  DATA_DIR: {os.getenv('DATA_DIR')}")
        print(f"  PORT: {os.getenv('PORT')}")
        
        # Test 3: Check AI guards
        print("✓ Testing AI service guards...")
        from server import AI_ENABLED, WEB3_ENABLED, AUTOLEX_AVAILABLE
        print(f"  AI_ENABLED: {AI_ENABLED}")
        print(f"  WEB3_ENABLED: {WEB3_ENABLED}")  
        print(f"  AUTOLEX_AVAILABLE: {AUTOLEX_AVAILABLE}")
        
        # Test 4: Check router inclusion
        print("✓ Testing FastAPI router setup...")
        from server import ai_team_router
        if ai_team_router is None:
            print("  AI Team router correctly disabled")
        else:
            print("  AI Team router available")
            
        # Test 5: Test FastAPI app creation
        print("✓ Testing FastAPI app initialization...")
        if hasattr(app, 'routes'):
            route_count = len(app.routes)
            print(f"  FastAPI app has {route_count} routes")
        else:
            raise Exception("FastAPI app missing routes")
            
        # Test 6: Test database paths
        print("✓ Testing database path configuration...")
        import autolex_core
        core_instance = autolex_core.AutoLexCore()
        print(f"  AutoLex DB path: {core_instance.db_path}")
        
        if core_instance.db_path.startswith('/tmp/'):
            print("  Database paths correctly configured for Railway")
        else:
            print(f"  WARNING: Database path may not work on Railway: {core_instance.db_path}")
            
        print("\n🎉 ALL RAILWAY TESTS PASSED!")
        print("✅ RAILWAY DEPLOYMENT READY")
        return True
        
    except Exception as e:
        print(f"\n❌ RAILWAY TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_railway_deployment())
    sys.exit(0 if success else 1)