# Movie Night App 🎬

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 19](https://img.shields.io/badge/react-19-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/flask-3.1.1-green.svg)](https://flask.palletsprojects.com/)

A full-stack movie discovery web application with JWT authentication, real-time TMDB API integration, and a modern React interface. Built for movie enthusiasts who want to explore, search, and discover films with an IMDb-like experience.

![Movie Night App Demo](https://via.placeholder.com/800x400/2c3e50/ffffff?text=Movie+Night+App+Demo)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 🎬 **Movie Discovery** - Search and explore movies with TMDB API
- 👥 **Cast & Crew** - Detailed information about actors and filmmakers  
- 🏷️ **Movie Keywords** - Discover movies by themes and topics
- 📺 **Trailers** - Watch movie trailers directly in the app
- ⭐ **Reviews & Ratings** - Read user reviews and ratings
- 🎯 **Similar Movies** - Get personalized movie recommendations
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🚀 **Fast Performance** - Optimized with code splitting and caching

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **JWT** - Secure authentication
- **TMDB API** - Movie data source
- **Gunicorn** - WSGI HTTP Server
- **pytest** - Testing framework

### Frontend  
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with dark mode
- **Responsive Design** - Mobile-first approach

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD ready
- **Heroku/Railway** - Platform deployment ready

## 🚀 Quick Start

### Prerequisites
- Python 3.11+ 
- Node.js 18+
- TMDB API Key ([Get yours free](https://www.themoviedb.org/settings/api))

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/movie-night-app.git
cd movie-night-app

# Copy environment template
cp .env.example .env
# Edit .env with your TMDB_API_KEY and JWT_SECRET
```

### 2. Backend Setup
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Run Development Servers
```bash
# Terminal 1 - Backend (Port 5001)
source venv/bin/activate
python app.py

# Terminal 2 - Frontend (Port 5176)
cd frontend
npm run dev
```

Visit `http://localhost:5176` and login with:
- **Username:** `test`
- **Password:** `password`

## 📋 API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `GET /api/protected` - Protected route example

### Movies
- `GET /api/popular` - Popular movies
- `GET /api/movies?query=` - Search movies
- `GET /api/movie/{id}` - Movie details
- `GET /api/movie/{id}/credits` - Cast & crew
- `GET /api/movie/{id}/videos` - Trailers
- `GET /api/movie/{id}/reviews` - User reviews
- `GET /api/movie/{id}/similar` - Similar movies
- `GET /api/movie/{id}/keywords` - Movie keywords

### System
- `GET /health` - Health check

## 🧪 Testing

```bash
# Backend tests
source venv/bin/activate
python -m pytest test_app.py -v

# Frontend tests  
cd frontend
npm test

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Option 1: One-Click Deployment
```bash
./deploy.sh
```

### Option 2: Docker
```bash
docker build -t movie-night-app .
docker run -p 5001:5001 --env-file .env movie-night-app
```

### Option 3: Platform Deployment
- **Heroku**: Push with included `Procfile`
- **Railway**: Direct GitHub integration
- **DigitalOcean**: App Platform ready

See [DEPLOYMENT_README.md](DEPLOYMENT_README.md) for detailed deployment instructions.

## 📁 Project Structure

```
movie-night-app/
├── 🐍 Backend (Flask)
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── test_app.py        # Backend tests
│   └── gunicorn.conf.py   # Production server config
├── ⚛️ Frontend (React)
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── api.js         # API client utilities
│   │   └── components/    # Reusable components
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Build configuration
├── 🚀 Deployment
│   ├── deploy.sh          # Deployment script
│   ├── Dockerfile         # Docker configuration
│   ├── Procfile          # Heroku configuration
│   └── .env.example      # Environment template
└── 📚 Documentation
    ├── README.md          # This file
    ├── DEPLOYMENT_README.md
    └── docs/              # Detailed documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [React](https://reactjs.org/) for the amazing frontend framework
- [Flask](https://flask.palletsprojects.com/) for the lightweight backend framework


⭐ **Star this repo if you found it helpful!**
