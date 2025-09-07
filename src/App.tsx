import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  AutoStories as AutoStoriesIcon,
  RateReview as RateReviewIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { MainLayout, AuthLayout, Section, Breadcrumbs } from './components/common';
import ReduxTest from './components/common/ReduxTest';
import { User } from './types/common';

// Mock user data for demonstration
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser(mockUser);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Routes>
      {/* Authentication routes */}
      <Route 
        path="/login" 
        element={
          <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to continue your reading journey"
            footerText={
              <>
                Don't have an account?{' '}
                <Button variant="text" size="small" href="/register">
                  Sign up here
                </Button>
              </>
            }
          >
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Login form would go here
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Demo Login
              </Button>
            </Box>
          </AuthLayout>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthLayout 
            title="Join BookReview" 
            subtitle="Create an account to start reviewing and discovering books"
            footerText={
              <>
                Already have an account?{' '}
                <Button variant="text" size="small" href="/login">
                  Sign in here
                </Button>
              </>
            }
          >
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Registration form would go here
              </Typography>
            </Box>
          </AuthLayout>
        } 
      />

      {/* Main application routes */}
      <Route 
        path="/*" 
        element={
          <MainLayout
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          >
            <Routes>
              <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/my-reviews" element={<MyReviewsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </MainLayout>
        } 
      />
    </Routes>
  );
}

// Home Page Component
const HomePage: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const stats = [
    { label: 'Books', value: '10,234', icon: AutoStoriesIcon, color: 'primary' },
    { label: 'Reviews', value: '45,123', icon: RateReviewIcon, color: 'secondary' },
    { label: 'Users', value: '8,567', icon: PeopleIcon, color: 'success' },
    { label: 'This Month', value: '+2,341', icon: TrendingUpIcon, color: 'info' },
  ] as const;

  return (
    <Box>
      <Breadcrumbs />
      
      <Section
        title="Welcome to BookReview Platform"
        subtitle="Discover your next favorite book through community-driven reviews and recommendations."
        variant="default"
        spacing="large"
      >
        {!isAuthenticated && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                size="large" 
                href="/register"
                sx={{ minWidth: 120 }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                href="/login"
                sx={{ minWidth: 120 }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Card 
                sx={{ 
                  textAlign: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <stat.icon 
                    sx={{ 
                      fontSize: 40, 
                      color: `${stat.color}.main`, 
                      mb: 1 
                    }} 
                  />
                  <Typography variant="h4" component="div" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <ReduxTest />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Features Coming Soon
          </Typography>
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ gap: 1 }}
          >
            <Chip label="Book Search & Filtering" color="primary" />
            <Chip label="Advanced Reviews" color="secondary" />
            <Chip label="Personal Recommendations" color="success" />
            <Chip label="Reading Lists" color="info" />
            <Chip label="User Profiles" color="warning" />
            <Chip label="Community Features" color="primary" variant="outlined" />
          </Stack>
        </Box>
      </Section>
    </Box>
  );
};

// Placeholder page components
const BooksPage = () => (
  <Box>
    <Breadcrumbs />
    <Section title="Browse Books" subtitle="Discover and explore our extensive book collection">
      <Typography>Book management features will be implemented in Task 06.</Typography>
    </Section>
  </Box>
);

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
