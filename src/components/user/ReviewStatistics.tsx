/**
 * ReviewStatistics Component
 * Display statistics about user's reviews
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  RateReview as ReviewIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { Review } from '@/types/api';

interface ReviewStatisticsProps {
  reviews: Review[];
  detailed?: boolean;
  compact?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary'
}) => (
  <Card>
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <Box sx={{ color: `${color}.main`, mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main` }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export const ReviewStatistics: React.FC<ReviewStatisticsProps> = ({
  reviews,
  detailed = false,
  compact = false
}) => {
  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  // Calculate monthly reviews (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyReviews = reviews.filter(review => 
    new Date(review.createdAt) >= thirtyDaysAgo
  ).length;

  // Get most recent review date
  const mostRecentReview = totalReviews > 0 
    ? new Date(Math.max(...reviews.map(r => new Date(r.createdAt).getTime())))
    : null;

  // Calculate genre distribution (if book data is available in reviews)
  const genreCount: Record<string, number> = {};
  reviews.forEach(review => {
    // Note: This assumes review has book data with genres
    // In real implementation, you might need to fetch book data separately
    if ((review as any).book?.genres) {
      (review as any).book.genres.forEach((genre: any) => {
        genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
      });
    }
  });

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);

  if (compact) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Review Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                {totalReviews}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Reviews
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700 }}>
                {averageRating.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average Rating
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Review Statistics
      </Typography>

      {/* Main Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Total Reviews"
            value={totalReviews}
            icon={<ReviewIcon sx={{ fontSize: 32 }} />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            subtitle="stars given"
            icon={<StarIcon sx={{ fontSize: 32 }} />}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatCard
            title="This Month"
            value={monthlyReviews}
            subtitle="reviews written"
            icon={<TrendingIcon sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Latest Review"
            value={mostRecentReview ? mostRecentReview.toLocaleDateString() : 'None'}
            icon={<ChartIcon sx={{ fontSize: 32 }} />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {detailed && totalReviews > 0 && (
        <>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {/* Rating Distribution */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Rating Distribution
              </Typography>
              
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <Box key={rating} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {rating}
                        </Typography>
                        <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {count} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: 'warning.main'
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Grid>

            {/* Top Genres */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Most Reviewed Genres
              </Typography>
              
              {topGenres.length > 0 ? (
                <Stack spacing={1}>
                  {topGenres.map((genre, index) => (
                    <Box key={genre} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={genre} 
                        size="small" 
                        variant={index === 0 ? "filled" : "outlined"}
                        color={index === 0 ? "primary" : "default"}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {genreCount[genre]} reviews
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No genre data available
                </Typography>
              )}
            </Grid>
          </Grid>
        </>
      )}

      {/* Encouraging message for users with few reviews */}
      {totalReviews < 5 && (
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'primary.50', 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <ReviewIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            Keep Reviewing!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalReviews === 0 
              ? "Write your first review to see detailed statistics."
              : `You've written ${totalReviews} review${totalReviews === 1 ? '' : 's'}. Write more to unlock detailed insights!`
            }
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ReviewStatistics;
