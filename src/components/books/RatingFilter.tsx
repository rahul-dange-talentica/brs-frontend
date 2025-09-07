/**
 * RatingFilter Component
 * Slider filter for selecting rating range
 */

import React from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface RatingFilterProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  label?: string;
  size?: 'small' | 'medium';
  min?: number;
  max?: number;
  step?: number;
}

const marks = [
  { value: 0, label: '0★' },
  { value: 1, label: '1★' },
  { value: 2, label: '2★' },
  { value: 3, label: '3★' },
  { value: 4, label: '4★' },
  { value: 5, label: '5★' },
];

export const RatingFilter: React.FC<RatingFilterProps> = ({
  value,
  onChange,
  label = 'Rating Range',
  size = 'medium',
  min = 0,
  max = 5,
  step = 0.5
}) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as [number, number]);
  };

  const formatValue = (val: number) => {
    return val === 0 ? 'Any' : `${val}★`;
  };

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <FormLabel component="legend" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Star color="primary" fontSize="small" />
        {label}
      </FormLabel>
      
      <Box sx={{ px: 2 }}>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatValue}
          min={min}
          max={max}
          step={step}
          marks={marks}
          size={size}
          sx={{
            color: 'primary.main',
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
              },
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'primary.main',
              '&:before': {
                color: 'primary.main',
              },
            },
          }}
        />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Min: {formatValue(value[0])}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max: {formatValue(value[1])}
          </Typography>
        </Box>
      </Box>
    </FormControl>
  );
};

export default RatingFilter;
