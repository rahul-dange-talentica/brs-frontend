import React from 'react';
import { Box, Skeleton, Card, CardContent, Stack } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'book-card' | 'review-card' | 'profile-header' | 'text-block' | 'custom';
  count?: number;
  sx?: object;
  children?: React.ReactNode;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text-block',
  count = 1,
  sx = {},
  children,
}) => {
  const renderSkeletonContent = () => {
    switch (variant) {
      case 'book-card':
        return (
          <Card sx={{ height: 300, ...sx }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={80} height={120} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="90%" height={16} />
                    <Skeleton variant="text" width="70%" height={16} />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton variant="rectangular" width={100} height={24} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      case 'review-card':
        return (
          <Card sx={{ ...sx }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="text" width="50%" height={16} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={20} />
              </Box>
              <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="80%" height={16} />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="rectangular" width={60} height={20} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      case 'profile-header':
        return (
          <Box sx={{ ...sx }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Skeleton variant="circular" width={80} height={80} />
              <Box sx={{ ml: 3, flexGrow: 1 }}>
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="30%" height={16} />
              </Box>
              <Skeleton variant="rectangular" width={100} height={36} />
            </Box>
            <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
              <Box>
                <Skeleton variant="text" width={60} height={24} />
                <Skeleton variant="text" width={40} height={20} />
              </Box>
              <Box>
                <Skeleton variant="text" width={60} height={24} />
                <Skeleton variant="text" width={40} height={20} />
              </Box>
              <Box>
                <Skeleton variant="text" width={60} height={24} />
                <Skeleton variant="text" width={40} height={20} />
              </Box>
            </Stack>
          </Box>
        );

      case 'text-block':
        return (
          <Box sx={{ ...sx }}>
            <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Box>
        );

      case 'custom':
        return children;

      default:
        return (
          <Box sx={{ ...sx }}>
            <Skeleton variant="text" width="100%" height={20} />
          </Box>
        );
    }
  };

  return (
    <Box>
      {Array.from({ length: count }, (_, index) => (
        <Box key={index} sx={{ mb: count > 1 ? 2 : 0 }}>
          {renderSkeletonContent()}
        </Box>
      ))}
    </Box>
  );
};

// Specific skeleton components for common use cases
export const BookCardSkeleton: React.FC<{ count?: number; sx?: object }> = ({ count, sx }) => (
  <LoadingSkeleton variant="book-card" count={count} sx={sx} />
);

export const ReviewCardSkeleton: React.FC<{ count?: number; sx?: object }> = ({ count, sx }) => (
  <LoadingSkeleton variant="review-card" count={count} sx={sx} />
);

export const ProfileHeaderSkeleton: React.FC<{ sx?: object }> = ({ sx }) => (
  <LoadingSkeleton variant="profile-header" sx={sx} />
);

export const TextBlockSkeleton: React.FC<{ count?: number; sx?: object }> = ({ count, sx }) => (
  <LoadingSkeleton variant="text-block" count={count} sx={sx} />
);

export default LoadingSkeleton;
