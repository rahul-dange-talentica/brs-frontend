import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review, ApiError } from '../types';
import { reviewsService, userService } from '@/services';
import { handleAPIError, getValidationErrors } from '@/utils/errorHandler';
import { AxiosError } from 'axios';

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


// Async thunks
export const createReview = createAsyncThunk<
  Review,
  CreateReviewData,
  { rejectValue: ApiError }
>('reviews/createReview', async (reviewData, { rejectWithValue }) => {
  try {
    const response = await reviewsService.createReview(reviewData);
    
    if (response.success && response.review) {
      return response.review;
    } else {
      throw new Error('Failed to create review');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
        errors: getValidationErrors(error),
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to create review',
      status: 400,
    });
  }
});

export const updateReview = createAsyncThunk<
  Review,
  UpdateReviewData,
  { rejectValue: ApiError }
>('reviews/updateReview', async (updateData, { rejectWithValue }) => {
  try {
    const { reviewId, ...updateFields } = updateData;
    const response = await reviewsService.updateReview(reviewId, updateFields);
    
    if (response.success && response.review) {
      return response.review;
    } else {
      throw new Error('Failed to update review');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
        errors: getValidationErrors(error),
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to update review',
      status: 400,
    });
  }
});

export const deleteReview = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>('reviews/deleteReview', async (reviewId, { rejectWithValue }) => {
  try {
    const response = await reviewsService.deleteReview(reviewId);
    
    if (response.success) {
      return reviewId;
    } else {
      throw new Error(response.message || 'Failed to delete review');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to delete review',
      status: 400,
    });
  }
});

export const fetchBookReviews = createAsyncThunk<
  Review[],
  { bookId: string; page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('reviews/fetchBookReviews', async ({ bookId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    const response = await reviewsService.getReviewsForBook(bookId, {
      page,
      limit: pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    
    if (response.success) {
      return response.reviews;
    } else {
      throw new Error('Failed to fetch book reviews');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch book reviews',
      status: 500,
    });
  }
});

export const fetchUserReviews = createAsyncThunk<
  Review[],
  { page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('reviews/fetchUserReviews', async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    const response = await userService.getUserReviews(page, pageSize);
    
    if (response.success) {
      // Extract reviews from the response (they include book information)
      return response.reviews.map(reviewWithBook => ({
        ...reviewWithBook,
        // Remove book information from review object to match Review interface
        book: undefined,
      }));
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

export const fetchAllReviews = createAsyncThunk<
  Review[],
  { page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('reviews/fetchAllReviews', async ({ page = 1, pageSize = 20 }, { rejectWithValue }) => {
  try {
    // This would require a different endpoint to get all reviews across all books
    // For now, we'll fetch recent reviews from user service as a placeholder
    const response = await userService.getUserReviews(page, pageSize);
    
    if (response.success) {
      return response.reviews.map(reviewWithBook => ({
        ...reviewWithBook,
        book: undefined, // Remove book info to match Review interface
      }));
    } else {
      throw new Error('Failed to fetch reviews');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch reviews',
      status: 500,
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

const reviewsReducer = reviewsSlice.reducer;
export default reviewsReducer;
