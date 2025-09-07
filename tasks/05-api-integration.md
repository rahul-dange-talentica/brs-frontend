# Task 05: API Integration & Services

**Sequence**: 05  
**Priority**: Critical  
**Estimated Duration**: 2-3 days  
**Dependencies**: Task 01 (Project Setup), Task 03 (Redux Store), Task 04 (Authentication)  
**Assigned To**: TBD  

---

## Task Overview

Implement complete API integration with axios HTTP client, including service functions for all endpoints, request/response interceptors, error handling, and integration with Redux async thunks.

---

## Acceptance Criteria

### API Client Configuration
- [ ] **Axios Setup**: Configure base URL, timeout, and withCredentials for httpOnly cookies
- [ ] **Request Interceptors**: Add authentication headers and request logging
- [ ] **Response Interceptors**: Handle errors, token expiration, and response transformation
- [ ] **Error Handling**: Centralized API error handling with user-friendly messages

### Service Functions
- [ ] **Auth Services**: Login, register, logout, token verification
- [ ] **Books Services**: Get books, search, book details, recommendations
- [ ] **Reviews Services**: CRUD operations for reviews and ratings
- [ ] **User Services**: Profile management and favorites (future implementation)

### Error Management
- [ ] **HTTP Status Handling**: Proper handling of 4xx and 5xx errors
- [ ] **Network Error Handling**: Timeout, offline, and connection errors
- [ ] **Validation Error Mapping**: Map API validation errors to form fields
- [ ] **User Notifications**: Display appropriate error messages to users

### Integration with Redux
- [ ] **Async Thunks Integration**: Connect API services with Redux actions
- [ ] **Loading States**: Manage loading indicators during API calls
- [ ] **Error States**: Update Redux error states from API responses
- [ ] **Data Normalization**: Transform API responses for Redux store

---

## Implementation Details

### 1. API Client Configuration

Create `src/services/api.ts`:
```typescript
import axios, { AxiosResponse, AxiosError } from 'axios';
import { store } from '@/store';
import { logout } from '@/store/authSlice';
import { showNotification } from '@/store/uiSlice';

const API_BASE_URL = 'http://34.192.2.109';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Essential for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and headers
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle specific HTTP errors
    if (error.response?.status === 401) {
      // Token expired - logout user
      store.dispatch(logout());
      store.dispatch(showNotification({
        message: 'Your session has expired. Please log in again.',
        type: 'warning',
      }));
    }
    
    return Promise.reject(error);
  }
);
```

### 2. API Service Structure
```typescript
// Service pattern for all API endpoints
interface APIService {
  // Authentication
  auth: {
    login: (credentials: LoginRequest) => Promise<LoginResponse>;
    register: (userData: RegisterRequest) => Promise<RegisterResponse>;
    logout: () => Promise<{ message: string }>;
    verify: () => Promise<VerifyResponse>;
  };
  
  // Books
  books: {
    getAll: (query?: BooksQuery) => Promise<BooksResponse>;
    getById: (id: string) => Promise<BookDetailsResponse>;
    search: (query: SearchQuery) => Promise<SearchResponse>;
    getRecommendations: (type: RecommendationType) => Promise<RecommendationsResponse>;
  };
  
  // Reviews
  reviews: {
    create: (data: CreateReviewRequest) => Promise<ReviewResponse>;
    update: (id: string, data: UpdateReviewRequest) => Promise<ReviewResponse>;
    delete: (id: string) => Promise<DeleteResponse>;
    getForBook: (bookId: string, query?: ReviewsQuery) => Promise<ReviewsResponse>;
  };
}
```

