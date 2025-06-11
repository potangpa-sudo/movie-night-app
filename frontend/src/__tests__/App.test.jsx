import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from '../App'
import * as api from '../api'

// Mock the API module
vi.mock('../api', () => ({
  api: {
    login: vi.fn(),
    searchMovies: vi.fn(),
    getPopularMovies: vi.fn(),
    getMovieDetails: vi.fn(),
    getMovieVideos: vi.fn(),
  },
  useErrorHandler: vi.fn(() => vi.fn()),
  APIError: class APIError extends Error {
    constructor(message, status, endpoint) {
      super(message)
      this.status = status
      this.endpoint = endpoint
    }
  },
  NetworkError: class NetworkError extends Error {
    constructor(message, endpoint) {
      super(message)
      this.endpoint = endpoint
    }
  },
  AuthError: class AuthError extends Error {
    constructor(message) {
      super(message)
    }
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('Movie Night App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Authentication', () => {
    it('renders login form when not authenticated', () => {
      render(<App />)
      
      expect(screen.getByText('🎬 Movie Night')).toBeInTheDocument()
      expect(screen.getByText('Login to Continue')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })

    it('shows demo credentials', () => {
      render(<App />)
      
      expect(screen.getByText(/Demo: username "test", password "password"/)).toBeInTheDocument()
    })

    it('handles successful login', async () => {
      const user = userEvent.setup()
      api.api.login.mockResolvedValue({ token: 'fake-token' })
      api.api.getPopularMovies.mockResolvedValue({ results: [] })
      
      render(<App />)
      
      await user.type(screen.getByPlaceholderText('Username'), 'test')
      await user.type(screen.getByPlaceholderText('Password'), 'password')
      await user.click(screen.getByRole('button', { name: 'Login' }))
      
      await waitFor(() => {
        expect(api.api.login).toHaveBeenCalledWith({
          username: 'test',
          password: 'password'
        })
      })
      
      await waitFor(() => {
        expect(screen.getByText('Search Movies')).toBeInTheDocument()
      })
    })

    it('handles login error', async () => {
      const user = userEvent.setup()
      api.api.login.mockRejectedValue(new Error('Invalid credentials'))
      
      render(<App />)
      
      await user.type(screen.getByPlaceholderText('Username'), 'wrong')
      await user.type(screen.getByPlaceholderText('Password'), 'wrong')
      await user.click(screen.getByRole('button', { name: 'Login' }))
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })

    it('restores authentication from localStorage', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'movieNightToken') return 'saved-token'
        if (key === 'darkMode') return 'false'
        if (key === 'viewMode') return 'list'
        if (key === 'watchlist') return '[]'
        return null
      })
      
      api.api.getPopularMovies.mockResolvedValue({ results: [] })
      
      render(<App />)
      
      expect(screen.getByText('Search Movies')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
    })
  })

  describe('Movie Search', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'movieNightToken') return 'fake-token'
        if (key === 'darkMode') return 'false'
        if (key === 'viewMode') return 'list'
        if (key === 'watchlist') return '[]'
        return null
      })
      
      api.api.getPopularMovies.mockResolvedValue({ results: [] })
    })

    it('performs movie search', async () => {
      const user = userEvent.setup()
      const mockMovies = [
        {
          id: 1,
          title: 'Test Movie',
          overview: 'A test movie',
          release_date: '2023-01-01',
          vote_average: 8.5,
          poster_path: '/test.jpg'
        }
      ]
      
      api.api.searchMovies.mockResolvedValue({ results: mockMovies })
      
      render(<App />)
      
      const searchInput = screen.getByPlaceholderText('Search for movies...')
      const searchButton = screen.getByRole('button', { name: 'Search Movies' })
      
      await user.type(searchInput, 'test movie')
      await user.click(searchButton)
      
      await waitFor(() => {
        expect(api.api.searchMovies).toHaveBeenCalledWith('test movie')
      })
      
      await waitFor(() => {
        expect(screen.getByText('Test Movie')).toBeInTheDocument()
      })
    })

    it('handles search error', async () => {
      const user = userEvent.setup()
      api.api.searchMovies.mockRejectedValue(new Error('Search failed'))
      
      render(<App />)
      
      await user.type(screen.getByPlaceholderText('Search for movies...'), 'test')
      await user.click(screen.getByRole('button', { name: 'Search Movies' }))
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Watchlist', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'movieNightToken') return 'fake-token'
        if (key === 'darkMode') return 'false'
        if (key === 'viewMode') return 'list'
        if (key === 'watchlist') return '[]'
        return null
      })
      
      api.api.getPopularMovies.mockResolvedValue({
        results: [
          {
            id: 1,
            title: 'Popular Movie',
            overview: 'A popular movie',
            release_date: '2023-01-01',
            vote_average: 8.5,
            poster_path: '/popular.jpg'
          }
        ]
      })
    })

    it('adds movie to watchlist', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Popular Movie')).toBeInTheDocument()
      })
      
      const addButton = screen.getByRole('button', { name: '+ Watchlist' })
      await user.click(addButton)
      
      expect(screen.getByRole('button', { name: '✓ Added' })).toBeInTheDocument()
      
      // Check watchlist tab
      await user.click(screen.getByText(/My Watchlist \(1\)/))
      expect(screen.getByText('Popular Movie')).toBeInTheDocument()
    })

    it('removes movie from watchlist', async () => {
      const user = userEvent.setup()
      
      // Start with movie in watchlist
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'movieNightToken') return 'fake-token'
        if (key === 'darkMode') return 'false'
        if (key === 'viewMode') return 'list'
        if (key === 'watchlist') return JSON.stringify([{
          id: 1,
          title: 'Popular Movie',
          overview: 'A popular movie',
          release_date: '2023-01-01',
          vote_average: 8.5,
          poster_path: '/popular.jpg'
        }])
        return null
      })
      
      render(<App />)
      
      // Go to watchlist tab
      await user.click(screen.getByText(/My Watchlist \(1\)/))
      
      const removeButton = screen.getByRole('button', { name: 'Remove' })
      await user.click(removeButton)
      
      expect(screen.getByText('Your watchlist is empty. Add some movies!')).toBeInTheDocument()
    })
  })

  describe('UI Controls', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'movieNightToken') return 'fake-token'
        if (key === 'darkMode') return 'false'
        if (key === 'viewMode') return 'list'
        if (key === 'watchlist') return '[]'
        return null
      })
      
      api.api.getPopularMovies.mockResolvedValue({ results: [] })
    })

    it('toggles dark mode', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      const darkModeButton = screen.getByTitle('Toggle Dark Mode')
      expect(darkModeButton).toHaveTextContent('🌙')
      
      await user.click(darkModeButton)
      
      expect(darkModeButton).toHaveTextContent('☀️')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true')
    })

    it('toggles view mode', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      const viewModeButton = screen.getByTitle('Toggle View Mode')
      expect(viewModeButton).toHaveTextContent('⚏')
      
      await user.click(viewModeButton)
      
      expect(viewModeButton).toHaveTextContent('☰')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('viewMode', 'grid')
    })

    it('handles logout', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      await user.click(logoutButton)
      
      expect(screen.getByText('Login to Continue')).toBeInTheDocument()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('movieNightToken')
    })
  })

  describe('Tab Navigation', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'movieNightToken') return 'fake-token'
        if (key === 'darkMode') return 'false'
        if (key === 'viewMode') return 'list'
        if (key === 'watchlist') return '[]'
        return null
      })
      
      api.api.getPopularMovies.mockResolvedValue({ results: [] })
    })

    it('switches between tabs', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      // Default tab should be popular
      expect(screen.getByText(/🔥 Popular/).classList.contains('active')).toBe(true)
      
      // Switch to search tab
      await user.click(screen.getByText(/🔍 Search Results/))
      expect(screen.getByText(/🔍 Search Results/).classList.contains('active')).toBe(true)
      
      // Switch to watchlist tab
      await user.click(screen.getByText(/⭐ My Watchlist/))
      expect(screen.getByText(/⭐ My Watchlist/).classList.contains('active')).toBe(true)
    })
  })
})
