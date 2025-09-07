# Task 08: User Profile & Dashboard

**Sequence**: 08  
**Priority**: Medium  
**Estimated Duration**: 2-3 days  
**Dependencies**: Task 04 (Authentication), Task 06 (Book Management), Task 07 (Review System)  
**Assigned To**: TBD  

---

## Task Overview

Implement comprehensive user profile management including personal dashboard, favorite books management, user review history, profile settings, and account management features.

---

## Acceptance Criteria

### User Dashboard
- [ ] **Profile Overview**: Display user information and statistics
- [ ] **Recent Activity**: Show recent reviews, favorites, and reading activity
- [ ] **Quick Actions**: Easy access to write reviews, browse books, manage favorites
- [ ] **Reading Statistics**: Books read, reviews written, average rating given

### Profile Management
- [ ] **View Profile**: Display complete user profile information
- [ ] **Edit Profile**: Update name, email, and profile preferences
- [ ] **Profile Picture**: Upload and manage user avatar (future enhancement)
- [ ] **Account Settings**: Privacy settings and notification preferences

### Favorites Management
- [ ] **Favorites List**: View all favorite books with sorting and filtering
- [ ] **Add/Remove Favorites**: Toggle favorite status for books
- [ ] **Favorites Organization**: Categorize favorites by genre or custom lists
- [ ] **Export Favorites**: Export favorites list (future enhancement)

### Review History
- [ ] **Review List**: View all user's reviews with search and filter
- [ ] **Review Management**: Edit or delete own reviews from profile
- [ ] **Review Statistics**: Total reviews, average rating given, most reviewed genres
- [ ] **Review Export**: Download review history (future enhancement)

---

## Implementation Details

### 1. User Profile Data Structure
```typescript
// Extended user profile interface
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  lastActive: string;
  preferences: {
    emailNotifications: boolean;
    reviewNotifications: boolean;
    recommendationEmails: boolean;
    publicProfile: boolean;
  };
  statistics: {
    totalReviews: number;
    averageRating: number;
    favoriteBooks: number;
    monthlyReviews: number;
    topGenres: string[];
  };
}

// User activity interface
interface UserActivity {
  id: string;
  type: 'review' | 'favorite' | 'rating';
  bookId: string;
  bookTitle: string;
  action: string;
  timestamp: string;
  details?: Record<string, any>;
}
```

### 2. Component Architecture
```
UserProfile
├── UserDashboard
│   ├── ProfileSummary
│   ├── ReadingStatistics
│   ├── RecentActivity
│   └── QuickActions
├── ProfilePage
│   ├── ProfileHeader
│   │   ├── UserAvatar
│   │   ├── UserInfo
│   │   └── ProfileActions
│   ├── ProfileTabs
│   │   ├── OverviewTab
│   │   ├── ReviewsTab
│   │   ├── FavoritesTab
│   │   └── SettingsTab
│   └── ProfileContent
├── EditProfilePage
│   ├── ProfileForm
│   │   ├── BasicInfoSection
│   │   ├── PreferencesSection
│   │   └── PrivacySection
│   └── ProfilePreview
└── FavoritesPage
    ├── FavoritesHeader
    ├── FavoritesFilters
    └── FavoritesGrid
```

### 3. State Management Integration
```typescript
// User slice enhancement
interface UserState {
  profile: UserProfile | null;
  favoriteBooks: Book[];
  userReviews: Review[];
  recentActivity: UserActivity[];
  loading: boolean;
  error: string | null;
  profileUpdateLoading: boolean;
  favoritesLoading: boolean;
}
```

---

## Components to Create

### Dashboard Components
1. **src/pages/UserDashboard.tsx** - Main user dashboard page
2. **src/components/user/ProfileSummary.tsx** - User profile summary card
3. **src/components/user/ReadingStatistics.tsx** - User reading statistics display
4. **src/components/user/RecentActivity.tsx** - Recent user activity feed
5. **src/components/user/QuickActions.tsx** - Quick action buttons

### Profile Management
6. **src/pages/UserProfilePage.tsx** - Complete user profile page
7. **src/pages/EditProfilePage.tsx** - Profile editing interface
8. **src/components/user/ProfileHeader.tsx** - Profile header with user info
9. **src/components/user/ProfileForm.tsx** - Profile editing form
10. **src/components/user/UserAvatar.tsx** - User avatar display and upload

### Favorites Management
11. **src/pages/FavoritesPage.tsx** - User favorites management page
12. **src/components/user/FavoritesList.tsx** - List of favorite books
13. **src/components/user/FavoriteButton.tsx** - Toggle favorite status button
14. **src/components/user/FavoritesFilters.tsx** - Filter favorite books

