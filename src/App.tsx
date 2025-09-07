import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  Typography, 
  Box
} from '@mui/material';
import { 
  MainLayout, 
  Section, 
  Breadcrumbs, 
  ProtectedRoute 
} from './components/common';
import { 
  LoginPage, 
  RegisterPage, 
  HomePage as HomePageComponent, 
  BooksPage as BooksPageComponent, 
  BookDetailsPage 
} from './pages';
import { useAuth } from './hooks';
import { useAppDispatch } from './store/hooks';
import { setInitialized } from './store/authSlice';

function App() {
  const { isInitialized, isAuthenticated, verify, loading, error } = useAuth();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    console.log('App mounted - isInitialized:', isInitialized, 'loading:', loading);
    
    // Initialize auth state on app load
    if (!isInitialized) {
      console.log('Starting authentication initialization...');
      
      // In development mode, skip API verification and proceed directly
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Skipping authentication verification, proceeding with app...');
        dispatch(setInitialized());
        return;
      }
      
      // Force initialization after timeout in production
      const timeoutId = setTimeout(() => {
        console.warn('Auth verification timeout - forcing initialization');
        dispatch(setInitialized());
      }, 2000); // 2 second timeout
      
      verify()
        .then(() => {
          console.log('Auth verification completed successfully');
          clearTimeout(timeoutId);
        })
        .catch((err) => {
          console.error('Auth verification failed:', err);
          clearTimeout(timeoutId);
          dispatch(setInitialized()); // Force initialization even on error
        });
    }
  }, [isInitialized, verify, dispatch, loading]);
  
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
        <Route 
          path="/my-reviews" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <MyReviewsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <FavoritesPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
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

// Placeholder page components (keeping for future use)

const MyReviewsPage = () => (
  <Box>
    <Breadcrumbs />
    <Section title="My Reviews" subtitle="Manage and view all your book reviews">
      <Typography>Review system will be implemented in Task 07.</Typography>
    </Section>
  </Box>
);

const FavoritesPage = () => (
  <Box>
    <Breadcrumbs />
    <Section title="Favorites" subtitle="Your favorite books and reading lists">
      <Typography>Favorites feature will be implemented with user profiles in Task 08.</Typography>
    </Section>
  </Box>
);

const ProfilePage = () => (
  <Box>
    <Breadcrumbs />
    <Section title="Profile" subtitle="Manage your account and preferences">
      <Typography>User profile features will be implemented in Task 08.</Typography>
    </Section>
  </Box>
);

const SettingsPage = () => (
  <Box>
    <Breadcrumbs />
    <Section title="Settings" subtitle="Customize your BookReview experience">
      <Typography>Settings and preferences will be implemented with user profiles.</Typography>
    </Section>
  </Box>
);

export default App;