import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, Book, ApiError, Review } from '../types';
import { userService } from '@/services';
import { handleAPIError, getValidationErrors } from '@/utils/errorHandler';
import { AxiosError } from 'axios';
import { UserActivity, UserStatistics } from '@/components/user/types';

interface UserState {
  profile: UserProfile | null;
  favoriteBooks: Book[];
  readingList: Book[];
  userReviews: Review[];
  recentActivity: UserActivity[];
  statistics: UserStatistics | null;
  loading: boolean;
  favoritesLoading: boolean;
  readingListLoading: boolean;
  profileUpdateLoading: boolean;
  statisticsLoading: boolean;
  activityLoading: boolean;
  error: string | null;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    reviewNotifications: boolean;
    recommendationNotifications: boolean;
  };
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  favoriteGenres?: string[];
}

interface UpdatePreferencesData {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  reviewNotifications?: boolean;
  recommendationNotifications?: boolean;
}

const initialState: UserState = {
  profile: null,
  favoriteBooks: [],
  readingList: [],
  userReviews: [],
  recentActivity: [],
  statistics: null,
  loading: false,
  favoritesLoading: false,
  readingListLoading: false,
  profileUpdateLoading: false,
  statisticsLoading: false,
  activityLoading: false,
  error: null,
  preferences: {
    theme: 'light',
    emailNotifications: true,
    reviewNotifications: true,
    recommendationNotifications: true,
  },
};


// Async thunks
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: ApiError }
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getProfile();
    
    console.log('Profile API response:', response); // Debug logging
    
    // Handle different response formats more flexibly
    if (response && typeof response === 'object') {
      // If response has success field and user field
      if (response.success && response.user) {
        return response.user;
      }
      // If response is the user object directly with snake_case fields
      if (response.id && response.email) {
        // Transform snake_case to camelCase for frontend
        const transformedProfile: UserProfile = {
          id: response.id,
          email: response.email,
          firstName: response.first_name || response.firstName || '',
          lastName: response.last_name || response.lastName || '',
          avatar: response.avatar || response.avatar_url,
          bio: response.bio || '',
          favoriteGenres: response.favorite_genres || response.favoriteGenres || [],
          totalReviews: response.total_reviews || response.totalReviews || 0,
          averageRating: response.average_rating || response.averageRating || 0,
          createdAt: response.created_at || response.createdAt || '',
          updatedAt: response.updated_at || response.updatedAt || '',
        };
        console.log('Transformed profile data:', transformedProfile);
        return transformedProfile;
      }
      // If response already has camelCase fields
      if (response.firstName || response.first_name) {
        return response as UserProfile;
      }
    }
    
    console.error('Unexpected profile response format:', response);
    throw new Error('Invalid profile response format');
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch user profile',
      status: 500,
    });
  }
});

export const updateUserProfile = createAsyncThunk<
  UserProfile,
  UpdateProfileData,
  { rejectValue: ApiError }
>('user/updateProfile', async (updateData, { rejectWithValue }) => {
  try {
    console.log('updateUserProfile thunk called with:', updateData);
    const response = await userService.updateProfile(updateData);
    
    console.log('updateUserProfile response:', response);
    
    // Handle different response formats more flexibly
    if (response && typeof response === 'object') {
      // If response has success field and user field
      if (response.success && response.user) {
        return response.user;
      }
      // If response is the user object directly
      if (response.id && response.email) {
        return response as UserProfile;
      }
      // If response has user data but different structure (snake_case to camelCase)
      if (response.firstName || response.first_name) {
        const transformedProfile: UserProfile = {
          id: response.id,
          email: response.email,
          firstName: response.first_name || response.firstName || '',
          lastName: response.last_name || response.lastName || '',
          avatar: response.avatar || response.avatar_url,
          bio: response.bio || '',
          favoriteGenres: response.favorite_genres || response.favoriteGenres || [],
          totalReviews: response.total_reviews || response.totalReviews || 0,
          averageRating: response.average_rating || response.averageRating || 0,
          createdAt: response.created_at || response.createdAt || '',
          updatedAt: response.updated_at || response.updatedAt || '',
        };
        console.log('Transformed update profile response:', transformedProfile);
        return transformedProfile;
      }
    }
    
    throw new Error('Invalid profile update response format');
  } catch (error: any) {
    console.error('updateUserProfile error:', error);
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
        errors: getValidationErrors(error),
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to update profile',
      status: 400,
    });
  }
});

export const fetchUserStatistics = createAsyncThunk<
  UserStatistics,
  void,
  { rejectValue: ApiError }
>('user/fetchStatistics', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getUserStats();
    
    console.log('Statistics API response:', response);
    
    if (response.success) {
      // Transform backend stats to frontend UserStatistics format
      return {
        totalReviews: response.stats.totalReviews,
        averageRating: response.stats.averageRating,
        favoriteBooks: response.stats.totalFavorites,
        monthlyReviews: 0, // Will be calculated from reviews
        topGenres: response.stats.mostReviewedGenre ? [response.stats.mostReviewedGenre] : [],
      };
    } else {
      console.warn('Statistics API returned success: false');
      throw new Error('Failed to fetch user statistics');
    }
  } catch (error: any) {
    console.error('fetchUserStatistics error:', error);
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch user statistics',
      status: 500,
    });
  }
});

