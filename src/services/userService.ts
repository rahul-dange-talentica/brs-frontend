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
} from '@/types/api';

/**
 * User service functions
 */
export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<any> => {
    return retryRequest(async () => {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.USERS.PROFILE
      );
      console.log('Raw profile API response:', response.data); // Debug logging
      return response.data;
    });
  },

  /**
   * Update user profile information
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    return retryRequest(async () => {
      console.log('Updating profile with data:', data);
      const response = await apiClient.put<UpdateProfileResponse>(
        API_CONFIG.ENDPOINTS.USERS.PROFILE,
        data
      );
      console.log('Profile update response:', response.data);
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
      await apiClient.post(
        `${API_CONFIG.ENDPOINTS.USERS.FAVORITES}/${bookId}`,
        {}
      );
      
      // API returns 201 status with no body on success
      return {
        success: true,
        message: 'Book added to favorites'
      } as FavoriteResponse;
    });
  },

  /**
   * Remove book from favorites
   */
  removeFromFavorites: async (bookId: string): Promise<FavoriteResponse> => {
    return retryRequest(async () => {
      await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.USERS.FAVORITES}/${bookId}`
      );
      
      // API returns 204 status with no body on success
      return {
        success: true,
        message: 'Book removed from favorites'
      } as FavoriteResponse;
    });
  },

  /**
   * Get user's favorite books
   */
  getFavorites: async (skip: number = 0, limit: number = 20): Promise<UserFavoritesResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<{
        favorites: any[];
        total: number;
        skip: number;
        limit: number;
        pages: number;
      }>(
        API_CONFIG.ENDPOINTS.USERS.FAVORITES,
        { params: { skip, limit } }
      );
      
      // Transform the API response to match the expected format
      return {
        success: true,
        books: response.data.favorites,
        total: response.data.total,
        totalFavorites: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
        pages: response.data.pages
      } as UserFavoritesResponse;
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
      const response = await apiClient.get<{
        reviews: any[];
        total: number;
        skip: number;
        limit: number;
        pages: number;
      }>(
        API_CONFIG.ENDPOINTS.USERS.REVIEWS,
        { params: { skip: (page - 1) * limit, limit } }
      );
      
      // Transform the API response to match the expected format
      return {
        success: true,
        reviews: response.data.reviews,
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
        pages: response.data.pages
      } as UserReviewsResponse;
    });
  },

  /**
   * Get user statistics (total reviews, favorites, etc.)
   * Since there's no dedicated stats API, we'll calculate from other endpoints
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
      try {
        // Fetch reviews and favorites to calculate stats (limit to 100 max as per API)
        const [reviewsResponse, favoritesResponse] = await Promise.all([
          apiClient.get(API_CONFIG.ENDPOINTS.USERS.REVIEWS, { 
            params: { skip: 0, limit: 100 } // API max limit is 100
          }),
          apiClient.get(API_CONFIG.ENDPOINTS.USERS.FAVORITES, { 
            params: { skip: 0, limit: 100 } // API max limit is 100
          })
        ]);

        const reviews = reviewsResponse.data.reviews || [];
        const favorites = favoritesResponse.data.favorites || [];

        // Calculate average rating
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length
          : 0;

        // Calculate most reviewed genre (if reviews have genre info)
        const genreCounts: Record<string, number> = {};
        reviews.forEach((review: any) => {
          if (review.book?.genres?.[0]?.name) {
            const genre = review.book.genres[0].name;
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          }
        });

        const mostReviewedGenre = Object.keys(genreCounts).length > 0
          ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
          : undefined;

        console.log('Calculated user stats from API data:', {
          totalReviews: reviews.length,
          totalFavorites: favorites.length,
          averageRating,
          mostReviewedGenre,
          note: 'Limited to 100 items each due to API constraints'
        });

        return {
          success: true,
          stats: {
            totalReviews: reviews.length,
            totalFavorites: favorites.length,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            mostReviewedGenre
          }
        };
      } catch (error: any) {
        console.error('Error calculating user stats:', error);
        // Return empty stats if API calls fail
        return {
          success: true,
          stats: {
            totalReviews: 0,
            totalFavorites: 0,
            averageRating: 0,
          }
        };
      }
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
