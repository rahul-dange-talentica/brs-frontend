/**
 * ReviewsSummary Component
 * Displays overall rating summary with distribution and statistics
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Stack
} from '@mui/material';
import { RatingDisplay } from '@/components/books';
import { RatingDistribution } from './RatingDistribution';

interface ReviewsSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  bookTitle?: string;
  compact?: boolean;
}

export const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
  averageRating,
  totalReviews,
  ratingDistribution,
  bookTitle,
  compact = false
}) => {
  if (totalReviews === 0) {
    return (
      <Paper
        sx={{
          p: compact ? 2 : 3,
          textAlign: 'center',
          backgroundColor: 'grey.50',
          mb: 2
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Reviews Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bookTitle ? `Be the first to review "${bookTitle}"` : 'Be the first to write a review!'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: compact ? 2 : 3,
        mb: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Grid container spacing={compact ? 2 : 3} alignItems="flex-start">
        {/* Overall Rating */}
        <Grid item xs={12} sm={4}>
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Typography
              variant={compact ? 'h4' : 'h3'}
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1
              }}
            >
              {averageRating.toFixed(1)}
            </Typography>
            
            <RatingDisplay
              value={averageRating}
              size={compact ? 'medium' : 'large'}
              readOnly
              color="warning"
              precision={0.1}
            />
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Based on {totalReviews.toLocaleString()} review{totalReviews !== 1 ? 's' : ''}
            </Typography>
          </Stack>
        </Grid>

        {/* Divider for larger screens */}
        {!compact && (
          <Grid item sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Divider orientation="vertical" flexItem />
          </Grid>
        )}

        {/* Rating Distribution */}
        <Grid item xs={12} sm={compact ? 8 : 7}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: compact ? 1 : 2,
                color: 'text.primary'
              }}
            >
              Rating Breakdown
            </Typography>
            
            <RatingDistribution
              distribution={ratingDistribution}
              totalReviews={totalReviews}
              showPercentages
              compact={compact}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Additional Statistics */}
      {!compact && (
        <>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {((ratingDistribution[5] + ratingDistribution[4]) / totalReviews * 100).toFixed(0)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Positive Reviews
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {Math.max(...Object.values(ratingDistribution))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Most Common Rating
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {ratingDistribution[5]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  5-Star Reviews
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {(averageRating / 5 * 100).toFixed(0)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Overall Score
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default ReviewsSummary;
