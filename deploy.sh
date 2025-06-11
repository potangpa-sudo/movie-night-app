#!/bin/bash

# Production Deployment Script for Movie Night App

echo "🚀 Starting Movie Night App deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Activate virtual environment
echo "📦 Activating Python virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm ci --only=production

# Build frontend for production
echo "🏗️  Building frontend for production..."
npm run build

# Go back to root
cd ..

# Run tests
echo "🧪 Running tests..."
python -m pytest test_app.py -v

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Tests failed! Deployment aborted."
    exit 1
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "To start the production server:"
echo "1. Set FLASK_ENV=production in your .env file"
echo "2. Run: python app.py"
echo ""
echo "Frontend build is available in: frontend/dist/"
