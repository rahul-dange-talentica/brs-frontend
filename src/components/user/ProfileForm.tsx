/**
 * ProfileForm Component
 * Form for editing user profile information with validation
 */

import React, { useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserProfile } from '@/types/api';
import { ProfileFormData } from './types';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  onChange?: () => void;
  loading?: boolean;
  error?: string | null;
}

// Validation schema
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(1, 'First name must be at least 1 character')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(1, 'Last name must be at least 1 character')
    .max(50, 'Last name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address'),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  location: yup
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  preferences: yup.object({
    emailNotifications: yup.boolean().default(true),
    reviewNotifications: yup.boolean().default(true),
    recommendationEmails: yup.boolean().default(true),
    publicProfile: yup.boolean().default(true)
  })
});

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  onCancel,
  onChange,
  loading = false,
  error = null
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
    reset
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      bio: profile.bio || '',
      location: (profile as any).location || '',
      preferences: {
        emailNotifications: true,
        reviewNotifications: true,
        recommendationEmails: true,
        publicProfile: true
      }
    },
    mode: 'onChange'
  });

  // Watch for form changes
  const watchedValues = watch();

  useEffect(() => {
    if (isDirty && onChange) {
      onChange();
    }
  }, [isDirty, onChange, watchedValues]);

  // Reset form when profile changes
  useEffect(() => {
    reset({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      bio: profile.bio || '',
      location: (profile as any).location || '',
      preferences: {
        emailNotifications: true,
        reviewNotifications: true,
        recommendationEmails: true,
        publicProfile: true
      }
    });
  }, [profile, reset]);

  const onSubmit = async (data: any) => {
    try {
      await onSave(data);
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  helperText={errors.email?.message || 'Your email address'}
                  disabled={loading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Location (Optional)"
                  error={!!errors.location}
                  helperText={errors.location?.message || 'City, Country'}
                  disabled={loading}
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
                  rows={4}
                  label="Bio (Optional)"
                  error={!!errors.bio}
                  helperText={
                    errors.bio?.message || 
                    `${field.value?.length || 0}/500 characters - Tell others about yourself`
                  }
                  inputProps={{ maxLength: 500 }}
                  disabled={loading}
                />
              )}
            />
          </Grid>

          {/* Preferences Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Privacy & Notifications
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
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Email notifications</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive email updates about new features and recommendations
                        </Typography>
                      </Box>
                    }
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
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Review notifications</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Get notified when others interact with your reviews
                        </Typography>
                      </Box>
                    }
                  />
                )}
              />

              <Controller
                name="preferences.recommendationEmails"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Recommendation emails</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive personalized book recommendations via email
                        </Typography>
                      </Box>
                    }
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
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Public profile</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Allow others to view your profile and reading activity
                        </Typography>
                      </Box>
                    }
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>

        {/* Form Actions */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            size="large"
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || !isValid || loading}
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ProfileForm;
