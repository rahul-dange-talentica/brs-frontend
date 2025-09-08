import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectSearchResults,
  selectSearchLoading,
  selectSearchQuery,
  selectSearchPagination,
  selectAdvancedFilters,
  selectPopularSearches,
  setAdvancedFilters,
  clearAdvancedFilters,
  performAdvancedSearch,
  setPage,
  setQuery,
} from '@/store/searchSlice';
import { Book } from '@/types/api';
import { SearchResultsHeader } from './SearchResultsHeader';
import { SearchResultsList } from './SearchResultsList';
import { SearchEmptyState } from './SearchEmptyState';

export interface SearchResultsProps {
  onBookClick?: (book: Book) => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  onBookClick,
  className,
}) => {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectSearchLoading);
  const query = useAppSelector(selectSearchQuery);
  const pagination = useAppSelector(selectSearchPagination);
  const filters = useAppSelector(selectAdvancedFilters);
  const popularSearches = useAppSelector(selectPopularSearches);
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  // Check if there are active filters
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'skip' || key === 'limit' || key === 'sort' || key === 'order') return false;
    return value !== undefined && value !== null && value !== '';
  });

  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ label: string; onRemove: () => void }> = [];
    
    if (filters.genre_id) {
      activeFilters.push({
        label: `Genre: ${filters.genre_id}`,
        onRemove: () => handleFilterChange({ genre_id: undefined }),
      });
    }
    
    if (filters.author) {
      activeFilters.push({
        label: `Author: ${filters.author}`,
        onRemove: () => handleFilterChange({ author: undefined }),
      });
    }
    
    if (filters.min_rating !== undefined || filters.max_rating !== undefined) {
      activeFilters.push({
        label: `Rating: ${filters.min_rating || 0} - ${filters.max_rating || 5}`,
        onRemove: () => handleFilterChange({ min_rating: undefined, max_rating: undefined }),
      });
    }
    
    if (filters.publishedAfter) {
      activeFilters.push({
        label: `After: ${filters.publishedAfter}`,
        onRemove: () => handleFilterChange({ publishedAfter: undefined }),
      });
    }
    
    if (filters.publishedBefore) {
      activeFilters.push({
        label: `Before: ${filters.publishedBefore}`,
        onRemove: () => handleFilterChange({ publishedBefore: undefined }),
      });
    }
    
    return activeFilters;
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters, skip: 0 };
    dispatch(setAdvancedFilters(updatedFilters));
    
    // Re-search with new filters
    if (query.trim()) {
      dispatch(performAdvancedSearch({
        q: query.trim(),
        ...updatedFilters,
      }));
    }
  };

  // Handle sort changes
  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    handleFilterChange({ sort: sortBy, order: sortOrder });
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    const skip = (page - 1) * (filters.limit || 20);
    
    dispatch(performAdvancedSearch({
      q: query.trim(),
      ...filters,
      skip,
    }));
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    dispatch(clearAdvancedFilters());
    
    // Re-search without filters
    if (query.trim()) {
      dispatch(performAdvancedSearch({
        q: query.trim(),
        skip: 0,
        limit: 20,
      }));
    }
  };

  // Handle trying a new query from empty state
  const handleTryQuery = (newQuery: string) => {
    dispatch(setQuery(newQuery));
    dispatch(clearAdvancedFilters());
    dispatch(performAdvancedSearch({
      q: newQuery,
      skip: 0,
      limit: 20,
    }));
  };

  // Don't render if no query
  if (!query.trim()) {
    return null;
  }

  return (
    <Box className={className}>
      {/* Results Header */}
      <SearchResultsHeader
        query={query}
        totalResults={pagination.totalResults}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        sortBy={filters.sort || 'relevance'}
        sortOrder={filters.order || 'desc'}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilters={getActiveFilters()}
        onClearAllFilters={handleClearAllFilters}
        loading={loading}
      />

      {/* Results Content */}
      {!loading && results.length === 0 ? (
        <SearchEmptyState
          query={query}
          onTryQuery={handleTryQuery}
          onClearFilters={hasActiveFilters ? handleClearAllFilters : undefined}
          hasActiveFilters={hasActiveFilters}
          popularSearches={popularSearches}
        />
      ) : (
        <SearchResultsList
          results={results}
          loading={loading}
          viewMode={viewMode}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onBookClick={onBookClick}
          searchQuery={query}
        />
      )}
    </Box>
  );
};
