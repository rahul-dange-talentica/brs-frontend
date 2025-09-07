# Task 03: Redux Store Configuration

**Sequence**: 03  
**Priority**: High  
**Estimated Duration**: 2-3 days  
**Dependencies**: Task 01 (Project Setup)  
**Assigned To**: TBD  

---

## Task Overview

Configure Redux Toolkit store with all required slices for state management including authentication, books, reviews, user profile, and UI state according to the Technical PRD specifications.

---

## Acceptance Criteria

### Store Configuration
- [ ] Configure Redux Toolkit store with proper middleware
- [ ] Set up Redux DevTools integration
- [ ] Implement typed hooks for TypeScript integration
- [ ] Configure serializable state check with proper ignored actions

### State Slices
- [ ] **Auth Slice**: User authentication state management
- [ ] **Books Slice**: Books data, search results, and current book state
- [ ] **Reviews Slice**: Review data and user reviews
- [ ] **User Slice**: User profile and preferences
- [ ] **UI Slice**: Global UI state, notifications, and loading states

### Async Actions
- [ ] Create async thunks for API calls
- [ ] Implement proper error handling in async actions
- [ ] Set up loading states for all async operations
- [ ] Handle optimistic updates where appropriate

### TypeScript Integration
- [ ] Type all state interfaces and action payloads
- [ ] Create typed versions of useSelector and useDispatch hooks
- [ ] Export all necessary types for components

---

## Implementation Details

### 1. Store Configuration

Create `src/store/index.ts`:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import booksReducer from './booksSlice';
import reviewsReducer from './reviewsSlice';
import userReducer from './userSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    reviews: reviewsReducer,
    user: userReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. Typed Hooks

Create `src/store/hooks.ts`:
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3. State Structure Overview
```typescript
// Complete Redux state structure
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  books: {
    books: Book[],
    currentBook: Book | null,
    searchResults: Book[],
    recommendations: Book[],
    loading: boolean,
    error: string | null,
    pagination: PaginationState | null
  },
  reviews: {
    reviews: Review[],
    userReviews: Review[],
    loading: boolean,
    error: string | null
  },
  user: {
    profile: UserProfile | null,
    favoriteBooks: Book[],
    loading: boolean,
    error: string | null
  },
  ui: {
    notifications: Notification[],
    globalLoading: boolean,
    mobileMenuOpen: boolean,
    theme: 'light' | 'dark'
  }
}
```

---

## Files to Create

### Core Store Files
1. **src/store/index.ts** - Main store configuration
2. **src/store/hooks.ts** - Typed Redux hooks
3. **src/types/index.ts** - Global TypeScript types

### State Slices
4. **src/store/authSlice.ts** - Authentication state management
5. **src/store/booksSlice.ts** - Books and search state management
6. **src/store/reviewsSlice.ts** - Reviews state management
7. **src/store/userSlice.ts** - User profile state management
8. **src/store/uiSlice.ts** - UI state management

### Type Definitions
9. **src/types/auth.ts** - Authentication related types
10. **src/types/api.ts** - API response types
11. **src/types/ui.ts** - UI component types

---

## Detailed Slice Implementations

### Auth Slice (`src/store/authSlice.ts`)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest) => {
    const response = await authService.register(userData);
    return response;
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verify',
  async () => {
    const response = await authService.verifyToken();
    return response;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
  }
);
```

### Books Slice (`src/store/booksSlice.ts`)
```typescript
interface BooksState {
  books: Book[];
  currentBook: Book | null;
  searchResults: Book[];
  recommendations: Book[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
  } | null;
}

// Key features from Technical PRD
export const fetchBooks = createAsyncThunk(/*...*/);
export const searchBooks = createAsyncThunk(/*...*/);
export const fetchBookById = createAsyncThunk(/*...*/);
export const updateBookRating = createAction(/*...*/);
```

### Reviews Slice (`src/store/reviewsSlice.ts`)
```typescript
interface ReviewsState {
  reviews: Review[];
  userReviews: Review[];
  loading: boolean;
  error: string | null;
}

