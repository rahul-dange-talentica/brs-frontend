import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { AuthLayout } from '../components/common';
import { LoginForm } from '../components/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Navigate to the intended destination or home page
    const intendedDestination = sessionStorage.getItem('intendedDestination') || '/';
    sessionStorage.removeItem('intendedDestination');
    navigate(intendedDestination, { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your reading journey"
      footerText={
        <>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/register" color="primary" underline="hover">
            Sign up here
          </MuiLink>
        </>
      }
    >
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
};

export default LoginPage;
