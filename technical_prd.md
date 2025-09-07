# Comprehensive Technical Product Requirement Document (Technical PRD)

## Book Review Platform Frontend - Complete Technical Specifications

### 1. Technical Overview
- **Project Name**: Book Review Platform Frontend (MVP)  
- **Architecture**: Single Page Application (SPA)
- **Development Approach**: Component-based React architecture
- **Target Environment**: Development only (no staging/production initially)
- **Browser Support**: Chrome and Safari (2 years backward compatibility)

---

## 2. Technology Stack

### 2.1 Core Framework & Libraries
```
├── React 18.x                    # Main frontend framework
├── TypeScript 5.x               # Type safety and developer experience
├── Material-UI v5               # UI component library and design system
├── Redux Toolkit                # State management
├── React-Redux 8.x              # React-Redux bindings
├── React Router v6              # Client-side routing
├── Axios                        # HTTP client for API calls
└── React Hook Form              # Form management and validation
```

### 2.2 Development Tools
```
├── Vite                         # Build tool and dev server
├── ESLint                       # Code linting
├── Prettier                     # Code formatting
└── TypeScript ESLint            # TypeScript specific linting
```

### 2.3 Authentication & Security
```
├── JWT handling via httpOnly cookies
├── Axios interceptors for token management
└── Protected route components
```

---

## 3. Complete Package Dependencies

### 3.1 package.json
```json
{
  "name": "brs-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "deploy": "npm run build && aws s3 sync dist/ s3://brs-frontend-bucket --delete"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "yup": "^1.3.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.1.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### 3.2 TypeScript Configuration

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/pages/*": ["pages/*"],
      "@/store/*": ["store/*"],
      "@/services/*": ["services/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"],
      "@/hooks/*": ["hooks/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3.3 Vite Configuration

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          redux: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    }
  }
})
```

### 3.4 ESLint Configuration

#### .eslintrc.cjs
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error'],
    'react-hooks/exhaustive-deps': 'warn'
  },
}
```

---

## 4. System Architecture

### 4.1 High-Level Architecture
```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   AWS CloudFront   │────│  AWS S3 Static Site │────│   Backend API       │
│   (CDN + Caching)  │    │   (React Build)     │    │ (34.192.2.109/docs) │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
           │                           │                           │
           └───────────────────────────┼───────────────────────────┘
                                       │
                              ┌────────▼────────┐
                              │  React Frontend │
                              │  (SPA with MUI) │
                              └─────────────────┘
```

### 4.2 Frontend Application Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Header, Footer, Loading)
│   ├── auth/            # Authentication components
│   ├── books/           # Book-related components
│   ├── reviews/         # Review components
│   └── user/            # User profile components
├── pages/               # Page-level components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── BookDetailsPage.tsx
│   ├── UserProfilePage.tsx
│   └── ReviewPage.tsx
├── store/               # Redux store configuration
│   ├── index.ts         # Store setup
│   ├── authSlice.ts     # Authentication state
│   ├── booksSlice.ts    # Books state
│   ├── reviewsSlice.ts  # Reviews state
│   └── userSlice.ts     # User profile state
├── services/            # API service functions
│   ├── api.ts           # Axios configuration
│   ├── authService.ts   # Authentication APIs
│   ├── booksService.ts  # Books APIs
│   └── reviewsService.ts # Reviews APIs
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

### 4.3 Core Components Hierarchy
```
App
├── Router
│   ├── AuthLayout
│   │   ├── LoginPage
│   │   └── SignupPage
│   └── MainLayout
│       ├── Header (with Navigation)
│       ├── HomePage
│       │   ├── BookGrid
│       │   ├── SearchBar
│       │   └── RecommendationSection
│       ├── BookDetailsPage
│       │   ├── BookInfo
│       │   ├── ReviewsList
│       │   ├── RatingDisplay
│       │   └── WriteReviewForm
│       ├── UserProfilePage
│       │   ├── UserInfo
│       │   ├── FavoriteBooks
│       │   └── UserReviews
│       └── Footer
```

### 4.4 State Management Structure
```
Redux Store
├── auth: { user, token, isLoggedIn, loading }
├── books: { booksList, currentBook, searchResults, loading }
├── reviews: { reviews, userReviews, loading }
├── user: { profile, favoriteBooks, loading }
└── ui: { notifications, loading states }
```

---

## 5. Material-UI Theme Configuration

### 5.1 Theme Setup

#### src/theme/index.ts
```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#f06292',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineLine: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
```

---

## 6. Redux Store Configuration

### 6.1 Store Setup

#### src/store/index.ts
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

### 6.2 Books Slice Example
```typescript
// src/store/booksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { booksService } from '@/services/booksService';
import type { Book, BooksResponse, SearchResponse } from '@/types/api';

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

