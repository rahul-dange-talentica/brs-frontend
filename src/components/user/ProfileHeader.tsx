/**
 * ProfileHeader Component
 * Profile header with user info, avatar, and action buttons
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  Stack,
  Chip,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Star as StarIcon,
  RateReview as ReviewIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/api';
import { UserStatistics } from './types';

interface ProfileHeaderProps {
  profile: UserProfile;
  statistics?: UserStatistics | null;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  statistics,
  isOwnProfile = true,
  onEdit,
  onShare
}) => {
  const navigate = useNavigate();

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
    return profile.email.split('@')[0]; // Use email username part
  };

  // Format join date
  const formatJoinDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch {
      return 'Recently';
    }
  };

  const handleEditProfile = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate('/profile/edit');
    }
  };

  const handleSettings = () => {
    navigate('/profile/settings');
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      const profileUrl = `${window.location.origin}/profile/${profile.id}`;
      navigator.clipboard.writeText(profileUrl);
    }
  };

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      {/* Cover/Background Area */}
      <Box
        sx={{
          height: 120,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative'
        }}
      />

      {/* Profile Content */}
      <Box sx={{ px: 3, pb: 3 }}>
        {/* Avatar and Basic Info */}
        <Box sx={{ position: 'relative', mt: -8, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                border: 4,
                borderColor: 'background.paper',
                fontSize: '3rem',
                fontWeight: 700,
                boxShadow: 3
              }}
            >
              {getInitials()}
            </Avatar>

            {/* Action Buttons */}
            {isOwnProfile && (
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={handleSettings}
                >
                  Settings
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                >
                  Share
                </Button>
              </Stack>
            )}
          </Box>

          {/* Name and Email */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
              {getDisplayName()}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
            </Box>

            {/* Location and Join Date */}
            <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
              {(profile as any).location && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {(profile as any).location}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Joined {formatJoinDate(profile.createdAt || new Date().toISOString())}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Bio */}
        {profile.bio && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {profile.bio}
            </Typography>
          </>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                    <ReviewIcon sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {statistics.totalReviews}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reviews
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                    <FavoriteIcon sx={{ fontSize: 24, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      {statistics.favoriteBooks}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Favorites
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                    <StarIcon sx={{ fontSize: 24, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {statistics.totalReviews > 0 ? statistics.averageRating.toFixed(1) : '0.0'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Rating
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                      {statistics.monthlyReviews}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      This Month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* Top Genres */}
        {statistics?.topGenres && statistics.topGenres.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Favorite Genres
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {statistics.topGenres.slice(0, 5).map((genre, index) => (
                  <Chip
                    key={genre}
                    label={genre}
                    variant={index === 0 ? "filled" : "outlined"}
                    color={index === 0 ? "primary" : "default"}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default ProfileHeader;
