/**
 * BookMeta Component
 * Displays book metadata in a compact format
 */

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { BookDisplay } from '@/types';
import { getPublicationYear } from '@/utils/bookTransformers';

interface BookMetaProps {
  book: BookDisplay;
  variant?: 'horizontal' | 'vertical';
  showGenres?: boolean;
  showRating?: boolean;
  size?: 'small' | 'medium';
}

export const BookMeta: React.FC<BookMetaProps> = ({
  book,
  variant = 'horizontal',
  showGenres = true,
  showRating = true,
  size = 'medium'
}) => {
  const publicationYear = getPublicationYear(book);
  
  const fontSize = size === 'small' ? '0.75rem' : '0.875rem';
  const iconSize = size === 'small' ? 'small' : 'medium';

  const MetaItem: React.FC<{
    icon: React.ReactNode;
    text: string;
  }> = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {React.cloneElement(icon as React.ReactElement, {
        fontSize: iconSize,
        color: 'action'
      })}
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ fontSize }}
      >
        {text}
      </Typography>
    </Box>
  );

  if (variant === 'vertical') {
    return (
      <Stack spacing={1.5}>
        <MetaItem
          icon={<PersonIcon />}
          text={book.author}
        />
        
        <MetaItem
          icon={<CalendarIcon />}
          text={publicationYear}
        />

        {showRating && (
          <MetaItem
            icon={<StarIcon />}
            text={`${book.averageRating.toFixed(1)} (${book.totalReviews} reviews)`}
          />
        )}

        {showGenres && book.genres.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <CategoryIcon fontSize={iconSize} color="action" />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize }}
              >
                Genres
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {book.genres.slice(0, 3).map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
                    height: size === 'small' ? '20px' : '24px',
                  }}
                />
              ))}
              {book.genres.length > 3 && (
                <Chip
                  label={`+${book.genres.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
                    height: size === 'small' ? '20px' : '24px',
                  }}
                />
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    );
  }

  return (
    <Box>
      {/* First Row - Author and Publication */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: showGenres || showRating ? 1 : 0,
          flexWrap: 'wrap'
        }}
      >
        <MetaItem
          icon={<PersonIcon />}
          text={book.author}
        />
        
        <Divider orientation="vertical" flexItem />
        
        <MetaItem
          icon={<CalendarIcon />}
          text={publicationYear}
        />

        {showRating && (
          <>
            <Divider orientation="vertical" flexItem />
            <MetaItem
              icon={<StarIcon />}
              text={`${book.averageRating.toFixed(1)} (${book.totalReviews})`}
            />
          </>
        )}
      </Box>

      {/* Second Row - Genres */}
      {showGenres && book.genres.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon fontSize={iconSize} color="action" />
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {book.genres.slice(0, 4).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
                  height: size === 'small' ? '20px' : '24px',
                }}
              />
            ))}
            {book.genres.length > 4 && (
              <Chip
                label={`+${book.genres.length - 4}`}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
                  height: size === 'small' ? '20px' : '24px',
                }}
              />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default BookMeta;
