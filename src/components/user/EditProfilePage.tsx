/**
 * EditProfilePage Component
 * Profile editing interface with form validation
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserProfile,
  updateUserProfile,
  selectUserProfile,
  selectProfileUpdateLoading,
  selectUserError,
  clearError
} from '@/store/userSlice';
import {
  ProfileForm,
  UserAvatar
} from '@/components/user';
import { PageLoader } from '@/components/common';
import { ProfileFormData } from './types';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const profile = useAppSelector(selectUserProfile);
  const loading = useAppSelector(selectProfileUpdateLoading);
  const error = useAppSelector(selectUserError);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load profile data - always fetch fresh data for editing
  useEffect(() => {
    if (user && isAuthenticated) {
      console.log('EditProfilePage: Fetching fresh profile data');
      dispatch(fetchUserProfile());
    }
  }, [user, isAuthenticated, dispatch]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Prompt user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
    }
    navigate('/profile');
  };

  const handleSaveProfile = async (formData: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        // Add other profile fields as needed
      })).unwrap();

      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setHasUnsavedChanges(false);
      
      // Navigate back to profile after successful update
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      // Error is handled by the useEffect above
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  // Show loading state for unauthenticated users
  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Please log in to edit your profile.
        </Alert>
      </Container>
    );
  }

  // Show loading state
  if (!profile) {
    return <PageLoader message="Loading your profile..." />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Profile
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Edit Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update your personal information and preferences
        </Typography>
        
        {/* Refresh Button for Fresh Data */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => dispatch(fetchUserProfile())}
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Picture Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Profile Picture
              </Typography>
              <UserAvatar 
                profile={profile}
                editable={true}
                size="large"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Click to upload a new profile picture
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form Section */}
        <Grid item xs={12} md={8}>
          <ProfileForm
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={handleCancel}
            onChange={handleFormChange}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Account Management Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These actions cannot be undone. Please proceed with caution.
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              disabled={loading}
            >
              Reset Password
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              disabled={loading}
            >
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProfilePage;
