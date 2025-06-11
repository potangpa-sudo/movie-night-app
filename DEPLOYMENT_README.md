# 🎬 Movie Night App - Production Deployment Guide

A full-stack movie discovery application with JWT authentication, TMDB API integration, and modern React UI.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### 1. Environment Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd movie-night-app

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required: TMDB_API_KEY, JWT_SECRET
```

### 2. Development Setup
```bash
# Backend setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
cd ..
```

### 3. Development Run
```bash
# Terminal 1 - Backend
source venv/bin/activate
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🏭 Production Deployment

### Option 1: Automated Deployment
```bash
# Run the deployment script
./deploy.sh
```

### Option 2: Manual Production Setup
```bash
# 1. Install dependencies
source venv/bin/activate
pip install -r requirements.txt

# 2. Build frontend
cd frontend
npm ci --only=production
npm run build:prod
cd ..

# 3. Set production environment
export FLASK_ENV=production
export FLASK_DEBUG=False

# 4. Start production server
./start_production.sh
```

### Option 3: Docker Deployment
```bash
# Build and run with Docker
docker build -t movie-night-app .
docker run -p 5001:5001 --env-file .env movie-night-app
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `TMDB_API_KEY` | TMDB API key for movie data | ✅ | - |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ | - |
| `FLASK_ENV` | Flask environment | ❌ | `development` |
| `FLASK_DEBUG` | Enable debug mode | ❌ | `True` |
| `PORT` | Server port | ❌ | `5001` |
| `HOST` | Server host | ❌ | `127.0.0.1` |
| `ALLOWED_ORIGINS` | CORS allowed origins | ❌ | `localhost origins` |

### Frontend Configuration
- **Development**: `http://localhost:5001` (auto-configured)
- **Production**: Update `frontend/src/api.js` with your production API URL

## 🧪 Testing

```bash
# Run backend tests
source venv/bin/activate
python -m pytest test_app.py -v

# Run frontend tests
cd frontend
npm test

# Run with coverage
npm run test:coverage
```

## 📁 Project Structure

```
movie-night-app/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── gunicorn.conf.py      # Production server config
├── deploy.sh             # Deployment script
├── start_production.sh   # Production startup
├── Dockerfile            # Docker configuration
├── .env.example          # Environment template
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main application
│   │   ├── api.js        # API utilities
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
└── docs/                 # Documentation
```

## 🌟 Features

### Backend (Flask)
- 🔐 JWT Authentication
- 🎬 TMDB API Integration
- 🔒 CORS Security
- 📊 Health Check Endpoints
- 🧪 Comprehensive Testing

### Frontend (React + Vite)
- 🎨 Modern React UI
- 🌙 Dark/Light Mode
- 📱 Responsive Design
- 🔍 Movie Search & Discovery
- 👥 Cast & Crew Information
- 📺 Movie Trailers
- ⭐ Reviews & Ratings
- 🎯 Similar Movie Recommendations

## 🚦 API Endpoints

### Authentication
- `POST /api/login` - User login
- `GET /api/protected` - Protected endpoint

### Movies
- `GET /api/popular` - Popular movies
- `GET /api/movies?query=` - Search movies
- `GET /api/movie/<id>` - Movie details
- `GET /api/movie/<id>/credits` - Cast & crew
- `GET /api/movie/<id>/videos` - Trailers
- `GET /api/movie/<id>/reviews` - Reviews
- `GET /api/movie/<id>/similar` - Similar movies
- `GET /api/movie/<id>/keywords` - Movie keywords

### System
- `GET /` - API status
- `GET /health` - Health check

## 🔒 Security Features

- Environment-based configuration
- CORS protection
- JWT token authentication
- Input validation
- Error handling
- Production-ready WSGI server (Gunicorn)

## 📈 Production Monitoring

### Health Checks
- `GET /health` - Returns server status and timestamp
- Monitor for 200 status code responses

### Logging
- Gunicorn access logs
- Application error logs
- Configurable log levels

## 🛠️ Development

### Code Quality
```bash
# Backend testing
python -m pytest test_app.py -v --cov

# Frontend linting
cd frontend
npm run lint

# Frontend testing
npm test
```

### Hot Reload Development
- Backend: Flask development server with auto-reload
- Frontend: Vite HMR (Hot Module Replacement)

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

[Add support information here]

---

**Movie Night App v1.0.0** - Built with ❤️ using Flask, React, and TMDB API
