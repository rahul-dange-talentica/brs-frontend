/**
 * UserReviewCard Component
 * Review card for user's review history with book information
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
  Avatar,
  Stack,
  // Rating,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as BookIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Review, BookDisplay } from '@/types/api';
import { RatingDisplay } from '@/components/books';

interface UserReviewCardProps {
  review: Review;
  book?: BookDisplay; // Book information for the review
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  onViewBook?: (bookId: string) => void;
  compact?: boolean;
}

export const UserReviewCard: React.FC<UserReviewCardProps> = ({
  review,
  book,
  onEdit,
  onDelete,
  onViewBook,
  compact = false
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
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

  const handleViewBook = () => {
    if (book) {
      onViewBook?.(book.id);
      navigate(`/books/${book.id}`);
    }
  };

  const createdDate = new Date(review.createdAt);
  const updatedDate = new Date(review.updatedAt);
  const wasEdited = review.updatedAt !== review.createdAt;

  return (
    <Card 
      sx={{ 
        mb: compact ? 1 : 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: theme.shadows[2]
        }
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            {/* Book Information */}
            {book && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {book.coverImage ? (
                    <Avatar
                      src={book.coverImage}
                      alt={book.title}
                      variant="rounded"
                      sx={{ width: 48, height: 64 }}
                    />
                  ) : (
                    <Avatar
                      variant="rounded"
                      sx={{ 
                        width: 48, 
                        height: 64, 
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }}
                    >
                      <BookIcon />
                    </Avatar>
                  )}
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      component="button"
                      onClick={handleViewBook}
                      sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        textAlign: 'left',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      by {book.author}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Review Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <RatingDisplay
                value={review.rating}
                size={compact ? 'small' : 'medium'}
                readOnly
                color="warning"
              />
              
              <Chip
                label="Your Review"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* Review Content */}
            {review.reviewText && (
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  lineHeight: 1.6,
                  color: 'text.primary',
                  fontSize: compact ? '0.875rem' : '1rem'
                }}
              >
                {review.reviewText}
              </Typography>
            )}

            {/* Review Date */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              Reviewed {formatDistanceToNow(createdDate, { addSuffix: true })}
              {wasEdited && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.disabled"
                  sx={{ ml: 1 }}
                >
                  (edited {formatDistanceToNow(updatedDate, { addSuffix: true })})
                </Typography>
              )}
            </Typography>
          </Box>

          {/* Actions Menu */}
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
              {book && (
                <MenuItem onClick={handleViewBook}>
                  <BookIcon fontSize="small" sx={{ mr: 1 }} />
                  View Book
                </MenuItem>
              )}
              
              {onEdit && (
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Edit Review
                </MenuItem>
              )}
              
              {onDelete && (
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete Review
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserReviewCard;
