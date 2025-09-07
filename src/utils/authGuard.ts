/**
 * Authentication Guard Utilities
 * Helper functions to check authentication before API calls
 */

import { authService } from '@/services/authService';

/**
 * Check if user is authenticated before making API calls
 * @returns Promise<boolean> - true if authenticated, false otherwise
 */
export const ensureAuthenticated = async (): Promise<boolean> => {
  // First check if token exists
  if (!authService.hasToken()) {
    console.warn('No authentication token found');
    return false;
  }

  // Then verify token with server
  try {
    const isAuth = await authService.isAuthenticated();
    if (!isAuth) {
      console.warn('Authentication token is invalid');
    }
    return isAuth;
  } catch (error) {
    console.error('Authentication verification failed:', error);
    return false;
  }
};

/**
 * Get authentication status without making API call
 * @returns boolean - true if token exists in localStorage
 */
export const hasValidToken = (): boolean => {
  return authService.hasToken();
};

/**
 * Get current authentication token
 * @returns string | null - the JWT token or null if not found
 */
export const getAuthToken = (): string | null => {
  return authService.getToken();
};

/**
 * Check if a specific error is due to authentication issues
 * @param error - The error object
 * @returns boolean - true if it's an authentication error
 */
export const isAuthenticationError = (error: any): boolean => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

export default {
  ensureAuthenticated,
  hasValidToken,
  getAuthToken,
  isAuthenticationError,
};
