/**
 * ReviewsList Component
 * Displays a list of reviews with loading states and empty states
 */

import React from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  Stack,
  Paper
} from '@mui/material';
import { Review } from '@/types/api';
import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
  error?: string | null;
  showBookInfo?: boolean;
  showActions?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  onReport?: (review: Review) => void;
  compact?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  loading = false,
  error = null,
  showBookInfo = false,
  showActions = false,
  onEdit,
  onDelete,
  onReport,
  compact = false,
  emptyMessage = "No reviews yet",
  emptyDescription = "Be the first to write a review for this book!"
}) => {
  // Loading state
  if (loading) {
    return (
      <Stack spacing={compact ? 1 : 2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Paper key={index} sx={{ p: compact ? 2 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="rectangular" width={100} height={20} />
            </Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width={150} height={16} />
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mt: 2 }}
      >
        {error}
      </Alert>
    );
  }

  // Empty state
  if (!reviews || reviews.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'grey.50',
          mt: 2
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
        >
          {emptyMessage}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {emptyDescription}
        </Typography>
      </Paper>
    );
  }

  // Reviews list
  return (
    <Stack spacing={compact ? 1 : 2}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          showBookInfo={showBookInfo}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
          onReport={onReport}
          compact={compact}
        />
      ))}
    </Stack>
  );
};

export default ReviewsList;
