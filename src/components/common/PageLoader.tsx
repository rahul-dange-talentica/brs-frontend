import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Fade,
  Backdrop,
} from '@mui/material';

interface PageLoaderProps {
  variant?: 'circular' | 'linear' | 'backdrop';
  message?: string;
  progress?: number; // For linear variant (0-100)
  open?: boolean; // For backdrop variant
  size?: number | string;
  color?: 'primary' | 'secondary' | 'inherit';
  fullScreen?: boolean;
  minHeight?: string | number;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  variant = 'circular',
  message = 'Loading...',
  progress,
  open = true,
  size = 60,
  color = 'primary',
  fullScreen = true,
  minHeight = '50vh',
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📚 BookReview
              </Typography>
              {message && (
                <Typography variant="body2" color="text.secondary">
                  {message}
                </Typography>
              )}
            </Box>
            {progress !== undefined ? (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
            ) : (
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
            )}
            {progress !== undefined && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'center', display: 'block' }}
              >
                {Math.round(progress)}%
              </Typography>
            )}
          </Box>
        );

      case 'backdrop':
        return (
          <Backdrop
            sx={{
              color: '#fff',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              flexDirection: 'column',
              gap: 2,
            }}
            open={open}
          >
            <CircularProgress color="inherit" size={size} />
            {message && (
              <Typography variant="body1" color="inherit">
                {message}
              </Typography>
            )}
          </Backdrop>
        );

      case 'circular':
      default:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textAlign: 'center',
              p: 4,
            }}
          >
            {/* Brand/Logo */}
            <Box>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                📚 BookReview
              </Typography>
            </Box>

            {/* Loading Spinner */}
            <Box sx={{ position: 'relative' }}>
              <CircularProgress
                size={size}
                color={color}
                thickness={3}
                sx={{
                  animationDuration: '1.5s',
                }}
              />
              {/* Optional inner circle for visual appeal */}
              <CircularProgress
                size={typeof size === 'number' ? size - 20 : '40px'}
                color="secondary"
                thickness={2}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDuration: '2s',
                  animationDirection: 'reverse',
                  opacity: 0.3,
                }}
              />
            </Box>

            {/* Loading Message */}
            {message && (
              <Box>
                <Typography
                  variant="h6"
                  color="text.primary"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {message}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we prepare your content...
                </Typography>
              </Box>
            )}

            {/* Optional progress indicator */}
            {progress !== undefined && (
              <Box sx={{ width: '100%', maxWidth: 300 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: 'center', display: 'block' }}
                >
                  {Math.round(progress)}% complete
                </Typography>
              </Box>
            )}
          </Box>
        );
    }
  };

  if (variant === 'backdrop') {
    return renderLoader();
  }

  return (
    <Fade in={open} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(fullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            bgcolor: 'background.default',
            zIndex: 9999,
          }),
          ...(!fullScreen && {
            minHeight,
            width: '100%',
          }),
        }}
      >
        {renderLoader()}
      </Box>
    </Fade>
  );
};

export default PageLoader;
