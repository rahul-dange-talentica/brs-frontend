/**
 * FavoritesList Component
 * Display user's favorite books in a grid layout
 */

import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Rating,
  Chip,
  Paper
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Star as StarIcon,
  RemoveRedEye as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/types/api';
import { FavoriteButton } from './FavoriteButton';
import { BookCover } from '@/components/books';
import { getBookCoverImage, transformBookForDisplay } from '@/utils/bookTransformers';

interface FavoritesListProps {
  books: Book[];
  compact?: boolean;
  gridCols?: number;
  showFilters?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

interface FavoriteBookCardProps {
  book: Book;
  compact?: boolean;
  onRemoveFavorite?: (bookId: string) => void;
}

const FavoriteBookCard: React.FC<FavoriteBookCardProps> = ({
  book,
  compact = false,
  onRemoveFavorite
}) => {
  const navigate = useNavigate();

  const handleViewBook = () => {
    navigate(`/books/${book.id}`);
  };

  const handleFavoriteToggle = (isFavorite: boolean) => {
    if (!isFavorite && onRemoveFavorite) {
      onRemoveFavorite(book.id);
    }
  };

  const rating = parseFloat(book.average_rating) || 0;
  const bookDisplay = transformBookForDisplay(book);
  const coverImageSrc = getBookCoverImage(bookDisplay);

  if (compact) {
    return (
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
        onClick={handleViewBook}
      >
        <Box sx={{ p: 1 }}>
          <BookCover
            src={coverImageSrc}
            alt={book.title}
            height={120}
            aspectRatio="2/3"
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
          <Typography 
            variant="subtitle2" 
            noWrap 
            sx={{ fontWeight: 600, mb: 0.5 }}
          >
            {book.title}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            noWrap
          >
            {book.author}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Rating 
              value={rating} 
              precision={0.1} 
              size="small" 
              readOnly 
            />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              ({book.total_reviews})
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <Box sx={{ p: 1.5, pb: 0 }}>
        <BookCover
          src={coverImageSrc}
          alt={book.title}
          height={200}
          aspectRatio="2/3"
          onClick={handleViewBook}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={handleViewBook}
        >
          {book.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
        >
          by {book.author}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={rating} 
            precision={0.1} 
            size="small" 
            readOnly 
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {rating.toFixed(1)} ({book.total_reviews} reviews)
          </Typography>
        </Box>

        {book.genres && book.genres.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Chip 
              label={book.genres[0].name} 
              size="small" 
              variant="outlined"
              color="primary"
            />
          </Box>
        )}

        {book.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {book.description}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          startIcon={<ViewIcon />}
          onClick={handleViewBook}
          size="small"
          variant="outlined"
          fullWidth
        >
          View Details
        </Button>
        <FavoriteButton
          bookId={book.id}
          variant="icon"
          size="small"
          onToggle={handleFavoriteToggle}
        />
      </CardActions>
    </Card>
  );
};

export const FavoritesList: React.FC<FavoritesListProps> = ({
  books,
  compact = false,
  gridCols = 3,
  showFilters = false,
  emptyTitle = "No Favorite Books",
  emptyDescription = "You haven't added any books to your favorites yet."
}) => {
  const navigate = useNavigate();

  const handleRemoveFavorite = (bookId: string) => {
    // This will be handled by the FavoriteButton component
    console.log('Removed from favorites:', bookId);
  };

  const handleBrowseBooks = () => {
    navigate('/books');
  };

  if (books.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <FavoriteIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {emptyDescription}
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBrowseBooks}
          startIcon={<StarIcon />}
        >
          Browse Books
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Filters Section */}
      {showFilters && (
        <Box sx={{ mb: 3 }}>
          {/* TODO: Add filters implementation */}
          <Typography variant="body2" color="text.secondary">
            Showing {books.length} favorite books
          </Typography>
        </Box>
      )}

      {/* Books Grid */}
      <Grid container spacing={compact ? 1 : 3}>
        {books.map((book) => (
          <Grid 
            item 
            xs={12} 
            sm={compact ? 6 : 12/gridCols} 
            md={compact ? 4 : 12/gridCols}
            lg={12/gridCols}
            key={book.id}
          >
            <FavoriteBookCard
              book={book}
              compact={compact}
              onRemoveFavorite={handleRemoveFavorite}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FavoritesList;
