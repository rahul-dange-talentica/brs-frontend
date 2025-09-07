/**
 * RecentActivity Component
 * Display user's recent reading activity with timeline visualization
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  Button,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';
import {
  RateReview as ReviewIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  BookmarkAdd as BookmarkIcon,
  TrendingUp as ActivityIcon,
  MoreHoriz as MoreIcon
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { UserActivity } from './types';

interface RecentActivityProps {
  activities: UserActivity[];
  maxItems?: number;
  showTitle?: boolean;
  compact?: boolean;
}

interface ActivityItemProps {
  activity: UserActivity;
  isLast?: boolean;
  compact?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast = false, compact = false }) => {
  const navigate = useNavigate();

  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'review':
        return <ReviewIcon sx={{ fontSize: compact ? 18 : 20 }} />;
      case 'favorite':
        return <FavoriteIcon sx={{ fontSize: compact ? 18 : 20 }} />;
      case 'rating':
        return <StarIcon sx={{ fontSize: compact ? 18 : 20 }} />;
      case 'profile_update':
        return <BookmarkIcon sx={{ fontSize: compact ? 18 : 20 }} />;
      default:
        return <ActivityIcon sx={{ fontSize: compact ? 18 : 20 }} />;
    }
  };

  const getActivityColor = (type: UserActivity['type']): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    switch (type) {
      case 'review':
        return 'primary';
      case 'favorite':
        return 'secondary';
      case 'rating':
        return 'warning';
      case 'profile_update':
        return 'success';
      default:
        return 'info';
    }
  };

  const handleBookClick = () => {
    if (activity.bookId) {
      navigate(`/books/${activity.bookId}`);
    }
  };

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: `${getActivityColor(activity.type)}.main`,
            mr: 2
          }}
        >
          {getActivityIcon(activity.type)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap>
            {activity.action}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {activity.bookTitle} • {formatActivityTime(activity.timestamp)}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={getActivityColor(activity.type)}>
          {getActivityIcon(activity.type)}
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent sx={{ py: '12px', px: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {activity.action}
        </Typography>
        
        {activity.bookTitle && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              cursor: activity.bookId ? 'pointer' : 'default',
              '&:hover': activity.bookId ? { color: 'primary.main' } : {}
            }}
            onClick={handleBookClick}
          >
            {activity.bookTitle}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formatActivityTime(activity.timestamp)}
          </Typography>
          
          {activity.details?.rating && (
            <Chip 
              label={`${activity.details.rating}★`} 
              size="small" 
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  maxItems = 10,
  showTitle = true,
  compact = false
}) => {
  const navigate = useNavigate();
  const displayActivities = activities.slice(0, maxItems);
  const hasMoreActivities = activities.length > maxItems;

  const handleViewAllActivity = () => {
    navigate('/profile?tab=activity');
  };

  if (compact) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2 }}>
          {showTitle && (
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
          )}
          
          {displayActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <ActivityIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {displayActivities.map((activity) => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity} 
                  compact 
                />
              ))}
              {hasMoreActivities && (
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={handleViewAllActivity}
                  endIcon={<MoreIcon />}
                >
                  View More
                </Button>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      {showTitle && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6">Recent Activity</Typography>
          {activities.length > 0 && (
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleViewAllActivity}
            >
              View All
            </Button>
          )}
        </Box>
      )}

      {/* Activity Timeline */}
      {displayActivities.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <ActivityIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No recent activity
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start exploring books, writing reviews, and adding favorites to see your activity here.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/books')}
          >
            Browse Books
          </Button>
        </Box>
      ) : (
        <Timeline>
          {displayActivities.map((activity, index) => (
            <ActivityItem 
              key={activity.id}
              activity={activity}
              isLast={index === displayActivities.length - 1}
            />
          ))}
        </Timeline>
      )}

      {/* Show More Button */}
      {hasMoreActivities && (
        <>
          <Divider sx={{ mt: 2, mb: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={handleViewAllActivity}
              endIcon={<MoreIcon />}
            >
              View {activities.length - maxItems} More Activities
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default RecentActivity;
