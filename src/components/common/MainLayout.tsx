import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { User } from '../../types/common';

interface MainLayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  user?: User | null;
  onLogout?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  sx?: object;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isAuthenticated,
  user,
  onLogout,
  maxWidth = 'lg',
  disableGutters = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        ...sx,
      }}
    >
      {/* Header */}
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 2, md: 3 },
          minHeight: 0, // Allows flex children to shrink
        }}
      >
        {maxWidth === false ? (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>
        ) : (
          <Container
            maxWidth={maxWidth}
            disableGutters={disableGutters}
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              px: disableGutters ? 0 : { xs: 2, sm: 3 },
            }}
          >
            {children}
          </Container>
        )}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default MainLayout;
