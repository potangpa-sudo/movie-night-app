import React from 'react';

/**
 * MovieCard Component
 * Displays movie information in both list and grid views
 * 
 * @param {Object} movie - Movie data object
 * @param {string} viewMode - 'list' or 'grid'
 * @param {boolean} showActions - Whether to show watchlist actions
 * @param {Function} onMovieClick - Handler for movie click
 * @param {Function} onAddToWatchlist - Handler for adding to watchlist
 * @param {Function} onRemoveFromWatchlist - Handler for removing from watchlist
 * @param {boolean} isInWatchlist - Whether movie is in watchlist
 * @param {string} activeTab - Current active tab
 */
const MovieCard = ({
  movie,
  viewMode = 'list',
  showActions = true,
  onMovieClick,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist = false,
  activeTab = 'popular'
}) => {
  const handleMovieClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleAddToWatchlist = (e) => {
    e.stopPropagation();
    if (onAddToWatchlist) {
      onAddToWatchlist(movie);
    }
  };

  const handleRemoveFromWatchlist = (e) => {
    e.stopPropagation();
    if (onRemoveFromWatchlist) {
      onRemoveFromWatchlist(movie.id);
    }
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/${viewMode === 'grid' ? 'w300' : 'w92'}${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'Unknown Year';

  const rating = movie.vote_average 
    ? movie.vote_average.toFixed(1) 
    : null;

  const overview = movie.overview 
    ? (viewMode === 'list' ? movie.overview.substring(0, 150) + '...' : movie.overview.substring(0, 100) + '...')
    : 'No description available';

  return (
    <li className={`movie-item ${viewMode === 'grid' ? 'movie-card' : ''}`}>
      {posterUrl ? (
        <img 
          src={posterUrl}
          alt={movie.title}
          className="movie-poster"
          onClick={handleMovieClick}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div 
          className="movie-poster movie-poster-placeholder"
          onClick={handleMovieClick}
          title={movie.title}
        >
          🎬
        </div>
      )}

      <div className="movie-info" onClick={handleMovieClick}>
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        
        <p className="movie-year">{releaseYear}</p>
        
        {rating && (
          <div className="movie-rating">
            <span className="rating-badge">★ {rating}</span>
          </div>
        )}
        
        {viewMode === 'list' && (
          <p className="movie-overview" title={movie.overview}>
            {overview}
          </p>
        )}
      </div>

      {showActions && (
        <div className="movie-actions">
          {activeTab === 'watchlist' ? (
            <button 
              className="remove-from-watchlist-btn"
              onClick={handleRemoveFromWatchlist}
              title="Remove from watchlist"
            >
              Remove
            </button>
          ) : (
            <button 
              className="add-to-watchlist-btn"
              onClick={handleAddToWatchlist}
              disabled={isInWatchlist}
              title={isInWatchlist ? 'Already in watchlist' : 'Add to watchlist'}
            >
              {isInWatchlist ? '✓ Added' : '+ Watchlist'}
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default MovieCard;