export const fetchUserActivity = createAsyncThunk<
  UserActivity[],
  { limit?: number },
  { rejectValue: ApiError }
>('user/fetchActivity', async ({ limit = 10 }, { rejectWithValue, getState }) => {
  try {
    // Since there's no dedicated activity API, we'll generate activity from existing user data
    const state = getState() as { user: UserState };
    const { favoriteBooks, userReviews } = state.user;
    
    console.log('Generating activity from user data:', { 
      favoriteBooks: favoriteBooks.length, 
      userReviews: userReviews.length 
    });
    
    const activities: UserActivity[] = [];
    
    // Generate activity from user reviews
    userReviews.forEach((review) => {
      activities.push({
        id: `review-${review.id}`,
        type: 'review',
        bookId: review.bookId,
        bookTitle: review.book?.title || 'Unknown Book',
        bookCoverUrl: review.book?.cover_image || review.book?.coverImage,
        action: `Wrote a review`,
        timestamp: review.createdAt,
        details: { 
          rating: review.rating,
          reviewText: review.reviewText?.substring(0, 100) + (review.reviewText && review.reviewText.length > 100 ? '...' : '')
        }
      });
      
      // Also add rating activity if different from review date
      if (review.rating) {
        activities.push({
          id: `rating-${review.id}`,
          type: 'rating',
          bookId: review.bookId,
          bookTitle: review.book?.title || 'Unknown Book',
          bookCoverUrl: review.book?.cover_image || review.book?.coverImage,
          action: `Rated ${review.rating} stars`,
          timestamp: review.createdAt,
          details: { rating: review.rating }
        });
      }
    });
    
    // Generate activity from favorite books
    favoriteBooks.forEach((book, index) => {
      activities.push({
        id: `favorite-${book.id}`,
        type: 'favorite',
        bookId: book.id,
        bookTitle: book.title,
        bookCoverUrl: book.cover_image || book.coverImage,
        action: `Added to favorites`,
        timestamp: book.updatedAt || book.createdAt || new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        details: {}
      });
    });
    
    // Sort activities by timestamp (most recent first) and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    console.log('Generated activities:', sortedActivities.length);
    
    // If no real activity, show a helpful message instead of empty
    if (sortedActivities.length === 0) {
      return [{
        id: 'welcome',
        type: 'profile_update',
        action: 'Welcome to Book Review System! Start by exploring books and writing reviews.',
        timestamp: new Date().toISOString(),
        details: {}
      }];
    }
    
    return sortedActivities;
  } catch (error: any) {
    console.error('Error generating user activity:', error);
    return rejectWithValue({
      message: error.message || 'Failed to fetch user activity',
      status: 500,
    });
  }
});

export const fetchUserReviews = createAsyncThunk<
  Review[],
  { page?: number; limit?: number },
  { rejectValue: ApiError }
>('user/fetchUserReviews', async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await userService.getUserReviews(page, limit);
    
    if (response.success && response.reviews) {
      return response.reviews;
    } else {
      throw new Error('Failed to fetch user reviews');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch user reviews',
      status: 500,
    });
  }
});

export const fetchFavoriteBooks = createAsyncThunk<
  Book[],
  { skip?: number; limit?: number },
  { rejectValue: ApiError }
>('user/fetchFavoriteBooks', async ({ skip = 0, limit = 20 }, { rejectWithValue }) => {
  try {
    const response = await userService.getFavorites(skip, limit);
    
    if (response.success) {
      return response.books;
    } else {
      throw new Error('Failed to fetch favorite books');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch favorite books',
      status: 500,
    });
  }
});

export const addToFavorites = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>('user/addToFavorites', async (bookId, { rejectWithValue }) => {
  try {
    const response = await userService.addToFavorites(bookId);
    
    if (response.success) {
      return bookId;
    } else {
      throw new Error(response.message || 'Failed to add to favorites');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to add to favorites',
      status: 400,
    });
  }
});

export const removeFromFavorites = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>('user/removeFromFavorites', async (bookId, { rejectWithValue }) => {
  try {
    const response = await userService.removeFromFavorites(bookId);
    
    if (response.success) {
      return bookId;
    } else {
      throw new Error(response.message || 'Failed to remove from favorites');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to remove from favorites',
      status: 400,
    });
  }
});

export const fetchReadingList = createAsyncThunk<
  Book[],
  string,
  { rejectValue: ApiError }
>('user/fetchReadingList', async (_, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return []; // Empty reading list for now
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch reading list',
      status: error.status || 500,
    });
  }
});

export const addToReadingList = createAsyncThunk<
  Book,
  { userId: string; bookId: string },
  { rejectValue: ApiError }
>('user/addToReadingList', async ({ bookId }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock book data
    const mockBook: Book = {
      id: bookId,
      title: 'Reading List Book',
      author: 'Sample Author',
      genres: [{ id: 'fiction', name: 'Fiction', description: null, created_at: new Date().toISOString() }],
      description: 'A book added to reading list.',
      cover_image_url: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
      average_rating: '4.0',
      total_reviews: 50,
      isbn: '9780000000001',
      publication_date: '2024-01-01',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };
    
    return mockBook;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to add to reading list',
      status: error.status || 400,
    });
  }
});

