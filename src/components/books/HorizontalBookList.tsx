/**
 * HorizontalBookList Component
 * Horizontally scrollable book list showing 4 books per row
 */

import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { BookDisplay } from '@/types';
import { BookCard } from './BookCard';

interface HorizontalBookListProps {
  books: BookDisplay[];
  loading?: boolean;
  onBookClick?: (book: BookDisplay) => void;
  onFavoriteClick?: (bookId: string, isFavorite: boolean) => Promise<void>;
  variant?: 'compact' | 'detailed';
  showGenres?: boolean;
  showFavorites?: boolean;
  emptyMessage?: string;
}

export const HorizontalBookList: React.FC<HorizontalBookListProps> = ({
  books,
  loading = false,
  onBookClick,
  variant = 'compact',
  showGenres = true,
  showFavorites = false,
  emptyMessage = 'No books available',
}) => {
  // const theme = useTheme();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 * 4; // Width of 4 cards plus gaps
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                minWidth: 280,
                height: 420,
                bgcolor: 'grey.100',
                borderRadius: 2,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.7 },
                  '50%': { opacity: 1 },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (books.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary',
        }}
      >
        {emptyMessage}
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Left scroll button */}
      <IconButton
        onClick={() => scroll('left')}
        sx={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          boxShadow: 2,
          zIndex: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: 4,
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Right scroll button */}
      <IconButton
        onClick={() => scroll('right')}
        sx={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          boxShadow: 2,
          zIndex: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: 4,
          },
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* Scrollable container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          pb: 1,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'grey.100',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.400',
            borderRadius: 4,
            '&:hover': {
              bgcolor: 'grey.600',
            },
          },
        }}
      >
        {books.map((book) => {
          return (
            <Box
              key={book.id}
              sx={{
                minWidth: 280,
                maxWidth: 280,
              }}
            >
              <BookCard
                book={book}
                onClick={onBookClick}
                variant={variant}
                showGenre={showGenres}
                showFavorite={showFavorites}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default HorizontalBookList;
