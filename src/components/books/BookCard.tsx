/**
 * BookCard Component
 * Reusable book display card for grids and lists
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { Favorite, FavoriteBorder, Share } from '@mui/icons-material';
import { BookDisplay } from '@/types';
import { getPrimaryGenre, getPublicationYear, getBookCoverImage } from '@/utils/bookTransformers';
import { BookCover } from './BookCover';
import { RatingDisplay } from './RatingDisplay';

interface BookCardProps {
  book: BookDisplay;
  onClick?: (book: BookDisplay) => void;
  onFavoriteClick?: (bookId: string) => void;
  onShareClick?: (book: BookDisplay) => void;
  showFavorite?: boolean;
  showGenre?: boolean;
  variant?: 'compact' | 'detailed';
  isFavorite?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  onFavoriteClick,
  onShareClick,
  showFavorite = false,
  showGenre = false,
  variant = 'compact',
  isFavorite = false
}) => {
  const handleCardClick = () => {
    onClick?.(book);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(book.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShareClick?.(book);
  };

  const primaryGenre = getPrimaryGenre(book);
  const publicationYear = getPublicationYear(book);
  const coverImageSrc = getBookCoverImage(book);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* Action buttons overlay */}
      {(showFavorite || onShareClick) && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            '.MuiCard-root:hover &': {
              opacity: 1,
            },
          }}
        >
          {showFavorite && (
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={handleFavoriteClick}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: isFavorite ? 'error.main' : 'action.active',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
          )}
          
          {onShareClick && (
            <Tooltip title="Share book">
              <IconButton
                size="small"
                onClick={handleShareClick}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'action.active',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <Share />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      <CardActionArea onClick={handleCardClick} sx={{ height: '100%' }}>
        {/* Book cover */}
        <Box sx={{ p: 1.5, pb: 0 }}>
          <BookCover
            src={coverImageSrc}
            alt={book.title}
            aspectRatio="2/3"
          />
        </Box>

        {/* Book information */}
        <CardContent sx={{ flexGrow: 1, pt: 1.5 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: variant === 'detailed' ? '1.1rem' : '1rem',
              fontWeight: 600,
              mb: 0.5,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
              minHeight: variant === 'detailed' ? '2.6rem' : '2.6rem',
            }}
          >
            {book.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            by {book.author}
          </Typography>

          {showGenre && (
            <Chip
              label={primaryGenre}
              size="small"
              variant="outlined"
              sx={{ 
                mb: 1,
                fontSize: '0.75rem',
                height: '20px',
              }}
            />
          )}

          {/* Rating */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mt: 'auto'
          }}>
            <RatingDisplay
              value={book.averageRating}
              showValue={variant === 'detailed'}
              showCount={variant === 'detailed'}
              reviewCount={book.totalReviews}
              size="small"
            />
            
            {variant === 'detailed' && (
              <Typography variant="caption" color="text.secondary">
                {publicationYear}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookCard;
