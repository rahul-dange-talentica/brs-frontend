/**
 * GenreFilter Component
 * Dropdown filter for selecting book genres
 */

import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Genre } from '@/types';
import { booksService } from '@/services';

interface GenreFilterProps {
  value: string;
  onChange: (genreId: string) => void;
  label?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  value,
  onChange,
  label = 'Genre',
  size = 'small',
  fullWidth = true,
  variant = 'outlined'
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      
      try {
        const genres = await booksService.getGenres();
        setGenres(genres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
        // Fallback to empty array - user will see "All Genres" option only
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  // Currently not needed but keeping for potential future use
  // const selectedGenre = genres.find(genre => genre.id === value);

  return (
    <FormControl 
      fullWidth={fullWidth} 
      size={size}
      variant={variant}
      disabled={loading}
    >
      <InputLabel id="genre-filter-label">{label}</InputLabel>
      <Select
        labelId="genre-filter-label"
        id="genre-filter"
        value={value}
        label={label}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: '#999' }}>All Genres</span>;
          }
          
          const genre = genres.find(g => g.id === selected);
          return genre ? (
            <Chip
              label={genre.name}
              size="small"
              color="primary"
              variant="outlined"
            />
          ) : selected;
        }}
        startAdornment={loading && (
          <CircularProgress size={16} sx={{ mr: 1 }} />
        )}
      >
        <MenuItem value="">
          <em>All Genres</em>
        </MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {genre.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenreFilter;
