/**
 * API Configuration Constants
 * Environment-based configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://18.233.174.25'),
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  POLLING_INTERVAL: parseInt(import.meta.env.VITE_POLLING_INTERVAL as string) || 30000,
  
  // Request configuration
  WITH_CREDENTIALS: true,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/v1/auth/login/json',
      REGISTER: '/api/v1/auth/register',
      LOGOUT: '/api/v1/auth/logout',
      ME: '/api/v1/auth/me',
    },
    
    // Books
    BOOKS: {
      BASE: '/api/v1/books',
      SEARCH: '/api/v1/books/search',
      BY_ID: (id: string) => `/api/v1/books/${id}`,
    },
    
    // Recommendations
    RECOMMENDATIONS: {
      POPULAR: '/api/v1/recommendations/popular',
      TRENDING: '/api/v1/recommendations/trending',
      PERSONAL: '/api/v1/recommendations/personal',
      GENRE: (genreId: string) => `/api/v1/recommendations/genre/${genreId}`,
      DIVERSITY: '/api/v1/recommendations/diversity',
    },
    
    // Reviews
    REVIEWS: {
      BASE: '/api/v1/reviews',
      BY_ID: (id: string) => `/api/v1/reviews/${id}`,
      BY_BOOK: (bookId: string) => `/api/v1/books/${bookId}/reviews`,
    },
    
    // Users
    USERS: {
      PROFILE: '/api/v1/users/profile',
      FAVORITES: '/api/v1/users/favorites',
      REVIEWS: '/api/v1/users/reviews',
    },
    
    // Genres
    GENRES: {
      BASE: '/api/v1/genres',
    },
  },
} as const;

export default API_CONFIG;
