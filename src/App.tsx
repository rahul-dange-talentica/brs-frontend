import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  Typography, 
  Box
} from '@mui/material';
import { 
  MainLayout, 
  ProtectedRoute 
} from './components/common';
import { 
  LoginPage, 
  RegisterPage, 
  HomePage as HomePageComponent, 
  BooksPage as BooksPageComponent, 
  BookDetailsPage,
  UserReviewsPage 
} from './pages';
import { 
  UserProfilePage,
  EditProfilePage,
  FavoritesPage
} from './components/user';
import UserDashboard from './pages/UserDashboard';
import { useAuth } from './hooks';
import { useAppDispatch } from './store/hooks';
import { setInitialized } from './store/authSlice';

function App() {
  const { isInitialized, isAuthenticated, loading, error } = useAuth();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    console.log('App mounted - isInitialized:', isInitialized, 'loading:', loading);
    // Auth initialization is now handled by initializeApp() in main.tsx
    // No need for duplicate auth verification here
    
    // Fallback: Force initialization after 5 seconds if still not initialized
    const fallbackTimeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('⚠️ App initialization timeout - forcing initialization');
        dispatch(setInitialized());
      }
    }, 5000);

    return () => clearTimeout(fallbackTimeout);
  }, [isInitialized, loading, dispatch]);
  
  // Show loading until auth is initialized
  if (!isInitialized) {
    console.log('Rendering loading screen - isInitialized:', isInitialized);
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
      >
        <Typography variant="h6" gutterBottom>
          Loading Book Review System...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Initializing authentication... (Debug: {loading ? 'loading' : 'not loading'})
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Error: {error}
          </Typography>
        )}
      </Box>
    );
  }

  console.log('Rendering main app - isInitialized:', isInitialized);
  
  return (
    <Routes>
        {/* Test route to verify routing is working */}
        <Route 
          path="/test" 
          element={
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">🎉 App is Working!</Typography>
              <Typography variant="body1">
                Authentication Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a test route to verify the app is loading correctly.
              </Typography>
            </Box>
          } 
        />
        
        {/* Guest routes - redirect to home if authenticated */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false} requireGuest={true}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <ProtectedRoute requireAuth={false} requireGuest={true}>
              <RegisterPage />
            </ProtectedRoute>
          } 
        />

        {/* Protected routes - require authentication */}
        
        {/* User Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <UserDashboard />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* User Profile Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <UserProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <EditProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/reviews" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <UserReviewsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/favorites" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <FavoritesPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Backwards compatibility routes */}
        <Route 
          path="/my-reviews" 
          element={<Navigate to="/profile/reviews" replace />}
        />
        <Route 
          path="/favorites" 
          element={<Navigate to="/profile/favorites" replace />}
        />
        <Route 
          path="/settings" 
          element={<Navigate to="/profile/edit" replace />}
        />

        {/* Public routes - accessible to everyone */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <HomePageComponent />
            </MainLayout>
          } 
        />
        <Route 
          path="/books" 
          element={
            <MainLayout>
              <BooksPageComponent />
            </MainLayout>
          } 
        />
        <Route 
          path="/books/:bookId" 
          element={
            <MainLayout>
              <BookDetailsPage />
            </MainLayout>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

// User profile system implemented in Task 08

export default App;