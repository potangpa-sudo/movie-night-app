"""
Unit tests for Movie Night Flask API
"""
import unittest
import json
import jwt
import datetime
from unittest.mock import patch, MagicMock
from app import app, USER


class MovieNightAPITestCase(unittest.TestCase):
    """Test cases for Movie Night API endpoints"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.app = app.test_client()
        self.app.testing = True
        
        # Test user credentials
        self.valid_credentials = {
            'username': 'test',
            'password': 'password'
        }
        
        self.invalid_credentials = {
            'username': 'wrong',
            'password': 'wrong'
        }
    
    def test_home_endpoint(self):
        """Test the home endpoint returns correct message"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Movie Night API is running!')
    
    def test_login_success(self):
        """Test successful login with valid credentials"""
        response = self.app.post('/api/login',
                                data=json.dumps(self.valid_credentials),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertIn('token', data)
        
        # Verify token is valid JWT
        try:
            decoded = jwt.decode(data['token'], 
                               app.config['SECRET_KEY'], 
                               algorithms=['HS256'])
            self.assertEqual(decoded['user'], 'test')
        except jwt.InvalidTokenError:
            self.fail("Generated token is invalid")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.app.post('/api/login',
                                data=json.dumps(self.invalid_credentials),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 401)
        
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Invalid credentials')
    
    def test_login_missing_data(self):
        """Test login with missing data"""
        response = self.app.post('/api/login',
                                data=json.dumps({}),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
    
    @patch('app.requests.get')
    def test_search_movies_success(self, mock_get):
        """Test successful movie search"""
        # Mock TMDB API response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'results': [
                {
                    'id': 123,
                    'title': 'Test Movie',
                    'overview': 'A test movie',
                    'release_date': '2023-01-01'
                }
            ]
        }
        mock_get.return_value = mock_response
        
        response = self.app.get('/api/movies?query=test')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertIn('results', data)
        self.assertEqual(len(data['results']), 1)
        self.assertEqual(data['results'][0]['title'], 'Test Movie')
    
    def test_search_movies_no_query(self):
        """Test movie search without query parameter"""
        response = self.app.get('/api/movies')
        self.assertEqual(response.status_code, 400)
        
        data = json.loads(response.data)
        self.assertIn('message', data)
    
    @patch('app.requests.get')
    def test_popular_movies(self, mock_get):
        """Test popular movies endpoint"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'results': [
                {
                    'id': 456,
                    'title': 'Popular Movie',
                    'vote_average': 8.5
                }
            ]
        }
        mock_get.return_value = mock_response
        
        response = self.app.get('/api/popular')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertIn('results', data)
    
    @patch('app.requests.get')
    def test_movie_details(self, mock_get):
        """Test movie details endpoint"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'id': 789,
            'title': 'Detailed Movie',
            'runtime': 120,
            'genres': [{'id': 1, 'name': 'Action'}]
        }
        mock_get.return_value = mock_response
        
        response = self.app.get('/api/movie/789')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertEqual(data['id'], 789)
        self.assertEqual(data['title'], 'Detailed Movie')
    
    @patch('app.requests.get')
    def test_movie_videos(self, mock_get):
        """Test movie videos endpoint"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'results': [
                {
                    'key': 'abc123',
                    'site': 'YouTube',
                    'type': 'Trailer'
                }
            ]
        }
        mock_get.return_value = mock_response
        
        response = self.app.get('/api/movie/789/videos')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertIn('results', data)
    
    def generate_valid_token(self):
        """Helper method to generate valid JWT token"""
        return jwt.encode({
            'user': 'test',
            'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
    
    def test_protected_endpoint_valid_token(self):
        """Test protected endpoint with valid token"""
        token = self.generate_valid_token()
        
        response = self.app.get('/api/protected',
                               headers={'Authorization': f'Bearer {token}'})
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Access granted')
    
    def test_protected_endpoint_invalid_token(self):
        """Test protected endpoint with invalid token"""
        response = self.app.get('/api/protected',
                               headers={'Authorization': 'Bearer invalid_token'})
        
        self.assertEqual(response.status_code, 401)
        
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Token is invalid or missing')
    
    def test_protected_endpoint_no_token(self):
        """Test protected endpoint without token"""
        response = self.app.get('/api/protected')
        
        self.assertEqual(response.status_code, 401)


if __name__ == '__main__':
    unittest.main()
