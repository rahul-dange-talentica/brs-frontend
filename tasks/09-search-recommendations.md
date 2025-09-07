# Task 09: Search & Recommendations

**Sequence**: 09  
**Priority**: Medium  
**Estimated Duration**: 2-3 days  
**Dependencies**: Task 05 (API Integration), Task 06 (Book Management), Task 08 (User Profile)  
**Assigned To**: TBD  

---

## Task Overview

Implement advanced search functionality with filters, debounced input, and comprehensive recommendation system including popular, genre-based, and personalized recommendations integrated with user preferences.

---

## Acceptance Criteria

### Advanced Search Features
- [ ] **Search Bar**: Debounced search input with autocomplete suggestions
- [ ] **Search Filters**: Filter by genre, author, publication date, rating
- [ ] **Search Results**: Paginated results with sorting options
- [ ] **Search History**: Store and display recent searches (local storage)

### Search User Experience
- [ ] **Auto-complete**: Suggest books, authors, and genres as user types
- [ ] **Search Highlighting**: Highlight search terms in results
- [ ] **No Results Handling**: Helpful message and suggestions when no results found
- [ ] **Search Analytics**: Track popular searches for improvements

### Recommendation System
- [ ] **Popular Books**: Most reviewed and highest-rated books
- [ ] **Genre-Based**: Recommendations based on selected or favorite genres
- [ ] **Personalized**: Recommendations based on user's review history and preferences
- [ ] **Similar Books**: Books similar to currently viewed book

### Recommendation Display
- [ ] **Recommendation Sections**: Different sections for different recommendation types
- [ ] **Recommendation Cards**: Visually appealing book recommendation display
- [ ] **Recommendation Reasons**: Show why a book is recommended
- [ ] **Recommendation Actions**: Easy actions to view details or add to favorites

---

## Implementation Details

### 1. Search Data Structure
```typescript
// Search query interface
interface SearchQuery {
  q: string; // Main search term
  genre?: string;
  author?: string;
  minRating?: number;
  maxRating?: number;
  publishedAfter?: string;
  publishedBefore?: string;
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'rating' | 'title' | 'publishedDate';
  order?: 'asc' | 'desc';
}

// Search results interface
interface SearchResponse {
  books: Book[];
  total: number;
  query: string;
  suggestions?: string[];
  facets?: {
    genres: { name: string; count: number }[];
    authors: { name: string; count: number }[];
    ratings: { range: string; count: number }[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
  };
}

// Recommendation interfaces
interface RecommendationRequest {
  type: 'popular' | 'genre-based' | 'personalized' | 'similar';
  limit?: number;
  genre?: string;
  bookId?: string; // For similar books
  userId?: string; // For personalized
}

interface RecommendationResponse {
  books: Book[];
  recommendationType: string;
  reason?: string;
  message?: string;
}
```

### 2. Component Architecture
```
SearchAndRecommendations
├── SearchPage
│   ├── SearchBar
│   │   ├── SearchInput
│   │   ├── SearchSuggestions
│   │   └── SearchHistory
│   ├── SearchFilters
│   │   ├── GenreFilter
│   │   ├── AuthorFilter
│   │   ├── RatingFilter
│   │   └── DateRangeFilter
│   ├── SearchResults
│   │   ├── SearchResultsHeader
│   │   ├── SearchResultsList
│   │   └── SearchPagination
│   └── SearchEmptyState
├── RecommendationsSection
│   ├── PopularBooks
│   ├── GenreRecommendations
│   ├── PersonalizedRecommendations
│   └── SimilarBooks
└── RecommendationCard
    ├── BookCover
    ├── BookInfo
    ├── RecommendationReason
    └── RecommendationActions
```

### 3. State Management Integration
```typescript
// Search slice
interface SearchState {
  query: string;
  filters: Omit<SearchQuery, 'q'>;
  results: Book[];
  suggestions: string[];
  facets: SearchResponse['facets'] | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
  } | null;
  searchHistory: string[];
}

// Recommendations slice addition to books slice
interface RecommendationsState {
  popular: Book[];
  genreBased: Book[];
  personalized: Book[];
  similar: Book[];
  loading: {
    popular: boolean;
    genreBased: boolean;
    personalized: boolean;
    similar: boolean;
  };
  lastUpdated: {
    popular: string | null;
    genreBased: string | null;
    personalized: string | null;
    similar: string | null;
  };
}
```

