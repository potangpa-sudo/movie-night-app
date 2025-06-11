#!/bin/bash

# GitHub Preparation Script
# Run this to prepare your Movie Night App for GitHub

echo "🚀 Preparing Movie Night App for GitHub..."

# Initialize git repository
echo "📝 Initializing git repository..."
git init

# Add all files
echo "📦 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎬 Initial commit: Movie Night App v1.0.0

✨ Features:
- Full-stack movie discovery app
- JWT authentication
- TMDB API integration
- React frontend with dark mode
- Flask backend with Gunicorn
- Production-ready deployment
- Comprehensive testing suite
- Docker support

🚀 Ready for production deployment!"

echo ""
echo "✅ Git repository initialized and committed!"
echo ""
echo "🔗 Next steps to push to GitHub:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/yourusername/movie-night-app.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "🎉 Your Movie Night App is ready for GitHub!"
