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

// Moved Review interface to Reviews API Types section above

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

// Reviews API Types (matching OpenAPI spec)
export interface CreateReviewRequest {
  rating: number;
  review_text?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  review_text?: string;
}

// Backend review response from OpenAPI spec
export interface ReviewFromAPI {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string; // Included in book reviews
}

// Frontend-friendly review interface
export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name?: string; // Combined name from backend
  };
  isOwn?: boolean; // Calculated on frontend
}

// Review response types from API
export interface ReviewSummaryAPI {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewListResponse {
  reviews: ReviewFromAPI[];
  total: number;
  skip: number;
  limit: number;
  pages: number;
  book_id: string;
}

export interface ReviewDetailResponse {
  rating: number;
  review_text: string | null;
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  book?: {
    title: string;
    author: string;
    isbn: string | null;
    description: string | null;
    cover_image_url: string | null;
    publication_date: string | null;
    id: string;
    average_rating: string;
    total_reviews: number;
    created_at: string;
    updated_at: string;
  } | null;
}

export interface ReviewsQuery {
  skip?: number;
  limit?: number;
  sort_by?: 'created_at' | 'rating' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  rating_filter?: number;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// Frontend data interfaces for Redux
export interface CreateReviewData {
  bookId: string;
  rating: number;
  review_text?: string;
}

export interface UpdateReviewData {
  reviewId: string;
  rating?: number;
  review_text?: string;
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
  reviews: any[]; // Reviews with book information from API
  total: number;
  skip: number;
  limit: number;
  pages: number;
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