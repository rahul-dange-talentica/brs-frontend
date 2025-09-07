// Backend API types (matching OpenAPI spec exactly)
export interface Genre {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface GenreWithCount extends Genre {
  book_count: number;
}

// Review Summary interface (exported for use in other interfaces)
export interface ReviewSummary {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  cover_image_url: string | null;
  publication_date: string | null;
  average_rating: string; // Backend returns as string
  total_reviews: number;
  created_at: string;
  updated_at: string;
  genres?: Genre[];
  recent_reviews?: ReviewSummary[];
}

// Frontend-friendly Book interface for components
export interface BookDisplay {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  coverImage: string | null;
  publishedDate: string | null;
  averageRating: number; // Converted to number for frontend
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
  recentReviews?: ReviewSummary[];
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
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface SearchFilters {
  query?: string;
  genreId?: string;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'title' | 'author' | 'average_rating' | 'publication_date' | 'created_at';
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

// Books API Types (matching backend parameters)
export interface BooksQuery {
  skip?: number; // Backend uses skip instead of page
  limit?: number;
  genre_id?: string; // Backend uses genre_id not genre
  min_rating?: number;
  max_rating?: number;
  sort_by?: 'title' | 'author' | 'average_rating' | 'publication_date' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface BooksResponse {
  books: Book[];
  total: number;
  skip: number;
  limit: number;
  pages: number;
}

export interface BookDetailsResponse extends Book {
  // Individual book endpoint returns BookResponse directly
}

export interface SearchQuery {
  q: string;
  genre_id?: string;
  min_rating?: number;
  skip?: number;
  limit?: number;
}

export interface SearchResponse {
  books: Book[];
  total: number;
  skip: number;
  limit: number;
  pages: number;
  query?: string; // Search query may be included in search responses
}

export type RecommendationType = 'popular' | 'genre-based' | 'personalized';

export interface RecommendationsResponse {
  recommendations: Book[];
  recommendation_type: string;
  total: number;
  limit: number;
  filters?: any;
  genre?: any; // For genre-based recommendations
  explanation?: string; // For personal recommendations
  user_id?: string; // For personal recommendations
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