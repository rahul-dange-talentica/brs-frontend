import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SearchQuery, SearchResponse, Book, ApiError } from '../types/api';
import { booksService } from '@/services';
import { handleAPIError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';
import { 
  addToSearchHistory, 
  getSearchHistory, 
  SearchHistoryItem,
  getSearchSuggestions 
} from '@/utils/searchHistory';
import { searchCache, searchAnalytics } from '@/utils/searchOptimization';

// Advanced search query interface
export interface AdvancedSearchQuery extends SearchQuery {
  author?: string;
  max_rating?: number;
  publishedAfter?: string;
  publishedBefore?: string;
  page?: number;
  sort?: 'relevance' | 'rating' | 'title' | 'publishedDate';
  order?: 'asc' | 'desc';
}

// Search suggestions interface
export interface SearchSuggestion {
  text: string;
  type: 'query' | 'book' | 'author' | 'genre';
  metadata?: {
    bookId?: string;
    authorName?: string;
    genreId?: string;
    resultCount?: number;
  };
}

// Search facets interface
export interface SearchFacets {
  genres: Array<{ name: string; id: string; count: number }>;
  authors: Array<{ name: string; count: number }>;
  ratings: Array<{ range: string; min: number; max: number; count: number }>;
  publicationYears: Array<{ year: number; count: number }>;
}

// Enhanced search state
interface SearchState {
  // Current search
  query: string;
  advancedFilters: Omit<AdvancedSearchQuery, 'q'>;
  results: Book[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  pageSize: number;
  
  // Search suggestions and autocomplete
  suggestions: SearchSuggestion[];
  suggestionsLoading: boolean;
  showSuggestions: boolean;
  
  // Search facets for filtering
  facets: SearchFacets | null;
  facetsLoading: boolean;
  
  // Search history
  searchHistory: SearchHistoryItem[];
  showHistory: boolean;
  
  // Search analytics and trends
  popularSearches: Array<{ query: string; count: number }>;
  trendingSearches: Array<{ query: string; count: number }>;
  
  // UI state
  searchMode: 'basic' | 'advanced';
  selectedBook: Book | null;
  recentSearches: string[];
  
  // Performance
  lastSearchTime: number;
  cacheHits: number;
}

const initialState: SearchState = {
  query: '',
  advancedFilters: {
    skip: 0,
    limit: 20,
    sort: 'relevance',
    order: 'desc',
  },
  results: [],
  totalResults: 0,
  loading: false,
  error: null,
  
  currentPage: 1,
  totalPages: 0,
  pageSize: 20,
  
  suggestions: [],
  suggestionsLoading: false,
  showSuggestions: false,
  
  facets: null,
  facetsLoading: false,
  
  searchHistory: [],
  showHistory: false,
  
  popularSearches: [],
  trendingSearches: [],
  
  searchMode: 'basic',
  selectedBook: null,
  recentSearches: [],
  
  lastSearchTime: 0,
  cacheHits: 0,
};

// Async thunks

/**
 * Perform advanced search with caching and analytics
 */
export const performAdvancedSearch = createAsyncThunk<
  SearchResponse,
  AdvancedSearchQuery,
  { rejectValue: ApiError }
>('search/performAdvancedSearch', async (searchQuery, { rejectWithValue }) => {
  try {
    const startTime = Date.now();
    
    // Check cache first
    const cachedResult = searchCache.get(searchQuery);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Perform search
    const response = await booksService.searchBooks(searchQuery);
    const responseTime = Date.now() - startTime;
    
    // Cache result
    searchCache.set(searchQuery, response);
    
    // Record analytics
    if (searchQuery.q) {
      searchAnalytics.record(searchQuery.q, response.total, responseTime, searchQuery);
      
      // Add to search history
      addToSearchHistory(searchQuery.q, response.total);
    }
    
    return response;
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

/**
 * Fetch search suggestions for autocomplete
 */
export const fetchSearchSuggestions = createAsyncThunk<
  SearchSuggestion[],
  string,
  { rejectValue: ApiError }
>('search/fetchSearchSuggestions', async (input, { rejectWithValue }) => {
  try {
    // Get suggestions from search history
    const historySuggestions = getSearchSuggestions(input, 3).map(query => ({
      text: query,
      type: 'query' as const,
    }));
    
    // Get smart suggestions from analytics
    const analyticsSuggestions = searchAnalytics.getPopularQueries(5)
      .filter(({ query }) => query.includes(input.toLowerCase()))
      .map(({ query, avgResults }) => ({
        text: query,
        type: 'query' as const,
        metadata: { resultCount: Math.round(avgResults) },
      }));
    
    // For now, return combined suggestions
    // In a real implementation, you might call an API for book/author suggestions
    const allSuggestions = [
      ...historySuggestions,
      ...analyticsSuggestions,
    ].slice(0, 8);
    
    return allSuggestions;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch suggestions',
      status: 500,
    });
  }
});

/**
 * Fetch search facets for advanced filtering
 */
export const fetchSearchFacets = createAsyncThunk<
  SearchFacets,
  string,
  { rejectValue: ApiError }
>('search/fetchSearchFacets', async (query, { rejectWithValue }) => {
  try {
    // First perform a search to get facet data
    const searchResult = await booksService.searchBooks({ q: query, limit: 100 });
    
    // Generate facets from search results
    const genres = new Map<string, { name: string; id: string; count: number }>();
    const authors = new Map<string, number>();
    const ratings = new Map<string, { range: string; min: number; max: number; count: number }>();
    const years = new Map<number, number>();
    
    searchResult.books.forEach(book => {
      // Process genres
      if (book.genres && book.genres.length > 0) {
        book.genres.forEach(genre => {
          const existing = genres.get(genre.id) || { name: genre.name, id: genre.id, count: 0 };
          genres.set(genre.id, { ...existing, count: existing.count + 1 });
        });
      }
      
      // Process authors
      const authorCount = authors.get(book.author) || 0;
      authors.set(book.author, authorCount + 1);
      
      // Process ratings
      const rating = parseFloat(book.average_rating) || 0;
      const ratingRange = Math.floor(rating);
      const rangeKey = `${ratingRange}-${ratingRange + 1}`;
      const existing = ratings.get(rangeKey) || { 
        range: `${ratingRange} - ${ratingRange + 1} stars`, 
        min: ratingRange, 
        max: ratingRange + 1, 
        count: 0 
      };
      ratings.set(rangeKey, { ...existing, count: existing.count + 1 });
      
      // Process publication years
      if (book.publication_date) {
        const year = new Date(book.publication_date).getFullYear();
        if (!isNaN(year)) {
          const yearCount = years.get(year) || 0;
          years.set(year, yearCount + 1);
        }
      }
    });
    
    const facets: SearchFacets = {
      genres: Array.from(genres.values()).sort((a, b) => b.count - a.count),
      authors: Array.from(authors.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20), // Limit authors to top 20
      ratings: Array.from(ratings.values()).sort((a, b) => a.min - b.min),
      publicationYears: Array.from(years.entries())
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => b.year - a.year)
        .slice(0, 10), // Limit to last 10 years with data
    };
    
    return facets;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch search facets',
      status: 500,
    });
  }
});

