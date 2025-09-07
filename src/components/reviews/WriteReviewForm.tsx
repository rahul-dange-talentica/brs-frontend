/**
 * WriteReviewForm Component
 * Form for creating and editing reviews with validation
 */

import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogActions
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StarRatingInput } from './StarRatingInput';
import { Review } from '@/types/api';

interface ReviewFormData {
  rating: number;
  review_text: string;
}

interface WriteReviewFormProps {
  bookId: string;
  bookTitle?: string;
  existingReview?: Review | null;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  isDialog?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating must be between 1 and 5')
    .required('Rating is required'),
  review_text: yup
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review must be less than 2000 characters')
    .required('Review text is required'),
});

export const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  // bookId,
  bookTitle,
  existingReview,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isDialog = false,
  open = false,
  onClose
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      review_text: existingReview?.reviewText || ''
    },
    mode: 'onChange'
  });

  const watchedReviewText = watch('review_text');
  const characterCount = watchedReviewText?.length || 0;

  const handleFormSubmit = async (data: ReviewFormData) => {
    try {
      await onSubmit(data);
      if (!existingReview) {
        reset();
      }
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
    onClose?.();
  };

  const isEditing = !!existingReview;

  const formContent = (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Rating Input */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRatingInput
              value={field.value}
              onChange={field.onChange}
              label="Your Rating"
              required
              error={!!errors.rating}
              helperText={errors.rating?.message}
              size="large"
              showLabels
            />
          )}
        />
      </Box>

      {/* Review Text */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="review_text"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Write your review"
              placeholder={`Share your thoughts about ${bookTitle || 'this book'}...`}
              error={!!errors.review_text}
              helperText={
                errors.review_text?.message || 
                `${characterCount}/2000 characters`
              }
              inputProps={{ 
                maxLength: 2000,
                'aria-describedby': 'character-count'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          )}
        />
      </Box>

      {/* Form Actions */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: isDialog ? 'flex-end' : 'flex-start',
        mt: 3
      }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || !isDirty || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading 
            ? (isEditing ? 'Updating...' : 'Publishing...') 
            : (isEditing ? 'Update Review' : 'Publish Review')
          }
        </Button>
      </Box>
    </Box>
  );

  if (isDialog) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6">
            {isEditing ? 'Edit Your Review' : 'Write a Review'}
          </Typography>
          {bookTitle && (
            <Typography variant="body2" color="text.secondary">
              {bookTitle}
            </Typography>
          )}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </Typography>
      
      {bookTitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {bookTitle}
        </Typography>
      )}
      
      {formContent}
    </Paper>
  );
};

export default WriteReviewForm;
