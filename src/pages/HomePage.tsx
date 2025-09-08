/**
 * HomePage Component
 * Main landing page with featured books and personalized recommendations
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  // useMediaQuery,
  // useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPopularBooks,
  fetchTrendingBooks,
  fetchPersonalRecommendations,
  selectPopularBooks,
  selectTrendingBooks,
  selectPersonalRecommendations,
  selectPopularBooksLoading,
  selectTrendingBooksLoading,
  selectPersonalRecommendationsLoading,
} from '@/store/booksSlice';
import { selectIsAuthenticated } from '@/store/authSlice';
import { 
  addToFavorites, 
  removeFromFavorites, 
  fetchFavoriteBooks,
} from '@/store/userSlice';
import { BookDisplay } from '@/types';
import { transformBooksForDisplay } from '@/utils/bookTransformers';
import { HorizontalBookList } from '@/components/books';
import { Section } from '@/components/common';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const popularBooks = useAppSelector(selectPopularBooks);
  const trendingBooks = useAppSelector(selectTrendingBooks);
  const personalRecommendations = useAppSelector(selectPersonalRecommendations);
  const popularBooksLoading = useAppSelector(selectPopularBooksLoading);
  const trendingBooksLoading = useAppSelector(selectTrendingBooksLoading);
  const personalRecommendationsLoading = useAppSelector(selectPersonalRecommendationsLoading);

  const [displayedPopularBooks, setDisplayedPopularBooks] = useState<BookDisplay[]>([]);
  const [displayedTrendingBooks, setDisplayedTrendingBooks] = useState<BookDisplay[]>([]);
  const [displayedPersonalRecommendations, setDisplayedPersonalRecommendations] = useState<BookDisplay[]>([]);

  // Load initial data
  useEffect(() => {
    dispatch(fetchPopularBooks({ limit: 12 }));
    dispatch(fetchTrendingBooks({ limit: 12 }));
    
    if (isAuthenticated) {
      dispatch(fetchPersonalRecommendations({ limit: 12 }));
      dispatch(fetchFavoriteBooks({ skip: 0, limit: 100 })); // Load all favorites
    }
  }, [dispatch, isAuthenticated]);

  // Transform books for display
  useEffect(() => {
    setDisplayedPopularBooks(transformBooksForDisplay(popularBooks));
  }, [popularBooks]);

  useEffect(() => {
    setDisplayedTrendingBooks(transformBooksForDisplay(trendingBooks));
  }, [trendingBooks]);

  useEffect(() => {
    setDisplayedPersonalRecommendations(transformBooksForDisplay(personalRecommendations));
  }, [personalRecommendations]);

  const handleBookClick = (book: BookDisplay) => {
    navigate(`/books/${book.id}`);
  };

  const handleFavoriteToggle = async (bookId: string, isFavorite: boolean) => {
    if (!isAuthenticated) return;
    
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(bookId)).unwrap();
      } else {
        await dispatch(addToFavorites(bookId)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleViewAllBooks = () => {
    navigate('/books');
  };


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Discover Your Next Great Read
        </Typography>
        
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.4,
          }}
        >
          Personalized recommendations and trending books curated just for you
        </Typography>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Personal Recommendations Section (Authenticated Users Only) */}
      {isAuthenticated && (
        <>
          <Section>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🎯 Just For You
            </Typography>

            <HorizontalBookList
              books={displayedPersonalRecommendations}
              loading={personalRecommendationsLoading}
              onBookClick={handleBookClick}
              onFavoriteClick={handleFavoriteToggle}
              variant="compact"
              showGenres
              showFavorites={isAuthenticated}
              emptyMessage="No personal recommendations available yet"
            />
          </Section>
          <Divider sx={{ my: 6 }} />
        </>
      )}

      {/* Popular Books Section */}
      <Section>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          🔥 Popular Books
        </Typography>

        <HorizontalBookList
          books={displayedPopularBooks}
          loading={popularBooksLoading}
          onBookClick={handleBookClick}
          onFavoriteClick={handleFavoriteToggle}
          variant="compact"
          showGenres
          showFavorites={isAuthenticated}
          emptyMessage="No popular books available"
        />
      </Section>

      <Divider sx={{ my: 6 }} />

      {/* Trending Books Section */}
      <Section>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          📈 Trending Now
        </Typography>

        <HorizontalBookList
          books={displayedTrendingBooks}
          loading={trendingBooksLoading}
          onBookClick={handleBookClick}
          onFavoriteClick={handleFavoriteToggle}
          variant="compact"
          showGenres
          showFavorites={isAuthenticated}
          emptyMessage="No trending books available"
        />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleViewAllBooks}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            Discover More Books
          </Button>
        </Box>
      </Section>
    </Container>
  );
};

export default HomePage;