/**
 * Load analytics data for trending and popular searches
 */
export const loadSearchAnalytics = createAsyncThunk<
  { popular: Array<{ query: string; count: number }>; trending: Array<{ query: string; count: number }> },
  void
>('search/loadSearchAnalytics', async () => {
  const popular = searchAnalytics.getPopularQueries(10);
  const trending = searchAnalytics.getTrendingQueries(24, 5);
  
  return {
    popular: popular.map(({ query, count }) => ({ query, count })),
    trending: trending,
  };
});

// Search slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      
      // Clear results if query is empty
      if (!action.payload.trim()) {
        state.results = [];
        state.totalResults = 0;
        state.facets = null;
      }
    },
    
    setAdvancedFilters: (state, action: PayloadAction<Partial<AdvancedSearchQuery>>) => {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    
    clearAdvancedFilters: (state) => {
      state.advancedFilters = {
        skip: 0,
        limit: 20,
        sort: 'relevance',
        order: 'desc',
      };
    },
    
    setSearchMode: (state, action: PayloadAction<'basic' | 'advanced'>) => {
      state.searchMode = action.payload;
    },
    
    showSuggestions: (state) => {
      state.showSuggestions = true;
    },
    
    hideSuggestions: (state) => {
      state.showSuggestions = false;
    },
    
    showSearchHistory: (state) => {
      state.showHistory = true;
      state.searchHistory = getSearchHistory();
    },
    
    hideSearchHistory: (state) => {
      state.showHistory = false;
    },
    
    selectSuggestion: (state, action: PayloadAction<SearchSuggestion>) => {
      const suggestion = action.payload;
      state.query = suggestion.text;
      state.showSuggestions = false;
      
      // Add to recent searches
      if (!state.recentSearches.includes(suggestion.text)) {
        state.recentSearches = [suggestion.text, ...state.recentSearches.slice(0, 4)];
      }
    },
    
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
    
    clearSearchResults: (state) => {
      state.results = [];
      state.totalResults = 0;
      state.facets = null;
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 0;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      state.advancedFilters.skip = (action.payload - 1) * state.pageSize;
    },
    
    incrementCacheHits: (state) => {
      state.cacheHits += 1;
    },
    
    updateLastSearchTime: (state) => {
      state.lastSearchTime = Date.now();
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Advanced search cases
      .addCase(performAdvancedSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastSearchTime = Date.now();
      })
      .addCase(performAdvancedSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.books;
        state.totalResults = action.payload.total;
        state.totalPages = action.payload.pages;
        state.currentPage = Math.floor((action.payload.skip || 0) / state.pageSize) + 1;
        state.error = null;
        
        // Update search history
        state.searchHistory = getSearchHistory();
      })
      .addCase(performAdvancedSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Search failed';
      })
      
      // Search suggestions cases
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSearchSuggestions.rejected, (state) => {
        state.suggestionsLoading = false;
        state.suggestions = [];
      })
      
      // Search facets cases
      .addCase(fetchSearchFacets.pending, (state) => {
        state.facetsLoading = true;
      })
      .addCase(fetchSearchFacets.fulfilled, (state, action) => {
        state.facetsLoading = false;
        state.facets = action.payload;
      })
      .addCase(fetchSearchFacets.rejected, (state) => {
        state.facetsLoading = false;
        state.facets = null;
      })
      
      // Analytics cases
      .addCase(loadSearchAnalytics.fulfilled, (state, action) => {
        state.popularSearches = action.payload.popular;
        state.trendingSearches = action.payload.trending;
      });
  },
});

