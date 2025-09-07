/**
 * ReviewCard Component
 * Displays individual review with user info, rating, and content
 */

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/types/api';
import { RatingDisplay } from '@/components/books';

interface ReviewCardProps {
  review: Review;
  showBookInfo?: boolean;
  showActions?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  onReport?: (review: Review) => void;
  compact?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  // showBookInfo = false,
  showActions = false,
  onEdit,
  onDelete,
  onReport,
  compact = false
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(review);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(review);
  };

  const handleReport = () => {
    handleMenuClose();
    onReport?.(review);
  };

  const userName = review.user.name || `${review.user.firstName} ${review.user.lastName}`.trim();
  const createdDate = new Date(review.createdAt);
  // const updatedDate = new Date(review.updatedAt);
  const wasEdited = review.updatedAt !== review.createdAt;

  return (
    <Card 
      sx={{ 
        mb: compact ? 1 : 2,
        ...(review.isOwn && {
          border: '1px solid',
          borderColor: 'primary.light',
          backgroundColor: 'primary.50'
        })
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            {/* User Info and Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <Typography
                variant="subtitle2"
                component="span"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                {userName}
              </Typography>
              
              <RatingDisplay
                value={review.rating}
                size="small"
                readOnly
                color="warning"
              />
              
              {review.isOwn && (
                <Chip
                  label="Your Review"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Review Content */}
            {review.reviewText && (
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  mb: 2,
                  lineHeight: 1.6,
                  color: 'text.primary',
                  fontSize: compact ? '0.875rem' : '1rem'
                }}
              >
                {review.reviewText}
              </Typography>
            )}

            {/* Date and Edit Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {formatDistanceToNow(createdDate, { addSuffix: true })}
                {wasEdited && ' (edited)'}
              </Typography>
            </Box>
          </Box>

          {/* Actions Menu */}
          {(showActions || review.isOwn) && (
            <Box>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ color: 'text.secondary' }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {review.isOwn && onEdit && (
                  <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Review
                  </MenuItem>
                )}
                
                {review.isOwn && onDelete && (
                  <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete Review
                  </MenuItem>
                )}
                
                {review.isOwn && (onEdit || onDelete) && onReport && <Divider />}
                
                {onReport && !review.isOwn && (
                  <MenuItem onClick={handleReport}>
                    <FlagIcon fontSize="small" sx={{ mr: 1 }} />
                    Report Review
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
