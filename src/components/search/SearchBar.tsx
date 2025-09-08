import React, { useCallback, useRef, useEffect } from 'react';
import { Box, ClickAwayListener } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setQuery,
  performAdvancedSearch,
  fetchSearchSuggestions,
  showSuggestions,
  hideSuggestions,
  showSearchHistory,
  hideSearchHistory,
  selectSuggestion,
  selectSearchQuery,
  selectSearchSuggestions,
  selectShowSuggestions,
  selectShowSearchHistory,
  selectPopularSearches,
  selectTrendingSearches,
  selectSearchLoading,
  loadSearchAnalytics,
} from '@/store/searchSlice';
import { SearchInput } from './SearchInput';
import { SearchSuggestions } from './SearchSuggestions';
import { SearchHistory } from './SearchHistory';
import { 
  removeFromSearchHistory, 
  clearSearchHistory,
  getSearchHistory,
} from '@/utils/searchHistory';

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceDelay?: number;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search books, authors, genres...",
  autoFocus = false,
  debounceDelay = 300,
  className,
}) => {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectSearchQuery);
  const suggestions = useAppSelector(selectSearchSuggestions);
  const showingSuggestions = useAppSelector(selectShowSuggestions);
  const showingHistory = useAppSelector(selectShowSearchHistory);
  const popularSearches = useAppSelector(selectPopularSearches);
  const trendingSearches = useAppSelector(selectTrendingSearches);
  const loading = useAppSelector(selectSearchLoading);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load analytics data on mount
  useEffect(() => {
    dispatch(loadSearchAnalytics());
  }, [dispatch]);

  // Handle input value change
  const handleInputChange = useCallback((value: string) => {
    dispatch(setQuery(value));
    
    // Fetch suggestions if there's input
    if (value.trim().length >= 2) {
      dispatch(fetchSearchSuggestions(value.trim()));
      dispatch(showSuggestions());
      dispatch(hideSearchHistory());
    } else {
      dispatch(hideSuggestions());
    }
  }, [dispatch]);

  // Handle search execution
  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Perform the search
    dispatch(performAdvancedSearch({ 
      q: searchQuery.trim(),
      skip: 0,
      limit: 20,
    }));
    
    // Hide suggestions and history
    dispatch(hideSuggestions());
    dispatch(hideSearchHistory());
    
    // Call external search handler if provided
    onSearch?.(searchQuery.trim());
  }, [dispatch, onSearch]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    // Show search history if no query, otherwise show suggestions
    if (!query.trim()) {
      dispatch(showSearchHistory());
      dispatch(hideSuggestions());
    } else if (query.trim().length >= 2) {
      dispatch(showSuggestions());
      dispatch(hideSearchHistory());
    }
  }, [dispatch, query]);

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    // Don't hide suggestions/history immediately to allow for clicks
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: any) => {
    dispatch(selectSuggestion(suggestion));
    handleSearch(suggestion.text);
  }, [dispatch, handleSearch]);

  // Handle history item click
  const handleHistoryClick = useCallback((historyQuery: string) => {
    dispatch(setQuery(historyQuery));
    handleSearch(historyQuery);
  }, [dispatch, handleSearch]);

  // Handle delete history item
  const handleDeleteHistoryItem = useCallback((historyQuery: string) => {
    removeFromSearchHistory(historyQuery);
    // Refresh history in state
    dispatch(showSearchHistory());
  }, [dispatch]);

  // Handle clear all history
  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
    dispatch(hideSearchHistory());
  }, [dispatch]);

  // Handle click away from search bar
  const handleClickAway = useCallback(() => {
    dispatch(hideSuggestions());
    dispatch(hideSearchHistory());
  }, [dispatch]);

  // Close suggestions and history
  const handleClose = useCallback(() => {
    dispatch(hideSuggestions());
    dispatch(hideSearchHistory());
  }, [dispatch]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box 
        ref={containerRef}
        className={className}
        sx={{ 
          position: 'relative',
          width: '100%',
          maxWidth: 600,
        }}
      >
        <SearchInput
          value={query}
          onChange={handleInputChange}
          onSearch={handleSearch}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          loading={loading}
          autoFocus={autoFocus}
          debounceDelay={debounceDelay}
        />
        
        {/* Search Suggestions */}
        {showingSuggestions && suggestions.length > 0 && (
          <SearchSuggestions
            suggestions={suggestions.map(suggestion => ({
              text: suggestion.text,
              type: suggestion.type,
              metadata: suggestion.metadata,
            }))}
            onSuggestionClick={handleSuggestionClick}
            onClose={handleClose}
            query={query}
          />
        )}
        
        {/* Search History */}
        {showingHistory && (
          <SearchHistory
            historyItems={getSearchHistory()}
            popularSearches={popularSearches}
            trendingSearches={trendingSearches}
            onHistoryClick={handleHistoryClick}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            onClose={handleClose}
          />
        )}
      </Box>
    </ClickAwayListener>
  );
};
