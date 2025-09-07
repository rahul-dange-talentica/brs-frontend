/**
 * RatingDistribution Component
 * Visual breakdown of rating distribution with bar chart
 */

import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Stack,
  Paper,
  useTheme
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

interface RatingDistributionProps {
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
  showPercentages?: boolean;
  compact?: boolean;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalReviews,
  showPercentages = true,
  compact = false
}) => {
  const theme = useTheme();

  if (totalReviews === 0) {
    return (
      <Paper
        sx={{
          p: compact ? 2 : 3,
          textAlign: 'center',
          backgroundColor: 'grey.50'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No ratings yet
        </Typography>
      </Paper>
    );
  }

  const getRatingPercentage = (count: number): number => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  const getBarColor = (rating: number): string => {
    if (rating >= 4) return theme.palette.success.main;
    if (rating >= 3) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={compact ? 0.5 : 1}>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating as keyof typeof distribution];
          const percentage = getRatingPercentage(count);
          
          return (
            <Box
              key={rating}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minHeight: compact ? 24 : 32
              }}
            >
              {/* Rating number and star */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  minWidth: compact ? 40 : 50
                }}
              >
                <Typography
                  variant={compact ? 'caption' : 'body2'}
                  sx={{
                    fontWeight: 500,
                    minWidth: '8px',
                    textAlign: 'center'
                  }}
                >
                  {rating}
                </Typography>
                <StarIcon
                  sx={{
                    fontSize: compact ? 14 : 16,
                    color: getBarColor(rating)
                  }}
                />
              </Box>

              {/* Progress bar */}
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  flexGrow: 1,
                  height: compact ? 6 : 8,
                  borderRadius: 1,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getBarColor(rating),
                    borderRadius: 1,
                  }
                }}
              />

              {/* Count and percentage */}
              <Box
                sx={{
                  minWidth: compact ? 60 : 80,
                  textAlign: 'right'
                }}
              >
                <Typography
                  variant={compact ? 'caption' : 'body2'}
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {count.toLocaleString()}
                  {showPercentages && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.disabled"
                      sx={{ ml: 0.5 }}
                    >
                      ({percentage.toFixed(0)}%)
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default RatingDistribution;
