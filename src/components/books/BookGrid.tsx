/**
 * BookGrid Component
 * Grid layout for displaying book cards
 */

import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Skeleton,
  Container,
} from '@mui/material';
import { BookDisplay } from '@/types';
import { BookCard } from './BookCard';
import { useMultipleRatingPolling } from '@/hooks/useRatingPolling';

interface BookGridProps {
  books: BookDisplay[];
  loading?: boolean;
  onBookClick?: (book: BookDisplay) => void;
  onFavoriteClick?: (bookId: string) => void;
  onShareClick?: (book: BookDisplay) => void;
  showFavorites?: boolean;
  showGenres?: boolean;
  variant?: 'compact' | 'detailed';
  favoriteBooks?: string[];
  emptyMessage?: string;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const BookGridSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Box sx={{ height: '100%' }}>
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 1, mb: 1 }}
          />
          <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={16} width="60%" />
        </Box>
      </Grid>
    ))}
  </>
);

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  loading = false,
  onBookClick,
  onFavoriteClick,
  onShareClick,
  showFavorites = false,
  showGenres = false,
  variant = 'compact',
  favoriteBooks = [],
  emptyMessage = 'No books found',
  maxWidth = 'lg'
}) => {
  const bookIds = books.map(book => book.id);
  
  // Enable real-time rating polling for displayed books
  useMultipleRatingPolling(bookIds, {
    enabled: books.length > 0,
  });

  const getGridColumns = () => {
    if (variant === 'detailed') {
      return {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
        xl: 3
      };
    }
    return {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
      xl: 2
    };
  };

  const gridColumns = getGridColumns();

  const content = (
    <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
      {loading ? (
        <BookGridSkeleton count={12} />
      ) : books.length > 0 ? (
        books.map((book) => (
          <Grid item {...gridColumns} key={book.id}>
            <BookCard
              book={book}
              onClick={onBookClick}
              onFavoriteClick={onFavoriteClick}
              onShareClick={onShareClick}
              showFavorite={showFavorites}
              showGenre={showGenres}
              variant={variant}
              isFavorite={favoriteBooks.includes(book.id)}
            />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              textAlign: 'center',
              py: 4,
            }}
          >
            <Typography 
              variant="h5" 
              color="text.secondary" 
              gutterBottom
            >
              📚
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {emptyMessage}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.disabled"
            >
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );

  if (maxWidth === false) {
    return content;
  }

  return (
    <Container maxWidth={maxWidth} sx={{ py: 2 }}>
      {content}
    </Container>
  );
};

export default BookGrid;
