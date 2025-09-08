import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  History as HistoryIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { SearchHistoryItem } from '@/utils/searchHistory';

export interface SearchHistoryProps {
  historyItems: SearchHistoryItem[];
  popularSearches?: Array<{ query: string; count: number }>;
  trendingSearches?: Array<{ query: string; count: number }>;
  onHistoryClick: (query: string) => void;
  onDeleteHistoryItem: (query: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
  className?: string;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  historyItems,
  popularSearches = [],
  trendingSearches = [],
  onHistoryClick,
  onDeleteHistoryItem,
  onClearHistory,
  onClose,
  className,
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const hasContent = historyItems.length > 0 || popularSearches.length > 0 || trendingSearches.length > 0;

  if (!hasContent) {
    return (
      <Paper
        className={className}
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          mt: 0.5,
          p: 3,
          textAlign: 'center',
          zIndex: 1300,
          boxShadow: 3,
        }}
      >
        <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1" color="text.secondary" gutterBottom>
          No search history yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your recent searches will appear here
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      className={className}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        mt: 0.5,
        maxHeight: 400,
        overflow: 'auto',
        zIndex: 1300,
        boxShadow: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="h6" color="text.primary">
          Search History
        </Typography>
        <Box>
          {historyItems.length > 0 && (
            <IconButton 
              size="small" 
              onClick={onClearHistory}
              sx={{ mr: 1 }}
              title="Clear all history"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" onClick={onClose}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Trending Searches */}
      {trendingSearches.length > 0 && (
        <>
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              Trending Now
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {trendingSearches.slice(0, 5).map((item, index) => (
                <Chip
                  key={index}
                  label={item.query}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => onHistoryClick(item.query)}
                  sx={{ 
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Popular Searches */}
      {popularSearches.length > 0 && (
        <>
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Popular Searches
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {popularSearches.slice(0, 6).map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.query} (${item.count})`}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => onHistoryClick(item.query)}
                  sx={{ 
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Recent History */}
      {historyItems.length > 0 && (
        <>
          <Box sx={{ p: 2, pb: 0 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Recent Searches
            </Typography>
          </Box>
          <List dense>
            {historyItems.slice(0, 10).map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => onHistoryClick(item.query)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <HistoryIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={item.query}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(item.timestamp)}
                      </Typography>
                      {item.resultsCount !== undefined && (
                        <>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.resultsCount} results
                          </Typography>
                        </>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.query);
                    }}
                    sx={{ 
                      opacity: 0.6,
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};
