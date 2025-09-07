/**
 * BookCover Component
 * Displays book cover image with fallback and lazy loading
 */

import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

interface BookCoverProps {
  src: string;
  alt: string;
  width?: string | number | { [key: string]: string | number };
  height?: string | number;
  aspectRatio?: string;
  onClick?: () => void;
}

const CoverContainer = styled(Box)<{ aspectRatio?: string; clickable?: boolean }>(
  ({ theme, aspectRatio = '2/3', clickable = false }) => ({
    position: 'relative',
    width: '100%',
    aspectRatio,
    overflow: 'hidden',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    cursor: clickable ? 'pointer' : 'default',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': clickable ? {
      transform: 'scale(1.02)',
    } : {},
  })
);

const CoverImage = styled('img')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'opacity 0.3s ease-in-out',
}));

const PlaceholderBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

export const BookCover: React.FC<BookCoverProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  onClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <CoverContainer
      sx={{ width, height }}
      aspectRatio={aspectRatio}
      clickable={!!onClick}
      onClick={onClick}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      
      {!hasError ? (
        <CoverImage
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoading ? 0 : 1,
          }}
        />
      ) : (
        <PlaceholderBox>
          No Cover
          <br />
          Available
        </PlaceholderBox>
      )}
    </CoverContainer>
  );
};

export default BookCover;
