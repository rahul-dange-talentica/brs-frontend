import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSimilarBooks,
  selectSimilarBooks,
  selectSimilarBooksLoading,
} from '@/store/booksSlice';
import { Book } from '@/types/api';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationCarousel } from './RecommendationCarousel';

export interface SimilarBooksProps {
  bookId: string;
  currentBook?: Book;
  limit?: number;
  onBookClick?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  getFavoriteStatus?: (bookId: string) => boolean;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export const SimilarBooks: React.FC<SimilarBooksProps> = ({
  bookId,
  currentBook,
  limit = 8,
  onBookClick,
  onToggleFavorite,
  getFavoriteStatus,
  showHeader = true,
  compact = false,
  className,
}) => {
  const dispatch = useAppDispatch();
  const similarBooks = useAppSelector(selectSimilarBooks);
  const loading = useAppSelector(selectSimilarBooksLoading);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchSimilarBooks({ bookId, limit }));
    }
  }, [dispatch, bookId, limit]);

  const handleRefresh = () => {
    if (bookId) {
      dispatch(fetchSimilarBooks({ bookId, limit }));
    }
  };

  const getRecommendationReason = (book: Book): string => {
    if (currentBook?.genres && book.genres) {
      const commonGenres = currentBook.genres.filter(genre1 => 
        book.genres!.some(genre2 => genre2.id === genre1.id)
      );
      if (commonGenres.length > 0) {
        return `Similar ${commonGenres[0].name} book`;
      }
    }
    
    if (currentBook?.author === book.author) {
      return `By the same author: ${book.author}`;
    }
    
    return 'Readers also enjoyed';
  };

  if (loading && similarBooks.length === 0) {
    return (
      <Box className={className}>
        {showHeader && (
          <Typography variant="h5" component="h2" gutterBottom>
            <AutoAwesomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Similar Books
          </Typography>
        )}
        <RecommendationCarousel>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={compact ? 180 : 200} />
          ))}
        </RecommendationCarousel>
      </Box>
    );
  }

  if (!loading && similarBooks.length === 0) {
    return null; // Don't show if no similar books
  }

  return (
    <Box className={className}>
      {showHeader && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            <AutoAwesomeIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
            Similar Books
          </Typography>
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
        showControls={similarBooks.length > 4}
      >
        {similarBooks.map((book) => (
          <RecommendationCard
            key={book.id}
            book={book}
            type="similar"
            reason={getRecommendationReason(book)}
            onViewDetails={onBookClick}
            onToggleFavorite={onToggleFavorite}
            isFavorite={getFavoriteStatus?.(book.id) || false}
            compact={compact}
          />
        ))}
      </RecommendationCarousel>
    </Box>
  );
};
