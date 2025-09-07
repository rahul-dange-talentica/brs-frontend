/**
 * BookActions Component
 * Action buttons for book interactions (favorite, share, etc.)
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Link as LinkIcon,
  Twitter,
  Facebook,
} from '@mui/icons-material';
import { BookDisplay } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface BookActionsProps {
  book: BookDisplay;
  isFavorite?: boolean;
  onFavoriteToggle?: (bookId: string, isFavorite: boolean) => Promise<void>;
  onShareClick?: (book: BookDisplay) => void;
  variant?: 'detailed' | 'compact';
  showLabels?: boolean;
}

export const BookActions: React.FC<BookActionsProps> = ({
  book,
  isFavorite = false,
  onFavoriteToggle,
  onShareClick,
  variant = 'detailed',
  showLabels = true
}) => {
  const { user } = useAuth();
  const [isToggling, setIsToggling] = useState(false);
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(null);
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info';
  } | null>(null);

  const handleFavoriteClick = async () => {
    if (!user) {
      setNotification({
        message: 'Please log in to add favorites',
        severity: 'info',
      });
      return;
    }

    if (!onFavoriteToggle || isToggling) return;

    setIsToggling(true);
    try {
      await onFavoriteToggle(book.id, !isFavorite);
      setNotification({
        message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        message: 'Failed to update favorites',
        severity: 'error',
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareMenuAnchor(event.currentTarget);
  };

  // Handle share functionality if callback is provided
  // const handleShareBook = () => {
  //   if (onShareClick) {
  //     onShareClick(book);
  //   }
  // };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/books/${book.id}`;
      await navigator.clipboard.writeText(url);
      setNotification({
        message: 'Link copied to clipboard',
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        message: 'Failed to copy link',
        severity: 'error',
      });
    }
    handleShareClose();
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const url = `${window.location.origin}/books/${book.id}`;
    const text = `Check out "${book.title}" by ${book.author}`;
    
    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    handleShareClose();
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={user ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : 'Login to add favorites'}>
          <IconButton 
            onClick={handleFavoriteClick} 
            disabled={isToggling}
            color={isFavorite ? 'error' : 'default'}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Share book">
          <IconButton onClick={handleShareClick}>
            <Share />
          </IconButton>
        </Tooltip>

        {/* Share Menu */}
        <Menu
          anchorEl={shareMenuAnchor}
          open={Boolean(shareMenuAnchor)}
          onClose={handleShareClose}
        >
          <MenuItem onClick={handleCopyLink}>
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <ListItemText>Copy Link</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleSocialShare('twitter')}>
            <ListItemIcon>
              <Twitter />
            </ListItemIcon>
            <ListItemText>Share on Twitter</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleSocialShare('facebook')}>
            <ListItemIcon>
              <Facebook />
            </ListItemIcon>
            <ListItemText>Share on Facebook</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notification Snackbar */}
        {notification && (
          <Snackbar
            open={true}
            autoHideDuration={3000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleNotificationClose} severity={notification.severity}>
              {notification.message}
            </Alert>
          </Snackbar>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
      {/* Primary Actions */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant={isFavorite ? 'contained' : 'outlined'}
          color={isFavorite ? 'error' : 'primary'}
          startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
          onClick={handleFavoriteClick}
          disabled={isToggling}
          size="large"
          sx={{ minWidth: 140 }}
        >
          {showLabels ? (isFavorite ? 'Remove Favorite' : 'Add to Favorites') : ''}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Share />}
          onClick={onShareClick ? () => onShareClick(book) : handleShareClick}
          size="large"
        >
          {showLabels ? 'Share' : ''}
        </Button>
      </Box>

      {/* Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleShareClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('twitter')}>
          <ListItemIcon>
            <Twitter />
          </ListItemIcon>
          <ListItemText>Share on Twitter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('facebook')}>
          <ListItemIcon>
            <Facebook />
          </ListItemIcon>
          <ListItemText>Share on Facebook</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      {notification && (
        <Snackbar
          open={true}
          autoHideDuration={4000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleNotificationClose} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default BookActions;
