/**
 * UserReviewsPage Component
 * User's review history page with filtering and management
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  // Skeleton,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material';
import {
  RateReview as ReviewIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchUserReviews, 
  updateReview, 
  deleteReview,
  clearError 
} from '@/store/reviewsSlice';
import { Review, UpdateReviewData } from '@/types/api';
import { UserReviewCard } from '@/components/reviews/UserReviewCard';
import { WriteReviewForm } from '@/components/reviews/WriteReviewForm';
import { PageLoader } from '@/components/common';
// import { userService } from '@/services';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

export const UserReviewsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { userReviews, userReviewsLoading, error } = useAppSelector(state => state.reviews);

  // Debug logging
  console.log('UserReviewsPage - Redux state:', { 
    userReviewsCount: userReviews.length, 
    userReviewsLoading, 
    error,
    user: user?.email 
  });

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [statistics, setStatistics] = useState({
    totalReviews: 0,
    averageRating: 0,
    mostRecentReview: null as Date | null
  });

  const pageSize = 10;

  // Load user reviews
  const loadUserReviews = useCallback(async () => {
    if (user) {
      try {
        console.log('UserReviewsPage: Dispatching fetchUserReviews...', { 
          userEmail: user.email, 
          page: currentPage, 
          pageSize 
        });
        const result = await dispatch(fetchUserReviews({ 
          page: currentPage, 
          pageSize 
        })).unwrap();
        console.log('UserReviewsPage: fetchUserReviews result:', result);
      } catch (error) {
        console.error('Failed to load user reviews:', error);
      }
    } else {
      console.log('UserReviewsPage: No user authenticated, skipping review load');
    }
  }, [dispatch, user, currentPage]);

  // Calculate statistics
  const calculateStatistics = useCallback(() => {
    if (userReviews.length > 0) {
      const totalReviews = userReviews.length;
      const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      const mostRecentReview = new Date(Math.max(...userReviews.map(r => new Date(r.createdAt).getTime())));
      
      setStatistics({
        totalReviews,
        averageRating,
        mostRecentReview
      });
    } else {
      setStatistics({
        totalReviews: 0,
        averageRating: 0,
        mostRecentReview: null
      });
    }
  }, [userReviews]);

  // Filter and sort reviews
  const processedReviews = React.useMemo(() => {
    let filtered = [...userReviews];

    // Apply filter
    if (filterBy !== 'all') {
      const rating = parseInt(filterBy);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [userReviews, sortBy, filterBy]);

  const totalPages = Math.ceil(processedReviews.length / pageSize);
  const paginatedReviews = processedReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    console.log('UserReviewsPage: Loading user reviews...');
    loadUserReviews();
  }, [loadUserReviews]);

  // Force reload when user changes (in case of authentication state changes)
  useEffect(() => {
    if (user) {
      console.log('UserReviewsPage: User authenticated, reloading reviews...');
      loadUserReviews();
    }
  }, [user?.id, loadUserReviews]);

  useEffect(() => {
    calculateStatistics();
  }, [calculateStatistics]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Event handlers
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleDeleteReview = (review: Review) => {
    setReviewToDelete(review);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      try {
        await dispatch(deleteReview(reviewToDelete.id)).unwrap();
        setSnackbarMessage('Review deleted successfully');
        setSnackbarOpen(true);
        loadUserReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setReviewToDelete(null);
  };

  const handleSubmitEdit = async (data: { rating: number; review_text: string }) => {
    if (editingReview) {
      try {
        const updateData: UpdateReviewData = {
          reviewId: editingReview.id,
          rating: data.rating,
          review_text: data.review_text
        };
        await dispatch(updateReview(updateData)).unwrap();
        setSnackbarMessage('Review updated successfully');
        setSnackbarOpen(true);
        setEditingReview(null);
        loadUserReviews();
      } catch (error) {
        console.error('Failed to update review:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value as SortOption);
    setCurrentPage(1);
  };

  const handleFilterChange = (event: any) => {
    setFilterBy(event.target.value as FilterOption);
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your reviews.
        </Alert>
      </Container>
    );
  }

  if (userReviewsLoading && userReviews.length === 0) {
    return <PageLoader message="Loading your reviews..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          My Reviews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and view all your book reviews
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <ReviewIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {statistics.totalReviews}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Reviews
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <StarIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {statistics.averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Rating
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TrendingIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {statistics.mostRecentReview ? 
                statistics.mostRecentReview.toLocaleDateString() : 
                'N/A'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Latest Review
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters and Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="highest">Highest Rated</MenuItem>
              <MenuItem value="lowest">Lowest Rated</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Rating</InputLabel>
            <Select value={filterBy} label="Filter by Rating" onChange={handleFilterChange}>
              <MenuItem value="all">All Ratings</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </Select>
          </FormControl>

          {filterBy !== 'all' && (
            <Chip
              label={`${filterBy} Star${filterBy !== '1' ? 's' : ''}`}
              onDelete={() => setFilterBy('all')}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      </Paper>

      {/* Reviews List */}
      {paginatedReviews.length > 0 ? (
        <Box>
          {paginatedReviews.map((review) => (
            <UserReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ReviewIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No reviews found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filterBy !== 'all' 
              ? `You haven't written any ${filterBy}-star reviews yet.`
              : "You haven't written any reviews yet. Start by reviewing a book you've read!"
            }
          </Typography>
        </Paper>
      )}

      {/* Edit Review Dialog */}
      {editingReview && (
        <WriteReviewForm
          bookId={editingReview.bookId}
          bookTitle={`Edit Review`} // Could fetch book title if needed
          existingReview={editingReview}
          onSubmit={handleSubmitEdit}
          onCancel={handleCancelEdit}
          loading={userReviewsLoading}
          error={error}
          isDialog
          open={!!editingReview}
          onClose={handleCancelEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserReviewsPage;