export const createReview = createAsyncThunk(/*...*/);
export const updateReview = createAsyncThunk(/*...*/);
export const deleteReview = createAsyncThunk(/*...*/);
export const fetchBookReviews = createAsyncThunk(/*...*/);
```

### UI Slice (`src/store/uiSlice.ts`)
```typescript
interface UIState {
  notifications: Notification[];
  globalLoading: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
}

// Synchronous actions for UI state
export const showNotification = createAction(/*...*/);
export const hideNotification = createAction(/*...*/);
export const toggleMobileMenu = createAction(/*...*/);
export const setGlobalLoading = createAction(/*...*/);
```

---

## TypeScript Type Definitions

### Core API Types (`src/types/api.ts`)
```typescript
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  averageRating: number;
  totalReviews: number;
  isbn: string;
  publishedDate: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  reviewText: string;
  title?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}
```

### Authentication Types (`src/types/auth.ts`)
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}
```

---

## Testing Checklist

### Store Configuration
- [ ] Store initializes without errors
- [ ] All slices are properly registered
- [ ] Redux DevTools extension works in development
- [ ] TypeScript types are properly exported

### State Management
- [ ] Initial state is correctly set for all slices
- [ ] Actions update state immutably
- [ ] Async thunks handle pending/fulfilled/rejected states
- [ ] Error states are properly managed

### TypeScript Integration
- [ ] useAppSelector provides proper type inference
- [ ] useAppDispatch works with async thunks
- [ ] All action creators are properly typed
- [ ] State types match component expectations

### Redux DevTools
- [ ] Actions appear in DevTools with clear names
- [ ] State changes are trackable and debuggable
- [ ] Time-travel debugging works correctly
- [ ] Async actions show proper lifecycle states

---

## Integration Points

### With Authentication (Task 04)
- Auth slice will manage login/logout state
- User profile data will be stored and persisted
- Protected routes will read authentication state

### With API Integration (Task 05)
- Async thunks will call API service functions
- Error handling will integrate with API error responses
- Loading states will be managed during API calls

### With UI Components (Task 02)
- UI slice will manage global loading states
- Mobile menu state will be controlled by Redux
- Notification system will be Redux-based

---

## Performance Considerations

### State Normalization
- [ ] Implement normalized state structure for books and reviews
- [ ] Use entity adapters from Redux Toolkit where appropriate
- [ ] Avoid deeply nested state structures

### Memoization
- [ ] Use createSelector for derived state
- [ ] Implement proper memoization for expensive computations
- [ ] Cache frequently accessed data

### Bundle Size
- [ ] Import only necessary Redux Toolkit features
- [ ] Use code splitting for large state slices
- [ ] Configure proper tree-shaking

---

## Definition of Done

- [ ] Redux store is configured with all required slices
- [ ] TypeScript integration is complete and type-safe
- [ ] All async thunks are implemented with proper error handling
- [ ] State updates are immutable and performant
- [ ] Redux DevTools integration works correctly
- [ ] All state interfaces are properly typed
- [ ] Store is ready for component integration
- [ ] Performance optimizations are in place

---

## Potential Issues & Solutions

### Issue: State Serialization
**Problem**: Non-serializable values in Redux state
**Solution**: Configure serializableCheck to ignore specific actions and use proper data types

### Issue: TypeScript Complexity
**Problem**: Complex type definitions for nested state
**Solution**: Use utility types and keep interfaces focused and simple

### Issue: Action Naming Conflicts
**Problem**: Similar action names across slices
**Solution**: Use descriptive prefixes and follow consistent naming conventions

---

## Next Task Dependencies

This task enables:
- **Task 04**: Authentication (auth slice integration)
- **Task 05**: API Integration (async thunks with API services)
- **Task 06**: Book Management (books slice usage)
- **Task 07**: Review System (reviews slice integration)

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
