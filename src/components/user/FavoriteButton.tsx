/**
 * FavoriteButton Component
 * Toggle button for adding/removing books from favorites
 */

import React, { useState } from 'react';
import {
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavoriteBooks,
  selectIsBookFavorited,
  selectFavoritesLoading
} from '@/store/userSlice';

interface FavoriteButtonProps {
  bookId: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  variant?: 'button' | 'icon';
  disabled?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  bookId,
  size = 'medium',
  showLabel = false,
  variant = 'icon',
  disabled = false,
  onToggle
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const isFavorite = useAppSelector(selectIsBookFavorited(bookId));
  const favoritesLoading = useAppSelector(selectFavoritesLoading);
  
  const [localLoading, setLocalLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const isLoading = localLoading || favoritesLoading;

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please log in to add favorites');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (isLoading || disabled) return;

    setLocalLoading(true);
    
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(bookId)).unwrap();
        setSnackbarMessage('Removed from favorites');
        setSnackbarSeverity('success');
        onToggle?.(false);
      } else {
        await dispatch(addToFavorites(bookId)).unwrap();
        setSnackbarMessage('Added to favorites');
        setSnackbarSeverity('success');
        onToggle?.(true);
      }
      
      // Refresh favorites list to get updated state
      dispatch(fetchFavoriteBooks({ skip: 0, limit: 50 }));
      
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setSnackbarMessage('Failed to update favorites. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLocalLoading(false);
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <CircularProgress size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />;
    }
    return isFavorite ? 
      <FavoriteIcon color="secondary" /> : 
      <FavoriteBorderIcon />;
  };

  const getTooltipText = () => {
    if (!isAuthenticated) return 'Login to add favorites';
    if (isLoading) return 'Updating...';
    return isFavorite ? 'Remove from favorites' : 'Add to favorites';
  };

  const buttonProps = {
    onClick: handleToggleFavorite,
    disabled: isLoading || disabled,
    size: size,
    'aria-label': isFavorite ? 'Remove from favorites' : 'Add to favorites'
  };

  if (variant === 'button' && showLabel) {
    return (
      <>
        <Button
          {...buttonProps}
          variant={isFavorite ? 'contained' : 'outlined'}
          color="secondary"
          startIcon={getIcon()}
          sx={{
            minWidth: 120,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          {isLoading ? 'Updating...' : isFavorite ? 'Favorited' : 'Add to Favorites'}
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Tooltip title={getTooltipText()}>
        <span>
          <IconButton
            {...buttonProps}
            color={isFavorite ? 'secondary' : 'default'}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: isFavorite ? 'secondary.50' : 'grey.50'
              },
              ...(isFavorite && {
                bgcolor: 'secondary.50'
              })
            }}
          >
            {getIcon()}
          </IconButton>
        </span>
      </Tooltip>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FavoriteButton;