---

## Components to Create

### Search Components
1. **src/pages/SearchPage.tsx** - Main search page with results
2. **src/components/search/SearchBar.tsx** - Search input with autocomplete
3. **src/components/search/SearchInput.tsx** - Debounced search input field
4. **src/components/search/SearchSuggestions.tsx** - Autocomplete suggestions dropdown
5. **src/components/search/SearchFilters.tsx** - Advanced search filters

### Search Results
6. **src/components/search/SearchResults.tsx** - Search results display
7. **src/components/search/SearchResultsHeader.tsx** - Results count and sorting
8. **src/components/search/SearchResultsList.tsx** - Paginated results list
9. **src/components/search/SearchEmptyState.tsx** - No results found state
10. **src/components/search/SearchHistory.tsx** - Recent searches display

### Recommendations
11. **src/components/recommendations/RecommendationsSection.tsx** - Main recommendations container
12. **src/components/recommendations/PopularBooks.tsx** - Popular books section
13. **src/components/recommendations/GenreRecommendations.tsx** - Genre-based recommendations
14. **src/components/recommendations/PersonalizedRecommendations.tsx** - User-specific recommendations
15. **src/components/recommendations/SimilarBooks.tsx** - Similar books section

### Recommendation Display
16. **src/components/recommendations/RecommendationCard.tsx** - Individual recommendation card
17. **src/components/recommendations/RecommendationCarousel.tsx** - Horizontal scrolling recommendations
18. **src/components/recommendations/RecommendationReason.tsx** - Why this book is recommended

---

## Key Component Implementations

### 1. SearchBar Component with Debouncing
```typescript
// src/components/search/SearchBar.tsx
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useAppDispatch();
  const { suggestions, loading } = useAppSelector(state => state.search);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim()) {
        dispatch(searchBooks({ q: searchQuery }));
        dispatch(fetchSearchSuggestions(searchQuery));
      }
    }, 300),
    [dispatch]
  );

  // Debounced suggestions fetch
  const debouncedSuggestions = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length >= 2) {
        dispatch(fetchSearchSuggestions(searchQuery));
        setShowSuggestions(true);
      }
    }, 150),
    [dispatch]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    
    if (value.trim()) {
      debouncedSuggestions(value);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      debouncedSearch(query);
      dispatch(addToSearchHistory(query));
      setShowSuggestions(false);
      onSearch?.(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch();
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder || "Search books, authors, genres..."}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} />}
              <IconButton onClick={handleSearch} disabled={!query.trim()}>
                <ArrowForwardIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
          },
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <SearchSuggestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </Box>
  );
};
```

### 2. PersonalizedRecommendations Component
```typescript
// src/components/recommendations/PersonalizedRecommendations.tsx
export const PersonalizedRecommendations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { personalized, loading } = useAppSelector(state => state.recommendations);
  const { favoriteBooks, userReviews } = useAppSelector(state => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchPersonalizedRecommendations({
        type: 'personalized',
        limit: 12,
        userId: user.id,
      }));
    }
  }, [isAuthenticated, user, dispatch]);

  const getRecommendationReason = (book: Book): string => {
    // Determine why this book is recommended
    const userGenres = userReviews.map(review => review.book?.genre).filter(Boolean);
    const favoriteGenres = favoriteBooks.map(book => book.genre);
    const allUserGenres = [...new Set([...userGenres, ...favoriteGenres])];

    if (allUserGenres.includes(book.genre)) {
      return `Because you like ${book.genre} books`;
    }

    const averageUserRating = userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
      : 0;

    if (book.averageRating >= averageUserRating) {
      return `Highly rated book (${book.averageRating.toFixed(1)} stars)`;
    }

    return 'Recommended for you';
  };

  if (!isAuthenticated) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Personalized Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Sign in to get personalized book recommendations based on your reading history.
        </Typography>
        <Button variant="contained" component={Link} to="/login">
          Sign In
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Recommended for You
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Based on your reading history and preferences
      </Typography>
      
      {loading.personalized ? (
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" height={60} />
            </Grid>
          ))}
        </Grid>
      ) : personalized.length > 0 ? (
        <RecommendationCarousel>
          {personalized.map((book) => (
            <RecommendationCard
              key={book.id}
              book={book}
              reason={getRecommendationReason(book)}
              type="personalized"
            />
          ))}
        </RecommendationCarousel>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            We need more information about your preferences to provide personalized recommendations.
            Try rating some books or adding them to your favorites!
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
```

