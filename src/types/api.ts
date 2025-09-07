// Existing types
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  averageRating: number;
  totalReviews: number;
  isbn: string;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  reviewText: string;
  title?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  favoriteGenres: string[];
  totalReviews: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  pageSize: number;
}

export interface SearchFilters {
  query?: string;
  genre?: string;
  author?: string;
  minRating?: number;
  sortBy?: 'title' | 'author' | 'rating' | 'publishedDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// === API Request/Response Types ===

// Authentication API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface VerifyResponse {
  success: boolean;
  user: UserProfile | null;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Books API Types
export interface BooksQuery {
  page?: number;
  limit?: number;
  genre?: string;
  author?: string;
  minRating?: number;
  sortBy?: 'title' | 'author' | 'rating' | 'publishedDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BooksResponse {
  success: boolean;
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    pageSize: number;
  };
}

export interface BookDetailsResponse {
  success: boolean;
  book: Book & {
    reviews: Review[];
    userReview?: Review;
    isFavorite?: boolean;
  };
}

export interface SearchQuery {
  q: string;
  genre?: string;
  author?: string;
  limit?: number;
  page?: number;
}

export interface SearchResponse {
  success: boolean;
  books: Book[];
  totalResults: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

export type RecommendationType = 'popular' | 'genre-based' | 'personalized';

export interface RecommendationsResponse {
  success: boolean;
  books: Book[];
  type: RecommendationType;
  message?: string;
}

// Reviews API Types
export interface CreateReviewRequest {
  bookId: string;
  rating: number;
  reviewText: string;
  title?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  reviewText?: string;
  title?: string;
}

export interface ReviewResponse {
  success: boolean;
  review: Review;
  updatedBookRating?: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface ReviewsQuery {
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'createdAt' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    pageSize: number;
  };
  bookRating: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  updatedBookRating?: {
    averageRating: number;
    totalReviews: number;
  };
}

// User API Types
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  favoriteGenres?: string[];
  avatar?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: UserProfile;
  message: string;
}

export interface FavoriteRequest {
  bookId: string;
}

export interface FavoriteResponse {
  success: boolean;
  message: string;
  isFavorite: boolean;
}

export interface UserFavoritesResponse {
  success: boolean;
  books: Book[];
  totalFavorites: number;
}

export interface UserReviewsResponse {
  success: boolean;
  reviews: (Review & { book: Book })[];
  totalReviews: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

// Generic API Response Wrapper
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}