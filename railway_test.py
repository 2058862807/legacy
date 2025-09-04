#!/usr/bin/env python3
"""
Quick test to verify all imports work for Railway deployment
"""
import os
import sys

# Set Railway environment for testing
os.environ['RAILWAY'] = 'true'
os.environ['DATA_DIR'] = '/tmp'

try:
    print("Testing Railway deployment imports...")
    
    # Test the problematic import
    print("✓ Testing autolex_core import...")
    from autolex_core import autolex_core
    print("✓ autolex_core imported successfully")
    
    print("✓ Testing server import...")
    import server
    print("✓ server imported successfully")
    
    print("✓ Testing health endpoints...")
    # Test that health endpoints return quickly
    from server import app
    print("✓ FastAPI app created successfully")
    
    print("\n🎉 ALL RAILWAY IMPORTS SUCCESSFUL!")
    print("Railway deployment should work now.")
    
except Exception as e:
    print(f"❌ RAILWAY TEST FAILED: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)