import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserProfile, ApiError } from '../types';
import { LoginRequest, RegisterRequest } from '@/types/api';
import { authService } from '@/services';
import { handleAPIError, getValidationErrors } from '@/utils/errorHandler';
import { AxiosError } from 'axios';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
};

// Async thunks - these will be connected to actual API services in Task 05
export const loginUser = createAsyncThunk<
  { user: UserProfile; message: string },
  LoginRequest,
  { rejectValue: ApiError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    
    if (response.success && response.user) {
      return { user: response.user, message: response.message };
    } else {
      throw new Error(response.message || 'Login failed');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 401,
        errors: getValidationErrors(error),
      });
    }
    return rejectWithValue({
      message: error.message || 'Login failed',
      status: 401,
    });
  }
});

export const registerUser = createAsyncThunk<
  { user: UserProfile; message: string },
  RegisterRequest,
  { rejectValue: ApiError }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.register(userData);
    
    if (response.success && response.user) {
      return { user: response.user, message: response.message };
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
        errors: getValidationErrors(error),
      });
    }
    return rejectWithValue({
      message: error.message || 'Registration failed',
      status: 400,
    });
  }
});

export const verifyToken = createAsyncThunk<
  { user: UserProfile; message: string },
  void,
  { rejectValue: ApiError }
>('auth/verify', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.verifyToken();
    
    if (response.success && response.user) {
      return { user: response.user, message: response.message || 'Token verified' };
    } else {
      throw new Error('No valid token');
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 401,
      });
    }
    return rejectWithValue({
      message: error.message || 'Token verification failed',
      status: 401,
    });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: handleAPIError(error),
        status: error.response?.status || 400,
      });
    }
    return rejectWithValue({
      message: error.message || 'Logout failed',
      status: 400,
    });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || action.error?.message || 'Login failed';
        state.isInitialized = true;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || action.error?.message || 'Registration failed';
        state.isInitialized = true;
      })
      // Verify token cases
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; // Don't show error for token verification failure
        state.isInitialized = true;
        
        // Log the verification failure for debugging
        console.warn('Token verification failed:', action.payload?.message || 'Unknown error');
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
        // Still clear user data even if logout request fails
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setInitialized, resetAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsAuthInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;

const authReducer = authSlice.reducer;
export default authReducer;
