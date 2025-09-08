import React from 'react';
import {
  Box,
  Grid,
  List,
  ListItem,
  Skeleton,
  Typography,
  Pagination,
} from '@mui/material';
import { Book } from '@/types/api';
import { BookCard } from '@/components/books/BookCard';
import { BookListItem } from '@/components/books/BookListItem';
import { transformBookForDisplay } from '@/utils/bookTransformers';

export interface SearchResultsListProps {
  results: Book[];
  loading?: boolean;
  viewMode?: 'list' | 'grid';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBookClick?: (book: Book) => void;
  searchQuery?: string;
  className?: string;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  loading = false,
  viewMode = 'grid',
  currentPage,
  totalPages,
  onPageChange,
  onBookClick,
  className,
}) => {

  // Loading skeleton
  if (loading) {
    return (
      <Box className={className}>
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {[...Array(12)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box>
                  <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" height={20} width="60%" />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <List>
            {[...Array(10)].map((_, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
                  <Skeleton variant="rectangular" width={80} height={120} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={16} width="40%" />
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    );
  }

  // No results
  if (!loading && results.length === 0) {
    return null; // SearchEmptyState should be handled by parent
  }

  return (
    <Box className={className}>
      {/* Results Display */}
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {results.map((book) => {
              const bookDisplay = transformBookForDisplay(book);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <BookCard
                    book={bookDisplay}
                    onClick={() => onBookClick?.(book)}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
            {results.map((book, index) => {
              const bookDisplay = transformBookForDisplay(book);
              return (
                <React.Fragment key={book.id}>
                  <ListItem sx={{ py: 2 }}>
                    <BookListItem
                      book={bookDisplay}
                      onClick={() => onBookClick?.(book)}
                    />
                  </ListItem>
                  {index < results.length - 1 && (
                    <Box sx={{ mx: 2, borderBottom: 1, borderColor: 'divider' }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4,
          mb: 2,
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '1rem',
              },
            }}
          />
        </Box>
      )}

      {/* Results Summary */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: 2,
      }}>
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages}
        </Typography>
      </Box>
    </Box>
  );
};
