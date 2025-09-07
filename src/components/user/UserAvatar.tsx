/**
 * UserAvatar Component
 * User avatar display with upload functionality
 */

import React, { useState, useRef } from 'react';
import {
  Avatar,
  Badge,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import {
  PhotoCamera as CameraIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { UserProfile } from '@/types/api';

interface UserAvatarProps {
  profile: UserProfile;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  editable?: boolean;
  onAvatarUpdate?: (file: File) => Promise<void>;
  showName?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  profile,
  size = 'medium',
  editable = false,
  onAvatarUpdate,
  showName = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get avatar size
  const getAvatarSize = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: '1rem' };
      case 'medium':
        return { width: 56, height: 56, fontSize: '1.25rem' };
      case 'large':
        return { width: 80, height: 80, fontSize: '2rem' };
      case 'extra-large':
        return { width: 120, height: 120, fontSize: '3rem' };
      default:
        return { width: 56, height: 56, fontSize: '1.25rem' };
    }
  };

  const avatarSize = getAvatarSize();

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
    return profile.email.split('@')[0];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewDialogOpen(true);
    setError(null);

    // Store file for upload
    if (fileInputRef.current) {
      fileInputRef.current.dataset.selectedFile = JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const handleUploadConfirm = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0] || !onAvatarUpdate) return;

    const file = fileInput.files[0];

    try {
      setUploading(true);
      await onAvatarUpdate(file);
      setPreviewDialogOpen(false);
      setPreviewUrl(null);
    } catch (error) {
      setError('Failed to update avatar. Please try again.');
      console.error('Avatar upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadCancel = () => {
    setPreviewDialogOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAvatarClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const avatarComponent = (
    <Avatar
      sx={{
        ...avatarSize,
        bgcolor: 'primary.main',
        fontWeight: 600,
        cursor: editable ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        ...(editable && {
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 2
          }
        })
      }}
      onClick={handleAvatarClick}
      src={profile.avatar || undefined}
    >
      {profile.avatar ? null : getInitials()}
    </Avatar>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Avatar with Upload Badge */}
      {editable ? (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            uploading ? (
              <CircularProgress size={20} />
            ) : (
              <IconButton
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
                onClick={handleAvatarClick}
              >
                <CameraIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )
          }
        >
          {avatarComponent}
        </Badge>
      ) : (
        avatarComponent
      )}

      {/* Display Name */}
      {showName && (
        <Typography
          variant={size === 'small' ? 'caption' : 'body2'}
          sx={{
            mt: 1,
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {getDisplayName()}
        </Typography>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 1, maxWidth: 200 }}>
          {error}
        </Alert>
      )}

      {/* Hidden File Input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handleUploadCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Update Profile Picture
          <IconButton onClick={handleUploadCancel}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          {previewUrl && (
            <Box sx={{ mb: 2 }}>
              <Avatar
                src={previewUrl}
                sx={{
                  width: 150,
                  height: 150,
                  mx: 'auto',
                  mb: 2,
                  border: 3,
                  borderColor: 'primary.main'
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Preview of your new profile picture
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleUploadCancel} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadConfirm}
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <CameraIcon />}
          >
            {uploading ? 'Uploading...' : 'Update Picture'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAvatar;
