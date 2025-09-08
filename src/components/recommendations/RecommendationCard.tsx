import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Rating,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { Book } from '@/types/api';
import { BookCover } from '@/components/books/BookCover';
import { RecommendationReason } from './RecommendationReason';

export interface RecommendationCardProps {
  book: Book;
  reason?: string;
  type: 'popular' | 'genre-based' | 'personalized' | 'similar' | 'diverse';
  onViewDetails?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  onShare?: (book: Book) => void;
  isFavorite?: boolean;
  showReason?: boolean;
  compact?: boolean;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  book,
  reason,
  type,
  onViewDetails,
  onToggleFavorite,
  onShare,
  isFavorite = false,
  showReason = true,
  compact = false,
  className,
}) => {
  const averageRating = parseFloat(book.average_rating) || 0;
  
  const handleViewDetails = () => {
    onViewDetails?.(book);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(book);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(book);
  };

  const getTypeColor = (recommendationType: string) => {
    switch (recommendationType) {
      case 'popular':
        return 'error';
      case 'genre-based':
        return 'primary';
      case 'personalized':
        return 'secondary';
      case 'similar':
        return 'success';
      case 'diverse':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (recommendationType: string) => {
    switch (recommendationType) {
      case 'popular':
        return 'Popular';
      case 'genre-based':
        return 'Genre Match';
      case 'personalized':
        return 'For You';
      case 'similar':
        return 'Similar';
      case 'diverse':
        return 'Diverse';
      default:
        return 'Recommended';
    }
  };

  return (
    <Card
      className={className}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        ...(compact && {
          maxWidth: 200,
        }),
      }}
      onClick={handleViewDetails}
    >
      {/* Type Badge */}
      <Chip
        label={getTypeLabel(type)}
        size="small"
        color={getTypeColor(type) as any}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          fontSize: '0.7rem',
          height: 20,
        }}
      />

      {/* Book Cover */}
      <CardMedia sx={{ position: 'relative' }}>
        <BookCover
          src={book.cover_image_url || ''}
          alt={`Cover of ${book.title}`}
          height={compact ? 180 : 200}
        />
        
        {/* Favorite Button Overlay */}
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: isFavorite ? 'error.main' : 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'error.main',
            },
          }}
          size="small"
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardMedia>

      {/* Book Info */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant={compact ? 'subtitle2' : 'h6'}
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: compact ? '2.4em' : '2.8em',
          }}
        >
          {book.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          by {book.author}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating
            value={averageRating}
            precision={0.1}
            readOnly
            size={compact ? 'small' : 'medium'}
          />
          <Typography variant="caption" color="text.secondary">
            ({averageRating.toFixed(1)})
          </Typography>
        </Box>

        {/* Genres */}
        {book.genres && book.genres.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              color="primary.main"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {book.genres.map(genre => genre.name).join(', ')}
            </Typography>
          </Box>
        )}

        {/* Recommendation Reason */}
        {showReason && reason && (
          <RecommendationReason
            reason={reason}
            type={type}
            compact={compact}
          />
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
        <Button
          size={compact ? 'small' : 'medium'}
          variant="contained"
          startIcon={<VisibilityIcon />}
          onClick={handleViewDetails}
          sx={{ flex: 1, mr: 1 }}
        >
          {compact ? 'View' : 'View Details'}
        </Button>
        
        <Tooltip title="Share this book">
          <IconButton
            size="small"
            onClick={handleShare}
            sx={{ color: 'text.secondary' }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
