/**
 * StarRatingInput Component
 * Interactive star rating input for review forms
 */

import React from 'react';
import { Box, Rating, Typography, FormHelperText } from '@mui/material';
import { Star, StarOutlined } from '@mui/icons-material';

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  precision?: number; // 0.5 for half stars, 1 for full stars
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  hover?: boolean;
  showLabels?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair', 
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  precision = 1,
  label,
  required = false,
  error = false,
  helperText,
  disabled = false,
  hover = true,
  showLabels = true
}) => {
  const [hoverValue, setHoverValue] = React.useState<number>(-1);

  const handleChange = (_: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (_: React.SyntheticEvent, newHover: number) => {
    if (!readOnly && !disabled && hover) {
      setHoverValue(newHover);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(-1);
  };

  const displayValue = hoverValue !== -1 ? hoverValue : value;
  const labelText = showLabels && displayValue > 0 ? RATING_LABELS[Math.ceil(displayValue)] : '';

  return (
    <Box>
      {label && (
        <Typography
          component="legend"
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 500,
            color: error ? 'error.main' : 'text.primary'
          }}
        >
          {label}{required && ' *'}
        </Typography>
      )}
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Rating
          value={value}
          onChange={handleChange}
          onChangeActive={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          precision={precision}
          size={size}
          readOnly={readOnly}
          disabled={disabled}
          icon={<Star fontSize="inherit" />}
          emptyIcon={<StarOutlined fontSize="inherit" />}
          sx={{
            fontSize: size === 'large' ? '2.5rem' : size === 'medium' ? '2rem' : '1.5rem',
            color: error ? 'error.main' : 'warning.main',
            '& .MuiRating-iconFilled': {
              color: error ? 'error.main' : 'warning.main',
            },
            '& .MuiRating-iconEmpty': {
              color: error ? 'error.light' : 'action.disabled',
            },
            '& .MuiRating-iconHover': {
              color: error ? 'error.dark' : 'warning.dark',
            },
            ...(disabled && {
              opacity: 0.6,
              cursor: 'not-allowed'
            })
          }}
        />
        
        {showLabels && labelText && (
          <Typography
            variant="body2"
            color={error ? 'error.main' : 'text.secondary'}
            sx={{
              minWidth: '80px',
              fontWeight: 500,
              fontSize: size === 'large' ? '1rem' : size === 'medium' ? '0.875rem' : '0.75rem'
            }}
          >
            {labelText}
          </Typography>
        )}
      </Box>
      
      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default StarRatingInput;
