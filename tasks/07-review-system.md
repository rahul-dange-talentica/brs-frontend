# Task 07: Review System Implementation

**Sequence**: 07  
**Priority**: High  
**Estimated Duration**: 3-4 days  
**Dependencies**: Task 04 (Authentication), Task 05 (API Integration), Task 06 (Book Management)  
**Assigned To**: TBD  

---

## Task Overview

Implement comprehensive review and rating system including review CRUD operations, 1-5 star rating system, review display, real-time rating updates, and integration with book management features.

---

## Acceptance Criteria

### Review CRUD Operations
- [ ] **Create Review**: Authenticated users can write reviews with ratings
- [ ] **Read Reviews**: Display all reviews for a book with pagination
- [ ] **Update Review**: Users can edit their own reviews
- [ ] **Delete Review**: Users can delete their own reviews

### Rating System
- [ ] **Star Rating Input**: Interactive 1-5 star rating component
- [ ] **Rating Display**: Visual star rating display with average ratings
- [ ] **Rating Distribution**: Show breakdown of ratings (5-star: X, 4-star: Y, etc.)
- [ ] **Real-time Updates**: Rating updates reflect immediately via polling

### Review Display Features
- [ ] **Review Cards**: Well-formatted review display with user info
- [ ] **Review Sorting**: Sort by newest, oldest, highest-rated, lowest-rated
- [ ] **Review Pagination**: Handle large numbers of reviews efficiently
- [ ] **User Review Highlighting**: Highlight current user's review

### User Experience
- [ ] **Review Form**: Intuitive review writing interface with validation
- [ ] **Review Preview**: Preview review before submission
- [ ] **Review Guidelines**: Clear guidelines for writing reviews
- [ ] **Moderation Indicators**: Show review status (pending, approved, etc.)

---

## Implementation Details

### 1. Review Data Structure
```typescript
// Complete review interface from API
interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number; // 1-5 stars
  reviewText: string;
  title?: string; // Optional review title
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string; // Future enhancement
  };
  createdAt: string;
  updatedAt: string;
  isOwn?: boolean; // Current user's review
}

// Review form data structure
interface ReviewFormData {
  rating: number;
  title?: string;
  reviewText: string;
}

// Review creation/update requests
interface CreateReviewRequest {
  bookId: string;
  rating: number;
  reviewText: string;
  title?: string;
}
```

### 2. Component Architecture
```
ReviewSystem
├── BookDetailsPage
│   ├── ReviewsSection
│   │   ├── ReviewsSummary (rating distribution)
│   │   ├── WriteReviewForm (if authenticated)
│   │   ├── ReviewsList
│   │   │   └── ReviewCard (multiple)
│   │   └── ReviewPagination
│   └── RatingDisplay (book's overall rating)
├── ReviewForm (modal/standalone)
│   ├── StarRatingInput
│   ├── ReviewTitleField
│   ├── ReviewTextArea
│   └── ReviewActions
└── UserReviewsPage (user's review history)
    └── UserReviewCard (multiple)
```

### 3. State Management Integration
```typescript
// Reviews slice integration
interface ReviewsState {
  reviews: Review[]; // Reviews for current book
  userReviews: Review[]; // Current user's reviews
  loading: boolean;
  error: string | null;
  reviewsMetadata: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
  } | null;
}
```

---

## Components to Create

### Core Review Components
1. **src/components/reviews/ReviewsSection.tsx** - Main reviews display section
2. **src/components/reviews/ReviewsList.tsx** - List of reviews with pagination
3. **src/components/reviews/ReviewCard.tsx** - Individual review display
4. **src/components/reviews/ReviewsSummary.tsx** - Rating distribution and summary

### Review Form Components
5. **src/components/reviews/WriteReviewForm.tsx** - Review creation/editing form
6. **src/components/reviews/ReviewForm.tsx** - Standalone review form component
7. **src/components/reviews/StarRatingInput.tsx** - Interactive star rating input
8. **src/components/reviews/ReviewTextEditor.tsx** - Rich text review editor

### Rating Components
9. **src/components/reviews/RatingDisplay.tsx** - Read-only star rating display
10. **src/components/reviews/RatingDistribution.tsx** - Visual rating breakdown
11. **src/components/reviews/RatingSummary.tsx** - Overall rating with statistics

### User Review Management
12. **src/pages/UserReviewsPage.tsx** - User's review history page
13. **src/components/reviews/UserReviewCard.tsx** - User's own review card with edit/delete
14. **src/components/reviews/ReviewActions.tsx** - Edit/delete actions for user reviews