### Review History
15. **src/pages/UserReviewsPage.tsx** - User review history page
16. **src/components/user/UserReviewsList.tsx** - List of user's reviews
17. **src/components/user/ReviewStatistics.tsx** - User review statistics
18. **src/components/user/ReviewsFilter.tsx** - Filter user reviews

---

## Key Component Implementations

### 1. UserDashboard Component
```typescript
// src/pages/UserDashboard.tsx
export const UserDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { profile, favoriteBooks, userReviews, recentActivity, loading } = 
    useAppSelector(state => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile());
      dispatch(fetchUserFavorites());
      dispatch(fetchUserReviews({ limit: 5 })); // Recent reviews
      dispatch(fetchRecentActivity({ limit: 10 }));
    }
  }, [user, dispatch]);

  if (loading || !profile) {
    return <DashboardSkeleton />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileSummary profile={profile} />
          <Box sx={{ mt: 2 }}>
            <QuickActions />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <ReadingStatistics statistics={profile.statistics} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Favorites
                </Typography>
                <FavoritesList 
                  books={favoriteBooks.slice(0, 4)} 
                  compact 
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <RecentActivity activities={recentActivity} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
```

### 2. FavoriteButton Component
```typescript
// src/components/user/FavoriteButton.tsx
interface FavoriteButtonProps {
  bookId: string;
  isFavorite: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  bookId,
  isFavorite,
  size = 'medium',
  showLabel = false
}) => {
  const dispatch = useAppDispatch();
  const { favoritesLoading } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(bookId)).unwrap();
      } else {
        await dispatch(addToFavorites(bookId)).unwrap();
      }
    } catch (error) {
      // Error handled by Redux slice
    } finally {
      setLoading(false);
    }
  };

  const ButtonComponent = showLabel ? Button : IconButton;
  const buttonProps = showLabel 
    ? {
        startIcon: loading ? <CircularProgress size={16} /> : 
                   isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />,
        variant: isFavorite ? 'contained' : 'outlined' as const,
        color: 'secondary' as const,
      }
    : {
        color: isFavorite ? 'secondary' : 'default' as const,
        size: size,
      };

  return (
    <ButtonComponent
      {...buttonProps}
      onClick={handleToggleFavorite}
      disabled={loading || favoritesLoading}
    >
      {showLabel ? (isFavorite ? 'Remove from Favorites' : 'Add to Favorites') :
       loading ? <CircularProgress size={size === 'small' ? 16 : 20} /> :
       isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </ButtonComponent>
  );
};
```

