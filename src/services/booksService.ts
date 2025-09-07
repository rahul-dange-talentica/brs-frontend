/**
 * Books Service
 * API endpoints for book management, search, and recommendations
 */

import { apiClient, retryRequest, createCancelToken } from './api';
import { API_CONFIG } from '@/config/api';
import {
  BooksQuery,
  BooksResponse,
  BookDetailsResponse,
  SearchQuery,
  SearchResponse,
  RecommendationType,
  RecommendationsResponse,
} from '@/types/api';

/**
 * Books service functions
 */
export const booksService = {
  /**
   * Get paginated list of books with optional filtering and sorting
   */
  getAllBooks: async (query: BooksQuery = {}): Promise<BooksResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<BooksResponse>(
        API_CONFIG.ENDPOINTS.BOOKS.BASE,
        { params: query }
      );
      return response.data;
    });
  },

  /**
   * Get detailed information about a specific book including reviews
   */
  getBookById: async (bookId: string): Promise<BookDetailsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<BookDetailsResponse>(
        API_CONFIG.ENDPOINTS.BOOKS.BY_ID(bookId)
      );
      return response.data;
    });
  },

  /**
   * Search books by title, author, or genre
   */
  searchBooks: async (query: SearchQuery): Promise<SearchResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<SearchResponse>(
        API_CONFIG.ENDPOINTS.BOOKS.SEARCH,
        { params: query }
      );
      return response.data;
    });
  },

  /**
   * Search books with cancellation support for real-time search
   */
  searchBooksWithCancel: async (
    query: SearchQuery
  ): Promise<{ data: Promise<SearchResponse>; cancel: () => void }> => {
    const cancelToken = createCancelToken();
    
    const searchPromise = apiClient.get<SearchResponse>(
      API_CONFIG.ENDPOINTS.BOOKS.SEARCH,
      {
        params: query,
        cancelToken: cancelToken.token,
      }
    );

    return {
      data: searchPromise.then(response => response.data),
      cancel: cancelToken.cancel,
    };
  },

  /**
   * Get book recommendations based on type
   */
  getRecommendations: async (
    type: RecommendationType,
    limit: number = 10
  ): Promise<RecommendationsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<RecommendationsResponse>(
        API_CONFIG.ENDPOINTS.BOOKS.RECOMMENDATIONS,
        {
          params: { type, limit }
        }
      );
      return response.data;
    });
  },

  /**
   * Get popular books (shortcut for popular recommendations)
   */
  getPopularBooks: async (limit: number = 10): Promise<RecommendationsResponse> => {
    return booksService.getRecommendations('popular', limit);
  },

  /**
   * Get genre-based recommendations
   */
  getGenreBasedRecommendations: async (limit: number = 10): Promise<RecommendationsResponse> => {
    return booksService.getRecommendations('genre-based', limit);
  },

  /**
   * Get personalized recommendations for logged-in user
   */
  getPersonalizedRecommendations: async (limit: number = 10): Promise<RecommendationsResponse> => {
    return booksService.getRecommendations('personalized', limit);
  },

  /**
   * Get books by genre with pagination
   */
  getBooksByGenre: async (
    genre: string,
    query: Omit<BooksQuery, 'genre'> = {}
  ): Promise<BooksResponse> => {
    return booksService.getAllBooks({ ...query, genre });
  },

  /**
   * Get books by author with pagination
   */
  getBooksByAuthor: async (
    author: string,
    query: Omit<BooksQuery, 'author'> = {}
  ): Promise<BooksResponse> => {
    return booksService.getAllBooks({ ...query, author });
  },

  /**
   * Get top-rated books
   */
  getTopRatedBooks: async (
    query: Omit<BooksQuery, 'sortBy' | 'sortOrder'> = {}
  ): Promise<BooksResponse> => {
    return booksService.getAllBooks({
      ...query,
      sortBy: 'rating',
      sortOrder: 'desc',
    });
  },

  /**
   * Get recently published books
   */
  getRecentBooks: async (
    query: Omit<BooksQuery, 'sortBy' | 'sortOrder'> = {}
  ): Promise<BooksResponse> => {
    return booksService.getAllBooks({
      ...query,
      sortBy: 'publishedDate',
      sortOrder: 'desc',
    });
  },

  /**
   * Get book genres available in the system
   */
  getAvailableGenres: async (): Promise<{ success: boolean; genres: string[] }> => {
    return retryRequest(async () => {
      const response = await apiClient.get<{ success: boolean; genres: string[] }>(
        API_CONFIG.ENDPOINTS.GENRES.BASE
      );
      return response.data;
    });
  },
};

export default booksService;
