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
  Share,
  Link as LinkIcon,
  Twitter,
  Facebook,
} from '@mui/icons-material';
import { FavoriteButton } from '@/components/user';
import { BookDisplay } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface BookActionsProps {
  book: BookDisplay;
  onShareClick?: (book: BookDisplay) => void;
  variant?: 'detailed' | 'compact';
  showLabels?: boolean;
}

export const BookActions: React.FC<BookActionsProps> = ({
  book,
  onShareClick,
  variant = 'detailed',
  showLabels = true
}) => {
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(null);
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info';
  } | null>(null);

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
        <FavoriteButton
          bookId={book.id}
          variant="icon"
          size="medium"
        />

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
        <FavoriteButton
          bookId={book.id}
          variant="button"
          size="large"
          showLabel={showLabels}
        />

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
