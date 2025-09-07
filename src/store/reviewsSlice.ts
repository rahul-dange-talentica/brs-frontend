import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review, ApiError } from '../types';

interface ReviewsState {
  reviews: Review[];
  userReviews: Review[];
  currentBookReviews: Review[];
  loading: boolean;
  userReviewsLoading: boolean;
  error: string | null;
}

interface CreateReviewData {
  bookId: string;
  rating: number;
  reviewText: string;
  title?: string;
}

interface UpdateReviewData {
  reviewId: string;
  rating?: number;
  reviewText?: string;
  title?: string;
}

const initialState: ReviewsState = {
  reviews: [],
  userReviews: [],
  currentBookReviews: [],
  loading: false,
  userReviewsLoading: false,
  error: null,
};

// Mock data for development
const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    rating: 5,
    reviewText: 'An absolutely masterful piece of American literature. Fitzgerald\'s prose is elegant and the symbolism is profound.',
    title: 'A Timeless Classic',
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    bookId: '1',
    userId: '2',
    rating: 4,
    reviewText: 'Great book with beautiful writing, though the pacing could be better in some parts.',
    title: 'Well Written',
    user: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
    },
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
];

// Async thunks
export const createReview = createAsyncThunk<
  Review,
  CreateReviewData,
  { rejectValue: ApiError }
>('reviews/createReview', async (reviewData, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await reviewsService.createReview(reviewData);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const newReview: Review = {
      id: Date.now().toString(),
      bookId: reviewData.bookId,
      userId: currentUser.id || '1',
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      title: reviewData.title,
      user: {
        id: currentUser.id || '1',
        firstName: currentUser.firstName || 'Anonymous',
        lastName: currentUser.lastName || 'User',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newReview;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to create review',
      status: error.status || 400,
    });
  }
});

export const updateReview = createAsyncThunk<
  Review,
  UpdateReviewData,
  { rejectValue: ApiError }
>('reviews/updateReview', async (updateData, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await reviewsService.updateReview(updateData.reviewId, updateData);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const existingReview = mockReviews.find(r => r.id === updateData.reviewId);
    if (!existingReview) {
      throw new Error('Review not found');
    }
    
    const updatedReview: Review = {
      ...existingReview,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    return updatedReview;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to update review',
      status: error.status || 400,
    });
  }
});

export const deleteReview = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>('reviews/deleteReview', async (reviewId, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // await reviewsService.deleteReview(reviewId);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return reviewId;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to delete review',
      status: error.status || 400,
    });
  }
});

export const fetchBookReviews = createAsyncThunk<
  Review[],
  { bookId: string; page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('reviews/fetchBookReviews', async ({ bookId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await reviewsService.getBookReviews(bookId, { page, pageSize });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const bookReviews = mockReviews.filter(review => review.bookId === bookId);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return bookReviews.slice(startIndex, endIndex);
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch book reviews',
      status: error.status || 500,
    });
  }
});

export const fetchUserReviews = createAsyncThunk<
  Review[],
  { userId: string; page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('reviews/fetchUserReviews', async ({ userId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await reviewsService.getUserReviews(userId, { page, pageSize });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userReviews = mockReviews.filter(review => review.userId === userId);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return userReviews.slice(startIndex, endIndex);
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch user reviews',
      status: error.status || 500,
    });
  }
});

export const fetchAllReviews = createAsyncThunk<
  Review[],
  { page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('reviews/fetchAllReviews', async ({ page = 1, pageSize = 20 }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return mockReviews.slice(startIndex, endIndex);
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch reviews',
      status: error.status || 500,
    });
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBookReviews: (state) => {
      state.currentBookReviews = [];
    },
    addReviewToCurrentBook: (state, action: PayloadAction<Review>) => {
      state.currentBookReviews.unshift(action.payload);
    },
    updateReviewInCurrentBook: (state, action: PayloadAction<Review>) => {
      const index = state.currentBookReviews.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.currentBookReviews[index] = action.payload;
      }
    },
    removeReviewFromCurrentBook: (state, action: PayloadAction<string>) => {
      state.currentBookReviews = state.currentBookReviews.filter(r => r.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create review cases
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
        state.userReviews.unshift(action.payload);
        state.currentBookReviews.unshift(action.payload);
        state.error = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create review';
      })
      // Update review cases
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in all arrays
        const reviewId = action.payload.id;
        
        const reviewIndex = state.reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex] = action.payload;
        }
        
        const userReviewIndex = state.userReviews.findIndex(r => r.id === reviewId);
        if (userReviewIndex !== -1) {
          state.userReviews[userReviewIndex] = action.payload;
        }
        
        const currentBookReviewIndex = state.currentBookReviews.findIndex(r => r.id === reviewId);
        if (currentBookReviewIndex !== -1) {
          state.currentBookReviews[currentBookReviewIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update review';
      })
      // Delete review cases
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        const reviewId = action.payload;
        
        // Remove from all arrays
        state.reviews = state.reviews.filter(r => r.id !== reviewId);
        state.userReviews = state.userReviews.filter(r => r.id !== reviewId);
        state.currentBookReviews = state.currentBookReviews.filter(r => r.id !== reviewId);
        
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete review';
      })
      // Fetch book reviews cases
      .addCase(fetchBookReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBookReviews = action.payload;
        state.error = null;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch book reviews';
      })
      // Fetch user reviews cases
      .addCase(fetchUserReviews.pending, (state) => {
        state.userReviewsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.userReviewsLoading = false;
        state.userReviews = action.payload;
        state.error = null;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.userReviewsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch user reviews';
      })
      // Fetch all reviews cases
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
      });
  },
});

export const {
  clearError,
  clearCurrentBookReviews,
  addReviewToCurrentBook,
  updateReviewInCurrentBook,
  removeReviewFromCurrentBook,
} = reviewsSlice.actions;

// Selectors
export const selectReviews = (state: { reviews: ReviewsState }) => state.reviews.reviews;
export const selectUserReviews = (state: { reviews: ReviewsState }) => state.reviews.userReviews;
export const selectCurrentBookReviews = (state: { reviews: ReviewsState }) => state.reviews.currentBookReviews;
export const selectReviewsLoading = (state: { reviews: ReviewsState }) => state.reviews.loading;
export const selectUserReviewsLoading = (state: { reviews: ReviewsState }) => state.reviews.userReviewsLoading;
export const selectReviewsError = (state: { reviews: ReviewsState }) => state.reviews.error;

// Derived selectors
export const selectUserReviewForBook = (bookId: string) => (state: { reviews: ReviewsState }) => {
  return state.reviews.userReviews.find(review => review.bookId === bookId);
};

export const selectReviewById = (reviewId: string) => (state: { reviews: ReviewsState }) => {
  return state.reviews.reviews.find(review => review.id === reviewId) ||
         state.reviews.userReviews.find(review => review.id === reviewId) ||
         state.reviews.currentBookReviews.find(review => review.id === reviewId);
};

export default reviewsSlice.reducer;
