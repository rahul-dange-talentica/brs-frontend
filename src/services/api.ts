/**
 * Axios HTTP Client Configuration
 * Main API client with request/response interceptors and error handling
 */

import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';
import { requiresAuthentication } from '@/utils/errorHandler';

/**
 * Main Axios instance for API calls
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: API_CONFIG.WITH_CREDENTIALS, // Essential for httpOnly cookies
  headers: API_CONFIG.DEFAULT_HEADERS,
});

/**
 * Request interceptor for logging and headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Log API requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
        headers: config.headers,
      });
    }
    
    // Add Authorization header if token exists in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to requests to prevent caching issues
    if (config.params) {
      config.params._t = Date.now();
    } else {
      config.params = { _t: Date.now() };
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and authentication
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log API responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Response Error:', error);
    
    // Handle authentication errors
    if (requiresAuthentication(error)) {
      // Token expired or user not authenticated
      console.warn('Authentication required - token may have expired');
      // Note: Authentication handling will be done at component level
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check connection');
    }
    
    // Handle server errors (5xx)
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response.status);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Request retry utility for failed requests
 */
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry client errors (4xx) except 408 (timeout)
      if (axios.isAxiosError(error) && error.response?.status) {
        const status = error.response.status;
        if (status >= 400 && status < 500 && status !== 408) {
          throw error;
        }
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

/**
 * Create cancel token for request cancellation
 */
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

/**
 * Check if request was cancelled
 */
export const isRequestCancelled = (error: any): boolean => {
  return axios.isCancel(error);
};

export default apiClient;
