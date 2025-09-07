import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import PageLoader from './PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireGuest = false,
  redirectTo,
  fallback = <PageLoader />,
}) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading while authentication state is being determined
  if (!isInitialized) {
    return <>{fallback}</>;
  }

  // Handle guest-only routes (login, register)
  if (requireGuest && isAuthenticated) {
    const destination = redirectTo || '/';
    return <Navigate to={destination} replace />;
  }

  // Handle protected routes (requires authentication)
  if (requireAuth && !isAuthenticated) {
    // Store intended destination for redirect after login
    sessionStorage.setItem('intendedDestination', location.pathname + location.search);
    const destination = redirectTo || '/login';
    return <Navigate to={destination} replace />;
  }

  // Route is accessible, render children
  return <>{children}</>;
};

export default ProtectedRoute;
