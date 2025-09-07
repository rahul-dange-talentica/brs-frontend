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
  Genre,
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
   * Get popular book recommendations
   */
  getPopularBooks: async (limit: number = 10): Promise<RecommendationsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<RecommendationsResponse>(
        API_CONFIG.ENDPOINTS.RECOMMENDATIONS.POPULAR,
        {
          params: { limit }
        }
      );
      return response.data;
    });
  },

  /**
   * Get trending book recommendations
   */
  getTrendingBooks: async (limit: number = 10, days_back: number = 30): Promise<RecommendationsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<RecommendationsResponse>(
        API_CONFIG.ENDPOINTS.RECOMMENDATIONS.TRENDING,
        {
          params: { limit, days_back }
        }
      );
      return response.data;
    });
  },

  /**
   * Get personalized recommendations for logged-in user
   */
  getPersonalRecommendations: async (limit: number = 10): Promise<RecommendationsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<RecommendationsResponse>(
        API_CONFIG.ENDPOINTS.RECOMMENDATIONS.PERSONAL,
        {
          params: { limit }
        }
      );
      return response.data;
    });
  },

  /**
   * Get genre-based recommendations
   */
  getGenreBasedRecommendations: async (genreId: string, limit: number = 10): Promise<RecommendationsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<RecommendationsResponse>(
        API_CONFIG.ENDPOINTS.RECOMMENDATIONS.GENRE(genreId),
        {
          params: { limit }
        }
      );
      return response.data;
    });
  },

  /**
   * Get diverse recommendations across multiple genres
   */
  getDiverseRecommendations: async (limit: number = 10, genre_count: number = 5): Promise<RecommendationsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<RecommendationsResponse>(
        API_CONFIG.ENDPOINTS.RECOMMENDATIONS.DIVERSITY,
        {
          params: { limit, genre_count }
        }
      );
      return response.data;
    });
  },

  /**
   * Get books by genre with pagination
   */
  getBooksByGenre: async (
    genre_id: string,
    query: Omit<BooksQuery, 'genre_id'> = {}
  ): Promise<BooksResponse> => {
    return booksService.getAllBooks({ ...query, genre_id });
  },

  /**
   * Get top-rated books
   */
  getTopRatedBooks: async (
    query: Omit<BooksQuery, 'sort_by' | 'sort_order'> = {}
  ): Promise<BooksResponse> => {
    return booksService.getAllBooks({
      ...query,
      sort_by: 'average_rating',
      sort_order: 'desc',
    });
  },

  /**
   * Get recently published books
   */
  getRecentBooks: async (
    query: Omit<BooksQuery, 'sort_by' | 'sort_order'> = {}
  ): Promise<BooksResponse> => {
    return booksService.getAllBooks({
      ...query,
      sort_by: 'publication_date',
      sort_order: 'desc',
    });
  },

  /**
   * Get book genres available in the system with book counts
   */
  getGenres: async (): Promise<Genre[]> => {
    return retryRequest(async () => {
      const response = await apiClient.get<Genre[]>(
        API_CONFIG.ENDPOINTS.GENRES.BASE
      );
      return response.data;
    });
  },
};

export default booksService;
