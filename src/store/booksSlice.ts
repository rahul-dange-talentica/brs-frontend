import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, PaginationState, SearchFilters, ApiError } from '../types';
import { booksService } from '@/services';
import { handleAPIError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';

interface BooksState {
  books: Book[];
  currentBook: Book | null;
  searchResults: Book[];
  recommendations: Book[];
  loading: boolean;
  searchLoading: boolean;
  recommendationsLoading: boolean;
  error: string | null;
  pagination: PaginationState | null;
  searchFilters: SearchFilters;
  featuredBooks: Book[];
}

const initialState: BooksState = {
  books: [],
  currentBook: null,
  searchResults: [],
  recommendations: [],
  loading: false,
  searchLoading: false,
  recommendationsLoading: false,
  error: null,
  pagination: null,
  searchFilters: {
    query: '',
    sortBy: 'title',
    sortOrder: 'asc',
  },
  featuredBooks: [],
};


// Async thunks
export const fetchBooks = createAsyncThunk<
  { books: Book[]; pagination: PaginationState },
  { page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('books/fetchBooks', async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    const response = await booksService.getAllBooks({
      page,
      limit: pageSize,
    });
    
    if (response.success) {
      return {
        books: response.books,
        pagination: {
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalBooks: response.pagination.totalBooks,
          pageSize: response.pagination.pageSize,
        },
      };
    } else {
      throw new Error('Failed to fetch books');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch books',
      status: 500,
    });
  }
});

export const searchBooks = createAsyncThunk<
  { books: Book[]; pagination: PaginationState },
  SearchFilters,
  { rejectValue: ApiError }
>('books/searchBooks', async (filters, { rejectWithValue }) => {
  try {
    const searchQuery = {
      q: filters.query || '',
      genre: filters.genre,
      author: filters.author,
      page: 1,
      limit: 20,
    };
    
    const response = await booksService.searchBooks(searchQuery);
    
    if (response.success) {
      return {
        books: response.books,
        pagination: {
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalBooks: response.totalResults,
          pageSize: response.pagination.pageSize,
        },
      };
    } else {
      throw new Error('Search failed');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Search failed',
      status: 500,
    });
  }
});

export const fetchBookById = createAsyncThunk<
  Book,
  string,
  { rejectValue: ApiError }
>('books/fetchBookById', async (bookId, { rejectWithValue }) => {
  try {
    const response = await booksService.getBookById(bookId);
    
    if (response.success && response.book) {
      return response.book;
    } else {
      throw new Error('Book not found');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 404,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch book',
      status: 404,
    });
  }
});

export const fetchRecommendations = createAsyncThunk<
  Book[],
  { type?: 'popular' | 'genre-based' | 'personalized'; limit?: number },
  { rejectValue: ApiError }
>('books/fetchRecommendations', async ({ type = 'popular', limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await booksService.getRecommendations(type, limit);
    
    if (response.success) {
      return response.books;
    } else {
      throw new Error('Failed to fetch recommendations');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch recommendations',
      status: 500,
    });
  }
});

export const fetchFeaturedBooks = createAsyncThunk<
  Book[],
  void,
  { rejectValue: ApiError }
>('books/fetchFeaturedBooks', async (_, { rejectWithValue }) => {
  try {
    // Use popular recommendations as featured books
    const response = await booksService.getPopularBooks(6);
    
    if (response.success) {
      return response.books;
    } else {
      throw new Error('Failed to fetch featured books');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch featured books',
      status: 500,
    });
  }
});

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setCurrentBook: (state, action: PayloadAction<Book | null>) => {
      state.currentBook = action.payload;
    },
    setSearchFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.pagination = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateBookRating: (state, action: PayloadAction<{ bookId: string; averageRating: number; totalReviews: number }>) => {
      const { bookId, averageRating, totalReviews } = action.payload;
      
      // Update in books array
      const bookIndex = state.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        state.books[bookIndex].averageRating = averageRating;
        state.books[bookIndex].totalReviews = totalReviews;
      }
      
      // Update in search results
      const searchIndex = state.searchResults.findIndex(book => book.id === bookId);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex].averageRating = averageRating;
        state.searchResults[searchIndex].totalReviews = totalReviews;
      }
      
      // Update current book
      if (state.currentBook && state.currentBook.id === bookId) {
        state.currentBook.averageRating = averageRating;
        state.currentBook.totalReviews = totalReviews;
      }
      
      // Update recommendations
      const recIndex = state.recommendations.findIndex(book => book.id === bookId);
      if (recIndex !== -1) {
        state.recommendations[recIndex].averageRating = averageRating;
        state.recommendations[recIndex].totalReviews = totalReviews;
      }
      
      // Update featured books
      const featuredIndex = state.featuredBooks.findIndex(book => book.id === bookId);
      if (featuredIndex !== -1) {
        state.featuredBooks[featuredIndex].averageRating = averageRating;
        state.featuredBooks[featuredIndex].totalReviews = totalReviews;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch books cases
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch books';
      })
      // Search books cases
      .addCase(searchBooks.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.books;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload?.message || 'Search failed';
      })
      // Fetch book by ID cases
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
        state.error = null;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch book';
      })
      // Fetch recommendations cases
      .addCase(fetchRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch recommendations';
      })
      // Fetch featured books cases
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBooks = action.payload;
      })
      .addCase(fetchFeaturedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch featured books';
      });
  },
});

export const {
  setCurrentBook,
  setSearchFilters,
  clearSearchResults,
  clearError,
  updateBookRating,
} = booksSlice.actions;

// Selectors
export const selectBooks = (state: { books: BooksState }) => state.books.books;
export const selectCurrentBook = (state: { books: BooksState }) => state.books.currentBook;
export const selectSearchResults = (state: { books: BooksState }) => state.books.searchResults;
export const selectRecommendations = (state: { books: BooksState }) => state.books.recommendations;
export const selectBooksLoading = (state: { books: BooksState }) => state.books.loading;
export const selectSearchLoading = (state: { books: BooksState }) => state.books.searchLoading;
export const selectRecommendationsLoading = (state: { books: BooksState }) => state.books.recommendationsLoading;
export const selectBooksError = (state: { books: BooksState }) => state.books.error;
export const selectBooksPagination = (state: { books: BooksState }) => state.books.pagination;
export const selectSearchFilters = (state: { books: BooksState }) => state.books.searchFilters;
export const selectFeaturedBooks = (state: { books: BooksState }) => state.books.featuredBooks;

const booksReducer = booksSlice.reducer;
export default booksReducer;
