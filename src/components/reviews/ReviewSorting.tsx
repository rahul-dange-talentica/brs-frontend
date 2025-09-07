/**
 * ReviewSorting Component
 * Sorting controls for reviews
 */

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack
} from '@mui/material';
import { Sort as SortIcon } from '@mui/icons-material';

export type SortOption = 'created_at' | 'rating' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

interface ReviewSortingProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
  compact?: boolean;
}

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'updated_at', label: 'Last Updated' },
  { value: 'rating', label: 'Rating' }
] as const;

const ORDER_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' }
] as const;

export const ReviewSorting: React.FC<ReviewSortingProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  compact = false
}) => {
  const handleSortByChange = (event: any) => {
    onSortChange(event.target.value as SortOption, sortOrder);
  };

  const handleSortOrderChange = (event: any) => {
    onSortChange(sortBy, event.target.value as SortOrder);
  };

  if (compact) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <SortIcon fontSize="small" color="action" />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortOption, SortOrder];
              onSortChange(newSortBy, newSortOrder);
            }}
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="created_at-desc">Newest First</MenuItem>
            <MenuItem value="created_at-asc">Oldest First</MenuItem>
            <MenuItem value="rating-desc">Highest Rated</MenuItem>
            <MenuItem value="rating-asc">Lowest Rated</MenuItem>
            <MenuItem value="updated_at-desc">Recently Updated</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SortIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Sort by:
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={handleSortByChange}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder}
            label="Order"
            onChange={handleSortOrderChange}
          >
            {ORDER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default ReviewSorting;
