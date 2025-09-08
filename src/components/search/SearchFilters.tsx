import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Typography,
  IconButton,
  Chip,
  Box,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setAdvancedFilters,
  clearAdvancedFilters,
  selectAdvancedFilters,
  performAdvancedSearch,
  selectSearchQuery,
} from '@/store/searchSlice';
import { SearchFacets } from '@/store/searchSlice';

export interface SearchFiltersProps {
  facets?: SearchFacets | null;
  onFiltersChange?: (filters: any) => void;
  className?: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  facets,
  onFiltersChange,
  className,
}) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectAdvancedFilters);
  const query = useAppSelector(selectSearchQuery);
  const [expanded, setExpanded] = useState(false);

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters, skip: 0 };
    dispatch(setAdvancedFilters(updatedFilters));
    onFiltersChange?.(updatedFilters);
  };

  // Apply filters and search
  const handleApplyFilters = () => {
    if (query.trim()) {
      dispatch(performAdvancedSearch({
        q: query.trim(),
        ...filters,
        skip: 0,
      }));
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearAdvancedFilters());
    onFiltersChange?.({});
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'skip' || key === 'limit' || key === 'sort' || key === 'order') return false;
    return value !== undefined && value !== null && value !== '';
  }).length;

  // Rating marks for slider
  const ratingMarks = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  return (
    <Card className={className} sx={{ mb: 2 }}>
      <CardHeader
        avatar={<FilterListIcon />}
        title="Search Filters"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeFiltersCount > 0 && (
              <Chip 
                label={`${activeFiltersCount} active`} 
                size="small" 
                color="primary"
                variant="outlined"
                onDelete={handleClearFilters}
                deleteIcon={<ClearIcon />}
              />
            )}
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <Collapse in={expanded}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Genre Filter */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={filters.genre_id || ''}
                  label="Genre"
                  onChange={(e) => handleFilterChange({ genre_id: e.target.value || undefined })}
                >
                  <MenuItem value="">All Genres</MenuItem>
                  {facets?.genres.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name} ({genre.count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Author Filter */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Author"
                value={filters.author || ''}
                onChange={(e) => handleFilterChange({ author: e.target.value || undefined })}
                placeholder="Search by author name"
              />
            </Grid>

            {/* Rating Range */}
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>
                Rating Range
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={[filters.min_rating || 0, filters.max_rating || 5]}
                  onChange={(_, newValue) => {
                    const [min, max] = newValue as number[];
                    handleFilterChange({ 
                      min_rating: min > 0 ? min : undefined,
                      max_rating: max < 5 ? max : undefined,
                    });
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                  step={0.5}
                  marks={ratingMarks}
                  sx={{ mt: 2 }}
                />
              </Box>
            </Grid>

            {/* Sort Options */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sort || 'relevance'}
                  label="Sort By"
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="publishedDate">Publication Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Publication Date Range */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom variant="subtitle2">
                Publication Date Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Published After"
                    type="date"
                    value={filters.publishedAfter || ''}
                    onChange={(e) => handleFilterChange({ publishedAfter: e.target.value || undefined })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Published Before"
                    type="date"
                    value={filters.publishedBefore || ''}
                    onChange={(e) => handleFilterChange({ publishedBefore: e.target.value || undefined })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Sort Order */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={filters.order || 'desc'}
                  label="Order"
                  onChange={(e) => handleFilterChange({ order: e.target.value })}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Results per page */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Results per page</InputLabel>
                <Select
                  value={filters.limit || 20}
                  label="Results per page"
                  onChange={(e) => handleFilterChange({ limit: Number(e.target.value) })}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              disabled={activeFiltersCount === 0}
            >
              Clear Filters
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              startIcon={<FilterListIcon />}
              disabled={!query.trim()}
            >
              Apply Filters
            </Button>
          </Box>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.genre_id && facets?.genres.find(g => g.id === filters.genre_id) && (
                  <Chip
                    label={`Genre: ${facets.genres.find(g => g.id === filters.genre_id)?.name}`}
                    size="small"
                    onDelete={() => handleFilterChange({ genre_id: undefined })}
                  />
                )}
                {filters.author && (
                  <Chip
                    label={`Author: ${filters.author}`}
                    size="small"
                    onDelete={() => handleFilterChange({ author: undefined })}
                  />
                )}
                {(filters.min_rating !== undefined || filters.max_rating !== undefined) && (
                  <Chip
                    label={`Rating: ${filters.min_rating || 0} - ${filters.max_rating || 5}`}
                    size="small"
                    onDelete={() => handleFilterChange({ min_rating: undefined, max_rating: undefined })}
                  />
                )}
                {filters.publishedAfter && (
                  <Chip
                    label={`After: ${filters.publishedAfter}`}
                    size="small"
                    onDelete={() => handleFilterChange({ publishedAfter: undefined })}
                  />
                )}
                {filters.publishedBefore && (
                  <Chip
                    label={`Before: ${filters.publishedBefore}`}
                    size="small"
                    onDelete={() => handleFilterChange({ publishedBefore: undefined })}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};
