/**
 * Authentication Service
 * API endpoints for user authentication, registration, and session management
 */

import { apiClient, retryRequest } from './api';
import { API_CONFIG } from '@/config/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
  VerifyResponse,
  UserProfile,
} from '@/types/api';

/**
 * Authentication service functions
 */
export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginRequest): Promise<{ success: boolean; user: UserProfile; message: string }> => {
    return retryRequest(async () => {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // Transform backend response to frontend format
      const backendUser = response.data.user;
      const frontendUser: UserProfile = {
        id: backendUser.id,
        email: backendUser.email,
        firstName: backendUser.first_name,
        lastName: backendUser.last_name,
        favoriteGenres: [],
        totalReviews: 0,
        averageRating: 0,
        createdAt: backendUser.created_at,
        updatedAt: backendUser.updated_at,
      };
      
      return {
        success: true,
        user: frontendUser,
        message: 'Login successful! Welcome back.'
      };
    });
  },

  /**
   * Register new user account
   */
  register: async (userData: RegisterRequest): Promise<{ success: boolean; user: UserProfile; message: string }> => {
    return retryRequest(async () => {
      // Transform field names to match backend API
      const backendData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      };
      
      const response = await apiClient.post<RegisterResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        backendData
      );
      
      // Transform backend response to frontend format
      const backendUser = response.data.user;
      const frontendUser: UserProfile = {
        id: backendUser.id,
        email: backendUser.email,
        firstName: backendUser.first_name,
        lastName: backendUser.last_name,
        favoriteGenres: [],
        totalReviews: 0,
        averageRating: 0,
        createdAt: backendUser.created_at,
        updatedAt: backendUser.updated_at,
      };
      
      return {
        success: true,
        user: frontendUser,
        message: 'Registration successful! Welcome to Book Review System.'
      };
    });
  },

  /**
   * Logout user and clear authentication cookies
   */
  logout: async (): Promise<LogoutResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.post<LogoutResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGOUT
      );
      return response.data;
    });
  },

  /**
   * Verify user authentication token and get user data
   */
  verifyToken: async (): Promise<VerifyResponse> => {
    return retryRequest(async () => {
      const response = await apiClient.get<VerifyResponse>(
        API_CONFIG.ENDPOINTS.AUTH.VERIFY
      );
      return response.data;
    });
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const result = await authService.verifyToken();
      return result.success && result.user !== null;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get current user data (if authenticated)
   */
  getCurrentUser: async () => {
    try {
      const result = await authService.verifyToken();
      return result.success ? result.user : null;
    } catch (error) {
      return null;
    }
  },
};

export default authService;
