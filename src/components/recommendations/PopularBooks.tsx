import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPopularBooks,
  selectPopularBooks,
  selectPopularBooksLoading,
  selectBooksError,
} from '@/store/booksSlice';
import { Book } from '@/types/api';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationCarousel } from './RecommendationCarousel';

export interface PopularBooksProps {
  limit?: number;
  onBookClick?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  getFavoriteStatus?: (bookId: string) => boolean;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export const PopularBooks: React.FC<PopularBooksProps> = ({
  limit = 12,
  onBookClick,
  onToggleFavorite,
  getFavoriteStatus,
  showHeader = true,
  compact = false,
  className,
}) => {
  const dispatch = useAppDispatch();
  const popularBooks = useAppSelector(selectPopularBooks);
  const loading = useAppSelector(selectPopularBooksLoading);
  const error = useAppSelector(selectBooksError);

  // Fetch popular books on mount
  useEffect(() => {
    if (popularBooks.length === 0) {
      dispatch(fetchPopularBooks({ limit }));
    }
  }, [dispatch, limit, popularBooks.length]);

  // Refresh popular books
  const handleRefresh = () => {
    dispatch(fetchPopularBooks({ limit }));
  };

  // Get recommendation reason for popular books
  const getRecommendationReason = (book: Book): string => {
    const rating = parseFloat(book.average_rating) || 0;
    const reviews = book.total_reviews || 0;
    
    if (rating >= 4.5 && reviews >= 100) {
      return `Highly rated (${rating.toFixed(1)}/5) with ${reviews.toLocaleString()} reviews`;
    } else if (rating >= 4.0) {
      return `Popular choice with ${rating.toFixed(1)}/5 stars`;
    } else if (reviews >= 500) {
      return `Trending with ${reviews.toLocaleString()} reader reviews`;
    } else {
      return 'Popular among readers';
    }
  };

  // Loading state
  if (loading && popularBooks.length === 0) {
    return (
      <Box className={className}>
        {showHeader && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Popular Books
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Most loved books by our community
            </Typography>
          </Box>
        )}
        
        <RecommendationCarousel>
          {[...Array(6)].map((_, index) => (
            <Box key={index}>
              <Skeleton variant="rectangular" height={compact ? 180 : 200} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} width="60%" />
            </Box>
          ))}
        </RecommendationCarousel>
      </Box>
    );
  }

  // Error state
  if (error && popularBooks.length === 0) {
    return (
      <Paper 
        className={className}
        sx={{ p: 3, textAlign: 'center', backgroundColor: 'error.light', color: 'error.contrastText' }}
      >
        <Typography variant="h6" gutterBottom>
          Unable to load popular books
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          sx={{ backgroundColor: 'error.dark' }}
        >
          Try Again
        </Button>
      </Paper>
    );
  }

  // No data state
  if (!loading && popularBooks.length === 0) {
    return (
      <Paper 
        className={className}
        sx={{ p: 3, textAlign: 'center' }}
      >
        <TrendingUpIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No popular books available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Check back later for trending books
        </Typography>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
      </Paper>
    );
  }

  return (
    <Box className={className}>
      {showHeader && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'error.main' }} />
              Popular Books
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Most loved books by our community • Updated daily
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      )}

      <RecommendationCarousel 
        itemWidth={compact ? 160 : 200}
        showControls={popularBooks.length > 4}
      >
        {popularBooks.map((book) => (
          <RecommendationCard
            key={book.id}
            book={book}
            type="popular"
            reason={getRecommendationReason(book)}
            onViewDetails={onBookClick}
            onToggleFavorite={onToggleFavorite}
            isFavorite={getFavoriteStatus?.(book.id) || false}
            compact={compact}
          />
        ))}
      </RecommendationCarousel>

      {loading && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Updating popular books...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
