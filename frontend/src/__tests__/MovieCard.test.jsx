import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import MovieCard from '../MovieCard'

describe('MovieCard Component', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'This is a test movie with a longer description that should be truncated in the component.',
    release_date: '2023-06-15',
    vote_average: 8.5,
    poster_path: '/test-poster.jpg'
  }

  const defaultProps = {
    movie: mockMovie,
    viewMode: 'list',
    showActions: true,
    onMovieClick: vi.fn(),
    onAddToWatchlist: vi.fn(),
    onRemoveFromWatchlist: vi.fn(),
    isInWatchlist: false,
    activeTab: 'popular'
  }

  it('renders movie information correctly', () => {
    render(<MovieCard {...defaultProps} />)
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('★ 8.5')).toBeInTheDocument()
    expect(screen.getByText(/This is a test movie/)).toBeInTheDocument()
  })

  it('renders poster image when poster_path exists', () => {
    render(<MovieCard {...defaultProps} />)
    
    const poster = screen.getByAltText('Test Movie')
    expect(poster).toBeInTheDocument()
    expect(poster).toHaveAttribute('src', expect.stringContaining('/test-poster.jpg'))
  })

  it('renders placeholder when no poster_path', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null }
    render(<MovieCard {...defaultProps} movie={movieWithoutPoster} />)
    
    expect(screen.getByText('🎬')).toBeInTheDocument()
  })

  it('calls onMovieClick when movie is clicked', async () => {
    const user = userEvent.setup()
    const onMovieClick = vi.fn()
    
    render(<MovieCard {...defaultProps} onMovieClick={onMovieClick} />)
    
    await user.click(screen.getByText('Test Movie'))
    
    expect(onMovieClick).toHaveBeenCalledWith(mockMovie)
  })

  it('shows add to watchlist button when not in watchlist', () => {
    render(<MovieCard {...defaultProps} isInWatchlist={false} />)
    
    expect(screen.getByRole('button', { name: '+ Watchlist' })).toBeInTheDocument()
  })

  it('shows added button when in watchlist', () => {
    render(<MovieCard {...defaultProps} isInWatchlist={true} />)
    
    expect(screen.getByRole('button', { name: '✓ Added' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '✓ Added' })).toBeDisabled()
  })

  it('shows remove button when in watchlist tab', () => {
    render(<MovieCard {...defaultProps} activeTab="watchlist" />)
    
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  it('calls onAddToWatchlist when add button is clicked', async () => {
    const user = userEvent.setup()
    const onAddToWatchlist = vi.fn()
    
    render(<MovieCard {...defaultProps} onAddToWatchlist={onAddToWatchlist} />)
    
    await user.click(screen.getByRole('button', { name: '+ Watchlist' }))
    
    expect(onAddToWatchlist).toHaveBeenCalledWith(mockMovie)
  })

  it('calls onRemoveFromWatchlist when remove button is clicked', async () => {
    const user = userEvent.setup()
    const onRemoveFromWatchlist = vi.fn()
    
    render(<MovieCard {...defaultProps} activeTab="watchlist" onRemoveFromWatchlist={onRemoveFromWatchlist} />)
    
    await user.click(screen.getByRole('button', { name: 'Remove' }))
    
    expect(onRemoveFromWatchlist).toHaveBeenCalledWith(mockMovie.id)
  })

  it('applies grid view classes when viewMode is grid', () => {
    const { container } = render(<MovieCard {...defaultProps} viewMode="grid" />)
    
    expect(container.querySelector('.movie-card')).toBeInTheDocument()
  })

  it('applies list view classes when viewMode is list', () => {
    const { container } = render(<MovieCard {...defaultProps} viewMode="list" />)
    
    expect(container.querySelector('.movie-card')).not.toBeInTheDocument()
    expect(container.querySelector('.movie-item')).toBeInTheDocument()
  })

  it('truncates overview in grid view', () => {
    render(<MovieCard {...defaultProps} viewMode="grid" />)
    
    // In grid view, overview should be shorter or not shown
    const overview = screen.queryByText(/This is a test movie/)
    if (overview) {
      expect(overview.textContent.length).toBeLessThan(mockMovie.overview.length)
    }
  })

  it('handles movie without rating gracefully', () => {
    const movieWithoutRating = { ...mockMovie, vote_average: null }
    render(<MovieCard {...defaultProps} movie={movieWithoutRating} />)
    
    expect(screen.queryByText(/★/)).not.toBeInTheDocument()
  })

  it('handles movie without release date gracefully', () => {
    const movieWithoutDate = { ...mockMovie, release_date: null }
    render(<MovieCard {...defaultProps} movie={movieWithoutDate} />)
    
    expect(screen.getByText('Unknown Year')).toBeInTheDocument()
  })

  it('prevents event bubbling when action buttons are clicked', async () => {
    const user = userEvent.setup()
    const onMovieClick = vi.fn()
    const onAddToWatchlist = vi.fn()
    
    render(<MovieCard {...defaultProps} onMovieClick={onMovieClick} onAddToWatchlist={onAddToWatchlist} />)
    
    await user.click(screen.getByRole('button', { name: '+ Watchlist' }))
    
    expect(onAddToWatchlist).toHaveBeenCalled()
    expect(onMovieClick).not.toHaveBeenCalled()
  })

  it('hides actions when showActions is false', () => {
    render(<MovieCard {...defaultProps} showActions={false} />)
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
