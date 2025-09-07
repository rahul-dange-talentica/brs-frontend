/**
 * Reviews Service
 * API endpoints for review and rating management
 */

import { apiClient, retryRequest } from './api';
import { API_CONFIG } from '@/config/api';
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewDetailResponse,
  ReviewSummaryAPI,
  ReviewListResponse,
  ReviewsQuery,
} from '@/types/api';

/**
 * Reviews service functions
 */
export const reviewsService = {
  /**
   * Create a new review for a book
   */
  createReview: async (bookId: string, data: CreateReviewRequest): Promise<ReviewSummaryAPI> => {
    return retryRequest(async () => {
      const response = await apiClient.post<ReviewSummaryAPI>(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_BOOK(bookId),
        data
      );
      return response.data;
    });
  },

  /**
   * Update an existing review
   */
  updateReview: async (
    reviewId: string,
    data: UpdateReviewRequest
  ): Promise<ReviewSummaryAPI> => {
    return retryRequest(async () => {
      const response = await apiClient.put<ReviewSummaryAPI>(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_ID(reviewId),
        data
      );
      return response.data;
    });
  },

  /**
   * Delete a review
   */
  deleteReview: async (reviewId: string): Promise<void> => {
    return retryRequest(async () => {
      await apiClient.delete(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_ID(reviewId)
      );
    });
  },

  /**
   * Get reviews for a specific book
   */
  getBookReviews: async (
    bookId: string,
    query: ReviewsQuery = {}
  ): Promise<ReviewListResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<ReviewListResponse>(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_BOOK(bookId),
        { params: query }
      );
      return response.data;
    });
  },

  /**
   * Get a specific review by ID
   */
  getReviewById: async (reviewId: string): Promise<ReviewDetailResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<ReviewDetailResponse>(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_ID(reviewId)
      );
      return response.data;
    });
  },

  /**
   * Get reviews sorted by highest rating
   */
  getTopReviews: async (
    bookId: string,
    query: Omit<ReviewsQuery, 'sort_by' | 'sort_order'> = {}
  ): Promise<ReviewListResponse> => {
    return reviewsService.getBookReviews(bookId, {
      ...query,
      sort_by: 'rating',
      sort_order: 'desc',
    });
  },

  /**
   * Get most recent reviews
   */
  getRecentReviews: async (
    bookId: string,
    query: Omit<ReviewsQuery, 'sort_by' | 'sort_order'> = {}
  ): Promise<ReviewListResponse> => {
    return reviewsService.getBookReviews(bookId, {
      ...query,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  },

  /**
   * Get most helpful reviews (if available)
   */
  getHelpfulReviews: async (
    bookId: string,
    query: Omit<ReviewsQuery, 'sort_by' | 'sort_order'> = {}
  ): Promise<ReviewListResponse> => {
    return reviewsService.getBookReviews(bookId, {
      ...query,
      sort_by: 'updated_at',
      sort_order: 'desc',
    });
  },

  /**
   * Check if user has already reviewed a book
   */
  hasUserReviewed: async (bookId: string): Promise<boolean> => {
    try {
      // Get user's reviews and check if any match the book ID
      const userReviews = await apiClient.get('/api/v1/users/reviews');
      return userReviews.data.reviews?.some((review: any) => review.book_id === bookId) || false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get user's review for a specific book
   */
  getUserReviewForBook: async (bookId: string): Promise<ReviewDetailResponse | null> => {
    try {
      // Get user's reviews and find the one for this book
      const userReviews = await apiClient.get('/api/v1/users/reviews');
      const review = userReviews.data.reviews?.find((review: any) => review.book_id === bookId);
      return review || null;
    } catch (error) {
      return null;
    }
  },
};

export default reviewsService;
