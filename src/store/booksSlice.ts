import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, PaginationState, SearchFilters, ApiError } from '../types';
import { booksService } from '@/services';
import { handleAPIError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';

interface BooksState {
  books: Book[];
  currentBook: Book | null;
  searchResults: Book[];
  popularBooks: Book[];
  trendingBooks: Book[];
  personalRecommendations: Book[];
  genreBasedRecommendations: Book[];
  similarBooks: Book[];
  diverseRecommendations: Book[];
  loading: boolean;
  searchLoading: boolean;
  popularBooksLoading: boolean;
  trendingBooksLoading: boolean;
  personalRecommendationsLoading: boolean;
  genreBasedRecommendationsLoading: boolean;
  similarBooksLoading: boolean;
  diverseRecommendationsLoading: boolean;
  error: string | null;
  pagination: PaginationState | null;
  searchFilters: SearchFilters;
  featuredBooks: Book[];
  // Recommendation metadata
  recommendationsLastUpdated: {
    popular: string | null;
    trending: string | null;
    personal: string | null;
    genreBased: string | null;
    similar: string | null;
    diverse: string | null;
  };
  recommendationGenre: string | null;
  similarToBookId: string | null;
}

const initialState: BooksState = {
  books: [],
  currentBook: null,
  searchResults: [],
  popularBooks: [],
  trendingBooks: [],
  personalRecommendations: [],
  genreBasedRecommendations: [],
  similarBooks: [],
  diverseRecommendations: [],
  loading: false,
  searchLoading: false,
  popularBooksLoading: false,
  trendingBooksLoading: false,
  personalRecommendationsLoading: false,
  genreBasedRecommendationsLoading: false,
  similarBooksLoading: false,
  diverseRecommendationsLoading: false,
  error: null,
  pagination: null,
  searchFilters: {
    query: '',
    sortBy: 'title',
    sortOrder: 'asc',
  },
  featuredBooks: [],
  recommendationsLastUpdated: {
    popular: null,
    trending: null,
    personal: null,
    genreBased: null,
    similar: null,
    diverse: null,
  },
  recommendationGenre: null,
  similarToBookId: null,
};


// Async thunks
export const fetchBooks = createAsyncThunk<
  { books: Book[]; pagination: PaginationState },
  { skip?: number; limit?: number; genre_id?: string; min_rating?: number; max_rating?: number; sort_by?: 'title' | 'author' | 'average_rating' | 'publication_date' | 'created_at'; sort_order?: 'asc' | 'desc' },
  { rejectValue: ApiError }
>('books/fetchBooks', async ({ skip = 0, limit = 10, ...otherParams }, { rejectWithValue }) => {
  try {
    const response = await booksService.getAllBooks({
      skip,
      limit,
      ...otherParams,
    });
    
    return {
      books: response.books,
      pagination: {
        currentPage: Math.floor(response.skip / response.limit) + 1,
        totalPages: response.pages,
        totalBooks: response.total,
        pageSize: response.limit,
        hasNext: Math.floor(response.skip / response.limit) + 1 < response.pages,
        hasPrev: response.skip > 0,
      },
    };
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
      genre_id: filters.genreId,
      skip: 0,
      limit: 20,
    };
    
    const response = await booksService.searchBooks(searchQuery);
    
    return {
      books: response.books,
      pagination: {
        currentPage: Math.floor(response.skip / response.limit) + 1,
        totalPages: response.pages,
        totalBooks: response.total,
        pageSize: response.limit,
        hasNext: Math.floor(response.skip / response.limit) + 1 < response.pages,
        hasPrev: response.skip > 0,
      },
    };
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
    
    return response;
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

export const fetchPopularBooks = createAsyncThunk<
  Book[],
  { limit?: number },
  { rejectValue: ApiError }
>('books/fetchPopularBooks', async ({ limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await booksService.getPopularBooks(limit);
    
    return response.recommendations;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch popular books',
      status: 500,
    });
  }
});

export const fetchTrendingBooks = createAsyncThunk<
  Book[],
  { limit?: number; days_back?: number },
  { rejectValue: ApiError }
>('books/fetchTrendingBooks', async ({ limit = 10, days_back = 30 }, { rejectWithValue }) => {
  try {
    const response = await booksService.getTrendingBooks(limit, days_back);
    
    return response.recommendations;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch trending books',
      status: 500,
    });
  }
});

