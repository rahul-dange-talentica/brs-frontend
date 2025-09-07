/**
 * ProfileSummary Component
 * User profile summary card showing basic info and quick stats
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  RateReview as ReviewIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/api';

interface ProfileSummaryProps {
  profile: UserProfile;
  showEditButton?: boolean;
  compact?: boolean;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  profile,
  showEditButton = true,
  compact = false
}) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleViewFullProfile = () => {
    navigate('/profile');
  };

  // Create initials from name or email
  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    return profile.email.substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile.email;
  };

  // Format join date
  const formatJoinDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return 'Recently';
    }
  };

  if (compact) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.main',
                mr: 2,
                fontSize: '1.2rem',
                fontWeight: 600
              }}
            >
              {getInitials()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {getDisplayName()}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {profile.email}
              </Typography>
            </Box>
          </Box>
          
          {profile.bio && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {profile.bio}
            </Typography>
          )}

          <Button 
            variant="outlined" 
            size="small" 
            fullWidth
            onClick={handleViewFullProfile}
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      {/* Header with Edit Button */}
      {showEditButton && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          bgcolor: 'grey.50'
        }}>
          <Typography variant="h6">Profile</Typography>
          <Button
            startIcon={<EditIcon />}
            onClick={handleEditProfile}
            size="small"
            variant="outlined"
          >
            Edit
          </Button>
        </Box>
      )}

      <Box sx={{ p: 3 }}>
        {/* Profile Avatar and Basic Info */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 600
            }}
          >
            {getInitials()}
          </Avatar>
          
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {getDisplayName()}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {profile.email}
          </Typography>

          {(profile as any).location && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {(profile as any).location}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Bio */}
        {profile.bio && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              {profile.bio}
            </Typography>
          </>
        )}

        {/* Quick Stats */}
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReviewIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">Reviews</Typography>
            </Box>
            <Chip 
              label="0" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FavoriteIcon sx={{ fontSize: 16, mr: 1, color: 'secondary.main' }} />
              <Typography variant="body2">Favorites</Typography>
            </Box>
            <Chip 
              label="0" 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
              <Typography variant="body2">Avg Rating</Typography>
            </Box>
            <Chip 
              label="0.0" 
              size="small" 
              color="default" 
              variant="outlined"
            />
          </Box>
        </Stack>

        {/* Member Since */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Member since {formatJoinDate(profile.createdAt || new Date().toISOString())}
          </Typography>
        </Box>

        {/* View Full Profile Link */}
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="text" 
            fullWidth 
            onClick={handleViewFullProfile}
          >
            View Full Profile
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileSummary;
