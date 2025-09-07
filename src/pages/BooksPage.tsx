/**
 * BooksPage Component
 * Dedicated page for advanced book browsing with comprehensive filtering
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Fab,
} from '@mui/material';
import {
  FilterList,
  Close,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchBooks,
  searchBooks,
  setSearchFilters,
  selectBooks,
  selectSearchResults,
  selectBooksLoading,
  selectSearchLoading,
  selectBooksPagination,
  selectSearchFilters,
} from '@/store/booksSlice';
import { BookDisplay, SearchFilters } from '@/types';
import { transformBooksForDisplay } from '@/utils/bookTransformers';
import {
  BookGrid,
  BookListItem,
  FilterPanel,
  Pagination,
  ViewModeToggle,
  ViewMode,
} from '@/components/books';

const DRAWER_WIDTH = 320;

export const BooksPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [searchParams, setSearchParams] = useSearchParams();

  const books = useAppSelector(selectBooks);
  const searchResults = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectBooksLoading);
  const searchLoading = useAppSelector(selectSearchLoading);
  const pagination = useAppSelector(selectBooksPagination);
  const filters = useAppSelector(selectSearchFilters);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [displayedBooks, setDisplayedBooks] = useState<BookDisplay[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Check for URL parameters on mount
  useEffect(() => {
    const query = searchParams.get('q');
    const genre = searchParams.get('genre');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    const initialFilters: SearchFilters = {
      query: query || '',
      genreId: genre || undefined,
      sortBy: (sortBy as SearchFilters['sortBy']) || 'created_at',
      sortOrder: (sortOrder as SearchFilters['sortOrder']) || 'desc',
    };

    dispatch(setSearchFilters(initialFilters));
    setIsSearchMode(!!query);

    // Initial data load
    if (query) {
      dispatch(searchBooks(initialFilters));
    } else {
      dispatch(fetchBooks({
        skip: 0,
        limit: 20,
        genre_id: genre || undefined,
        sort_by: (sortBy as any) || 'created_at',
        sort_order: (sortOrder as any) || 'desc',
      }));
    }
  }, [dispatch, searchParams]);

  // Transform books for display
  useEffect(() => {
    const booksToDisplay = isSearchMode ? searchResults : books;
    setDisplayedBooks(transformBooksForDisplay(booksToDisplay));
  }, [books, searchResults, isSearchMode]);

  const handleBookClick = (book: BookDisplay) => {
    navigate(`/books/${book.id}`);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    dispatch(setSearchFilters(updatedFilters));

    // Update URL parameters
    const params = new URLSearchParams();
    if (updatedFilters.query) params.set('q', updatedFilters.query);
    if (updatedFilters.genreId) params.set('genre', updatedFilters.genreId);
    if (updatedFilters.sortBy) params.set('sortBy', updatedFilters.sortBy);
    if (updatedFilters.sortOrder) params.set('sortOrder', updatedFilters.sortOrder);
    setSearchParams(params);

    // Perform search or browse
    if (updatedFilters.query) {
      setIsSearchMode(true);
      dispatch(searchBooks(updatedFilters));
    } else {
      setIsSearchMode(false);
      const backendQuery = {
        skip: 0,
        limit: pagination?.pageSize || 20,
        genre_id: updatedFilters.genreId,
        min_rating: updatedFilters.minRating,
        max_rating: updatedFilters.maxRating,
        sort_by: updatedFilters.sortBy || 'created_at',
        sort_order: updatedFilters.sortOrder || 'desc',
      };
      dispatch(fetchBooks(backendQuery));
    }
  };

  const handleFilterReset = () => {
    const defaultFilters: SearchFilters = {
      query: '',
      genreId: undefined,
      minRating: undefined,
      maxRating: undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    
    dispatch(setSearchFilters(defaultFilters));
    setSearchParams(new URLSearchParams());
    setIsSearchMode(false);
    
    dispatch(fetchBooks({
      skip: 0,
      limit: pagination?.pageSize || 20,
      sort_by: 'created_at',
      sort_order: 'desc',
    }));
  };

  const handlePageChange = (page: number) => {
    if (isSearchMode) {
      // Search pagination (TODO: implement if backend supports it)
      console.log('Search pagination not yet implemented');
    } else {
      const backendQuery = {
        skip: (page - 1) * (pagination?.pageSize || 20),
        limit: pagination?.pageSize || 20,
        genre_id: filters.genreId,
        min_rating: filters.minRating,
        max_rating: filters.maxRating,
        sort_by: filters.sortBy || 'created_at',
        sort_order: filters.sortOrder || 'desc',
      };
      dispatch(fetchBooks(backendQuery));
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (!isSearchMode) {
      const backendQuery = {
        skip: 0,
        limit: pageSize,
        genre_id: filters.genreId,
        min_rating: filters.minRating,
        max_rating: filters.maxRating,
        sort_by: filters.sortBy || 'created_at',
        sort_order: filters.sortOrder || 'desc',
      };
      dispatch(fetchBooks(backendQuery));
    }
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const currentLoading = isSearchMode ? searchLoading : loading;

  const pageTitle = isSearchMode 
    ? `Search Results${filters.query ? ` for "${filters.query}"` : ''}`
    : 'Browse Books';

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ position: 'sticky', top: 80, height: 'calc(100vh - 80px)', overflow: 'auto' }}>
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleFilterReset}
              variant="sidebar"
              showTitle
            />
          </Box>
        </Box>
      )}

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={toggleMobileFilters}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: Math.min(DRAWER_WIDTH, window.innerWidth - 56),
              p: 2,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleMobileFilters} size="small">
              <Close />
            </IconButton>
          </Box>
          
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
            variant="sidebar"
            showTitle={false}
          />
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 600 }}
            >
              {pageTitle}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ViewModeToggle
                value={viewMode}
                onChange={setViewMode}
                availableModes={['grid', 'list']}
              />
            </Box>
          </Box>

          {/* Results Summary */}
          {pagination && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {pagination.totalBooks === 0
                ? 'No books found'
                : `${pagination.totalBooks.toLocaleString()} book${pagination.totalBooks !== 1 ? 's' : ''} found`}
            </Typography>
          )}

          {/* Books Display */}
          {viewMode === 'grid' ? (
            <BookGrid
              books={displayedBooks}
              loading={currentLoading}
              onBookClick={handleBookClick}
              variant="detailed"
              showGenres
              showFavorites
              maxWidth={false}
              emptyMessage={
                isSearchMode
                  ? "No books match your search criteria"
                  : "No books match your current filters"
              }
            />
          ) : (
            <Box>
              {currentLoading ? (
                // Loading skeletons for list view
                Array.from({ length: 5 }).map((_, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    {/* List item skeleton would go here */}
                  </Box>
                ))
              ) : displayedBooks.length > 0 ? (
                displayedBooks.map((book) => (
                  <BookListItem
                    key={book.id}
                    book={book}
                    onClick={handleBookClick}
                    showFavorite
                    showDescription
                  />
                ))
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  {isSearchMode
                    ? "No books match your search criteria"
                    : "No books match your current filters"}
                </Typography>
              )}
            </Box>
          )}

          {/* Pagination */}
          {pagination && !isSearchMode && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSizeSelector
              showResultsInfo
            />
          )}
        </Container>
      </Box>

      {/* Mobile Filter FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filters"
          onClick={toggleMobileFilters}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: theme.zIndex.speedDial,
          }}
        >
          <FilterList />
        </Fab>
      )}
    </Box>
  );
};

export default BooksPage;