export const fetchPersonalRecommendations = createAsyncThunk<
  Book[],
  { limit?: number },
  { rejectValue: ApiError }
>('books/fetchPersonalRecommendations', async ({ limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await booksService.getPersonalRecommendations(limit);
    
    return response.recommendations;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch personal recommendations',
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
    
    return response.recommendations;
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

export const fetchGenreBasedRecommendations = createAsyncThunk<
  Book[],
  { genreId: string; limit?: number },
  { rejectValue: ApiError }
>('books/fetchGenreBasedRecommendations', async ({ genreId, limit = 12 }, { rejectWithValue }) => {
  try {
    const response = await booksService.getGenreBasedRecommendations(genreId, limit);
    
    return response.recommendations;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch genre-based recommendations',
      status: 500,
    });
  }
});

export const fetchSimilarBooks = createAsyncThunk<
  Book[],
  { bookId: string; limit?: number },
  { rejectValue: ApiError }
>('books/fetchSimilarBooks', async ({ bookId, limit = 8 }, { rejectWithValue }) => {
  try {
    // For similar books, we'll use genre-based recommendations for the current book's genre
    // First get the book details to get its genre
    const bookDetails = await booksService.getBookById(bookId);
    
    if (bookDetails.genres && bookDetails.genres.length > 0) {
      const primaryGenre = bookDetails.genres[0];
      const response = await booksService.getGenreBasedRecommendations(primaryGenre.id, limit + 5);
      
      // Filter out the current book from recommendations
      const similarBooks = response.recommendations.filter(book => book.id !== bookId);
      
      return similarBooks.slice(0, limit);
    }
    
    // Fallback to popular books if no genres found
    const response = await booksService.getPopularBooks(limit);
    return response.recommendations.filter(book => book.id !== bookId).slice(0, limit);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch similar books',
      status: 500,
    });
  }
});

export const fetchDiverseRecommendations = createAsyncThunk<
  Book[],
  { limit?: number; genreCount?: number },
  { rejectValue: ApiError }
