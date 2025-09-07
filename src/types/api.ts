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