### 3. ProfileForm Component
```typescript
// src/components/user/ProfileForm.tsx
export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  onCancel
}) => {
  const dispatch = useAppDispatch();
  const { profileUpdateLoading } = useAppSelector(state => state.user);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      bio: profile.bio || '',
      location: profile.location || '',
      preferences: profile.preferences,
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      onSave?.();
    } catch (error) {
      // Error handled by Redux slice
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit Profile
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio (Optional)"
                  inputProps={{ maxLength: 500 }}
                  helperText={`${field.value?.length || 0}/500 characters`}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Preferences
            </Typography>
            <FormGroup>
              <Controller
                name="preferences.emailNotifications"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Email notifications"
                  />
                )}
              />
              <Controller
                name="preferences.reviewNotifications"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Review notifications"
                  />
                )}
              />
              <Controller
                name="preferences.publicProfile"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Make profile public"
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || !isValid || profileUpdateLoading}
          >
            {profileUpdateLoading ? <CircularProgress size={20} /> : 'Save Changes'}
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

---

## User Statistics Implementation

### Reading Statistics Calculation
```typescript
// src/utils/userStatistics.ts
export const calculateReadingStatistics = (
  userReviews: Review[],
  favoriteBooks: Book[]
): UserStatistics => {
  const totalReviews = userReviews.length;
  const averageRating = totalReviews > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  // Calculate genre distribution
  const genreCount: Record<string, number> = {};
  userReviews.forEach(review => {
    // Assuming we have book data with review
    if (review.book?.genre) {
      genreCount[review.book.genre] = (genreCount[review.book.genre] || 0) + 1;
    }
  });

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);

  // Calculate monthly activity
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyReviews = userReviews.filter(review => {
    const reviewDate = new Date(review.createdAt);
    return reviewDate.getMonth() === currentMonth && 
           reviewDate.getFullYear() === currentYear;
  }).length;

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    favoriteBooks: favoriteBooks.length,
    monthlyReviews,
    topGenres,
  };
};
```

### Activity Feed Implementation
```typescript
// src/components/user/RecentActivity.tsx
export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'review':
        return <RateReviewIcon />;
      case 'favorite':
        return <FavoriteIcon />;
      case 'rating':
        return <StarIcon />;
      default:
        return <BookIcon />;
    }
  };

  const getActivityColor = (type: UserActivity['type']) => {
    switch (type) {
      case 'review':
        return 'primary';
      case 'favorite':
        return 'secondary';
      case 'rating':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      
      {activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No recent activity to display.
        </Typography>
      ) : (
        <Timeline>
          {activities.map((activity) => (
            <TimelineItem key={activity.id}>
              <TimelineSeparator>
                <TimelineDot color={getActivityColor(activity.type)}>
                  {getActivityIcon(activity.type)}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="subtitle2">
                  {activity.action}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.bookTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Paper>
  );
};
```

---

## Testing Checklist

### User Dashboard
- [ ] Dashboard displays user profile information correctly
- [ ] Reading statistics show accurate data based on user activity
- [ ] Recent activity feed displays latest user actions
- [ ] Quick actions provide easy access to main features

### Profile Management
- [ ] View profile displays complete user information
- [ ] Edit profile form validates and updates user data correctly
- [ ] Profile preferences save and apply appropriately
- [ ] Profile picture upload works (when implemented)

### Favorites Management
- [ ] Favorites list displays all user's favorite books
- [ ] Add/remove favorite functionality works from book pages
- [ ] Favorite button shows correct state (favorited/not favorited)
- [ ] Favorites can be filtered and sorted appropriately

### Review History
- [ ] User reviews page shows all reviews by the user
- [ ] Reviews can be edited and deleted from the profile
- [ ] Review statistics are calculated correctly
- [ ] Review filtering and sorting work as expected

### Integration Testing
- [ ] Profile data syncs correctly with authentication state
- [ ] Favorites integrate properly with book management features
- [ ] Review history connects with review system functionality
- [ ] User activity updates in real-time with user actions

---

## Performance Considerations

### Data Loading Optimization
- [ ] **Lazy Loading**: Load profile sections on demand
- [ ] **Pagination**: Paginate large lists (favorites, reviews)
- [ ] **Caching**: Cache user profile data to reduce API calls
- [ ] **Selective Updates**: Update only changed profile fields

### User Experience Optimization
- [ ] **Optimistic Updates**: Update UI immediately, sync with API
- [ ] **Background Sync**: Sync profile data in the background
- [ ] **Progressive Loading**: Show partial data while loading complete profile
- [ ] **Error Recovery**: Graceful handling of profile update failures

---

## Accessibility Requirements

### Profile Navigation
- [ ] Profile sections are keyboard navigable
- [ ] Screen readers can access all profile information
- [ ] Focus management works correctly in profile forms
- [ ] Profile statistics are announced appropriately

### Form Accessibility
- [ ] Profile editing forms have proper labels and ARIA attributes
- [ ] Form validation errors are accessible
- [ ] Checkbox preferences are clearly labeled
- [ ] Form submission feedback is accessible

### Visual Accessibility
- [ ] Profile information has sufficient color contrast
- [ ] User statistics are readable by screen readers
- [ ] Activity feed timeline is accessible
- [ ] Profile pictures have appropriate alt text

---

## Definition of Done

- [ ] User dashboard provides comprehensive overview of user activity
- [ ] Profile management allows users to view and edit their information
- [ ] Favorites management enables adding, removing, and organizing favorite books
- [ ] Review history displays user's reviews with management capabilities
- [ ] User statistics accurately reflect reading activity and preferences
- [ ] All profile features integrate seamlessly with authentication
- [ ] Profile updates sync correctly with the backend API
- [ ] Performance optimizations prevent UI lag with large datasets
- [ ] Accessibility requirements are met for all profile features
- [ ] Responsive design works across all target screen sizes

---

## Integration Points

### With Authentication (Task 04)
- Profile data is tied to authenticated user account
- Profile access requires user authentication
- User session management affects profile data availability

### With Book Management (Task 06)
- Favorites feature integrates with book browsing and details
- Profile statistics include book interaction data
- Book recommendations can be based on profile preferences

### With Review System (Task 07)
- User review history displays all reviews by the user
- Profile shows review statistics and activity
- Review management features are accessible from profile

---

## Potential Issues & Solutions

### Issue: Profile Data Synchronization
**Problem**: Profile updates not reflecting across all components
**Solution**: Centralized state management with proper Redux actions

### Issue: Large Favorites Lists
**Problem**: Performance issues with users who have many favorites
**Solution**: Pagination and virtualization for large lists

### Issue: Profile Picture Upload
**Problem**: File upload and image processing complexity
**Solution**: Use cloud storage service for image handling (future enhancement)

### Issue: Privacy Concerns
**Problem**: Users want control over profile visibility
**Solution**: Implement comprehensive privacy settings and user consent

---

## Next Task Dependencies

This task enables:
- **Task 09**: Search & Recommendations (personalized recommendations based on profile)
- **Task 10**: Deployment (complete user experience for production)

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