export const {
  setQuery,
  setAdvancedFilters,
  clearAdvancedFilters,
  setSearchMode,
  showSuggestions,
  hideSuggestions,
  showSearchHistory,
  hideSearchHistory,
  selectSuggestion,
  setSelectedBook,
  clearSearchResults,
  clearError,
  setPage,
  incrementCacheHits,
  updateLastSearchTime,
} = searchSlice.actions;

// Selectors
export const selectSearchQuery = (state: { search: SearchState }) => state.search.query;
export const selectAdvancedFilters = (state: { search: SearchState }) => state.search.advancedFilters;
export const selectSearchResults = (state: { search: SearchState }) => state.search.results;
export const selectSearchLoading = (state: { search: SearchState }) => state.search.loading;
export const selectSearchError = (state: { search: SearchState }) => state.search.error;
export const selectSearchSuggestions = (state: { search: SearchState }) => state.search.suggestions;
export const selectShowSuggestions = (state: { search: SearchState }) => state.search.showSuggestions;
export const selectSearchFacets = (state: { search: SearchState }) => state.search.facets;
export const selectSearchMode = (state: { search: SearchState }) => state.search.searchMode;
export const selectSearchHistory = (state: { search: SearchState }) => state.search.searchHistory;
export const selectShowSearchHistory = (state: { search: SearchState }) => state.search.showHistory;
export const selectPopularSearches = (state: { search: SearchState }) => state.search.popularSearches;
export const selectTrendingSearches = (state: { search: SearchState }) => state.search.trendingSearches;
export const selectSearchPagination = (state: { search: SearchState }) => ({
  currentPage: state.search.currentPage,
  totalPages: state.search.totalPages,
  totalResults: state.search.totalResults,
  pageSize: state.search.pageSize,
});

const searchReducer = searchSlice.reducer;
export default searchReducer;