>('books/fetchDiverseRecommendations', async ({ limit = 15, genreCount = 5 }, { rejectWithValue }) => {
  try {
    const response = await booksService.getDiverseRecommendations(limit, genreCount);
    
    return response.recommendations;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: error.message || 'Failed to fetch diverse recommendations',
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
    setRecommendationGenre: (state, action: PayloadAction<string | null>) => {
      state.recommendationGenre = action.payload;
    },
    setSimilarToBookId: (state, action: PayloadAction<string | null>) => {
      state.similarToBookId = action.payload;
    },
    clearRecommendations: (state) => {
      state.popularBooks = [];
      state.trendingBooks = [];
      state.personalRecommendations = [];
      state.genreBasedRecommendations = [];
      state.similarBooks = [];
      state.diverseRecommendations = [];
      state.recommendationsLastUpdated = {
        popular: null,
        trending: null,
        personal: null,
        genreBased: null,
        similar: null,
        diverse: null,
      };
    },
    updateBookRating: (state, action: PayloadAction<{ bookId: string; averageRating: number; totalReviews: number }>) => {
      const { bookId, averageRating, totalReviews } = action.payload;
      
      // Update in books array
      const bookIndex = state.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        state.books[bookIndex].average_rating = averageRating.toString();
        state.books[bookIndex].total_reviews = totalReviews;
      }
      
      // Update in search results
      const searchIndex = state.searchResults.findIndex(book => book.id === bookId);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex].average_rating = averageRating.toString();
        state.searchResults[searchIndex].total_reviews = totalReviews;
      }
      
      // Update current book
      if (state.currentBook && state.currentBook.id === bookId) {
        state.currentBook.average_rating = averageRating.toString();
        state.currentBook.total_reviews = totalReviews;
      }
      
      // Update in popular books
      const popularIndex = state.popularBooks.findIndex(book => book.id === bookId);
      if (popularIndex !== -1) {
        state.popularBooks[popularIndex].average_rating = averageRating.toString();
        state.popularBooks[popularIndex].total_reviews = totalReviews;
      }
      
      // Update in trending books
      const trendingIndex = state.trendingBooks.findIndex(book => book.id === bookId);
      if (trendingIndex !== -1) {
        state.trendingBooks[trendingIndex].average_rating = averageRating.toString();
        state.trendingBooks[trendingIndex].total_reviews = totalReviews;
      }
      
      // Update in personal recommendations
      const personalIndex = state.personalRecommendations.findIndex(book => book.id === bookId);
      if (personalIndex !== -1) {
        state.personalRecommendations[personalIndex].average_rating = averageRating.toString();
        state.personalRecommendations[personalIndex].total_reviews = totalReviews;
      }
      
      // Update featured books
      const featuredIndex = state.featuredBooks.findIndex(book => book.id === bookId);
      if (featuredIndex !== -1) {
        state.featuredBooks[featuredIndex].average_rating = averageRating.toString();
        state.featuredBooks[featuredIndex].total_reviews = totalReviews;
      }
      
      // Update genre-based recommendations
      const genreBasedIndex = state.genreBasedRecommendations.findIndex(book => book.id === bookId);
      if (genreBasedIndex !== -1) {
        state.genreBasedRecommendations[genreBasedIndex].average_rating = averageRating.toString();
        state.genreBasedRecommendations[genreBasedIndex].total_reviews = totalReviews;
      }
      
      // Update similar books
      const similarIndex = state.similarBooks.findIndex(book => book.id === bookId);
      if (similarIndex !== -1) {
        state.similarBooks[similarIndex].average_rating = averageRating.toString();
        state.similarBooks[similarIndex].total_reviews = totalReviews;
      }
      
      // Update diverse recommendations
      const diverseIndex = state.diverseRecommendations.findIndex(book => book.id === bookId);
      if (diverseIndex !== -1) {
        state.diverseRecommendations[diverseIndex].average_rating = averageRating.toString();
        state.diverseRecommendations[diverseIndex].total_reviews = totalReviews;
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
      // Fetch popular books cases
      .addCase(fetchPopularBooks.pending, (state) => {
        state.popularBooksLoading = true;
      })
      .addCase(fetchPopularBooks.fulfilled, (state, action) => {
        state.popularBooksLoading = false;
        state.popularBooks = action.payload;
      })
      .addCase(fetchPopularBooks.rejected, (state, action) => {
        state.popularBooksLoading = false;
        state.error = action.payload?.message || 'Failed to fetch popular books';
      })
      // Fetch trending books cases
      .addCase(fetchTrendingBooks.pending, (state) => {
        state.trendingBooksLoading = true;
      })
      .addCase(fetchTrendingBooks.fulfilled, (state, action) => {
        state.trendingBooksLoading = false;
        state.trendingBooks = action.payload;
      })
      .addCase(fetchTrendingBooks.rejected, (state, action) => {
        state.trendingBooksLoading = false;
        state.error = action.payload?.message || 'Failed to fetch trending books';
      })
      // Fetch personal recommendations cases
      .addCase(fetchPersonalRecommendations.pending, (state) => {
        state.personalRecommendationsLoading = true;
      })
      .addCase(fetchPersonalRecommendations.fulfilled, (state, action) => {
        state.personalRecommendationsLoading = false;
        state.personalRecommendations = action.payload;
      })
      .addCase(fetchPersonalRecommendations.rejected, (state, action) => {
        state.personalRecommendationsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch personal recommendations';
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
      })
      // Fetch genre-based recommendations cases
      .addCase(fetchGenreBasedRecommendations.pending, (state) => {
        state.genreBasedRecommendationsLoading = true;
      })
      .addCase(fetchGenreBasedRecommendations.fulfilled, (state, action) => {
        state.genreBasedRecommendationsLoading = false;
        state.genreBasedRecommendations = action.payload;
        state.recommendationsLastUpdated.genreBased = new Date().toISOString();
      })
      .addCase(fetchGenreBasedRecommendations.rejected, (state, action) => {
        state.genreBasedRecommendationsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch genre-based recommendations';
      })
      // Fetch similar books cases
      .addCase(fetchSimilarBooks.pending, (state) => {
        state.similarBooksLoading = true;
      })
      .addCase(fetchSimilarBooks.fulfilled, (state, action) => {
        state.similarBooksLoading = false;
        state.similarBooks = action.payload;
        state.recommendationsLastUpdated.similar = new Date().toISOString();
      })
      .addCase(fetchSimilarBooks.rejected, (state, action) => {
        state.similarBooksLoading = false;
        state.error = action.payload?.message || 'Failed to fetch similar books';
      })
      // Fetch diverse recommendations cases
      .addCase(fetchDiverseRecommendations.pending, (state) => {
        state.diverseRecommendationsLoading = true;
      })
      .addCase(fetchDiverseRecommendations.fulfilled, (state, action) => {
        state.diverseRecommendationsLoading = false;
        state.diverseRecommendations = action.payload;
        state.recommendationsLastUpdated.diverse = new Date().toISOString();
      })
      .addCase(fetchDiverseRecommendations.rejected, (state, action) => {
        state.diverseRecommendationsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch diverse recommendations';
      });
  },
});

