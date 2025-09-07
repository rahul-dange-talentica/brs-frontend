/**
 * BookDetailsPage Component
 * Detailed view for individual books with reviews integration
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { NavigateNext, Home, MenuBook } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchBookById,
  setCurrentBook,
  selectCurrentBook,
  selectBooksLoading,
  selectBooksError,
} from '@/store/booksSlice';
import { BookDisplay } from '@/types';
import { transformBookForDisplay } from '@/utils/bookTransformers';
import { useRatingPolling } from '@/hooks/useRatingPolling';
import {
  BookCover,
  BookInfo,
  BookActions,
  BookMeta,
} from '@/components/books';
import { PageLoader } from '@/components/common';
import { ReviewsSection } from '@/components/reviews';

export const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentBook = useAppSelector(selectCurrentBook);
  const loading = useAppSelector(selectBooksLoading);
  const error = useAppSelector(selectBooksError);

  const [displayBook, setDisplayBook] = React.useState<BookDisplay | null>(null);

  // Real-time rating updates
  useRatingPolling(bookId || null, {
    enabled: !!bookId && !!currentBook,
  });

  // Fetch book details
  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookById(bookId));
    }
    
    return () => {
      dispatch(setCurrentBook(null));
    };
  }, [bookId, dispatch]);

  // Transform book for display
  useEffect(() => {
    if (currentBook) {
      setDisplayBook(transformBookForDisplay(currentBook));
    }
  }, [currentBook]);

  // Favorite functionality is now handled by FavoriteButton component

  const handleShareBook = (book: BookDisplay) => {
    // TODO: Implement sharing functionality
    console.log('Share book:', book);
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateBooks = () => {
    navigate('/books');
  };

  if (loading) {
    return <PageLoader message="Loading book details..." />;
  }

  if (error && !currentBook) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Link
              component="button"
              variant="body2"
              onClick={handleNavigateBooks}
              sx={{ textDecoration: 'none' }}
            >
              Browse Books
            </Link>
          }
        >
          {error === 'Book not found' ? 'Book not found' : 'Failed to load book details'}
        </Alert>
      </Container>
    );
  }

  if (!displayBook) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <BookDetailsSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          component="button"
          variant="body2"
          onClick={handleNavigateHome}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <Home fontSize="small" />
          Home
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={handleNavigateBooks}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <MenuBook fontSize="small" />
          Books
        </Link>
        <Typography variant="body2" color="text.primary">
          {displayBook.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Book Cover */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'grey.50',
            }}
          >
            <BookCover
              src={displayBook.coverImage || ''}
              alt={displayBook.title}
              width={{ xs: 200, sm: 250, md: '100%' }}
              aspectRatio="2/3"
            />
          </Paper>
        </Grid>

        {/* Book Information */}
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%' }}>
            <BookInfo
              book={displayBook}
              showFullDescription
            />
            
            <BookActions
              book={displayBook}
              onShareClick={handleShareBook}
              variant="detailed"
              showLabels
            />
          </Box>
        </Grid>
      </Grid>

      {/* Additional Book Metadata */}
      {!isMobile && (
        <>
          <Divider sx={{ my: 4 }} />
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Book Details
            </Typography>
            <BookMeta
              book={displayBook}
              variant="horizontal"
              showGenres
              showRating
            />
          </Paper>
        </>
      )}

      {/* Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>
        <ReviewsSection
          bookId={displayBook.id}
          bookTitle={displayBook.title}
          averageRating={displayBook.averageRating}
          totalReviews={displayBook.totalReviews}
          ratingDistribution={{
            5: Math.floor(displayBook.totalReviews * 0.4),
            4: Math.floor(displayBook.totalReviews * 0.3),
            3: Math.floor(displayBook.totalReviews * 0.2),
            2: Math.floor(displayBook.totalReviews * 0.08),
            1: Math.floor(displayBook.totalReviews * 0.02)
          }}
        />
      </Box>
    </Container>
  );
};

// Loading skeleton for book details
const BookDetailsSkeleton: React.FC = () => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={4}>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    </Grid>
    <Grid item xs={12} md={8}>
      <Skeleton variant="text" height={48} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={32} width="60%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={24} width="40%" sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
      </Box>
      
      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="80%" />
    </Grid>
  </Grid>
);

export default BookDetailsPage;