### 3. SearchFilters Component
```typescript
// src/components/search/SearchFilters.tsx
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  facets,
  onFiltersChange
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (newFilters: Partial<SearchQuery>) => {
    onFiltersChange({ ...filters, ...newFilters, page: 1 });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      genre: undefined,
      author: undefined,
      minRating: undefined,
      maxRating: undefined,
      publishedAfter: undefined,
      publishedBefore: undefined,
      page: 1,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title="Filters"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeFiltersCount > 0 && (
              <Chip 
                label={`${activeFiltersCount} active`} 
                size="small" 
                color="primary"
                onDelete={clearAllFilters}
              />
            )}
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        }
      />
      
      <Collapse in={expanded}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={filters.genre || ''}
                  label="Genre"
                  onChange={(e) => handleFilterChange({ genre: e.target.value || undefined })}
                >
                  <MenuItem value="">All Genres</MenuItem>
                  {facets?.genres.map((genre) => (
                    <MenuItem key={genre.name} value={genre.name}>
                      {genre.name} ({genre.count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Rating Range</Typography>
              <Slider
                value={[filters.minRating || 0, filters.maxRating || 5]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange({ minRating: min, maxRating: max });
                }}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2.5, label: '2.5' },
                  { value: 5, label: '5' },
                ]}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Published After"
                type="date"
                value={filters.publishedAfter || ''}
                onChange={(e) => handleFilterChange({ publishedAfter: e.target.value || undefined })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Published Before"
                type="date"
                value={filters.publishedBefore || ''}
                onChange={(e) => handleFilterChange({ publishedBefore: e.target.value || undefined })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};
```

---

## Search Optimization

### Debouncing Implementation
```typescript
// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Usage in search components
const debouncedSearch = useCallback(
  debounce((query: string) => {
    dispatch(searchBooks({ q: query }));
  }, 300), // 300ms delay
  [dispatch]
);
```

### Search History Management
```typescript
// src/utils/searchHistory.ts
const SEARCH_HISTORY_KEY = 'book-search-history';
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = (): string[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

export const addToSearchHistory = (query: string): void => {
  try {
    const history = getSearchHistory();
    const updatedHistory = [
      query,
      ...history.filter(item => item !== query)
    ].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save search history:', error);
  }
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
};
```

---

## Recommendation Algorithms

### Popular Books Algorithm
```typescript
// Fetch popular books based on ratings and review count
const fetchPopularBooks = async (): Promise<Book[]> => {
  return booksService.getRecommendations({
    type: 'popular',
    limit: 20,
  });
};
```

### Genre-Based Recommendations
```typescript
// Recommend books from user's favorite genres
const fetchGenreRecommendations = async (userGenres: string[]): Promise<Book[]> => {
  const recommendations = await Promise.all(
    userGenres.map(genre =>
      booksService.getRecommendations({
        type: 'genre-based',
        genre,
        limit: 10,
      })
    )
  );
  
  // Combine and deduplicate recommendations
  return [...new Set(recommendations.flat())];
};
```

### Personalized Recommendations
```typescript
// Machine learning-like approach using user behavior
const fetchPersonalizedRecommendations = async (
  userId: string,
  userReviews: Review[],
  favoriteBooks: Book[]
): Promise<Book[]> => {
  // Analyze user preferences
  const preferences = analyzeUserPreferences(userReviews, favoriteBooks);
  
  return booksService.getRecommendations({
    type: 'personalized',
    userId,
    preferences,
    limit: 15,
  });
};

const analyzeUserPreferences = (
  userReviews: Review[],
  favoriteBooks: Book[]
) => {
  // Calculate genre preferences
  const genreWeights: Record<string, number> = {};
  
  userReviews.forEach(review => {
    const genre = review.book?.genre;
    if (genre) {
      genreWeights[genre] = (genreWeights[genre] || 0) + review.rating;
    }
  });
  
  favoriteBooks.forEach(book => {
    genreWeights[book.genre] = (genreWeights[book.genre] || 0) + 5; // Favorites get max weight
  });
  
  // Normalize weights
  const maxWeight = Math.max(...Object.values(genreWeights));
  Object.keys(genreWeights).forEach(genre => {
    genreWeights[genre] = genreWeights[genre] / maxWeight;
  });
  
  return {
    preferredGenres: genreWeights,
    averageRatingPreference: userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length,
    preferredAuthors: [...new Set(favoriteBooks.map(book => book.author))],
  };
};
```

