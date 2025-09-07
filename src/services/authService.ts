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
      
      // Store the JWT token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        
        // Set token expiration timer
        const expiresIn = response.data.expires_in || 1800; // 30 minutes default
        setTimeout(() => {
          localStorage.removeItem('authToken');
          // Could dispatch logout action here
        }, expiresIn * 1000);
      }
      
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
      
      // Store the JWT token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        
        // Set token expiration timer
        const expiresIn = response.data.expires_in || 1800; // 30 minutes default
        setTimeout(() => {
          localStorage.removeItem('authToken');
          // Could dispatch logout action here
        }, expiresIn * 1000);
      }
      
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
      
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      
      return response.data;
    });
  },

  /**
   * Verify user authentication token and get user data
   */
  verifyToken: async (): Promise<VerifyResponse> => {
    return retryRequest(async () => {
      // Check if token exists first
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.AUTH.ME
      );
      
      // Transform the user response to match our VerifyResponse format
      const backendUser = response.data;
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
        message: 'Token verified successfully'
      };
    });
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      // Quick check for token existence
      const token = localStorage.getItem('authToken');
      if (!token) {
        return false;
      }
      
      const result = await authService.verifyToken();
      return result.success && result.user !== null;
    } catch (error) {
      // If verification fails, remove invalid token
      localStorage.removeItem('authToken');
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
      // If verification fails, remove invalid token
      localStorage.removeItem('authToken');
      return null;
    }
  },

  /**
   * Check if user has a valid token in localStorage
   */
  hasToken: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get the current token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },
};

export default authService;
