/**
 * Services Index
 * Central export file for all API services
 */

export { default as apiClient } from './api';
export { retryRequest, createCancelToken, isRequestCancelled } from './api';

export { default as authService } from './authService';
export { default as booksService } from './booksService';
export { default as reviewsService } from './reviewsService';
export { default as userService } from './userService';

// Re-export types for convenience
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyResponse,
  LogoutResponse,
  BooksQuery,
  BooksResponse,
  BookDetailsResponse,
  SearchQuery,
  SearchResponse,
  RecommendationType,
  RecommendationsResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewDetailResponse,
  ReviewsQuery,
  ReviewListResponse,
  DeleteResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  FavoriteRequest,
  FavoriteResponse,
  UserFavoritesResponse,
  UserReviewsResponse,
} from '@/types/api';
