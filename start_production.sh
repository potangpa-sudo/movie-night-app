#!/bin/bash

# Production startup script for Movie Night API

echo "🚀 Starting Movie Night API in production mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please ensure .env file exists with production configuration."
    exit 1
fi

# Activate virtual environment
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
else
    echo "❌ Error: Virtual environment not found!"
    echo "Please run: python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Set production environment
export FLASK_ENV=production
export FLASK_DEBUG=False

# Start the server with Gunicorn
echo "🌟 Starting production server with Gunicorn..."
gunicorn --config gunicorn.conf.py app:app
