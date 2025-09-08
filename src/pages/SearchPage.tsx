import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  Link,
  Typography,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectSearchQuery,
  selectSearchResults,
  selectSearchLoading,
  selectSearchMode,
  selectSearchFacets,
  setQuery,
  setSearchMode,
  performAdvancedSearch,
  fetchSearchFacets,
} from '@/store/searchSlice';
import { selectIsAuthenticated } from '@/store/authSlice';
import { Book } from '@/types/api';

// Import all search and recommendation components
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { RecommendationsSection } from '@/components/recommendations/RecommendationsSection';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = useAppSelector(selectSearchQuery);
  const results = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectSearchLoading);
  const searchMode = useAppSelector(selectSearchMode);
  const facets = useAppSelector(selectSearchFacets);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [showFilters, setShowFilters] = useState(false);

  // Initialize search from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlGenre = searchParams.get('genre');
    const urlMode = searchParams.get('mode');
    
    if (urlQuery && urlQuery !== query) {
      dispatch(setQuery(urlQuery));
      
      // Perform search with URL parameters
      dispatch(performAdvancedSearch({
        q: urlQuery,
        genre_id: urlGenre || undefined,
        skip: 0,
        limit: 20,
      }));
      
      // Fetch facets for filtering
      dispatch(fetchSearchFacets(urlQuery));
    }
    
    if (urlMode === 'advanced') {
      dispatch(setSearchMode('advanced'));
      setShowFilters(true);
    }
  }, [searchParams, dispatch, query]);

  // Update URL when search changes
  const updateUrl = (searchQuery: string, additionalParams: Record<string, string> = {}) => {
    const newParams = new URLSearchParams();
    
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    }
    
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    
    if (searchMode === 'advanced') {
      newParams.set('mode', 'advanced');
    }
    
    setSearchParams(newParams);
  };

  // Handle search execution
  const handleSearch = (searchQuery: string) => {
    updateUrl(searchQuery);
    
    // Fetch facets for the new search
    if (searchQuery.trim()) {
      dispatch(fetchSearchFacets(searchQuery.trim()));
    }
  };

  // Handle book click
  const handleBookClick = (book: Book) => {
    navigate(`/books/${book.id}`);
  };

  // Handle favorite toggle (placeholder)
  const handleToggleFavorite = (book: Book) => {
    // This would integrate with user favorites functionality
    console.log('Toggle favorite for book:', book.id);
  };


  // Handle search mode toggle
  const handleSearchModeToggle = (advanced: boolean) => {
    const newMode = advanced ? 'advanced' : 'basic';
    dispatch(setSearchMode(newMode));
    setShowFilters(advanced);
    
    if (query.trim()) {
      updateUrl(query, { mode: advanced ? 'advanced' : 'basic' });
    }
  };


  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Search
        </Typography>
      </Breadcrumbs>

      {/* Main Search Interface */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Discover Your Next Great Read
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Search through thousands of books and get personalized recommendations
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for books, authors, genres, or topics..."
            autoFocus={!hasQuery}
          />
        </Box>

        {/* Search Mode Toggle and Filter Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <FormControlLabel
            control={
              <Switch
                checked={searchMode === 'advanced'}
                onChange={(e) => handleSearchModeToggle(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterListIcon sx={{ mr: 0.5 }} fontSize="small" />
                Advanced Search
              </Box>
            }
          />

          {hasQuery && (
            <Typography variant="body2" color="text.secondary">
              {loading ? 'Searching...' : `${results.length} results found`}
            </Typography>
          )}
        </Box>

        {/* Advanced Filters */}
        {showFilters && searchMode === 'advanced' && (
          <Box sx={{ mt: 2 }}>
            <SearchFilters facets={facets} />
          </Box>
        )}
      </Paper>

      {/* Search Results or Recommendations */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {hasQuery ? (
            // Show search results
            <SearchResults 
              onBookClick={handleBookClick}
            />
          ) : (
            // Show recommendations when no search query
            <Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                Recommendations for You
              </Typography>
              <RecommendationsSection
                onBookClick={handleBookClick}
                onToggleFavorite={handleToggleFavorite}
                showPopular={true}
                showPersonalized={isAuthenticated}
                showGenreBased={true}
                showSimilar={false}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Additional Recommendations (shown below search results) */}
      {hasQuery && hasResults && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
              You Might Also Like
            </Typography>
            <RecommendationsSection
              onBookClick={handleBookClick}
              onToggleFavorite={handleToggleFavorite}
              showPopular={true}
              showPersonalized={isAuthenticated}
              showGenreBased={false}
              showSimilar={false}
              compact={true}
            />
          </Box>
        </>
      )}
    </Container>
  );
};
