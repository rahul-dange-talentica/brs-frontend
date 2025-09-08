import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

export interface SearchResultsHeaderProps {
  query: string;
  totalResults: number;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  activeFilters?: Array<{ label: string; onRemove: () => void }>;
  onClearAllFilters?: () => void;
  loading?: boolean;
}

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  query,
  totalResults,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  activeFilters = [],
  onClearAllFilters,
  loading = false,
}) => {
  // Calculate result range
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);


  return (
    <Box>
      {/* Main Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Search Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {loading ? (
              'Searching...'
            ) : totalResults > 0 ? (
              <>
                {totalResults.toLocaleString()} results for{' '}
                <strong>"{query}"</strong>
                {totalResults > pageSize && (
                  <> • Showing {startResult}-{endResult}</>
                )}
              </>
            ) : (
              `No results found for "${query}"`
            )}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Sort Controls */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={`${sortBy}-${sortOrder}`}
              label="Sort by"
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                onSortChange(field, order as 'asc' | 'desc');
              }}
              disabled={loading}
            >
              <MenuItem value="relevance-desc">Relevance</MenuItem>
              <MenuItem value="title-asc">Title (A-Z)</MenuItem>
              <MenuItem value="title-desc">Title (Z-A)</MenuItem>
              <MenuItem value="rating-desc">Rating (High to Low)</MenuItem>
              <MenuItem value="rating-asc">Rating (Low to High)</MenuItem>
              <MenuItem value="publishedDate-desc">Newest First</MenuItem>
              <MenuItem value="publishedDate-asc">Oldest First</MenuItem>
            </Select>
          </FormControl>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <IconButton
                size="small"
                onClick={() => onViewModeChange('list')}
                sx={{
                  borderRadius: 0,
                  backgroundColor: viewMode === 'list' ? 'action.selected' : 'transparent',
                }}
              >
                <ViewListIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onViewModeChange('grid')}
                sx={{
                  borderRadius: 0,
                  backgroundColor: viewMode === 'grid' ? 'action.selected' : 'transparent',
                }}
              >
                <ViewModuleIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1 
          }}>
            <Typography variant="subtitle2" color="text.secondary">
              Active Filters ({activeFilters.length})
            </Typography>
            {onClearAllFilters && (
              <IconButton 
                size="small" 
                onClick={onClearAllFilters}
                sx={{ color: 'text.secondary' }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                size="small"
                variant="outlined"
                onDelete={filter.onRemove}
                deleteIcon={<ClearIcon />}
              />
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />
    </Box>
  );
};
