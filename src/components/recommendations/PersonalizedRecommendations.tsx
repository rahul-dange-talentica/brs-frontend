import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Skeleton,
  Paper,
  Alert,
} from '@mui/material';
import {
  PersonOutline as PersonOutlineIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPersonalRecommendations,
  selectPersonalRecommendations,
  selectPersonalRecommendationsLoading,
  selectBooksError,
} from '@/store/booksSlice';
import { selectIsAuthenticated } from '@/store/authSlice';
import { selectUserReviews, selectFavoriteBooks } from '@/store/userSlice';
import { Book } from '@/types/api';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationCarousel } from './RecommendationCarousel';

export interface PersonalizedRecommendationsProps {
  limit?: number;
  onBookClick?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  getFavoriteStatus?: (bookId: string) => boolean;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  limit = 12,
  onBookClick,
  onToggleFavorite,
  getFavoriteStatus,
  showHeader = true,
  compact = false,
  className,
}) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const personalRecommendations = useAppSelector(selectPersonalRecommendations);
  const loading = useAppSelector(selectPersonalRecommendationsLoading);
  const error = useAppSelector(selectBooksError);
  const userReviews = useAppSelector(selectUserReviews);
  const favoriteBooks = useAppSelector(selectFavoriteBooks);

  // Analyze user preferences for better recommendation reasons
  const userPreferences = useMemo(() => {
    if (!isAuthenticated || userReviews.length === 0) return null;

    // Calculate average rating preference
    const avgRatingPreference = userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length;
    
    // Get favorite genres from reviews and favorites
    const genreFrequency = new Map<string, number>();
    
    // Note: Current Review type doesn't include book data
    // This would need API enhancement to include book genres in review responses
    // userReviews.forEach(review => {
    //   if (review.book?.genres) {
    //     review.book.genres.forEach(genre => {
    //       genreFrequency.set(genre, (genreFrequency.get(genre) || 0) + review.rating);
    //     });
    //   }
    // });
    
    favoriteBooks.forEach(book => {
      if (book.genres) {
        book.genres.forEach(genre => {
          genreFrequency.set(genre.name, (genreFrequency.get(genre.name) || 0) + 5); // Favorites get max weight
        });
      }
    });
    
    // Get top genres
    const topGenres = Array.from(genreFrequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    return {
      avgRatingPreference,
      topGenres,
      totalReviews: userReviews.length,
      totalFavorites: favoriteBooks.length,
    };
  }, [isAuthenticated, userReviews, favoriteBooks]);

  // Fetch personalized recommendations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && personalRecommendations.length === 0) {
      dispatch(fetchPersonalRecommendations({ limit }));
    }
  }, [dispatch, isAuthenticated, limit, personalRecommendations.length]);

  // Refresh recommendations
  const handleRefresh = () => {
    if (isAuthenticated) {
      dispatch(fetchPersonalRecommendations({ limit }));
    }
  };

  // Get personalized recommendation reason
  const getRecommendationReason = (book: Book): string => {
    if (!userPreferences) return 'Recommended for you';
    
    const bookGenres = book.genres?.map(g => g.name) || [];
    const matchingGenres = bookGenres.filter(genre => userPreferences.topGenres.includes(genre));
    const bookRating = parseFloat(book.average_rating) || 0;
    
    if (matchingGenres.length > 0) {
      return `Because you enjoy ${matchingGenres[0]} books`;
    }
    
    if (bookRating >= userPreferences.avgRatingPreference) {
      return `Highly rated book (${bookRating.toFixed(1)} stars) matching your preferences`;
    }
    
    if (userPreferences.totalReviews >= 5) {
      return 'Based on your reading history';
    }
    
    return 'Recommended for you';
  };

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <Paper className={className} sx={{ p: 4, textAlign: 'center' }}>
        <PersonOutlineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Personalized Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Sign in to get personalized book recommendations based on your reading history and preferences.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/login"
          startIcon={<LoginIcon />}
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>
      </Paper>
    );
  }

  // Insufficient data state
  if (isAuthenticated && userPreferences && userPreferences.totalReviews === 0 && userPreferences.totalFavorites === 0) {
    return (
      <Box className={className}>
        {showHeader && (
          <Typography variant="h5" component="h2" gutterBottom>
            <PersonOutlineIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'secondary.main' }} />
            Personalized Recommendations
          </Typography>
        )}
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            We need more information about your preferences to provide personalized recommendations. 
            Try rating some books or adding them to your favorites!
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Loading state
  if (loading && personalRecommendations.length === 0) {
    return (
      <Box className={className}>
        {showHeader && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              <PersonOutlineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Personalized Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Curated just for you based on your reading preferences
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
  if (error && personalRecommendations.length === 0) {
    return (
      <Paper 
        className={className}
        sx={{ p: 3, textAlign: 'center', backgroundColor: 'error.light', color: 'error.contrastText' }}
      >
        <Typography variant="h6" gutterBottom>
          Unable to load personalized recommendations
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

  // No recommendations state
  if (!loading && personalRecommendations.length === 0) {
    return (
      <Box className={className}>
        {showHeader && (
          <Typography variant="h5" component="h2" gutterBottom>
            <PersonOutlineIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'secondary.main' }} />
            Personalized Recommendations
          </Typography>
        )}
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <PersonOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No personalized recommendations available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We're working on finding the perfect books for you. Check back soon!
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Paper>
      </Box>
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
              <PersonOutlineIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'secondary.main' }} />
              Recommended for You
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userPreferences ? (
                `Based on your ${userPreferences.totalReviews} reviews and ${userPreferences.totalFavorites} favorites`
              ) : (
                'Curated just for you based on your reading preferences'
              )}
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
        showControls={personalRecommendations.length > 4}
      >
        {personalRecommendations.map((book) => (
          <RecommendationCard
            key={book.id}
            book={book}
            type="personalized"
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
            Updating your recommendations...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
