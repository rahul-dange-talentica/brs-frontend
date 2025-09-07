import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, PaginationState, SearchFilters, ApiError } from '../types';

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

// Mock data for development
const mockBooks: Book[] = [
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
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description: 'A story of racial injustice and childhood innocence.',
    coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
    averageRating: 4.5,
    totalReviews: 203,
    isbn: '9780446310789',
    publishedDate: '1960-07-11',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Async thunks
export const fetchBooks = createAsyncThunk<
  { books: Book[]; pagination: PaginationState },
  { page?: number; pageSize?: number },
  { rejectValue: ApiError }
>('books/fetchBooks', async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await booksService.getBooks({ page, pageSize });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBooks = mockBooks.slice(startIndex, endIndex);
    
    const pagination: PaginationState = {
      currentPage: page,
      totalPages: Math.ceil(mockBooks.length / pageSize),
      totalBooks: mockBooks.length,
      pageSize,
    };
    
    return { books: paginatedBooks, pagination };
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch books',
      status: error.status || 500,
    });
  }
});

export const searchBooks = createAsyncThunk<
  { books: Book[]; pagination: PaginationState },
  SearchFilters,
  { rejectValue: ApiError }
>('books/searchBooks', async (filters, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await booksService.searchBooks(filters);
    
    // Mock implementation with filtering
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filteredBooks = mockBooks;
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
      );
    }
    
    if (filters.genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.toLowerCase() === filters.genre!.toLowerCase()
      );
    }
    
    if (filters.author) {
      filteredBooks = filteredBooks.filter(book => 
        book.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }
    
    if (filters.minRating) {
      filteredBooks = filteredBooks.filter(book => book.averageRating >= filters.minRating!);
    }
    
    // Sort books
    if (filters.sortBy) {
      filteredBooks.sort((a, b) => {
        let aValue: any = a[filters.sortBy as keyof Book];
        let bValue: any = b[filters.sortBy as keyof Book];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (filters.sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }
    
    const pagination: PaginationState = {
      currentPage: 1,
      totalPages: Math.ceil(filteredBooks.length / 10),
      totalBooks: filteredBooks.length,
      pageSize: 10,
    };
    
    return { books: filteredBooks, pagination };
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Search failed',
      status: error.status || 500,
    });
  }
});

export const fetchBookById = createAsyncThunk<
  Book,
  string,
  { rejectValue: ApiError }
>('books/fetchBookById', async (bookId, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await booksService.getBookById(bookId);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const book = mockBooks.find(b => b.id === bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    
    return book;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch book',
      status: error.status || 404,
    });
  }
});

export const fetchRecommendations = createAsyncThunk<
  Book[],
  { userId?: string; bookId?: string; type?: 'popular' | 'genre' | 'personalized' },
  { rejectValue: ApiError }
>('books/fetchRecommendations', async (_, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await booksService.getRecommendations(params);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a subset of mock books as recommendations
    return mockBooks.slice(0, 5);
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch recommendations',
      status: error.status || 500,
    });
  }
});

export const fetchFeaturedBooks = createAsyncThunk<
  Book[],
  void,
  { rejectValue: ApiError }
>('books/fetchFeaturedBooks', async (_, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockBooks.slice(0, 3);
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch featured books',
      status: error.status || 500,
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
    updateBookRating: (state, action: PayloadAction<{ bookId: string; newRating: number; totalReviews: number }>) => {
      const { bookId, newRating, totalReviews } = action.payload;
      
      // Update in books array
      const bookIndex = state.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        state.books[bookIndex].averageRating = newRating;
        state.books[bookIndex].totalReviews = totalReviews;
      }
      
      // Update in search results
      const searchIndex = state.searchResults.findIndex(book => book.id === bookId);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex].averageRating = newRating;
        state.searchResults[searchIndex].totalReviews = totalReviews;
      }
      
      // Update current book
      if (state.currentBook && state.currentBook.id === bookId) {
        state.currentBook.averageRating = newRating;
        state.currentBook.totalReviews = totalReviews;
      }
      
      // Update recommendations
      const recIndex = state.recommendations.findIndex(book => book.id === bookId);
      if (recIndex !== -1) {
        state.recommendations[recIndex].averageRating = newRating;
        state.recommendations[recIndex].totalReviews = totalReviews;
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

export default booksSlice.reducer;