---

## Testing Checklist

### Search Functionality
- [ ] Search input debounces properly to prevent excessive API calls
- [ ] Autocomplete suggestions appear and work correctly
- [ ] Search results display with proper pagination
- [ ] Search filters work independently and in combination
- [ ] Search history saves and displays recent searches

### Search User Experience
- [ ] Empty search states provide helpful guidance
- [ ] Search results highlight search terms appropriately
- [ ] Loading states show during search operations
- [ ] Error states handle search failures gracefully

### Recommendation System
- [ ] Popular books recommendations display correctly
- [ ] Genre-based recommendations match user's reading preferences
- [ ] Personalized recommendations adapt to user behavior
- [ ] Similar books recommendations are contextually relevant

### Recommendation Display
- [ ] Recommendation sections load and display properly
- [ ] Recommendation cards show appropriate book information
- [ ] Recommendation reasons explain why books are suggested
- [ ] Recommendation actions (view details, favorite) work correctly

### Integration Testing
- [ ] Search integrates properly with book management features
- [ ] Recommendations update when user preferences change
- [ ] Search and recommendations work together seamlessly
- [ ] Performance remains good with large datasets

---

## Performance Optimizations

### Search Performance
- [ ] **Debouncing**: Prevent excessive API calls during typing
- [ ] **Caching**: Cache search results for repeated queries
- [ ] **Pagination**: Load search results in manageable chunks
- [ ] **Index Optimization**: Use proper search indexes on backend

### Recommendation Performance
- [ ] **Background Loading**: Load recommendations asynchronously
- [ ] **Incremental Updates**: Update recommendations gradually
- [ ] **Cache Management**: Cache recommendations with expiration
- [ ] **Lazy Loading**: Load recommendation sections on demand

---

## Accessibility Requirements

### Search Accessibility
- [ ] Search input is properly labeled and describable
- [ ] Search suggestions are keyboard navigable
- [ ] Search results are announced to screen readers
- [ ] Filter controls are accessible via keyboard

### Recommendation Accessibility
- [ ] Recommendation sections have proper heading structure
- [ ] Recommendation reasons are accessible to screen readers
- [ ] Carousel navigation is keyboard accessible
- [ ] Book cards in recommendations are properly labeled

---

## Definition of Done

- [ ] Advanced search with debouncing and autocomplete is fully functional
- [ ] Search filters work correctly and provide meaningful results
- [ ] Search history is saved and accessible to users
- [ ] Popular books recommendations display trending and highly-rated books
- [ ] Genre-based recommendations match user's reading preferences
- [ ] Personalized recommendations adapt to individual user behavior
- [ ] Recommendation display is visually appealing and informative
- [ ] Search and recommendations integrate seamlessly with existing features
- [ ] Performance optimizations ensure smooth user experience
- [ ] Accessibility requirements are met for all search and recommendation features

---

## Integration Points

### With Book Management (Task 06)
- Search results use same book display components
- Recommendations integrate with book browsing features
- Book details pages show similar book recommendations

### With User Profile (Task 08)
- Personalized recommendations use user profile data
- Search history can be managed from user settings
- User preferences affect recommendation algorithms

### With API Integration (Task 05)
- All search and recommendation features use proper API endpoints
- Debouncing and caching optimize API usage
- Error handling integrates with global error management

---

## Potential Issues & Solutions

### Issue: Search Performance with Large Datasets
**Problem**: Slow search response times with large book catalogs
**Solution**: Implement proper indexing, pagination, and result caching

### Issue: Recommendation Accuracy
**Problem**: Recommendations not matching user preferences
**Solution**: Improve recommendation algorithms and collect user feedback

### Issue: Search Query Complexity
**Problem**: Complex search queries with multiple filters are slow
**Solution**: Optimize database queries and implement smart filtering

### Issue: Mobile Search Experience
**Problem**: Search interface difficult to use on mobile devices
**Solution**: Implement mobile-optimized search UI with touch-friendly filters

---

## Next Task Dependencies

This task enables:
- **Task 10**: Deployment (complete feature set ready for production)

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
