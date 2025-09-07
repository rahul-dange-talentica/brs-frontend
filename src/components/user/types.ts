/**
 * User Component Types
 * Type definitions for user profile and dashboard components
 */

import { Book, Review } from '@/types/api';

// User activity interface
export interface UserActivity {
  id: string;
  type: 'review' | 'favorite' | 'rating' | 'profile_update';
  bookId?: string;
  bookTitle?: string;
  bookCoverUrl?: string;
  action: string;
  timestamp: string;
  details?: Record<string, any>;
}

// User statistics interface  
export interface UserStatistics {
  totalReviews: number;
  averageRating: number;
  favoriteBooks: number;
  monthlyReviews: number;
  topGenres: string[];
  reviewsThisMonth?: number;
  booksThisYear?: number;
  mostActiveMonth?: string;
  joinedDate?: string;
}

// Extended user profile for dashboard
export interface UserDashboard {
  recentActivity: UserActivity[];
  statistics: UserStatistics;
  recentReviews: Review[];
  recentFavorites: Book[];
}

// Profile form data
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  location?: string;
  preferences: {
    emailNotifications: boolean;
    reviewNotifications: boolean;
    recommendationEmails: boolean;
    publicProfile: boolean;
  };
}

// Quick action types
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

// Favorites filter options
export interface FavoritesFilterOptions {
  genre?: string;
  rating?: number;
  dateAdded?: 'week' | 'month' | 'year' | 'all';
  sortBy?: 'date_added' | 'title' | 'author' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// User review filter options (extends existing review filters)
export interface UserReviewsFilterOptions {
  rating?: number;
  dateRange?: 'week' | 'month' | 'year' | 'all';
  genre?: string;
  sortBy?: 'date' | 'rating' | 'book_title';
  sortOrder?: 'asc' | 'desc';
}
