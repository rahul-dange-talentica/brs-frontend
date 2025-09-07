/**
 * QuickActions Component
 * Quick action buttons for common user tasks
 */

import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider
} from '@mui/material';
import {
  RateReview as ReviewIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
  BookmarkAdd as ReadingListIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  TrendingUp as RecommendationsIcon,
  MenuBook as BrowseIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { QuickAction } from './types';

interface QuickActionsProps {
  compact?: boolean;
  showTitle?: boolean;
  maxActions?: number;
}

interface ActionCardProps {
  action: QuickAction;
  compact?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, compact = false }) => {
  const getIcon = (iconName: string) => {
    const iconProps = { fontSize: compact ? 'medium' : 'large' } as const;
    
    switch (iconName) {
      case 'review': return <ReviewIcon {...iconProps} />;
      case 'favorite': return <FavoriteIcon {...iconProps} />;
      case 'search': return <SearchIcon {...iconProps} />;
      case 'reading-list': return <ReadingListIcon {...iconProps} />;
      case 'settings': return <SettingsIcon {...iconProps} />;
      case 'share': return <ShareIcon {...iconProps} />;
      case 'recommendations': return <RecommendationsIcon {...iconProps} />;
      case 'browse': return <BrowseIcon {...iconProps} />;
      default: return <ReviewIcon {...iconProps} />;
    }
  };

  if (compact) {
    return (
      <Tooltip title={action.description}>
        <IconButton
          onClick={action.action}
          color={action.color || 'primary'}
          sx={{ 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.5
          }}
        >
          {getIcon(action.icon)}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
      onClick={action.action}
    >
      <CardContent sx={{ 
        textAlign: 'center', 
        p: 2,
        '&:last-child': { pb: 2 }
      }}>
        <Box sx={{ 
          color: `${action.color || 'primary'}.main`, 
          mb: 1 
        }}>
          {getIcon(action.icon)}
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {action.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {action.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const QuickActions: React.FC<QuickActionsProps> = ({
  compact = false,
  showTitle = true,
  maxActions = 8
}) => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Define available quick actions
  const allActions: QuickAction[] = [
    {
      id: 'browse-books',
      title: 'Browse Books',
      description: 'Discover new books',
      icon: 'browse',
      color: 'primary',
      action: () => navigate('/books')
    },
    {
      id: 'my-reviews',
      title: 'My Reviews',
      description: 'View and manage reviews',
      icon: 'review',
      color: 'primary',
      action: () => navigate('/profile/reviews')
    },
    {
      id: 'favorites',
      title: 'Favorites',
      description: 'View favorite books',
      icon: 'favorite',
      color: 'secondary',
      action: () => navigate('/profile/favorites')
    },
    {
      id: 'search',
      title: 'Search',
      description: 'Find specific books',
      icon: 'search',
      color: 'success',
      action: () => navigate('/books?focus=search')
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      description: 'Books for you',
      icon: 'recommendations',
      color: 'warning',
      action: () => navigate('/recommendations')
    },
    {
      id: 'reading-list',
      title: 'Reading List',
      description: 'Books to read later',
      icon: 'reading-list',
      color: 'primary',
      action: () => navigate('/profile/reading-list')
    },
    {
      id: 'profile-settings',
      title: 'Settings',
      description: 'Account settings',
      icon: 'settings',
      color: 'secondary',
      action: () => navigate('/profile/settings')
    },
    {
      id: 'share-profile',
      title: 'Share Profile',
      description: 'Share your reading profile',
      icon: 'share',
      color: 'success',
      action: () => setShareDialogOpen(true)
    }
  ];

  const displayActions = allActions.slice(0, maxActions);

  const handleCopyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setShareDialogOpen(false);
      // Could add a snackbar notification here
    });
  };

  if (compact) {
    return (
      <Paper sx={{ p: 2 }}>
        {showTitle && (
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
        )}
        <Grid container spacing={1}>
          {displayActions.slice(0, 6).map((action) => (
            <Grid item xs={4} key={action.id}>
              <ActionCard action={action} compact />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {showTitle && (
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
      )}

      {/* Primary Actions */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {displayActions.slice(0, 4).map((action) => (
          <Grid item xs={6} key={action.id}>
            <ActionCard action={action} />
          </Grid>
        ))}
      </Grid>

      {/* Secondary Actions */}
      {displayActions.length > 4 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {displayActions.slice(4).map((action) => (
              <Button
                key={action.id}
                variant="outlined"
                size="small"
                startIcon={action.icon === 'review' ? <ReviewIcon /> :
                          action.icon === 'favorite' ? <FavoriteIcon /> :
                          action.icon === 'search' ? <SearchIcon /> :
                          action.icon === 'reading-list' ? <ReadingListIcon /> :
                          action.icon === 'settings' ? <SettingsIcon /> :
                          action.icon === 'share' ? <ShareIcon /> :
                          action.icon === 'recommendations' ? <RecommendationsIcon /> :
                          <BrowseIcon />}
                onClick={action.action}
                sx={{ mb: 1, flexShrink: 0 }}
              >
                {action.title}
              </Button>
            ))}
          </Stack>
        </>
      )}

      {/* Share Profile Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          Share Your Profile
          <IconButton onClick={() => setShareDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share your reading profile with friends and fellow book lovers.
          </Typography>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.100', 
            borderRadius: 1, 
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            wordBreak: 'break-all'
          }}>
            {window.location.origin}/profile/{user?.id}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCopyProfileLink}
            startIcon={<ShareIcon />}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default QuickActions;