const initialState: BooksState = {
  books: [],
  currentBook: null,
  searchResults: [],
  recommendations: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (query: BooksQuery = {}) => {
    const response = await booksService.getAllBooks(query);
    return response;
  }
);

export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (query: SearchQuery) => {
    const response = await booksService.searchBooks(query);
    return response;
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId: string) => {
    const response = await booksService.getBookById(bookId);
    return response.book;
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    updateBookRating: (state, action: PayloadAction<{
      bookId: string;
      averageRating: number;
      totalReviews: number;
    }>) => {
      const { bookId, averageRating, totalReviews } = action.payload;
      
      // Update in books list
      const bookIndex = state.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        state.books[bookIndex].averageRating = averageRating;
        state.books[bookIndex].totalReviews = totalReviews;
      }
      
      // Update current book
      if (state.currentBook?.id === bookId) {
        state.currentBook.averageRating = averageRating;
        state.currentBook.totalReviews = totalReviews;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.searchResults = action.payload.books;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.currentBook = action.payload;
      });
  },
});

export const { clearSearchResults, updateBookRating } = booksSlice.actions;
export default booksSlice.reducer;
```

---

## 7. Complete API Integration Strategy

### 7.1 API Client Configuration

#### src/services/api.ts
```typescript
import axios, { AxiosResponse, AxiosError } from 'axios';
import { store } from '@/store';
import { logout } from '@/store/authSlice';
import { showNotification } from '@/store/uiSlice';

