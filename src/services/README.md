# API Services Documentation

This directory contains all API service functions for communicating with the backend server.

## Structure

- **`api.ts`** - Main Axios client configuration with interceptors
- **`authService.ts`** - Authentication and user session management
- **`booksService.ts`** - Book data retrieval and search functionality
- **`reviewsService.ts`** - Review CRUD operations and book ratings
- **`userService.ts`** - User profile and favorites management
- **`index.ts`** - Central export file for all services

## Usage

```typescript
import { authService, booksService, reviewsService, userService } from '@/services';

// Authentication
const loginResponse = await authService.login({ email, password });

// Books
const booksResponse = await booksService.getAllBooks({ page: 1, limit: 20 });

// Reviews
const reviewResponse = await reviewsService.createReview({
  bookId: '123',
  rating: 5,
  reviewText: 'Great book!'
});

// User operations
const favoritesResponse = await userService.getFavorites();
```

## Error Handling

All services implement comprehensive error handling:
- Network errors and timeouts
- HTTP status code handling
- Validation error mapping
- User-friendly error messages
- Authentication token expiration handling

## Features

- **Retry Logic**: Automatic retry for failed requests
- **Request Cancellation**: Support for cancelling ongoing requests
- **Real-time Polling**: Rating updates via periodic polling
- **Authentication Interceptors**: Automatic token handling
- **Request/Response Logging**: Development debugging support
