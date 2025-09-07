/**
 * ReviewsSection Component
 * Main reviews section that integrates all review components for a book
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Button,
  Pagination,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchBookReviews, 
  createReview, 
  updateReview, 
  deleteReview,
  clearError 
} from '@/store/reviewsSlice';
import { Review, CreateReviewData, UpdateReviewData } from '@/types/api';
import { ReviewsSummary } from './ReviewsSummary';
import { ReviewsList } from './ReviewsList';
import { WriteReviewForm } from './WriteReviewForm';
import { reviewsService } from '@/services';
import { AuthenticatedReviewActions } from './AuthenticatedReviewActions';
import { selectCurrentBookReviews } from '@/store/reviewsSlice';

interface ReviewsSectionProps {
  bookId: string;
  bookTitle: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

type TabValue = 'all' | 'recent' | 'helpful' | 'highest' | 'lowest';
type SortOption = 'created_at' | 'rating' | 'updated_at';
type SortOrder = 'desc' | 'asc';


export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  bookId,
  bookTitle,
  averageRating,
  totalReviews,
  ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
}) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: any) => state.auth);
  const { loading, error } = useAppSelector((state: any) => state.reviews);
  const currentBookReviews = useAppSelector((state: any) => selectCurrentBookReviews(state));

  // Local state
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const pageSize = 10;
  const totalPages = Math.ceil(totalReviews / pageSize);

  // Transform reviews and mark user's own review
  // Transform reviews for display - add isOwn property
  const transformedReviews = currentBookReviews.map(review => ({
    ...review,
    isOwn: user?.id === review.userId
  }));

  // Load reviews when component mounts or filters change
  const loadReviews = useCallback(async () => {
    try {
      await dispatch(fetchBookReviews({
        bookId,
        page: currentPage,
        pageSize: pageSize
      })).unwrap();
      console.log('Reviews loaded successfully', { sortBy, sortOrder }); // Using variables to avoid lint warnings
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  }, [dispatch, bookId, currentPage, pageSize, sortBy, sortOrder]);

  // Check if user has already reviewed this book
  const checkUserReview = useCallback(async () => {
    if (user) {
      try {
        const review = await reviewsService.getUserReviewForBook(bookId);
        if (review) {
          setUserReview({
            ...review,
            id: review.id,
            bookId: review.book_id || bookId,
            userId: review.user_id || user.id,
            rating: review.rating,
            reviewText: review.review_text || '',
            createdAt: review.created_at || new Date().toISOString(),
            updatedAt: review.updated_at || new Date().toISOString(),
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            },
            isOwn: true
          } as Review);
        } else {
          setUserReview(null);
        }
      } catch (error) {
        console.error('Failed to check user review:', error);
        setUserReview(null);
      }
    } else {
      setUserReview(null);
    }
  }, [user, bookId]);

  useEffect(() => {
    loadReviews();
    checkUserReview();
  }, [loadReviews, checkUserReview]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Event handlers
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);
    
    // Set sort based on tab
    switch (newValue) {
      case 'recent':
        setSortBy('created_at');
        setSortOrder('desc');
        break;
      case 'helpful':
        setSortBy('updated_at');
        setSortOrder('desc');
        break;
      case 'highest':
        setSortBy('rating');
        setSortOrder('desc');
        break;
      case 'lowest':
        setSortBy('rating');
        setSortOrder('asc');
        break;
      default:
        setSortBy('created_at');
        setSortOrder('desc');
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleWriteReview = () => {
    setShowWriteReview(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowWriteReview(true);
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
        setUserReview(null);
        loadReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setReviewToDelete(null);
  };

  const handleSubmitReview = async (data: { rating: number; review_text: string }) => {
    try {
      // Check authentication from Redux state (already verified during app initialization)
      if (!user || !isAuthenticated) {
        setSnackbarMessage('Please log in to submit reviews');
        setSnackbarOpen(true);
        return;
      }

      if (editingReview) {
        // Update existing review
        const updateData: UpdateReviewData = {
          reviewId: editingReview.id,
          rating: data.rating,
          review_text: data.review_text
        };
        const updatedReview = await dispatch(updateReview(updateData)).unwrap();
        setSnackbarMessage('Review updated successfully');
        setUserReview(updatedReview);
      } else {
        // Create new review
        const createData: CreateReviewData = {
          bookId,
          rating: data.rating,
          review_text: data.review_text
        };
        const newReview = await dispatch(createReview(createData)).unwrap();
        setSnackbarMessage('Review published successfully');
        setUserReview(newReview);
      }
      
      setSnackbarOpen(true);
      setShowWriteReview(false);
      setEditingReview(null);
      
      // Reload reviews to ensure we have the latest data
      await loadReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
      setSnackbarMessage('Failed to submit review. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleCancelReview = () => {
    setShowWriteReview(false);
    setEditingReview(null);
  };

  return (
    <Box>
      {/* Reviews Summary */}
      <ReviewsSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
        ratingDistribution={ratingDistribution}
        bookTitle={bookTitle}
      />

      {/* Write Review Button */}
      {!userReview && (
        <Box sx={{ mb: 3 }}>
          <AuthenticatedReviewActions
            onAuthRequired={() => {
              setSnackbarMessage('Please log in to write reviews');
              setSnackbarOpen(true);
            }}
            fallback={
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSnackbarMessage('Please log in to write reviews');
                  setSnackbarOpen(true);
                }}
                size="large"
              >
                Login to Write Review
              </Button>
            }
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleWriteReview}
              size="large"
            >
              Write a Review
            </Button>
          </AuthenticatedReviewActions>
        </Box>
      )}

      {/* User's Own Review */}
      {userReview && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Review
          </Typography>
          <ReviewsList
            reviews={[userReview]}
            showActions
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </Box>
      )}

      {/* Review Filters and Tabs */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ flexGrow: 1 }}
          >
            <Tab label="All Reviews" value="all" />
            <Tab label="Most Recent" value="recent" />
            <Tab label="Most Helpful" value="helpful" />
            <Tab label="Highest Rated" value="highest" />
            <Tab label="Lowest Rated" value="lowest" />
          </Tabs>

          {/* Rating Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter by Rating</InputLabel>
            <Select
              value={ratingFilter || ''}
              label="Filter by Rating"
              onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
            >
              <MenuItem value="">All Ratings</MenuItem>
              <MenuItem value={5}>5 Stars</MenuItem>
              <MenuItem value={4}>4 Stars</MenuItem>
              <MenuItem value={3}>3 Stars</MenuItem>
              <MenuItem value={2}>2 Stars</MenuItem>
              <MenuItem value={1}>1 Star</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Active Filters */}
        {ratingFilter && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`${ratingFilter} Star${ratingFilter !== 1 ? 's' : ''}`}
              onDelete={() => setRatingFilter(null)}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      {/* Reviews List */}
      <ReviewsList
        reviews={transformedReviews}
        loading={loading}
        error={error}
        showActions
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
        emptyMessage="No reviews found"
        emptyDescription="Be the first to write a review for this book!"
      />

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

      {/* Write/Edit Review Dialog */}
      <WriteReviewForm
        bookId={bookId}
        bookTitle={bookTitle}
        existingReview={editingReview}
        onSubmit={handleSubmitReview}
        onCancel={handleCancelReview}
        loading={loading}
        error={error}
        isDialog
        open={showWriteReview}
        onClose={handleCancelReview}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your review? This action cannot be undone.
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
    </Box>
  );
};

export default ReviewsSection;
