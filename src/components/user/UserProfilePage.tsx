/**
 * UserProfilePage Component
 * Simple user profile page with basic information and account settings
 */

import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Alert,
  Paper,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  DateRange as DateIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserProfile,
  fetchUserStatistics,
  selectUserProfile,
  selectUserStatistics,
  selectUserLoading,
  selectUserError
} from '@/store/userSlice';
import { PageLoader } from '@/components/common';

// Simple profile page - no tabs needed

export const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const profile = useAppSelector(selectUserProfile);
  const statistics = useAppSelector(selectUserStatistics);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  // Load profile data
  useEffect(() => {
    if (user && isAuthenticated) {
      console.log('UserProfilePage: Fetching profile and statistics');
      dispatch(fetchUserProfile());
      dispatch(fetchUserStatistics());
    }
  }, [user, isAuthenticated, dispatch]);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      console.log('Account deletion requested');
    }
  };

  // Show loading state for unauthenticated users
  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  // Show loading state
  if (loading && !profile) {
    return <PageLoader message="Loading your profile..." />;
  }

  // Show error state
  if (error && !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Profile data not available. Please check the browser console for more details.
          {error && <><br />Error: {error}</>}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information and preferences
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                {/* Avatar */}
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                  src={profile?.avatar}
                >
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </Avatar>

                {/* User Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {profile?.firstName} {profile?.lastName}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {profile?.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DateIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
                    </Typography>
                  </Box>

                  {profile?.bio && (
                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{profile.bio}"
                    </Typography>
                  )}

                  {/* Stats Chips */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`${statistics?.totalReviews || 0} Reviews`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`${statistics?.favoriteBooks || 0} Favorites`} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                    {statistics?.averageRating && (
                      <Chip 
                        label={`${statistics.averageRating.toFixed(1)} ★ Avg Rating`} 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
            
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => navigate('/profile/edit')}
              >
                Settings
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Links Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/profile/reviews')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  My Reviews ({statistics?.totalReviews || 0})
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/profile/favorites')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  My Favorites ({statistics?.favoriteBooks || 0})
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/books')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Browse Books
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Danger Zone Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon color="error" />
                <Typography variant="h6" color="error">
                  Danger Zone
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Irreversible and destructive actions
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAccount}
                fullWidth
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default UserProfilePage;