export const removeFromReadingList = createAsyncThunk<
  string,
  { userId: string; bookId: string },
  { rejectValue: ApiError }
>('user/removeFromReadingList', async ({ bookId }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return bookId;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to remove from reading list',
      status: error.status || 400,
    });
  }
});

export const updatePreferences = createAsyncThunk<
  UpdatePreferencesData,
  UpdatePreferencesData,
  { rejectValue: ApiError }
>('user/updatePreferences', async (preferences, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Store preferences in localStorage for now
    const existingPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const updatedPrefs = { ...existingPrefs, ...preferences };
    localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    
    return preferences;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to update preferences',
      status: error.status || 400,
    });
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    updateProfileLocally: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setPreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    initializePreferences: (state) => {
      const storedPrefs = localStorage.getItem('userPreferences');
      if (storedPrefs) {
        try {
          const parsed = JSON.parse(storedPrefs);
          state.preferences = { ...state.preferences, ...parsed };
        } catch (error) {
          // Ignore parsing errors and keep default preferences
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user profile';
      })
      // Update user profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.profileUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileUpdateLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileUpdateLoading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })
      // Fetch user statistics cases
      .addCase(fetchUserStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch statistics';
      })
      // Fetch user activity cases
      .addCase(fetchUserActivity.pending, (state) => {
        state.activityLoading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.recentActivity = action.payload;
        state.error = null;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.activityLoading = false;
        state.error = action.payload?.message || 'Failed to fetch activity';
      })
      // Fetch user reviews cases
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload;
        state.error = null;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user reviews';
      })
      // Fetch favorite books cases
      .addCase(fetchFavoriteBooks.pending, (state) => {
        state.favoritesLoading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteBooks.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favoriteBooks = action.payload;
        state.error = null;
      })
      .addCase(fetchFavoriteBooks.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.error = action.payload?.message || 'Failed to fetch favorite books';
      })
      // Add to favorites cases
      .addCase(addToFavorites.fulfilled, (_state, _action) => {
        // Re-fetch favorites after successful addition
        // Note: This will trigger a separate fetchFavoriteBooks call
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to add to favorites';
      })
      // Remove from favorites cases
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favoriteBooks = state.favoriteBooks.filter(book => book.id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to remove from favorites';
      })
      // Fetch reading list cases
      .addCase(fetchReadingList.pending, (state) => {
        state.readingListLoading = true;
        state.error = null;
      })
      .addCase(fetchReadingList.fulfilled, (state, action) => {
        state.readingListLoading = false;
        state.readingList = action.payload;
        state.error = null;
      })
      .addCase(fetchReadingList.rejected, (state, action) => {
        state.readingListLoading = false;
        state.error = action.payload?.message || 'Failed to fetch reading list';
      })
      // Add to reading list cases
      .addCase(addToReadingList.fulfilled, (state, action) => {
        if (!state.readingList.find(book => book.id === action.payload.id)) {
          state.readingList.push(action.payload);
        }
      })
      .addCase(addToReadingList.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to add to reading list';
      })
      // Remove from reading list cases
      .addCase(removeFromReadingList.fulfilled, (state, action) => {
        state.readingList = state.readingList.filter(book => book.id !== action.payload);
      })
      .addCase(removeFromReadingList.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to remove from reading list';
      })
      // Update preferences cases
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update preferences';
      });
  },
});

export const {
  clearError,
  setProfile,
  updateProfileLocally,
  setPreferences,
  initializePreferences,
} = userSlice.actions;

// Selectors
export const selectUserProfile = (state: { user: UserState }) => state.user.profile;
export const selectFavoriteBooks = (state: { user: UserState }) => state.user.favoriteBooks;
export const selectReadingList = (state: { user: UserState }) => state.user.readingList;
export const selectUserReviews = (state: { user: UserState }) => state.user.userReviews;
export const selectUserActivity = (state: { user: UserState }) => state.user.recentActivity;
export const selectUserStatistics = (state: { user: UserState }) => state.user.statistics;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectFavoritesLoading = (state: { user: UserState }) => state.user.favoritesLoading;
export const selectReadingListLoading = (state: { user: UserState }) => state.user.readingListLoading;
export const selectProfileUpdateLoading = (state: { user: UserState }) => state.user.profileUpdateLoading;
export const selectStatisticsLoading = (state: { user: UserState }) => state.user.statisticsLoading;
export const selectActivityLoading = (state: { user: UserState }) => state.user.activityLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserPreferences = (state: { user: UserState }) => state.user.preferences;

// Derived selectors
export const selectIsBookFavorited = (bookId: string) => (state: { user: UserState }) => {
  return state.user.favoriteBooks.some(book => book.id === bookId);
};

export const selectIsBookInReadingList = (bookId: string) => (state: { user: UserState }) => {
  return state.user.readingList.some(book => book.id === bookId);
};

const userReducer = userSlice.reducer;
export default userReducer;
