import React from 'react';

// Loading skeleton for movie cards
export const MovieCardSkeleton = () => (
  <div className="movie-item skeleton">
    <div className="movie-poster skeleton-poster"></div>
    <div className="movie-info">
      <div className="skeleton-title skeleton-text"></div>
      <div className="skeleton-year skeleton-text"></div>
      <div className="skeleton-rating skeleton-text"></div>
      <div className="skeleton-overview">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
    <div className="movie-actions">
      <div className="skeleton-button"></div>
    </div>
  </div>
);

// Loading skeleton for grid view
export const MovieGridSkeleton = () => (
  <div className="movie-card skeleton">
    <div className="skeleton-poster-large"></div>
    <div className="movie-info">
      <div className="skeleton-title skeleton-text"></div>
      <div className="skeleton-year skeleton-text"></div>
      <div className="skeleton-rating skeleton-text"></div>
    </div>
    <div className="movie-actions">
      <div className="skeleton-button"></div>
    </div>
  </div>
);

// Loading skeleton for movie details modal
export const MovieDetailsSkeleton = () => (
  <div className="movie-details-content skeleton">
    <div className="skeleton-modal-title skeleton-text"></div>
    
    <div className="movie-details-main">
      <div className="skeleton-poster-modal"></div>
      
      <div className="movie-details-info">
        <div className="movie-meta">
          <div className="movie-meta-item">
            <div className="skeleton-label skeleton-text"></div>
            <div className="skeleton-value skeleton-text"></div>
          </div>
          <div className="movie-meta-item">
            <div className="skeleton-label skeleton-text"></div>
            <div className="skeleton-value skeleton-text"></div>
          </div>
          <div className="movie-meta-item">
            <div className="skeleton-label skeleton-text"></div>
            <div className="skeleton-value skeleton-text"></div>
          </div>
        </div>

        <div className="genre-tags">
          <div className="skeleton-genre skeleton-text"></div>
          <div className="skeleton-genre skeleton-text"></div>
          <div className="skeleton-genre skeleton-text"></div>
        </div>

        <div className="movie-actions-modal">
          <div className="skeleton-button-large"></div>
        </div>
      </div>
    </div>

    <div className="movie-overview">
      <div className="skeleton-subtitle skeleton-text"></div>
      <div className="skeleton-overview">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
  </div>
);

// Loading skeleton list component
export const SkeletonList = ({ count = 5, type = 'list' }) => {
  const SkeletonComponent = type === 'grid' ? MovieGridSkeleton : MovieCardSkeleton;
  
  return (
    <div className={`skeleton-container ${type === 'grid' ? 'movie-grid' : 'movie-list'}`}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

export default SkeletonList;
