import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, Book, ApiError } from '../types';

interface UserState {
  profile: UserProfile | null;
  favoriteBooks: Book[];
  readingList: Book[];
  loading: boolean;
  favoritesLoading: boolean;
  readingListLoading: boolean;
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
  loading: false,
  favoritesLoading: false,
  readingListLoading: false,
  error: null,
  preferences: {
    theme: 'light',
    emailNotifications: true,
    reviewNotifications: true,
    recommendationNotifications: true,
  },
};

// Mock data for development
const mockUserProfile: UserProfile = {
  id: '1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  bio: 'Avid reader and literature enthusiast. Love exploring different genres and discovering new authors.',
  favoriteGenres: ['Fiction', 'Science Fiction', 'Mystery'],
  totalReviews: 15,
  averageRating: 4.2,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

// Async thunks
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  string,
  { rejectValue: ApiError }
>('user/fetchProfile', async (userId, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await userService.getProfile(userId);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ...mockUserProfile, id: userId };
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch user profile',
      status: error.status || 500,
    });
  }
});

export const updateUserProfile = createAsyncThunk<
  UserProfile,
  UpdateProfileData,
  { rejectValue: ApiError }
>('user/updateProfile', async (updateData, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await userService.updateProfile(updateData);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const updatedProfile: UserProfile = {
      ...mockUserProfile,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    return updatedProfile;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to update profile',
      status: error.status || 400,
    });
  }
});

export const fetchFavoriteBooks = createAsyncThunk<
  Book[],
  string,
  { rejectValue: ApiError }
>('user/fetchFavoriteBooks', async (_, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await userService.getFavoriteBooks(userId);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock favorite books
    const mockFavorites: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        description: 'A classic American novel set in the Jazz Age.',
        coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
        averageRating: 4.2,
        totalReviews: 156,
        isbn: '9780743273565',
        publishedDate: '1925-04-10',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
    
    return mockFavorites;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch favorite books',
      status: error.status || 500,
    });
  }
});

export const addToFavorites = createAsyncThunk<
  Book,
  { userId: string; bookId: string },
  { rejectValue: ApiError }
>('user/addToFavorites', async ({ bookId }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await userService.addToFavorites(userId, bookId);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock book data
    const mockBook: Book = {
      id: bookId,
      title: 'Sample Book',
      author: 'Sample Author',
      genre: 'Fiction',
      description: 'A sample book description.',
      coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
      averageRating: 4.0,
      totalReviews: 100,
      isbn: '9780000000000',
      publishedDate: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    
    return mockBook;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to add to favorites',
      status: error.status || 400,
    });
  }
});

export const removeFromFavorites = createAsyncThunk<
  string,
  { userId: string; bookId: string },
  { rejectValue: ApiError }
>('user/removeFromFavorites', async ({ bookId }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // await userService.removeFromFavorites(userId, bookId);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return bookId;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to remove from favorites',
      status: error.status || 400,
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
      genre: 'Fiction',
      description: 'A book added to reading list.',
      coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
      averageRating: 4.0,
      totalReviews: 50,
      isbn: '9780000000001',
      publishedDate: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
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
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
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
      .addCase(addToFavorites.fulfilled, (state, action) => {
        if (!state.favoriteBooks.find(book => book.id === action.payload.id)) {
          state.favoriteBooks.push(action.payload);
        }
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
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectFavoritesLoading = (state: { user: UserState }) => state.user.favoritesLoading;
export const selectReadingListLoading = (state: { user: UserState }) => state.user.readingListLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserPreferences = (state: { user: UserState }) => state.user.preferences;

// Derived selectors
export const selectIsBookFavorited = (bookId: string) => (state: { user: UserState }) => {
  return state.user.favoriteBooks.some(book => book.id === bookId);
};

export const selectIsBookInReadingList = (bookId: string) => (state: { user: UserState }) => {
  return state.user.readingList.some(book => book.id === bookId);
};

export default userSlice.reducer;
