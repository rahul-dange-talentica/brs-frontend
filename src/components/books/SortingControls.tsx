/**
 * SortingControls Component
 * Controls for sorting book results
 */

import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import {
  Sort,
  SortByAlpha,
  Star,
  CalendarToday,
  TrendingUp,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';

type SortOption = 'title' | 'author' | 'average_rating' | 'publication_date' | 'created_at';
type SortOrder = 'asc' | 'desc';

interface SortingControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
  variant?: 'full' | 'compact';
  size?: 'small' | 'medium';
}

const sortOptions: Array<{
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'title', label: 'Title', icon: <SortByAlpha /> },
  { value: 'author', label: 'Author', icon: <Sort /> },
  { value: 'average_rating', label: 'Rating', icon: <Star /> },
  { value: 'publication_date', label: 'Publication Date', icon: <CalendarToday /> },
  { value: 'created_at', label: 'Recently Added', icon: <TrendingUp /> },
];

export const SortingControls: React.FC<SortingControlsProps> = ({
  sortBy,
  sortOrder,
  onChange,
  variant = 'full',
  size = 'small'
}) => {
  const handleSortByChange = (event: SelectChangeEvent<SortOption>) => {
    onChange(event.target.value as SortOption, sortOrder);
  };

  const handleSortOrderChange = (_event: React.MouseEvent<HTMLElement>, newOrder: SortOrder) => {
    if (newOrder !== null) {
      onChange(sortBy, newOrder);
    }
  };

  const selectedOption = sortOptions.find(option => option.value === sortBy);

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl size={size} sx={{ minWidth: 120 }}>
          <InputLabel id="sort-by-label">Sort by</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            label="Sort by"
            onChange={handleSortByChange}
            startAdornment={selectedOption?.icon}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {option.icon}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={sortOrder}
          exclusive
          onChange={handleSortOrderChange}
          size={size}
        >
          <ToggleButton value="asc" aria-label="ascending">
            <KeyboardArrowUp />
          </ToggleButton>
          <ToggleButton value="desc" aria-label="descending">
            <KeyboardArrowDown />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Sort color="action" />
        Sort Options
      </Typography>
      
      <FormControl fullWidth size={size}>
        <InputLabel id="sort-by-full-label">Sort by</InputLabel>
        <Select
          labelId="sort-by-full-label"
          value={sortBy}
          label="Sort by"
          onChange={handleSortByChange}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {option.icon}
                <Box>
                  <Typography variant="body2">{option.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.value === 'title' && 'Alphabetical order'}
                    {option.value === 'author' && 'By author name'}
                    {option.value === 'average_rating' && 'By user ratings'}
                    {option.value === 'publication_date' && 'By publish date'}
                    {option.value === 'created_at' && 'Latest additions'}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Order
        </Typography>
        <ToggleButtonGroup
          value={sortOrder}
          exclusive
          onChange={handleSortOrderChange}
          fullWidth
          size={size}
        >
          <ToggleButton value="asc" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyboardArrowUp />
            {sortBy === 'title' || sortBy === 'author' ? 'A to Z' : 
             sortBy === 'average_rating' ? 'Low to High' :
             'Oldest First'}
          </ToggleButton>
          <ToggleButton value="desc" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyboardArrowDown />
            {sortBy === 'title' || sortBy === 'author' ? 'Z to A' : 
             sortBy === 'average_rating' ? 'High to Low' :
             'Newest First'}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default SortingControls;
