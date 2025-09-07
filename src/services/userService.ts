/**
 * User Service
 * API endpoints for user profile management, favorites, and reading lists
 */

import { apiClient, retryRequest } from './api';
import { API_CONFIG } from '@/config/api';
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  FavoriteResponse,
  UserFavoritesResponse,
  UserReviewsResponse,
  UserProfile,
} from '@/types/api';

/**
 * User service functions
 */
export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<{ success: boolean; user: UserProfile }> => {
    return retryRequest(async () => {
      const response = await apiClient.get<{ success: boolean; user: UserProfile }>(
        API_CONFIG.ENDPOINTS.USERS.PROFILE
      );
      return response.data;
    });
  },

  /**
   * Update user profile information
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.put<UpdateProfileResponse>(
        API_CONFIG.ENDPOINTS.USERS.PROFILE,
        data
      );
      return response.data;
    });
  },

  /**
   * Add or remove book from favorites
   */
  toggleFavorite: async (bookId: string): Promise<FavoriteResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.post<FavoriteResponse>(
        API_CONFIG.ENDPOINTS.USERS.FAVORITES,
        { bookId }
      );
      return response.data;
    });
  },

  /**
   * Add book to favorites
   */
  addToFavorites: async (bookId: string): Promise<FavoriteResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.post<FavoriteResponse>(
        `${API_CONFIG.ENDPOINTS.USERS.FAVORITES}/${bookId}`,
        {}
      );
      return response.data;
    });
  },

  /**
   * Remove book from favorites
   */
  removeFromFavorites: async (bookId: string): Promise<FavoriteResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.delete<FavoriteResponse>(
        `${API_CONFIG.ENDPOINTS.USERS.FAVORITES}/${bookId}`
      );
      return response.data;
    });
  },

  /**
   * Get user's favorite books
   */
  getFavorites: async (skip: number = 0, limit: number = 20): Promise<UserFavoritesResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<UserFavoritesResponse>(
        API_CONFIG.ENDPOINTS.USERS.FAVORITES,
        { params: { skip, limit } }
      );
      return response.data;
    });
  },

  /**
   * Check if a book is in user's favorites
   */
  isFavorite: async (bookId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ isFavorite: boolean }>(
        `${API_CONFIG.ENDPOINTS.USERS.FAVORITES}/${bookId}/status`
      );
      return response.data.isFavorite;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get user's reviews with book information
   */
  getUserReviews: async (
    page: number = 1,
    limit: number = 10
  ): Promise<UserReviewsResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<UserReviewsResponse>(
        API_CONFIG.ENDPOINTS.USERS.REVIEWS,
        { params: { skip: (page - 1) * limit, limit } }
      );
      return response.data;
    });
  },

  /**
   * Get user statistics (total reviews, favorites, etc.)
   */
  getUserStats: async (): Promise<{
    success: boolean;
    stats: {
      totalReviews: number;
      totalFavorites: number;
      averageRating: number;
      mostReviewedGenre?: string;
    };
  }> => {
    return retryRequest(async () => {
      const response = await apiClient.get<{
        success: boolean;
        stats: {
          totalReviews: number;
          totalFavorites: number;
          averageRating: number;
          mostReviewedGenre?: string;
        };
      }>('/users/stats');
      return response.data;
    });
  },

  /**
   * Update user avatar
   */
  updateAvatar: async (avatarFile: File): Promise<UpdateProfileResponse> => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    return retryRequest(async () => {
      const response = await apiClient.post<UpdateProfileResponse>(
        '/users/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    });
  },

  /**
   * Delete user account
   */
  deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
    return retryRequest(async () => {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        API_CONFIG.ENDPOINTS.USERS.PROFILE
      );
      return response.data;
    });
  },
};

export default userService;
