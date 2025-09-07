/**
 * BookListItem Component
 * List view item for displaying books in a compact horizontal format
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  ChevronRight,
} from '@mui/icons-material';
import { BookDisplay } from '@/types';
import { BookCover } from './BookCover';
import { RatingDisplay } from './RatingDisplay';
import { BookMeta } from './BookMeta';
import { getPrimaryGenre, getBookCoverImage } from '@/utils/bookTransformers';

interface BookListItemProps {
  book: BookDisplay;
  onClick?: (book: BookDisplay) => void;
  onFavoriteClick?: (bookId: string) => void;
  onShareClick?: (book: BookDisplay) => void;
  showFavorite?: boolean;
  showDescription?: boolean;
  isFavorite?: boolean;
}

export const BookListItem: React.FC<BookListItemProps> = ({
  book,
  onClick,
  onFavoriteClick,
  onShareClick,
  showFavorite = false,
  showDescription = true,
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

  const coverImageSrc = getBookCoverImage(book);
  const primaryGenre = getPrimaryGenre(book);
  
  const truncatedDescription = book.description 
    ? book.description.length > 200 
      ? `${book.description.substring(0, 200)}...`
      : book.description
    : '';

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateX(4px)',
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={3}>
            {/* Book Cover */}
            <Grid item xs={12} sm={3} md={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <BookCover
                  src={coverImageSrc}
                  alt={book.title}
                  width={120}
                  aspectRatio="2/3"
                />
              </Box>
            </Grid>

            {/* Book Information */}
            <Grid item xs={12} sm={9} md={8}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Title and Author */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3,
                    }}
                  >
                    {book.title}
                  </Typography>
                  
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    by {book.author}
                  </Typography>

                  {/* Primary Genre Chip */}
                  <Chip
                    label={primaryGenre}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                </Box>

                {/* Rating */}
                <Box sx={{ mb: 2 }}>
                  <RatingDisplay
                    value={book.averageRating}
                    showValue
                    showCount
                    reviewCount={book.totalReviews}
                    size="medium"
                  />
                </Box>

                {/* Description */}
                {showDescription && truncatedDescription && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: { xs: 3, md: 2 },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {truncatedDescription}
                  </Typography>
                )}

                {/* Book Meta Info */}
                <Box sx={{ mt: 'auto' }}>
                  <BookMeta
                    book={book}
                    variant="horizontal"
                    showGenres={false}
                    showRating={false}
                    size="small"
                  />
                </Box>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} md={2}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: 'center',
                  justifyContent: { xs: 'space-between', md: 'flex-start' },
                  gap: 1,
                  height: '100%',
                }}
              >
                {/* Action Buttons */}
                <Stack direction={{ xs: 'row', md: 'column' }} spacing={1}>
                  {showFavorite && (
                    <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                      <IconButton
                        onClick={handleFavoriteClick}
                        color={isFavorite ? 'error' : 'default'}
                        size="small"
                      >
                        {isFavorite ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Tooltip>
                  )}

                  {onShareClick && (
                    <Tooltip title="Share book">
                      <IconButton
                        onClick={handleShareClick}
                        color="default"
                        size="small"
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>

                {/* View Details Indicator */}
                <Box sx={{ mt: { xs: 0, md: 'auto' } }}>
                  <ChevronRight color="action" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookListItem;
