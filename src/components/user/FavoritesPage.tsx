/**
 * FavoritesPage Component
 * Complete page for managing user's favorite books
 */

import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchFavoriteBooks,
  selectFavoriteBooks,
  selectFavoritesLoading,
  selectUserError
} from '@/store/userSlice';
import { FavoritesList } from './FavoritesList';
import { PageLoader } from '@/components/common';

export const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const favoriteBooks = useAppSelector(selectFavoriteBooks);
  const loading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectUserError);

  // Load favorite books on component mount
  useEffect(() => {
    if (user && isAuthenticated) {
      dispatch(fetchFavoriteBooks({ skip: 0, limit: 100 }));
    }
  }, [user, isAuthenticated, dispatch]);

  // Show loading state for unauthenticated users
  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Please log in to view your favorite books.
        </Alert>
      </Container>
    );
  }

  // Show loading state
  if (loading && favoriteBooks.length === 0) {
    return <PageLoader message="Loading your favorite books..." />;
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          My Favorite Books
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Books you've marked as favorites
        </Typography>
      </Box>

      {/* Favorites List */}
      <FavoritesList
        books={favoriteBooks}
        showFilters={true}
        gridCols={4}
        emptyTitle="No Favorite Books Yet"
        emptyDescription="Start exploring our book collection and add books you love to your favorites!"
      />

      {/* Loading indicator for additional data */}
      {loading && favoriteBooks.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Updating favorites...
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;
