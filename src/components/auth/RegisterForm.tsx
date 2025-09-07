import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, Divider, Grid, Button, CircularProgress } from '@mui/material';
import { FormField, PasswordField, FormError } from '../forms';
import { registerSchema, RegisterFormData } from '../../utils/validation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/authSlice';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        onSuccess?.();
      }
    } catch (error) {
      // Error handling is managed by Redux
      console.error('Registration error:', error);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError 
        error={error} 
        title="Registration Failed"
        onClose={handleClearError}
      />
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormField
            name="firstName"
            control={control}
            label="First Name"
            disabled={loading}
            placeholder="Enter your first name"
            autoComplete="given-name"
          />
        </Grid>
        <Grid item xs={6}>
          <FormField
            name="lastName"
            control={control}
            label="Last Name"
            disabled={loading}
            placeholder="Enter your last name"
            autoComplete="family-name"
          />
        </Grid>
      </Grid>

      <FormField
        name="email"
        control={control}
        label="Email Address"
        type="email"
        disabled={loading}
        placeholder="Enter your email address"
        autoComplete="email"
      />

      <Divider sx={{ my: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Password Requirements
        </Typography>
      </Divider>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Password must contain at least 8 characters with uppercase, lowercase, and number.
      </Typography>

      <PasswordField
        name="password"
        control={control}
        label="Password"
        disabled={loading}
        autoComplete="new-password"
      />

      <PasswordField
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        disabled={loading}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!isValid || loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ 
          mt: 3,
          mb: 2,
          height: 48,
          textTransform: 'none',
          fontSize: '1rem',
        }}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
        By creating an account, you agree to our{' '}
        <Typography component="span" variant="body2" color="primary">
          Terms of Service
        </Typography>
        {' '}and{' '}
        <Typography component="span" variant="body2" color="primary">
          Privacy Policy
        </Typography>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
