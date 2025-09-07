import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { AuthLayout } from '../components/common';
import { RegisterForm } from '../components/auth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    // Navigate to home page after successful registration
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout
      title="Join BookReview"
      subtitle="Create an account to start reviewing and discovering books"
      footerText={
        <>
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" color="primary" underline="hover">
            Sign in here
          </MuiLink>
        </>
      }
    >
      <RegisterForm onSuccess={handleRegistrationSuccess} />
    </AuthLayout>
  );
};

export default RegisterPage;
