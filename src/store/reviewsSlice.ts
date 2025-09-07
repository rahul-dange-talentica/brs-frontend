import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review, ApiError, CreateReviewData, UpdateReviewData } from '../types';
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

// CreateReviewData and UpdateReviewData are now imported from types

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
    const response = await reviewsService.createReview(reviewData.bookId, {
      rating: reviewData.rating,
      review_text: reviewData.review_text
    });
    
    // Transform the API response to frontend format
    return {
      id: response.id,
      bookId: response.book_id,
      userId: response.user_id,
      rating: response.rating,
      reviewText: response.review_text,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      user: {
        id: response.user_id,
        firstName: 'User',
        lastName: '',
      },
      isOwn: true
    } as Review;
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
    
    // Transform the API response to frontend format
    return {
      id: response.id,
      bookId: response.book_id,
      userId: response.user_id,
      rating: response.rating,
      reviewText: response.review_text,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      user: {
        id: response.user_id,
        firstName: 'User',
        lastName: '',
      },
      isOwn: true
    } as Review;
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
    await reviewsService.deleteReview(reviewId);
    return reviewId;
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
    const response = await reviewsService.getBookReviews(bookId, {
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    
    // Transform API reviews to frontend format
    return response.reviews.map(review => ({
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      rating: review.rating,
      reviewText: review.review_text,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      user: {
        id: review.user_id,
        firstName: review.user_name?.split(' ')[0] || 'User',
        lastName: review.user_name?.split(' ').slice(1).join(' ') || '',
      }
    } as Review));
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
    
    // The API returns a custom paginated format like { reviews: [...], total, skip, limit, pages }
    // Transform the API reviews to frontend format
    if (response.reviews) {
      return response.reviews.map(reviewWithBook => ({
        id: reviewWithBook.id,
        bookId: reviewWithBook.book_id || reviewWithBook.bookId,
        userId: reviewWithBook.user_id || reviewWithBook.userId,
        rating: reviewWithBook.rating,
        reviewText: reviewWithBook.review_text || reviewWithBook.reviewText || '',
        createdAt: reviewWithBook.created_at || reviewWithBook.createdAt,
        updatedAt: reviewWithBook.updated_at || reviewWithBook.updatedAt,
        user: {
          id: reviewWithBook.user_id || reviewWithBook.userId,
          firstName: reviewWithBook.user_name?.split(' ')[0] || 'User',
          lastName: reviewWithBook.user_name?.split(' ').slice(1).join(' ') || '',
          name: reviewWithBook.user_name || 'Anonymous User'
        },
        isOwn: true // User's own reviews
      } as Review));
    } else if ((response as any).success && (response as any).reviews) {
      // Fallback to old format if success wrapper exists
      return (response as any).reviews.map((reviewWithBook: any) => ({
        ...reviewWithBook,
        // Remove book information from review object to match Review interface
        book: undefined,
      }));
    } else {
      throw new Error('Failed to fetch user reviews - invalid response format');
    }
  } catch (error: any) {
    console.error('fetchUserReviews error:', error);
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
    
    if (response.reviews) {
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