export const {
  setCurrentBook,
  setSearchFilters,
  clearSearchResults,
  clearError,
  updateBookRating,
  setRecommendationGenre,
  setSimilarToBookId,
  clearRecommendations,
} = booksSlice.actions;

// Selectors
export const selectBooks = (state: { books: BooksState }) => state.books.books;
export const selectCurrentBook = (state: { books: BooksState }) => state.books.currentBook;
export const selectSearchResults = (state: { books: BooksState }) => state.books.searchResults;
export const selectPopularBooks = (state: { books: BooksState }) => state.books.popularBooks;
export const selectTrendingBooks = (state: { books: BooksState }) => state.books.trendingBooks;
export const selectPersonalRecommendations = (state: { books: BooksState }) => state.books.personalRecommendations;
export const selectGenreBasedRecommendations = (state: { books: BooksState }) => state.books.genreBasedRecommendations;
export const selectSimilarBooks = (state: { books: BooksState }) => state.books.similarBooks;
export const selectDiverseRecommendations = (state: { books: BooksState }) => state.books.diverseRecommendations;
export const selectBooksLoading = (state: { books: BooksState }) => state.books.loading;
export const selectSearchLoading = (state: { books: BooksState }) => state.books.searchLoading;
export const selectPopularBooksLoading = (state: { books: BooksState }) => state.books.popularBooksLoading;
export const selectTrendingBooksLoading = (state: { books: BooksState }) => state.books.trendingBooksLoading;
export const selectPersonalRecommendationsLoading = (state: { books: BooksState }) => state.books.personalRecommendationsLoading;
export const selectGenreBasedRecommendationsLoading = (state: { books: BooksState }) => state.books.genreBasedRecommendationsLoading;
export const selectSimilarBooksLoading = (state: { books: BooksState }) => state.books.similarBooksLoading;
export const selectDiverseRecommendationsLoading = (state: { books: BooksState }) => state.books.diverseRecommendationsLoading;
export const selectBooksError = (state: { books: BooksState }) => state.books.error;
export const selectBooksPagination = (state: { books: BooksState }) => state.books.pagination;
export const selectSearchFilters = (state: { books: BooksState }) => state.books.searchFilters;
export const selectFeaturedBooks = (state: { books: BooksState }) => state.books.featuredBooks;
export const selectRecommendationsLastUpdated = (state: { books: BooksState }) => state.books.recommendationsLastUpdated;
export const selectRecommendationGenre = (state: { books: BooksState }) => state.books.recommendationGenre;
export const selectSimilarToBookId = (state: { books: BooksState }) => state.books.similarToBookId;

const booksReducer = booksSlice.reducer;
export default booksReducer;
