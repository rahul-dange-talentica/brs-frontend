import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, LoginRequest, RegisterRequest, AuthResponse, ApiError } from '../types';

interface AuthState {
  user: User | null;
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
  AuthResponse,
  LoginRequest,
  { rejectValue: ApiError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await authService.login(credentials);
    
    // Mock implementation for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return { user: mockUser, message: 'Login successful' };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Login failed',
      status: error.status || 401,
    });
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: ApiError }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await authService.register(userData);
    
    // Mock implementation for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return { user: mockUser, message: 'Registration successful' };
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Registration failed',
      status: error.status || 400,
    });
  }
});

export const verifyToken = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: ApiError }
>('auth/verify', async (_, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // const response = await authService.verifyToken();
    
    // Mock implementation for now
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user is stored in localStorage (temporary solution)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return { user, message: 'Token verified' };
    } else {
      throw new Error('No valid token');
    }
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Token verification failed',
      status: error.status || 401,
    });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call in Task 05
    // await authService.logout();
    
    // Mock implementation for now
    localStorage.removeItem('user');
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Logout failed',
      status: error.status || 400,
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
        // Store user in localStorage (temporary solution)
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Login failed';
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
        // Store user in localStorage (temporary solution)
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Registration failed';
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
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; // Don't show error for token verification failure
        state.isInitialized = true;
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

export default authSlice.reducer;
