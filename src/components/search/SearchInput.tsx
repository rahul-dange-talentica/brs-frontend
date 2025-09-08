import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { debounce } from '@/utils/debounce';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  debounceDelay?: number;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  onFocus,
  onBlur,
  placeholder = "Search books, authors, genres...",
  loading = false,
  disabled = false,
  autoFocus = false,
  debounceDelay = 300,
  className,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounced onChange function
  const debouncedOnChange = useCallback(
    debounce((searchValue: string) => {
      onChange(searchValue);
    }, debounceDelay),
    [onChange, debounceDelay]
  );

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Handle clear button
  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle search button or Enter key
  const handleSearch = () => {
    if (localValue.trim()) {
      onSearch(localValue.trim());
    }
  };

  // Handle key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <Box className={className}>
      <TextField
        ref={inputRef}
        fullWidth
        value={localValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading && (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              )}
              {localValue && !loading && (
                <IconButton
                  onClick={handleClear}
                  size="small"
                  sx={{ mr: 0.5 }}
                  aria-label="Clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                onClick={handleSearch}
                disabled={!localValue.trim() || loading}
                size="small"
                color="primary"
                aria-label="Search"
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-focused': {
              backgroundColor: 'background.paper',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '1rem',
            padding: '12px 0',
          },
        }}
      />
    </Box>
  );
};
