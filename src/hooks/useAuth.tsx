import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginUser,
  registerUser,
  logoutUser,
  verifyToken,
  clearError,
  selectAuth,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthInitialized,
} from '../store/authSlice';
import { LoginFormData, RegisterFormData } from '../utils/validation';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isInitialized = useAppSelector(selectIsAuthInitialized);

  // Auth actions
  const login = useCallback(
    async (credentials: LoginFormData) => {
      const result = await dispatch(loginUser(credentials));
      return loginUser.fulfilled.match(result);
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData: RegisterFormData) => {
      const result = await dispatch(registerUser(userData));
      return registerUser.fulfilled.match(result);
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const result = await dispatch(logoutUser());
    return logoutUser.fulfilled.match(result);
  }, [dispatch]);

  const verify = useCallback(async () => {
    const result = await dispatch(verifyToken());
    return verifyToken.fulfilled.match(result);
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Utility functions
  const hasRole = useCallback(
    (_role: string) => {
      // This would be implemented based on your user role structure
      // For now, returning true for authenticated users
      return isAuthenticated;
    },
    [isAuthenticated]
  );

  const canAccess = useCallback(
    (_permission: string) => {
      // This would be implemented based on your permission structure
      // For now, returning true for authenticated users
      return isAuthenticated;
    },
    [isAuthenticated]
  );

  // User profile utilities
  const getUserDisplayName = useCallback(() => {
    if (!user) return 'Guest';
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  }, [user]);

  const getUserInitials = useCallback(() => {
    if (!user) return 'G';
    const firstInitial = user.firstName?.[0]?.toUpperCase() || '';
    const lastInitial = user.lastName?.[0]?.toUpperCase() || '';
    return firstInitial + lastInitial || user.email[0]?.toUpperCase() || 'U';
  }, [user]);

  // Return memoized object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // State
      user,
      isAuthenticated,
      loading,
      error,
      isInitialized,
      auth,

      // Actions
      login,
      register,
      logout,
      verify,
      clearAuthError,

      // Utilities
      hasRole,
      canAccess,
      getUserDisplayName,
      getUserInitials,
    }),
    [
      user,
      isAuthenticated,
      loading,
      error,
      isInitialized,
      auth,
      login,
      register,
      logout,
      verify,
      clearAuthError,
      hasRole,
      canAccess,
      getUserDisplayName,
      getUserInitials,
    ]
  );
};

export default useAuth;
