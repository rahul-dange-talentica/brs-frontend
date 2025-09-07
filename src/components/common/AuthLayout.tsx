import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Link as MuiLink,
  useTheme,
  Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: React.ReactNode;
  showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  showLogo = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(220, 0, 78, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          {showLogo && (
            <MuiLink
              component={Link}
              to="/"
              sx={{
                mb: 4,
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                📚 BookReview
              </Typography>
            </MuiLink>
          )}

          {/* Auth Card */}
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, md: 4 },
              width: '100%',
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Title and Subtitle */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            {/* Content */}
            {children}

            {/* Footer Text */}
            {footerText && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {footerText}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Additional Footer Links */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              mt: 4,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <MuiLink
              component={Link}
              to="/privacy"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              to="/terms"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              component={Link}
              to="/help"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Help
            </MuiLink>
          </Stack>

          {/* Copyright */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 2,
              textAlign: 'center',
              opacity: 0.7,
            }}
          >
            © {new Date().getFullYear()} BookReview Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
