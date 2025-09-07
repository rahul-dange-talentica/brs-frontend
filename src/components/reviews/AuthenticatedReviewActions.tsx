/**
 * AuthenticatedReviewActions Component
 * Wrapper component that ensures user is authenticated before allowing review actions
 */

import React from 'react';
import { Alert, Button } from '@mui/material';
import { useAppSelector } from '@/store/hooks';

interface AuthenticatedReviewActionsProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onAuthRequired?: () => void;
}

export const AuthenticatedReviewActions: React.FC<AuthenticatedReviewActionsProps> = ({
  children,
  fallback,
  onAuthRequired
}) => {
  const { isAuthenticated, user, isInitialized } = useAppSelector(state => state.auth);

  // Wait for auth initialization to complete
  if (!isInitialized) {
    return <>{fallback || children}</>; // Show fallback or children while initializing
  }

  // Show fallback or login prompt if not authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert 
        severity="info" 
        action={
          <Button color="inherit" size="small" onClick={onAuthRequired}>
            Login
          </Button>
        }
      >
        Please log in to write reviews
      </Alert>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthenticatedReviewActions;