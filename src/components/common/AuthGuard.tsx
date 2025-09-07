import React, { useEffect } from 'react';
import { useAuth } from '../../hooks';
import PageLoader from './PageLoader';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component that handles authentication initialization
 * and verification on app startup. This should wrap the main app
 * to ensure authentication state is properly initialized.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = <PageLoader />,
}) => {
  const { isInitialized, verify } = useAuth();

  useEffect(() => {
    // Verify authentication token on app initialization
    if (!isInitialized) {
      verify();
    }
  }, [isInitialized, verify]);

  // Show loading while authentication is being initialized
  if (!isInitialized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthGuard;
