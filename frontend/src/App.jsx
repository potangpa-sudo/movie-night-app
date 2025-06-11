import { useState, useEffect } from 'react'
import './App.css'
import ErrorBoundary from './ErrorBoundary'
import MovieCard from './MovieCard'
import { SkeletonList, MovieDetailsSkeleton } from './LoadingSkeletons'
import { api, useErrorHandler, APIError, NetworkError, AuthError } from './api'

/**
 * Movie Night Application with Enhanced Movie Overview
 * A comprehensive movie discovery platform with IMDb-like details
 * 
 * Features:
 * - JWT Authentication
 * - Movie search with TMDB API
 * - Enhanced movie details with cast, crew, keywords, reviews
 * - Similar movies recommendations
 * - Watchlist management
 * - Dark mode support
 * - Grid/List view toggle
 * - Movie trailers
 * - Responsive design
 * - Error handling and loading states
 */

function App() {
  // Authentication state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // UI state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem('viewMode')
    return saved || 'list'
  })
  const [activeTab, setActiveTab] = useState('popular')
  
  // Movie data state
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieTrailers, setMovieTrailers] = useState({})
  
  // Enhanced movie overview data
  const [movieCredits, setMovieCredits] = useState(null)
  const [movieKeywords, setMovieKeywords] = useState(null)
  const [similarMovies, setSimilarMovies] = useState(null)
  const [movieReviews, setMovieReviews] = useState(null)
  
  // Loading and error state
  const [loading, setLoading] = useState(false)
  const [popularLoading, setPopularLoading] = useState(false)
  const [movieDetailsLoading, setMovieDetailsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Error handler
  const handleError = useErrorHandler()

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('movieNightToken')
    if (savedToken) {
      setToken(savedToken)
      setIsLoggedIn(true)
    }
  }, [])

  // Load popular movies when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      loadPopularMovies()
    }
  }, [isLoggedIn])

  // Apply dark mode class to body and save preference
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode)
  }, [viewMode])

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list')
  }

  /**
   * Authentication handlers
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.login({ username, password })
      setToken(response.token)
      setIsLoggedIn(true)
      setPassword('')
      console.log('Login successful')
    } catch (err) {
      const errorMessage = handleError(err, 'Login')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setToken('')
    setUsername('')
    setPassword('')
    setIsLoggedIn(false)
    setMovies([])
    setQuery('')
    setError('')
    setWatchlist([])
    setSelectedMovie(null)
    setActiveTab('popular')
    localStorage.removeItem('movieNightToken')
  }

  /**
   * Movie search and data handlers
   */
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setError('')
    setLoading(true)
    setActiveTab('search')

    try {
      const data = await api.searchMovies(query)
      setMovies(data.results || [])
    } catch (err) {
      const errorMessage = handleError(err, 'Movie search')
      setError(errorMessage)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const loadPopularMovies = async () => {
    setPopularLoading(true)
    setError('')

    try {
      const data = await api.getPopularMovies()
      setPopularMovies(data.results || [])
    } catch (err) {
      const errorMessage = handleError(err, 'Loading popular movies')
      setError(errorMessage)
    } finally {
      setPopularLoading(false)
    }
  }

  /**
   * Watchlist management
   */
  const addToWatchlist = (movie) => {
    if (!watchlist.find(m => m.id === movie.id)) {
      setWatchlist(prev => [...prev, movie])
    }
  }

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId))
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => m.id === movieId)
  }

  /**
   * Enhanced movie details with comprehensive overview data
   */
  const openMovieDetails = async (movie) => {
    setMovieDetailsLoading(true)
    setSelectedMovie(movie) // Show modal immediately with basic info
    
    // Clear previous movie data
    setMovieCredits(null)
    setMovieKeywords(null)
    setSimilarMovies(null)
    setMovieReviews(null)

    try {
      // Fetch detailed movie information
      const detailedMovie = await api.getMovieDetails(movie.id)
      setSelectedMovie(detailedMovie)

      // Fetch enhanced movie data in parallel
      const enhancedDataPromises = [
        // Movie trailers
        api.getMovieVideos(movie.id).then(trailerData => {
          const trailer = trailerData.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          )
          if (trailer) {
            setMovieTrailers(prev => ({
              ...prev,
              [movie.id]: trailer.key
            }))
          }
        }).catch(err => console.warn('Failed to load trailer:', err)),

        // Movie credits (cast and crew)
        api.getMovieCredits(movie.id).then(creditsData => {
          setMovieCredits(creditsData)
        }).catch(err => console.warn('Failed to load credits:', err)),

        // Movie keywords
        api.getMovieKeywords(movie.id).then(keywordsData => {
          setMovieKeywords(keywordsData)
        }).catch(err => console.warn('Failed to load keywords:', err)),

        // Similar movies
        api.getSimilarMovies(movie.id).then(similarData => {
          setSimilarMovies(similarData)
        }).catch(err => console.warn('Failed to load similar movies:', err)),

        // Movie reviews
        api.getMovieReviews(movie.id).then(reviewsData => {
          setMovieReviews(reviewsData)
        }).catch(err => console.warn('Failed to load reviews:', err))
      ]

      // Wait for all enhanced data requests
      await Promise.allSettled(enhancedDataPromises)

    } catch (err) {
      const errorMessage = handleError(err, 'Loading movie details')
      console.error(errorMessage)
      // Keep the modal open with basic movie info even if detailed fetch fails
    } finally {
      setMovieDetailsLoading(false)
    }
  }

  const closeMovieDetails = () => {
    setSelectedMovie(null)
    setMovieDetailsLoading(false)
    // Clear enhanced movie data
    setMovieCredits(null)
    setMovieKeywords(null)
    setSimilarMovies(null)
    setMovieReviews(null)
  }

  /**
   * Render JSX helpers for enhanced movie components
   */
  const renderCastSection = () => {
    if (!movieCredits || !movieCredits.cast) return null

    const mainCast = movieCredits.cast.slice(0, 8)
    return (
      <div className="movie-cast">
        <h3>Cast</h3>
        <div className="cast-grid">
          {mainCast.map(person => (
            <div key={person.id} className="cast-member">
              {person.profile_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  className="cast-photo"
                />
              ) : (
                <div className="cast-photo cast-photo-placeholder">👤</div>
              )}
              <div className="cast-name">{person.name}</div>
              <div className="cast-character">{person.character}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCrewSection = () => {
    if (!movieCredits || !movieCredits.crew) return null

    const keyCrewRoles = ['Director', 'Producer', 'Executive Producer', 'Screenplay', 'Writer', 'Music', 'Director of Photography']
    const keyCrew = movieCredits.crew.filter(person => 
      keyCrewRoles.includes(person.job)
    ).slice(0, 6)

    if (keyCrew.length === 0) return null

    return (
      <div className="crew-section">
        <h3>Crew</h3>
        <div className="crew-list">
          {keyCrew.map((person, index) => (
            <div key={`${person.id}-${index}`} className="crew-member">
              <span className="crew-name">{person.name}</span>
              <span className="crew-job">{person.job}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderKeywordsSection = () => {
    if (!movieKeywords || !movieKeywords.keywords || movieKeywords.keywords.length === 0) return null

    return (
      <div className="keywords-section">
        <h3>Keywords</h3>
        <div className="keywords-list">
          {movieKeywords.keywords.slice(0, 10).map(keyword => (
            <span key={keyword.id} className="keyword-tag">
              {keyword.name}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const renderReviewsSection = () => {
    if (!movieReviews || !movieReviews.results || movieReviews.results.length === 0) return null

    const topReviews = movieReviews.results.slice(0, 3)
    return (
      <div className="reviews-section">
        <h3>Reviews ({movieReviews.total_results})</h3>
        <div className="reviews-list">
          {topReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                {review.author_details?.rating && (
                  <span className="review-rating">
                    ★ {review.author_details.rating}/10
                  </span>
                )}
              </div>
              <div className="review-content">
                {review.content.length > 300 
                  ? `${review.content.substring(0, 300)}...` 
                  : review.content
                }
              </div>
              <div className="review-date">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSimilarMoviesSection = () => {
    if (!similarMovies || !similarMovies.results || similarMovies.results.length === 0) return null

    return (
      <div className="similar-movies-section">
        <h3>Similar Movies</h3>
        <div className="similar-movies-grid">
          {similarMovies.results.slice(0, 6).map(movie => (
            <div 
              key={movie.id} 
              className="similar-movie-card"
              onClick={() => openMovieDetails(movie)}
            >
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="similar-movie-poster"
                />
              ) : (
                <div className="similar-movie-poster-placeholder">🎬</div>
              )}
              <div className="similar-movie-info">
                <div className="similar-movie-title">{movie.title}</div>
                <div className="similar-movie-year">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                </div>
                <div className="similar-movie-rating">
                  ★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /**
   * Enhanced movie list rendering with modern design
   */
  const renderMovieList = (movieList, showActions = true) => {
    if (movieList.length === 0) return null

    return (
      <ul className={`${viewMode === 'grid' ? 'movie-grid' : 'movie-list'}`}>
        {movieList.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            viewMode={viewMode}
            showActions={showActions}
            isInWatchlist={isInWatchlist(movie.id)}
            onMovieClick={() => openMovieDetails(movie)}
            onAddToWatchlist={() => addToWatchlist(movie)}
            onRemoveFromWatchlist={() => removeFromWatchlist(movie.id)}
            activeTab={activeTab}
          />
        ))}
      </ul>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        <header className="app-header">
          <h1>🎬 Movie Night</h1>
          
          {isLoggedIn && (
            <div className="header-controls">
              <button 
                className="mode-toggle-btn"
                onClick={toggleDarkMode}
                title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button 
                className="view-toggle-btn"
                onClick={toggleViewMode}
                title={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
              >
                {viewMode === 'list' ? '⊞' : '☰'}
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </header>

        {!isLoggedIn ? (
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login to Continue</h2>
            <div className="form-group">
              <input 
                placeholder="Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input 
                placeholder="Password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="demo-info">
              Demo: username "test", password "password"
            </p>
          </form>
        ) : (
          <>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-group">
                <input 
                  placeholder="Search for movies..." 
                  value={query} 
                  onChange={e => setQuery(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? '⏳' : '🔍'}
                </button>
              </div>
            </form>

            <div className="content-header">
              <div className="tab-buttons">
                <button 
                  className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
                  onClick={() => setActiveTab('popular')}
                >
                  🔥 Popular ({popularMovies.length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                  onClick={() => setActiveTab('search')}
                >
                  🔍 Search Results ({movies.length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
                  onClick={() => setActiveTab('watchlist')}
                >
                  ⭐ My Watchlist ({watchlist.length})
                </button>
              </div>
            </div>

            <div className="content-area">
              {activeTab === 'popular' && (
                <div>
                  {popularLoading ? (
                    <SkeletonList count={6} />
                  ) : popularMovies.length > 0 ? (
                    renderMovieList(popularMovies)
                  ) : (
                    <div className="empty-state">
                      <p>No popular movies available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'search' && (
                <div>
                  {loading ? (
                    <SkeletonList count={6} />
                  ) : movies.length > 0 ? (
                    renderMovieList(movies)
                  ) : (
                    <div className="empty-state">
                      <p>Search for movies to see results here</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'watchlist' && (
                <div>
                  {watchlist.length > 0 ? (
                    renderMovieList(watchlist)
                  ) : (
                    <div className="empty-state">
                      <p>Your watchlist is empty. Add some movies!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Movie Details Modal */}
            {selectedMovie && (
              <div className="modal-overlay" onClick={closeMovieDetails}>
                <div className="movie-details-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="close-modal-btn" onClick={closeMovieDetails}>
                    ×
                  </button>
                  
                  {movieDetailsLoading ? (
                    <MovieDetailsSkeleton />
                  ) : (
                    <div className="movie-details-content">
                      <div className="movie-details-header">
                        <div className="movie-poster-container">
                          {selectedMovie.poster_path && (
                            <img 
                              src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`}
                              alt={selectedMovie.title}
                              className="movie-poster-large"
                            />
                          )}
                        </div>
                        
                        <div className="movie-header-info">
                          <h2 className="movie-title">{selectedMovie.title}</h2>
                          
                          {selectedMovie.tagline && (
                            <p className="movie-tagline">"{selectedMovie.tagline}"</p>
                          )}
                          
                          <div className="movie-meta-grid">
                            <div className="movie-meta-item">
                              <span className="movie-meta-label">Release Date</span>
                              <span className="movie-meta-value">
                                {selectedMovie.release_date ? new Date(selectedMovie.release_date).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                            <div className="movie-meta-item">
                              <span className="movie-meta-label">Runtime</span>
                              <span className="movie-meta-value">
                                {selectedMovie.runtime ? `${selectedMovie.runtime} minutes` : 'N/A'}
                              </span>
                            </div>
                            <div className="movie-meta-item">
                              <span className="movie-meta-label">Rating</span>
                              <span className="movie-meta-value">
                                {selectedMovie.vote_average ? (
                                  <span className="rating-display">
                                    <span className="rating-badge">★ {selectedMovie.vote_average.toFixed(1)}</span>
                                    <span className="rating-text">({selectedMovie.vote_count} votes)</span>
                                  </span>
                                ) : 'N/A'}
                              </span>
                            </div>
                            {selectedMovie.budget && selectedMovie.budget > 0 && (
                              <div className="movie-meta-item">
                                <span className="movie-meta-label">Budget</span>
                                <span className="movie-meta-value">
                                  ${selectedMovie.budget.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {selectedMovie.revenue && selectedMovie.revenue > 0 && (
                              <div className="movie-meta-item">
                                <span className="movie-meta-label">Revenue</span>
                                <span className="movie-meta-value">
                                  ${selectedMovie.revenue.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>

                          {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                            <div className="genre-tags">
                              {selectedMovie.genres.map(genre => (
                                <span key={genre.id} className="genre-tag">{genre.name}</span>
                              ))}
                            </div>
                          )}

                          <div className="movie-actions">
                            <button 
                              className={`watchlist-btn ${isInWatchlist(selectedMovie.id) ? 'in-watchlist' : ''}`}
                              onClick={() => isInWatchlist(selectedMovie.id) 
                                ? removeFromWatchlist(selectedMovie.id) 
                                : addToWatchlist(selectedMovie)
                              }
                            >
                              {isInWatchlist(selectedMovie.id) ? '✓ In Watchlist' : '+ Add to Watchlist'}
                            </button>
                            
                            {movieTrailers[selectedMovie.id] && (
                              <button 
                                className="trailer-btn"
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${movieTrailers[selectedMovie.id]}`, '_blank')}
                              >
                                ▶️ Watch Trailer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="movie-details-body">
                        <div className="movie-overview-section">
                          <h3>Overview</h3>
                          <p>{selectedMovie.overview || 'No description available'}</p>
                        </div>

                        {selectedMovie.production_companies && selectedMovie.production_companies.length > 0 && (
                          <div className="production-section">
                            <h3>Production Companies</h3>
                            <div className="production-companies">
                              {selectedMovie.production_companies.slice(0, 3).map(company => (
                                <span key={company.id} className="production-company">
                                  {company.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {renderCastSection()}
                        {renderCrewSection()}
                        {renderKeywordsSection()}
                        {renderReviewsSection()}
                        {renderSimilarMoviesSection()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button className="error-dismiss" onClick={() => setError('')}>×</button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