### Utility Components
15. **src/components/reviews/ReviewPagination.tsx** - Review pagination controls
16. **src/components/reviews/ReviewSorting.tsx** - Review sorting options
17. **src/components/reviews/ReviewGuidelines.tsx** - Review writing guidelines

---

## Key Component Implementations

### 1. StarRatingInput Component
```typescript
// src/components/reviews/StarRatingInput.tsx
interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  precision?: number; // 0.5 for half stars, 1 for full stars
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  precision = 1
}) => {
  return (
    <Rating
      value={value}
      onChange={(_, newValue) => onChange(newValue || 0)}
      precision={precision}
      readOnly={readOnly}
      size={size}
      sx={{
        fontSize: size === 'large' ? '2rem' : size === 'small' ? '1.2rem' : '1.5rem',
      }}
    />
  );
};
```

### 2. WriteReviewForm Component
```typescript
// src/components/reviews/WriteReviewForm.tsx
export const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  bookId,
  existingReview,
  onSuccess,
  onCancel
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.reviews);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      title: existingReview?.title || '',
      reviewText: existingReview?.reviewText || ''
    }
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      if (existingReview) {
        await dispatch(updateReview({
          reviewId: existingReview.id,
          reviewData: data
        })).unwrap();
      } else {
        await dispatch(createReview({
          bookId,
          ...data
        })).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      // Error handled by Redux slice
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Your Rating *</Typography>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRatingInput
                value={field.value}
                onChange={field.onChange}
                size="large"
              />
            )}
          />
          {errors.rating && (
            <Typography color="error" variant="caption">
              {errors.rating.message}
            </Typography>
          )}
        </Box>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Review Title (Optional)"
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="reviewText"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Your Review *"
              margin="normal"
              error={!!errors.reviewText}
              helperText={errors.reviewText?.message}
              inputProps={{ maxLength: 2000 }}
            />
          )}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Submit Review'}
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
```

### 3. ReviewCard Component
```typescript
// src/components/reviews/ReviewCard.tsx
export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  showBookInfo = false,
  showActions = false,
  onEdit,
  onDelete 
}) => {
  const { user } = useAppSelector(state => state.auth);
  const isOwnReview = user?.id === review.userId;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" component="h3">
              {review.title || 'Review'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <RatingDisplay value={review.rating} size="small" readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                by {review.user.firstName} {review.user.lastName}
              </Typography>
            </Box>
          </Box>
          
          {isOwnReview && showActions && (
            <Box>
              <IconButton onClick={() => onEdit?.(review)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete?.(review)} size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
          {review.reviewText}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          {review.updatedAt !== review.createdAt && ' (edited)'}
        </Typography>
      </CardContent>
    </Card>
  );
};
```

---

## Real-time Rating Updates

### Integration with Polling System
```typescript
// src/hooks/useReviewPolling.ts
export const useReviewPolling = (bookId: string, enabled: boolean = true) => {
  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !bookId) return;

    const pollReviews = async () => {
      try {
        // Refresh book rating and review metadata
        const bookDetails = await booksService.getBookById(bookId);
        dispatch(updateBookRating({
          bookId,
          averageRating: bookDetails.book.averageRating,
          totalReviews: bookDetails.book.totalReviews
        }));

        // Refresh reviews if user is viewing reviews
        const reviewsData = await reviewsService.getBookReviews(bookId);
        dispatch(updateReviewsMetadata(reviewsData));
      } catch (error) {
        console.error('Failed to poll review updates:', error);
      }
    };

    intervalRef.current = setInterval(pollReviews, 30000); // 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookId, enabled, dispatch]);
};
```

### Rating Distribution Visualization
```typescript
// src/components/reviews/RatingDistribution.tsx
export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalReviews
}) => {
  return (
    <Box>
      {[5, 4, 3, 2, 1].map((rating) => (
        <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ width: '20px' }}>
            {rating}
          </Typography>
          <StarIcon sx={{ fontSize: '1rem', mr: 1, color: 'gold' }} />
          <LinearProgress
            variant="determinate"
            value={(distribution[rating as keyof typeof distribution] / totalReviews) * 100}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <Typography variant="body2" sx={{ width: '40px', textAlign: 'right' }}>
            {distribution[rating as keyof typeof distribution]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
```

---

## Form Validation Schema

### Review Form Validation
```typescript
// src/utils/reviewValidation.ts
export const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating must be between 1 and 5')
    .required('Rating is required'),
  title: yup
    .string()
    .max(100, 'Title must be less than 100 characters')
    .optional(),
  reviewText: yup
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review must be less than 2000 characters')
    .required('Review text is required'),
});

// Client-side validation rules
export const REVIEW_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 100,
  REVIEW_MIN_LENGTH: 10,
  REVIEW_MAX_LENGTH: 2000,
  MIN_RATING: 1,
  MAX_RATING: 5,
};
```

