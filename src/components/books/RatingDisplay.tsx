/**
 * RatingDisplay Component
 * Displays star ratings with customizable appearance
 */

import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

interface RatingDisplayProps {
  value: number;
  max?: number;
  precision?: number;
  size?: 'small' | 'medium' | 'large';
  readOnly?: boolean;
  showValue?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  onChange?: (value: number | null) => void;
  color?: 'primary' | 'secondary' | 'warning';
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  value,
  max = 5,
  precision = 0.1,
  size = 'small',
  readOnly = true,
  showValue = false,
  showCount = false,
  reviewCount,
  onChange,
  color = 'warning'
}) => {
  const displayValue = Math.min(Math.max(value || 0, 0), max);
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Rating
        value={displayValue}
        max={max}
        precision={precision}
        size={size}
        readOnly={readOnly}
        onChange={(_, newValue) => onChange?.(newValue)}
        icon={<Star fontSize="inherit" />}
        emptyIcon={<StarBorder fontSize="inherit" />}
        sx={{
          color: `${color}.main`,
          '& .MuiRating-iconFilled': {
            color: `${color}.main`,
          },
          '& .MuiRating-iconEmpty': {
            color: 'action.disabled',
          },
        }}
      />
      
      {showValue && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            minWidth: '2ch',
            fontWeight: 500,
            fontSize: size === 'large' ? '1rem' : 
                     size === 'medium' ? '0.875rem' : '0.75rem'
          }}
        >
          {displayValue.toFixed(1)}
        </Typography>
      )}
      
      {showCount && reviewCount !== undefined && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: size === 'large' ? '0.875rem' : 
                     size === 'medium' ? '0.75rem' : '0.6875rem',
          }}
        >
          ({reviewCount.toLocaleString()})
        </Typography>
      )}
    </Box>
  );
};

export default RatingDisplay;
