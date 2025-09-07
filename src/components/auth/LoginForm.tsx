import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Link, Typography, CircularProgress } from '@mui/material';
import { FormField, PasswordField, FormError } from '../forms';
import { loginSchema, LoginFormData } from '../../utils/validation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/authSlice';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(result)) {
        onSuccess?.();
      }
    } catch (error) {
      // Error handling is managed by Redux
      console.error('Login error:', error);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError 
        error={error} 
        title="Login Failed"
        onClose={handleClearError}
      />
      
      <FormField
        name="email"
        control={control}
        label="Email Address"
        type="email"
        autoComplete="email"
        disabled={loading}
        placeholder="Enter your email address"
      />

      <PasswordField
        name="password"
        control={control}
        label="Password"
        disabled={loading}
        autoComplete="current-password"
      />

      <Box sx={{ mt: 1, mb: 3, textAlign: 'right' }}>
        <Link
          href="#"
          variant="body2"
          color="primary"
          sx={{ textDecoration: 'none' }}
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!isValid || loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ 
          mb: 2,
          height: 48,
          textTransform: 'none',
          fontSize: '1rem',
        }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Demo credentials: test@example.com / password
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