const API_BASE_URL = 'http://34.192.2.109';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any global request headers or modifications here
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      store.dispatch(
        showNotification({
          message: 'Your session has expired. Please log in again.',
          type: 'warning',
        })
      );
    } else if (error.response?.status >= 500) {
      store.dispatch(
        showNotification({
          message: 'Server error. Please try again later.',
          type: 'error',
        })
      );
    } else if (error.code === 'ECONNABORTED') {
      store.dispatch(
        showNotification({
          message: 'Request timeout. Please check your connection.',
          type: 'error',
        })
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 7.2 Authentication API Services

#### Authentication Endpoints
```typescript
// POST /auth/register
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
  message: string;
}

// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  message: string;
  // JWT token set in httpOnly cookie automatically
}

// Service Implementation
export const authService = {
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  
  verifyToken: async (): Promise<{
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    isValid: boolean;
  }> => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  }
};
```

### 7.3 Books API Services

#### Books Service Implementation
```typescript
interface Book {
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

interface BooksQuery {
  page?: number;
  limit?: number;
  genre?: string;
  sort?: 'rating' | 'title' | 'author' | 'createdAt';
  order?: 'asc' | 'desc';
}

interface BooksResponse {
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const booksService = {
  getAllBooks: async (query: BooksQuery = {}): Promise<BooksResponse> => {
    const response = await apiClient.get('/books', { params: query });
    return response.data;
  },
  
  searchBooks: async (query: {
    q: string;
    genre?: string;
    author?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    books: Book[];
    total: number;
    query: string;
  }> => {
    const response = await apiClient.get('/books/search', { params: query });
    return response.data;
  },
  
  getBookById: async (bookId: string): Promise<{
    book: Book;
    reviews: Review[];
    userReview?: Review;
    isFavorite: boolean;
  }> => {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data;
  },
  
  getRecommendations: async (query: {
    type: 'popular' | 'genre-based' | 'personalized';
    limit?: number;
    genre?: string;
  }): Promise<{
    books: Book[];
    recommendationType: string;
    message: string;
  }> => {
    const response = await apiClient.get('/books/recommendations', { params: query });
    return response.data;
  }
};
```

### 7.4 Reviews API Services

#### Reviews Service Implementation
```typescript
interface Review {
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

interface CreateReviewRequest {
  bookId: string;
  rating: number; // 1-5 stars
  reviewText: string;
  title?: string;
}

export const reviewsService = {
  createReview: async (reviewData: CreateReviewRequest): Promise<{
    review: Review;
    message: string;
    updatedBookRating: number;
  }> => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },
  
  updateReview: async (reviewId: string, reviewData: {
    rating?: number;
    reviewText?: string;
    title?: string;
  }): Promise<{
    review: Review;
    message: string;
    updatedBookRating: number;
  }> => {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },
  
  deleteReview: async (reviewId: string): Promise<{
    message: string;
    updatedBookRating: number;
  }> => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
  
  getBookReviews: async (bookId: string, query: {
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest' | 'highest-rated' | 'lowest-rated';
  } = {}): Promise<{
    reviews: Review[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReviews: number;
    };
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  }> => {
    const response = await apiClient.get(`/books/${bookId}/reviews`, { params: query });
    return response.data;
  }
};
```

### 7.5 Real-time Polling Implementation

#### Rating Updates Polling Hook
```typescript
// src/hooks/useRatingPolling.ts
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateBookRating } from '@/store/booksSlice';
import { booksService } from '@/services/booksService';

export const useRatingPolling = (bookId: string, enabled: boolean = true) => {
  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !bookId) return;

    const pollRating = async () => {
      try {
        const bookDetails = await booksService.getBookById(bookId);
        dispatch(updateBookRating({
          bookId,
          averageRating: bookDetails.book.averageRating,
          totalReviews: bookDetails.book.totalReviews
        }));
      } catch (error) {
        console.error('Failed to poll rating updates:', error);
      }
    };

    // Poll immediately
    pollRating();

    // Set up interval polling
    intervalRef.current = setInterval(pollRating, 30000); // 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookId, enabled, dispatch]);
};
```

---

## 8. Security Implementation

### 8.1 Authentication Flow
```
1. User submits login credentials
2. Backend returns JWT token via httpOnly cookie
3. Frontend stores authentication state in Redux
4. All API requests automatically include cookie
5. Token refresh handled via axios interceptors
6. Logout clears cookie and Redux state
```

### 8.2 Route Protection
```typescript
<ProtectedRoute requireAuth={true}>
  <UserProfilePage />
</ProtectedRoute>

<ProtectedRoute requireGuest={true}>
  <LoginPage />
</ProtectedRoute>
```

### 8.3 Input Validation & Security
- **Client-side**: React Hook Form with basic validation
- **Sanitization**: XSS prevention via React's built-in protection
- **API Validation**: Server-side validation handling
- **Content Security Policy**: Restrictive CSP headers

#### Content Security Policy Headers
```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
               font-src 'self' fonts.gstatic.com; 
               img-src 'self' data: https:; 
               connect-src 'self' http://34.192.2.109;">
```

---

## 9. Performance Optimization

### 9.1 Bundle Optimization
- **Tree Shaking**: Vite's automatic dead code elimination
- **Material-UI Optimization**: Selective component imports
- **Image Optimization**: WebP format support and lazy loading

### 9.2 Application Performance
- **React Optimization**: React.memo, useMemo, useCallback where needed
- **List Virtualization**: For large book lists (if needed)
- **Debounced Search**: Prevent excessive API calls during search

### 9.3 Performance Targets
| Metric | Target | Implementation |
|--------|--------|----------------|
| Page Load Time | < 5 seconds | Code splitting, optimized bundles |
| Concurrent Users | 100+ | Efficient state management |
| Bundle Size | < 1MB | Tree shaking, selective imports |
| Time to Interactive | < 3 seconds | Lazy loading, critical CSS |

---

## 10. Accessibility Implementation

### 10.1 Implemented Features
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader Support**: Proper ARIA labels and roles
- **Visual Hierarchy**: Semantic HTML and heading structure
- **Focus Management**: Focus trapping in modals and forms
- **Image Alt Text**: Descriptive alt attributes for all images

### 10.2 Material-UI Accessibility
- Built-in accessibility features from Material-UI components
- Proper color contrast ratios
- Focus indicators and keyboard shortcuts

### 10.3 Accessibility Utilities
```typescript
// src/utils/accessibility.ts
export const focusFirstElement = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  firstElement?.focus();
};

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
};
```

---

## 11. Deployment Architecture

### 11.1 AWS Infrastructure
```
AWS S3 Bucket (Static Hosting)
├── React build files (HTML, CSS, JS)
├── Static assets (images, fonts)
└── Routing configuration (SPA fallback)

AWS CloudFront Distribution
├── S3 Origin configuration
├── Custom domain setup (optional)
├── SSL/TLS certificate
└── Caching policies for static assets
```

### 11.2 Deployment Configuration

#### deploy.sh
```bash
#!/bin/bash

# Build the application
echo "Building React application..."
npm run build

# Sync to S3 bucket
echo "Deploying to AWS S3..."
aws s3 sync dist/ s3://brs-frontend-bucket --delete --exact-timestamps

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "Deployment completed successfully!"
```

#### AWS S3 Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::brs-frontend-bucket/*"
    }
  ]
}
```

#### CloudFront Distribution Configuration
```json
{
  "Origins": [
    {
      "Id": "S3-brs-frontend-bucket",
      "DomainName": "brs-frontend-bucket.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-brs-frontend-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "CustomErrorResponses": [
    {
      "ErrorCode": 403,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html",
      "ErrorCachingMinTTL": 300
    },
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html",
      "ErrorCachingMinTTL": 300
    }
  ]
}
```

---

## 12. Error Handling Strategy

### 12.1 API Error Handling
```typescript
// src/utils/errorHandler.ts
import { AxiosError } from 'axios';

