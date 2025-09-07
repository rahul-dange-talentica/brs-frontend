/**
 * UserDashboard Component
 * Main user dashboard page showing profile overview and recent activity
 */

import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Alert,
  Paper,
  Skeleton
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserProfile,
  fetchUserStatistics,
  fetchUserActivity,
  fetchFavoriteBooks,
  fetchUserReviews,
  selectUserProfile,
  selectUserStatistics,
  selectUserActivity,
  selectFavoriteBooks,
  selectUserLoading,
  selectStatisticsLoading,
  selectActivityLoading,
  selectFavoritesLoading,
  selectUserError
} from '@/store/userSlice';
import { 
  ProfileSummary,
  ReadingStatistics,
  RecentActivity,
  QuickActions,
  FavoritesList
} from '@/components/user';
import { PageLoader } from '@/components/common';

interface DashboardSkeletonProps {
  showProfileCard?: boolean;
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ showProfileCard = true }) => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Grid container spacing={3}>
      {showProfileCard && (
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={120} />
          </Paper>
        </Grid>
      )}
      <Grid item xs={12} md={showProfileCard ? 8 : 12}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="text" height={32} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={6} key={item}>
                    <Skeleton variant="rectangular" height={80} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="text" height={32} sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={6} key={item}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="text" height={32} sx={{ mb: 2 }} />
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" height={16} width="60%" />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Container>
);

export const UserDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const profile = useAppSelector(selectUserProfile);
  const statistics = useAppSelector(selectUserStatistics);
  const recentActivity = useAppSelector(selectUserActivity);
  const favoriteBooks = useAppSelector(selectFavoriteBooks);
  // const userReviews = useAppSelector(selectUserReviews); // Not used in dashboard
  const profileLoading = useAppSelector(selectUserLoading);
  const statisticsLoading = useAppSelector(selectStatisticsLoading);
  const activityLoading = useAppSelector(selectActivityLoading);
  const favoritesLoading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectUserError);

  // Check if any critical data is still loading
  const isInitialLoading = profileLoading && !profile;

  useEffect(() => {
    if (user && isAuthenticated) {
      // Load all user dashboard data
      const promises = [
        dispatch(fetchUserProfile()),
        dispatch(fetchUserStatistics()),
        dispatch(fetchUserActivity({ limit: 10 })),
        dispatch(fetchFavoriteBooks({ skip: 0, limit: 8 })), // Limit for dashboard preview
        dispatch(fetchUserReviews({ page: 1, limit: 5 })) // Recent reviews for dashboard
      ];

      // Handle any potential errors gracefully
      Promise.allSettled(promises).then(results => {
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(`Dashboard data load ${index} failed:`, result.reason);
          }
        });
      });
    }
  }, [user, isAuthenticated, dispatch]);

  // Show loading state for unauthenticated users
  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please log in to view your dashboard.
        </Alert>
      </Container>
    );
  }

  // Show initial loading state
  if (isInitialLoading) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  // Show error state if profile failed to load
  if (error && !profile) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <DashboardSkeleton showProfileCard={false} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {profile?.firstName || user.email}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your reading journey
        </Typography>
      </Box>

      {/* Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Profile Summary */}
        <Grid item xs={12} md={4}>
          {profile ? (
            <ProfileSummary profile={profile} />
          ) : (
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={120} />
            </Paper>
          )}
          
          {/* Quick Actions */}
          <Box sx={{ mt: 3 }}>
            <QuickActions />
          </Box>
        </Grid>

        {/* Right Column - Statistics and Activity */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Reading Statistics */}
            <Grid item xs={12} lg={6}>
              {statisticsLoading ? (
                <Paper sx={{ p: 2 }}>
                  <Skeleton variant="text" height={32} sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((item) => (
                      <Grid item xs={6} key={item}>
                        <Skeleton variant="rectangular" height={80} />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              ) : (
                <ReadingStatistics statistics={statistics} />
              )}
            </Grid>

            {/* Recent Favorites Preview */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Favorites
                </Typography>
                {favoritesLoading ? (
                  <Grid container spacing={1}>
                    {[1, 2, 3, 4].map((item) => (
                      <Grid item xs={6} key={item}>
                        <Skeleton variant="rectangular" height={150} />
                      </Grid>
                    ))}
                  </Grid>
                ) : favoriteBooks.length > 0 ? (
                  <FavoritesList 
                    books={favoriteBooks.slice(0, 4)} 
                    compact 
                    gridCols={2}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No favorite books yet. Start exploring!
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              {activityLoading ? (
                <Paper sx={{ p: 3 }}>
                  <Skeleton variant="text" height={32} sx={{ mb: 2 }} />
                  {[1, 2, 3].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" height={16} width="60%" />
                      </Box>
                    </Box>
                  ))}
                </Paper>
              ) : (
                <RecentActivity activities={recentActivity} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Error Alert for Non-Critical Errors */}
      {error && profile && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Some dashboard data could not be loaded: {error}
        </Alert>
      )}
    </Container>
  );
};

export default UserDashboard;
