/**
 * API Error Handling Utilities
 * Centralized error handling for API responses and network errors
 */

import { AxiosError } from 'axios';

export interface APIError {
  message: string;
  statusCode: number;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Handle API errors and return user-friendly messages
 */
export const handleAPIError = (error: AxiosError<APIError>): string => {
  // If backend provides a specific error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  // Handle HTTP status codes
  switch (error.response?.status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists or there is a conflict.';
    case 422:
      return 'Invalid data provided. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Service temporarily unavailable. Please try again.';
    case 503:
      return 'Service maintenance in progress. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Extract validation errors from API response for form field mapping
 */
export const getValidationErrors = (error: AxiosError<APIError>): Record<string, string[]> => {
  const validationErrors: Record<string, string[]> = {};
  
  if (error.response?.data && typeof error.response.data === 'object') {
    const responseData = error.response.data as any;
    
    // Handle the backend's specific error format
    if (responseData.errors && responseData.errors.fields) {
      Object.keys(responseData.errors.fields).forEach(field => {
        const fieldError = responseData.errors.fields[field];
        // Map backend field names to frontend field names
        const frontendFieldName = field === 'first_name' ? 'firstName' : 
                                 field === 'last_name' ? 'lastName' : field;
        validationErrors[frontendFieldName] = [fieldError.message];
      });
    }
    
    // Handle details array format as fallback
    if (responseData.errors && Array.isArray(responseData.errors.details)) {
      responseData.errors.details.forEach((err: any) => {
        const frontendFieldName = err.field === 'first_name' ? 'firstName' : 
                                 err.field === 'last_name' ? 'lastName' : err.field;
        validationErrors[frontendFieldName] = [err.message];
      });
    }
    
    // Handle standard validation format as fallback
    if (responseData.errors && typeof responseData.errors === 'object' && !responseData.errors.fields) {
      Object.keys(responseData.errors).forEach(field => {
        const fieldErrors = responseData.errors[field];
        validationErrors[field] = Array.isArray(fieldErrors) 
          ? fieldErrors 
          : [fieldErrors];
      });
    }
  }
  
  return validationErrors;
};

/**
 * Check if error is a network connectivity issue
 */
export const isNetworkError = (error: AxiosError): boolean => {
  return !error.response || error.code === 'NETWORK_ERROR';
};

/**
 * Check if error is a timeout error
 */
export const isTimeoutError = (error: AxiosError): boolean => {
  return error.code === 'ECONNABORTED';
};

/**
 * Check if error is a client-side error (4xx)
 */
export const isClientError = (error: AxiosError): boolean => {
  const status = error.response?.status;
  return status !== undefined && status >= 400 && status < 500;
};

/**
 * Check if error is a server-side error (5xx)
 */
export const isServerError = (error: AxiosError): boolean => {
  const status = error.response?.status;
  return status !== undefined && status >= 500;
};

/**
 * Check if the error indicates user needs to authenticate
 */
export const requiresAuthentication = (error: AxiosError): boolean => {
  return error.response?.status === 401;
};

/**
 * Create a standardized error response for consistent error handling
 */
export const createErrorResponse = (message: string, statusCode: number = 500): APIError => {
  return {
    message,
    statusCode,
  };
};