interface APIError {
  message: string;
  statusCode: number;
  errors?: {
    field: string;
    message: string;
  }[];
}

export const handleAPIError = (error: AxiosError<APIError>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  switch (error.response?.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const getValidationErrors = (error: AxiosError<APIError>): Record<string, string> => {
  const validationErrors: Record<string, string> = {};
  
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach(err => {
      validationErrors[err.field] = err.message;
    });
  }
  
  return validationErrors;
};
```

### 12.2 User Experience Error Handling
- **Loading States**: Skeleton screens and progress indicators
- **Error Boundaries**: React error boundaries for component crashes
- **Graceful Degradation**: Fallback UI for network issues

---

## 13. Development Environment Setup

### 13.1 Project Initialization
```bash
# Initialize React + TypeScript + Vite project
npm create vite@latest brs-frontend -- --template react-ts

# Install core dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux react-router-dom axios react-hook-form
```

### 13.2 Development Standards
- **Code Style**: Prettier + ESLint configuration
- **Git Workflow**: Feature branches with meaningful commit messages
- **Component Standards**: Functional components with TypeScript
- **File Naming**: PascalCase for components, camelCase for utilities

### 13.3 Environment Configuration

#### .env.development
```env
VITE_API_BASE_URL=http://34.192.2.109
VITE_APP_NAME=Book Review Platform
VITE_POLLING_INTERVAL=30000
```

### 13.4 VS Code Configuration

#### .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "typescriptreact",
    "javascript": "javascriptreact"
  }
}
```

---

## 14. Component Implementation Examples

### 14.1 Book Details Page Integration
```typescript
// src/pages/BookDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookById } from '@/store/booksSlice';
import { useRatingPolling } from '@/hooks/useRatingPolling';
import { BookInfo } from '@/components/books/BookInfo';
import { ReviewsList } from '@/components/reviews/ReviewsList';

export const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const dispatch = useAppDispatch();
  const { currentBook, loading } = useAppSelector(state => state.books);
  
  // Enable real-time rating updates
  useRatingPolling(bookId || '', !!bookId);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookById(bookId));
    }
  }, [bookId, dispatch]);

  if (loading || !currentBook) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BookInfo book={currentBook} />
      <ReviewsList bookId={currentBook.id} />
    </div>
  );
};
```

### 14.2 Search Component Integration
```typescript
// src/components/search/SearchBar.tsx
import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { searchBooks } from '@/store/booksSlice';
import { TextField, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { debounce } from '@/utils/debounce';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim()) {
        dispatch(searchBooks({ q: searchQuery }));
      }
    }, 300),
    [dispatch]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <TextField
      fullWidth
      placeholder="Search books..."
      value={query}
      onChange={handleInputChange}
      InputProps={{
        endAdornment: (
          <IconButton>
            <SearchIcon />
          </IconButton>
        ),
      }}
    />
  );
};
```

---

## 15. Timeline & Milestones

### Week 1-2: Foundation & Authentication
- [ ] Project setup and configuration
- [ ] Material-UI theme and basic layout
- [ ] Redux store configuration
- [ ] Authentication system implementation
- [ ] Protected routing setup

### Week 3: Core Features
- [ ] Book browsing and search functionality
- [ ] Review CRUD operations
- [ ] Rating system implementation
- [ ] API integration and error handling

### Week 4: Polish & Deployment
- [ ] User profile pages
- [ ] Recommendation system integration
- [ ] Accessibility improvements
- [ ] AWS deployment configuration
- [ ] Final testing and bug fixes

---

## 16. Technical Risks & Mitigation

### 16.1 Identified Risks
1. **API Dependency**: Single point of failure with backend API
   - **Mitigation**: Implement proper error handling and loading states

2. **Cookie Authentication**: Browser cookie limitations
   - **Mitigation**: Test cookie behavior across target browsers

3. **Real-time Updates**: Polling performance impact
   - **Mitigation**: Optimize polling intervals and implement smart refresh

### 16.2 Success Criteria
- Page load times under 5 seconds
- Responsive design works on target browsers
- Successful authentication flow with httpOnly cookies
- Real-time rating updates via polling
- Accessible keyboard navigation

---

## 17. Browser Compatibility

### 17.1 Supported Browsers
- **Chrome**: Version 88+ (January 2021)
- **Safari**: Version 14+ (September 2020)
- **Edge**: Chromium-based versions (79+)

### 17.2 Polyfills (if needed)
```typescript
// src/polyfills.ts
// Add any polyfills for older browser support
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

---

## 18. Testing Strategy (Future Enhancement)

### 18.1 Mock API Responses
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/books', (req, res, ctx) => {
    return res(
      ctx.json({
        books: [
          {
            id: '1',
            title: 'Sample Book',
            author: 'Sample Author',
            averageRating: 4.5,
            totalReviews: 10,
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBooks: 1,
        },
      })
    );
  }),
];
```

---

## 19. Architecture Summary

### 19.1 Key Business Requirements Addressed

✅ **User Authentication**: JWT-based auth with httpOnly cookies  
✅ **Book Browsing & Search**: Advanced search with filters and pagination  
✅ **Review System**: CRUD operations with 1-5 star ratings  
✅ **Real-time Updates**: Polling-based rating updates every 30 seconds  
✅ **User Profiles**: Personal dashboards with favorites and review history  
✅ **Recommendations**: Popular, genre-based, and personalized suggestions  
✅ **Responsive Design**: Desktop-first approach with mobile adaptation  
✅ **Performance**: Sub-5 second load times, support for 100+ concurrent users  

### 19.2 Architecture Highlights

**Frontend Technology Stack**
```
React 18 + TypeScript 5
├── Material-UI v5 (Design System)
├── Redux Toolkit (State Management)
├── React Router v6 (Navigation)
├── Axios (HTTP Client)
├── React Hook Form (Form Management)
└── Vite (Build Tool)
```

**Infrastructure & Deployment**
```
AWS CloudFront (CDN)
├── AWS S3 (Static Hosting)
├── Backend API (34.192.2.109)
└── JWT httpOnly Cookies (Authentication)
```

---

**Next Steps**: 
1. Review and approve Technical PRD
2. Set up development environment and repository
3. Create detailed UI mockups and component specifications
4. Begin implementation following the defined architecture

---

**Status**: ✅ Complete Technical PRD - Ready for Implementation  
**Last Updated**: January 2025  
**Architecture Version**: 1.0  
**Estimated Implementation Time**: 4 weeks