/**
 * FilterPanel Component
 * Main filtering interface for books
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { SearchFilters } from '@/types';
import { GenreFilter } from './GenreFilter';
import { RatingFilter } from './RatingFilter';
import { SortingControls } from './SortingControls';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  variant?: 'sidebar' | 'horizontal' | 'drawer';
  showTitle?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  variant = 'horizontal',
  showTitle = true,
  collapsible = false,
  defaultExpanded = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleGenreChange = (genreId: string) => {
    onChange({ genreId: genreId || undefined });
  };

  const handleRatingChange = (range: [number, number]) => {
    onChange({
      minRating: range[0] === 0 ? undefined : range[0],
      maxRating: range[1] === 5 ? undefined : range[1],
    });
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy'], sortOrder: SearchFilters['sortOrder']) => {
    onChange({ sortBy, sortOrder });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.genreId ||
      filters.minRating ||
      filters.maxRating !== 5 ||
      filters.sortBy !== 'created_at' ||
      filters.sortOrder !== 'desc'
    );
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const renderFilters = () => {
    const ratingRange: [number, number] = [
      filters.minRating || 0,
      filters.maxRating || 5
    ];

    if (variant === 'sidebar') {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <GenreFilter
            value={filters.genreId || ''}
            onChange={handleGenreChange}
            fullWidth
          />
          
          <Divider />
          
          <RatingFilter
            value={ratingRange}
            onChange={handleRatingChange}
          />
          
          <Divider />
          
          <SortingControls
            sortBy={filters.sortBy || 'created_at'}
            sortOrder={filters.sortOrder || 'desc'}
            onChange={handleSortChange}
            variant="full"
          />
        </Box>
      );
    }

    return (
      <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-end">
        <Grid item xs={12} sm={6} md={3}>
          <GenreFilter
            value={filters.genreId || ''}
            onChange={handleGenreChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ px: 1 }}>
            <RatingFilter
              value={ratingRange}
              onChange={handleRatingChange}
              size="small"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <SortingControls
            sortBy={filters.sortBy || 'created_at'}
            sortOrder={filters.sortOrder || 'desc'}
            onChange={handleSortChange}
            variant="compact"
          />
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Clear />}
              onClick={onReset}
              disabled={!hasActiveFilters()}
              fullWidth={isMobile}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const content = (
    <>
      {showTitle && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
            }}
          >
            <FilterList color="primary" />
            Filters & Sorting
            {hasActiveFilters() && (
              <Typography
                component="span"
                variant="caption"
                color="primary.main"
                sx={{
                  backgroundColor: 'primary.light',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  ml: 1,
                }}
              >
                Active
              </Typography>
            )}
          </Typography>
          
          {collapsible && (
            <IconButton onClick={toggleExpanded} size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>
      )}

      {collapsible ? (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {renderFilters()}
        </Collapse>
      ) : (
        renderFilters()
      )}
    </>
  );

  if (variant === 'sidebar') {
    return (
      <Box sx={{ p: 2 }}>
        {content}
      </Box>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 2,
      }}
    >
      {content}
    </Paper>
  );
};

export default FilterPanel;