### 3. Environment Configuration
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://34.192.2.109',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  POLLING_INTERVAL: parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 30000,
};
```

---

## Service Files to Create

### Core API Configuration
1. **src/services/api.ts** - Axios client configuration and interceptors
2. **src/config/api.ts** - API configuration constants
3. **src/utils/errorHandler.ts** - API error handling utilities

### Authentication Services
4. **src/services/authService.ts** - Authentication API endpoints
```typescript
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  
  verifyToken: async (): Promise<VerifyResponse> => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  },
};
```

### Books Services
5. **src/services/booksService.ts** - Books API endpoints
```typescript
export const booksService = {
  getAllBooks: async (query: BooksQuery = {}): Promise<BooksResponse> => {
    const response = await apiClient.get('/books', { params: query });
    return response.data;
  },
  
  getBookById: async (bookId: string): Promise<BookDetailsResponse> => {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data;
  },
  
  searchBooks: async (query: SearchQuery): Promise<SearchResponse> => {
    const response = await apiClient.get('/books/search', { params: query });
    return response.data;
  },
  
  getRecommendations: async (type: RecommendationType): Promise<RecommendationsResponse> => {
    const response = await apiClient.get('/books/recommendations', { 
      params: { type } 
    });
    return response.data;
  },
};
```

### Reviews Services
6. **src/services/reviewsService.ts** - Reviews API endpoints
7. **src/services/userService.ts** - User profile API endpoints (future)

### API Type Definitions
8. **src/types/api.ts** - API request/response type definitions
9. **src/types/errors.ts** - Error handling type definitions

---

## Error Handling Implementation

### 1. Error Handler Utility
```typescript
// src/utils/errorHandler.ts
export interface APIError {
  message: string;
  statusCode: number;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
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

### 2. Redux Integration Pattern
```typescript
// Pattern for integrating API services with Redux thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (query: BooksQuery = {}, { rejectWithValue }) => {
    try {
      const response = await booksService.getAllBooks(query);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(handleAPIError(error));
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
```

---

## API Endpoint Mappings

### Authentication Endpoints
| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/auth/register` | User registration | RegisterRequest | User data + message |
| POST | `/auth/login` | User login | LoginRequest | User data + httpOnly cookie |
| POST | `/auth/logout` | User logout | - | Success message |
| GET | `/auth/verify` | Token verification | - | User data + validity |

### Books Endpoints
| Method | Endpoint | Purpose | Query Params | Response |
|--------|----------|---------|-------------|----------|
| GET | `/books` | Get all books | page, limit, genre, sort | Books list + pagination |
| GET | `/books/search` | Search books | q, genre, author | Search results |
| GET | `/books/:id` | Book details | - | Book + reviews + user status |
| GET | `/books/recommendations` | Get recommendations | type, limit | Recommended books |

### Reviews Endpoints
| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/reviews` | Create review | CreateReviewRequest | Review + updated rating |
| PUT | `/reviews/:id` | Update review | UpdateReviewRequest | Updated review |
| DELETE | `/reviews/:id` | Delete review | - | Success + updated rating |
| GET | `/books/:id/reviews` | Get book reviews | page, limit, sort | Reviews list |

---

## Real-time Data Strategy

### 1. Polling Implementation
```typescript
// src/hooks/useRatingPolling.ts
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

    // Poll every 30 seconds
    intervalRef.current = setInterval(pollRating, API_CONFIG.POLLING_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookId, enabled, dispatch]);
};
```

---

## Testing Checklist

### API Client Configuration
- [ ] Axios client initializes with correct base URL
- [ ] withCredentials is set to true for cookie authentication
- [ ] Request timeout is configured appropriately
- [ ] Request/response interceptors work correctly

### Service Functions
- [ ] All authentication endpoints return expected responses
- [ ] Books service functions handle query parameters correctly
- [ ] Reviews service functions support CRUD operations
- [ ] Error responses are properly handled and transformed

### Error Handling
- [ ] HTTP error status codes trigger appropriate actions
- [ ] Network errors show user-friendly messages
- [ ] Validation errors are mapped to form fields
- [ ] Token expiration triggers automatic logout

### Redux Integration
- [ ] Async thunks integrate with API services correctly
- [ ] Loading states are managed during API calls
- [ ] Error states are updated from API responses
- [ ] Success responses update Redux store properly

---

## Performance Considerations

### Request Optimization
- [ ] Implement request debouncing for search queries
- [ ] Use request cancellation for aborted operations
- [ ] Cache frequently requested data where appropriate
- [ ] Implement retry logic for failed requests

### Response Handling
- [ ] Transform large API responses efficiently
- [ ] Implement pagination for large datasets
- [ ] Optimize polling intervals based on user activity
- [ ] Handle concurrent requests appropriately

---

## Definition of Done

- [ ] Axios HTTP client is configured with proper settings
- [ ] All API service functions are implemented and tested
- [ ] Request/response interceptors handle authentication and errors
- [ ] Error handling provides clear user feedback
- [ ] Redux integration works with all API endpoints
- [ ] Real-time polling is implemented for rating updates
- [ ] API responses are properly typed with TypeScript
- [ ] Environment configuration is flexible and secure
- [ ] Network error scenarios are handled gracefully
- [ ] Performance optimizations are in place

---

## Integration Points

### With Authentication (Task 04)
- httpOnly cookie authentication is properly configured
- Authentication state is updated from API responses
- Token expiration triggers appropriate user actions

### With Redux Store (Task 03)
- All API services integrate with Redux async thunks
- Loading and error states are managed consistently
- Data normalization happens during API response handling

### With Components (Future Tasks)
- Loading states are consumed by UI components
- Error messages are displayed to users appropriately
- API data flows correctly to component props

---

## Potential Issues & Solutions

### Issue: CORS Configuration
**Problem**: API requests blocked by CORS policy
**Solution**: Ensure backend CORS configuration allows credentials and frontend origin

### Issue: Cookie Authentication
**Problem**: httpOnly cookies not sent with requests
**Solution**: Verify withCredentials: true and correct domain configuration

### Issue: Request Timeout
**Problem**: Long-running requests timing out
**Solution**: Implement appropriate timeout values and retry logic

### Issue: Error Response Format
**Problem**: Inconsistent error response structure from backend
**Solution**: Implement error normalization in response interceptors

---

## Next Task Dependencies

This task enables:
- **Task 06**: Book Management (books API integration)
- **Task 07**: Review System (reviews API integration)
- **Task 08**: User Profile (user data API integration)
- **Task 09**: Search & Recommendations (search and recommendation APIs)

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
