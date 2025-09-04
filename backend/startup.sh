#!/bin/bash

# Railway startup script for NexteraEstate backend
echo "🚀 Starting NexteraEstate backend on Railway..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --no-cache-dir -r requirements.txt

# Create necessary directories
mkdir -p /app/uploads
mkdir -p /app/data

# Start the server
echo "🚀 Starting FastAPI server..."
uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}