---

## Testing Checklist

### Review CRUD Operations
- [ ] Users can create reviews with ratings successfully
- [ ] Users can view all reviews for a book with proper pagination
- [ ] Users can edit their own reviews (but not others' reviews)
- [ ] Users can delete their own reviews with confirmation
- [ ] Unauthorized users cannot create, edit, or delete reviews

### Rating System
- [ ] Star rating input allows selection of 1-5 stars
- [ ] Rating display shows correct average rating with proper precision
- [ ] Rating distribution chart displays accurate percentages
- [ ] Real-time updates reflect new ratings within polling interval

### Review Display
- [ ] Reviews display with proper user information and timestamps
- [ ] Review sorting options work correctly (newest, oldest, highest-rated)
- [ ] Pagination controls navigate through large review sets
- [ ] Current user's review is highlighted appropriately

### Form Validation
- [ ] Review form validates rating selection (required)
- [ ] Review text validates minimum and maximum length
- [ ] Review title validates maximum length (optional field)
- [ ] Error messages provide clear guidance for corrections

### User Experience
- [ ] Review submission shows loading state and success feedback
- [ ] Edit review form pre-populates with existing review data
- [ ] Delete confirmation prevents accidental review deletion
- [ ] Review guidelines help users write better reviews

---

## Performance Considerations

### Review Loading Optimization
- [ ] **Pagination**: Load reviews in batches to prevent overwhelming API
- [ ] **Lazy Loading**: Load review text on demand for long reviews
- [ ] **Caching**: Cache reviews to reduce API calls on navigation
- [ ] **Optimistic Updates**: Update UI immediately, sync with API

### Rating Updates Optimization
- [ ] **Debounced Polling**: Intelligent polling based on user activity
- [ ] **Incremental Updates**: Only update changed rating data
- [ ] **Local State Sync**: Sync local rating changes with global state
- [ ] **Error Recovery**: Handle failed rating updates gracefully

---

## Accessibility Requirements

### Review Reading Accessibility
- [ ] Reviews have proper heading structure for screen readers
- [ ] Star ratings are readable by assistive technology
- [ ] User information is properly associated with reviews
- [ ] Review dates and edit status are clearly announced

### Review Writing Accessibility
- [ ] Rating input is accessible via keyboard and screen readers
- [ ] Form validation errors are announced appropriately
- [ ] Character count is announced for review text field
- [ ] Form submission status is clearly communicated

### Navigation Accessibility
- [ ] Review pagination is keyboard accessible
- [ ] Sorting controls work with assistive technology
- [ ] Edit/delete actions have clear labels and confirmations
- [ ] Focus management works correctly in review forms

---

## Definition of Done

- [ ] Complete review CRUD functionality is implemented
- [ ] 1-5 star rating system works correctly with visual feedback
- [ ] Reviews display with proper formatting and user information
- [ ] Real-time rating updates work via polling integration
- [ ] Review form includes validation and error handling
- [ ] Review pagination handles large datasets efficiently
- [ ] Rating distribution visualization is accurate and responsive
- [ ] User's own reviews are editable and deletable
- [ ] Integration with book management features is complete
- [ ] Performance optimizations prevent UI lag with many reviews
- [ ] Accessibility requirements are fully met

---

## Integration Points

### With Authentication (Task 04)
- Review creation/editing requires user authentication
- User identification for review ownership and permissions
- Authentication state affects review action availability

### With Book Management (Task 06)
- Reviews display integrated with book details page
- Rating updates affect book display in real-time
- Review counts influence book sorting and filtering

### With API Integration (Task 05)
- All review operations use proper API service functions
- Real-time polling updates review and rating data
- Error handling integrates with global error management

---

## Potential Issues & Solutions

### Issue: Review Spam Prevention
**Problem**: Users submitting multiple reviews or spam content
**Solution**: Client-side validation, rate limiting, and backend moderation

### Issue: Rating Update Delays
**Problem**: Rating changes not reflected immediately in UI
**Solution**: Optimistic updates with rollback on API errors

### Issue: Long Review Text Display
**Problem**: Very long reviews break layout on mobile
**Solution**: Text truncation with "read more" functionality

### Issue: Concurrent Review Edits
**Problem**: Multiple users editing reviews simultaneously
**Solution**: Last-write-wins with user notification of conflicts

---

## Next Task Dependencies

This task enables:
- **Task 08**: User Profile (user review history integration)
- **Task 09**: Search & Recommendations (review-based recommendations)
- **Task 10**: Deployment (complete feature set for production)

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
