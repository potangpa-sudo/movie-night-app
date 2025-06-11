/**
 * API utility functions with comprehensive error handling
 * Provides centralized API calls with retry logic and error management
 */

// Environment-based API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-api-domain.com'  // Replace with your production API URL
  : 'http://localhost:5001';

// Custom error classes for better error handling
export class APIError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

export class NetworkError extends Error {
  constructor(message, endpoint) {
    super(message);
    this.name = 'NetworkError';
    this.endpoint = endpoint;
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

// Maximum retry attempts
const MAX_RETRIES = 3;

// Retry delay in milliseconds
const RETRY_DELAY = 1000;

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Enhanced fetch with timeout and retry logic
 */
const fetchWithTimeout = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new NetworkError('Request timeout', url);
    }
    throw error;
  }
};

/**
 * Generic API request with error handling and retry logic
 */
const apiRequest = async (endpoint, options = {}, retries = MAX_RETRIES) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new AuthError(errorMessage);
        }
        
        throw new APIError(errorMessage, response.status, endpoint);
      }

      return await response.json();
    } catch (error) {
      // Don't retry on auth errors or client errors (4xx)
      if (error instanceof AuthError || (error instanceof APIError && error.status >= 400 && error.status < 500)) {
        throw error;
      }

      // Log attempt
      console.warn(`API request attempt ${attempt}/${retries} failed:`, {
        endpoint,
        error: error.message,
        attempt
      });

      // If this was the last attempt, throw the error
      if (attempt === retries) {
        if (error instanceof APIError || error instanceof NetworkError) {
          throw error;
        }
        throw new NetworkError(`Network error: ${error.message}`, endpoint);
      }

      // Wait before retrying
      await sleep(RETRY_DELAY * attempt);
    }
  }
};

/**
 * API functions for the Movie Night app
 */
export const api = {
  /**
   * User authentication
   */
  login: async (credentials) => {
    try {
      const response = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('movieNightToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Search for movies
   */
  searchMovies: async (query) => {
    if (!query || !query.trim()) {
      throw new APIError('Search query is required', 400, '/api/movies');
    }

    try {
      return await apiRequest(`/api/movies?query=${encodeURIComponent(query.trim())}`);
    } catch (error) {
      console.error('Movie search failed:', error);
      throw error;
    }
  },

  /**
   * Get popular movies
   */
  getPopularMovies: async () => {
    try {
      return await apiRequest('/api/popular');
    } catch (error) {
      console.error('Failed to load popular movies:', error);
      throw error;
    }
  },

  /**
   * Get movie details
   */
  getMovieDetails: async (movieId) => {
    if (!movieId) {
      throw new APIError('Movie ID is required', 400, '/api/movie');
    }

    try {
      return await apiRequest(`/api/movie/${movieId}`);
    } catch (error) {
      console.error(`Failed to load movie details for ID ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get movie videos/trailers
   */
  getMovieVideos: async (movieId) => {
    if (!movieId) {
      throw new APIError('Movie ID is required', 400, '/api/movie/videos');
    }

    try {
      return await apiRequest(`/api/movie/${movieId}/videos`);
    } catch (error) {
      console.error(`Failed to load movie videos for ID ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get movie credits (cast and crew)
   */
  getMovieCredits: async (movieId) => {
    if (!movieId) {
      throw new APIError('Movie ID is required', 400, '/api/movie/credits');
    }

    try {
      return await apiRequest(`/api/movie/${movieId}/credits`);
    } catch (error) {
      console.error(`Failed to load movie credits for ID ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get movie keywords
   */
  getMovieKeywords: async (movieId) => {
    if (!movieId) {
      throw new APIError('Movie ID is required', 400, '/api/movie/keywords');
    }

    try {
      return await apiRequest(`/api/movie/${movieId}/keywords`);
    } catch (error) {
      console.error(`Failed to load movie keywords for ID ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get similar movies
   */
  getSimilarMovies: async (movieId) => {
    if (!movieId) {
      throw new APIError('Movie ID is required', 400, '/api/movie/similar');
    }

    try {
      return await apiRequest(`/api/movie/${movieId}/similar`);
    } catch (error) {
      console.error(`Failed to load similar movies for ID ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get movie reviews
   */
  getMovieReviews: async (movieId) => {
    if (!movieId) {
      throw new APIError('Movie ID is required', 400, '/api/movie/reviews');
    }

    try {
      return await apiRequest(`/api/movie/${movieId}/reviews`);
    } catch (error) {
      console.error(`Failed to load movie reviews for ID ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Test protected endpoint
   */
  testProtected: async () => {
    const token = localStorage.getItem('movieNightToken');
    if (!token) {
      throw new AuthError('No authentication token found');
    }

    try {
      return await apiRequest('/api/protected', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error instanceof AuthError) {
        // Clear invalid token
        localStorage.removeItem('movieNightToken');
      }
      throw error;
    }
  },
};

/**
 * Error handler hook for React components
 */
export const useErrorHandler = () => {
  const handleError = (error, context = '') => {
    // Log error details
    const errorInfo = {
      message: error.message,
      name: error.name,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Add specific error properties
    if (error instanceof APIError) {
      errorInfo.status = error.status;
      errorInfo.endpoint = error.endpoint;
    } else if (error instanceof NetworkError) {
      errorInfo.endpoint = error.endpoint;
    }

    console.error('Error handled:', errorInfo);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    // Return user-friendly error message
    if (error instanceof AuthError) {
      return 'Please log in again to continue.';
    } else if (error instanceof NetworkError) {
      return 'Network connection error. Please check your internet connection and try again.';
    } else if (error instanceof APIError) {
      if (error.status >= 500) {
        return 'Server error. Please try again later.';
      } else if (error.status === 404) {
        return 'The requested resource was not found.';
      } else {
        return error.message || 'An error occurred. Please try again.';
      }
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  };

  return handleError;
};
