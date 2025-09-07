/**
 * Reviews Service
 * API endpoints for review and rating management
 */

import { apiClient, retryRequest } from './api';
import { API_CONFIG } from '@/config/api';
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewResponse,
  ReviewsQuery,
  ReviewsResponse,
  DeleteResponse,
} from '@/types/api';

/**
 * Reviews service functions
 */
export const reviewsService = {
  /**
   * Create a new review for a book
   */
  createReview: async (data: CreateReviewRequest): Promise<ReviewResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.post<ReviewResponse>(
        API_CONFIG.ENDPOINTS.REVIEWS.BASE,
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
  ): Promise<ReviewResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.put<ReviewResponse>(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_ID(reviewId),
        data
      );
      return response.data;
    });
  },

  /**
   * Delete a review
   */
  deleteReview: async (reviewId: string): Promise<DeleteResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.delete<DeleteResponse>(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_ID(reviewId)
      );
      return response.data;
    });
  },

  /**
   * Get reviews for a specific book
   */
  getReviewsForBook: async (
    bookId: string,
    query: ReviewsQuery = {}
  ): Promise<ReviewsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<ReviewsResponse>(
        API_CONFIG.ENDPOINTS.REVIEWS.BY_BOOK(bookId),
        { params: query }
      );
      return response.data;
    });
  },

  /**
   * Get a specific review by ID
   */
  getReviewById: async (reviewId: string): Promise<ReviewResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<ReviewResponse>(
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
    query: Omit<ReviewsQuery, 'sortBy' | 'sortOrder'> = {}
  ): Promise<ReviewsResponse> => {
    return reviewsService.getReviewsForBook(bookId, {
      ...query,
      sortBy: 'rating',
      sortOrder: 'desc',
    });
  },

  /**
   * Get most recent reviews
   */
  getRecentReviews: async (
    bookId: string,
    query: Omit<ReviewsQuery, 'sortBy' | 'sortOrder'> = {}
  ): Promise<ReviewsResponse> => {
    return reviewsService.getReviewsForBook(bookId, {
      ...query,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  },

  /**
   * Get most helpful reviews (if available)
   */
  getHelpfulReviews: async (
    bookId: string,
    query: Omit<ReviewsQuery, 'sortBy' | 'sortOrder'> = {}
  ): Promise<ReviewsResponse> => {
    return reviewsService.getReviewsForBook(bookId, {
      ...query,
      sortBy: 'helpful',
      sortOrder: 'desc',
    });
  },

  /**
   * Check if user has already reviewed a book
   */
  hasUserReviewed: async (bookId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/reviews/user/book/${bookId}`);
      return response.data.hasReviewed;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get user's review for a specific book
   */
  getUserReviewForBook: async (bookId: string): Promise<ReviewResponse | null> => {
    try {
      const response = await apiClient.get<ReviewResponse>(
        `/reviews/user/book/${bookId}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default reviewsService;
