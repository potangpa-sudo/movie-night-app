import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# CORS configuration - secure for production
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176').split(',')
CORS(app, origins=allowed_origins)

# Load secrets from environment variables
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET')
if not app.config['SECRET_KEY']:
    raise ValueError("JWT_SECRET environment variable is required")

TMDB_API_KEY = os.environ.get('TMDB_API_KEY')
if not TMDB_API_KEY or TMDB_API_KEY == 'your_tmdb_api_key':
    raise ValueError("TMDB_API_KEY environment variable is required")

# Dummy user for demonstration
USER = {'username': 'test', 'password': 'password'}

# Test route
@app.route('/')
def home():
    return jsonify({'message': 'Movie Night API is running!', 'version': '1.0.0'})

@app.route('/health')
def health_check():
    """Health check endpoint for deployment monitoring"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now(datetime.UTC).isoformat(),
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password required'}), 400
    
    if data['username'] == USER['username'] and data['password'] == USER['password']:
        token = jwt.encode({
            'user': data['username'],
            'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=2)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/movies', methods=['GET'])
def get_movies():
    query = request.args.get('query')
    if not query:
        return jsonify({'message': 'Query parameter required'}), 400
    url = f'https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}'
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/api/movie/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}'
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/api/movie/<int:movie_id>/videos', methods=['GET'])
def get_movie_videos(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={TMDB_API_KEY}'
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/api/popular', methods=['GET'])
def get_popular_movies():
    url = f'https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}'
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/api/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return jsonify({'message': 'Access granted'})
    except Exception:
        return jsonify({'message': 'Token is invalid or missing'}), 401

@app.route('/api/movie/<int:movie_id>/credits', methods=['GET'])
def get_movie_credits(movie_id):
    """Get cast and crew information for a movie"""
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={TMDB_API_KEY}'
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/api/movie/<int:movie_id>/keywords', methods=['GET'])
def get_movie_keywords(movie_id):
    """Get keywords/tags for a movie"""
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/keywords?api_key={TMDB_API_KEY}'
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/api/movie/<int:movie_id>/similar', methods=['GET'])
def get_similar_movies(movie_id):
    """Get similar movies recommendations"""
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/similar?api_key={TMDB_API_KEY}'
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/api/movie/<int:movie_id>/reviews', methods=['GET'])
def get_movie_reviews(movie_id):
    """Get user reviews for a movie"""
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/reviews?api_key={TMDB_API_KEY}'
    r = requests.get(url)
    return jsonify(r.json())

if __name__ == '__main__':
    # Development server
    app.run(debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true', 
            port=int(os.environ.get('PORT', 5001)),
            host=os.environ.get('HOST', '127.0.0.1'))
