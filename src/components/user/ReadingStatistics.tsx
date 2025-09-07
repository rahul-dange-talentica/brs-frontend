/**
 * ReadingStatistics Component
 * Display user reading statistics with visual metrics
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
  Favorite as FavoriteIcon,
  TrendingUp as TrendingIcon,
  LocalLibrary as LibraryIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { UserStatistics } from '../user/types';

interface ReadingStatisticsProps {
  statistics: UserStatistics | null;
  compact?: boolean;
  showTitle?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend
}) => (
  <Card sx={{ height: '100%', position: 'relative' }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main`, mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: `${color}.main`, opacity: 0.7 }}>
          {icon}
        </Box>
      </Box>
      
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <TrendingIcon 
            sx={{ 
              fontSize: 14, 
              mr: 0.5, 
              color: trend.isPositive ? 'success.main' : 'error.main',
              transform: trend.isPositive ? 'none' : 'rotate(180deg)'
            }} 
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: trend.isPositive ? 'success.main' : 'error.main',
              fontWeight: 600
            }}
          >
            {trend.isPositive ? '+' : ''}{trend.value}% this month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export const ReadingStatistics: React.FC<ReadingStatisticsProps> = ({
  statistics,
  compact = false,
  showTitle = true
}) => {
  // Default statistics if none provided
  const stats = statistics || {
    totalReviews: 0,
    averageRating: 0,
    favoriteBooks: 0,
    monthlyReviews: 0,
    topGenres: []
  };

  // Calculate derived statistics
  const hasReviews = stats.totalReviews > 0;
  const topGenre = stats.topGenres?.[0] || 'None';
  const reviewsThisMonth = stats.monthlyReviews || 0;

  // Mock trend data (in real app, this would come from historical data)
  const mockTrends = {
    reviews: { value: 12, isPositive: true },
    rating: { value: 5, isPositive: true },
    favorites: { value: 8, isPositive: true }
  };

  if (compact) {
    return (
      <Paper sx={{ p: 2 }}>
        {showTitle && (
          <Typography variant="h6" gutterBottom>
            Quick Stats
          </Typography>
        )}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                {stats.totalReviews}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Reviews
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 700 }}>
                {stats.favoriteBooks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Favorites
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700 }}>
                {hasReviews ? stats.averageRating.toFixed(1) : '0.0'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Rating
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
                {reviewsThisMonth}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This Month
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {showTitle && (
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Reading Statistics
        </Typography>
      )}

      {/* Main Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<ReviewIcon sx={{ fontSize: 32 }} />}
            color="primary"
            trend={stats.totalReviews > 0 ? mockTrends.reviews : undefined}
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Average Rating"
            value={hasReviews ? stats.averageRating.toFixed(1) : '0.0'}
            subtitle="stars given"
            icon={<StarIcon sx={{ fontSize: 32 }} />}
            color="warning"
            trend={hasReviews ? mockTrends.rating : undefined}
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Favorite Books"
            value={stats.favoriteBooks}
            icon={<FavoriteIcon sx={{ fontSize: 32 }} />}
            color="secondary"
            trend={stats.favoriteBooks > 0 ? mockTrends.favorites : undefined}
          />
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatCard
            title="This Month"
            value={reviewsThisMonth}
            subtitle="reviews written"
            icon={<LibraryIcon sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Additional Insights */}
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {/* Reading Preferences */}
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Reading Preferences
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Favorite Genre</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {topGenre}
                </Typography>
              </Box>
              {topGenre !== 'None' && (
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              )}
            </Box>

            {stats.topGenres.length > 1 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {stats.topGenres.slice(0, 3).map((genre, index) => (
                  <Chip 
                    key={genre}
                    label={genre} 
                    size="small" 
                    variant={index === 0 ? "filled" : "outlined"}
                    color={index === 0 ? "primary" : "default"}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Grid>

        {/* Activity Level */}
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Activity Level
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrophyIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {reviewsThisMonth >= 5 ? 'Active Reader' : 
                   reviewsThisMonth >= 2 ? 'Regular Reader' : 
                   reviewsThisMonth >= 1 ? 'Casual Reader' : 'Getting Started'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Based on recent activity
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Monthly Goal Progress</Typography>
                <Typography variant="caption">{reviewsThisMonth}/5</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((reviewsThisMonth / 5) * 100, 100)} 
                sx={{ height: 6, borderRadius: 3 }}
                color={reviewsThisMonth >= 5 ? 'success' : 'primary'}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Encouraging Message for New Users */}
      {stats.totalReviews === 0 && (
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'primary.50', 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <LibraryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            Start Your Reading Journey!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Write your first review to see your reading statistics come to life.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ReadingStatistics;
