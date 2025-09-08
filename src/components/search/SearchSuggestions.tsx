import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'book' | 'author' | 'genre' | 'history' | 'trending';
  metadata?: {
    bookId?: string;
    authorName?: string;
    genreId?: string;
    resultCount?: number;
  };
}

export interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onClose: () => void;
  loading?: boolean;
  query?: string;
  className?: string;
}

const getSuggestionIcon = (type: SearchSuggestion['type']) => {
  switch (type) {
    case 'book':
      return <BookIcon fontSize="small" />;
    case 'author':
      return <PersonIcon fontSize="small" />;
    case 'genre':
      return <CategoryIcon fontSize="small" />;
    case 'history':
      return <HistoryIcon fontSize="small" />;
    case 'trending':
      return <TrendingUpIcon fontSize="small" />;
    default:
      return <SearchIcon fontSize="small" />;
  }
};

const getSuggestionLabel = (type: SearchSuggestion['type']) => {
  switch (type) {
    case 'book':
      return 'Book';
    case 'author':
      return 'Author';
    case 'genre':
      return 'Genre';
    case 'history':
      return 'Recent';
    case 'trending':
      return 'Trending';
    default:
      return 'Search';
  }
};

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  onClose,
  loading = false,
  query = '',
  className,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const paperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (suggestions.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSuggestionClick(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, onSuggestionClick, onClose]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const key = suggestion.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(suggestion);
    return groups;
  }, {} as Record<string, SearchSuggestion[]>);

  // Define display order for suggestion types
  const typeOrder: Array<SearchSuggestion['type']> = [
    'history', 'trending', 'query', 'book', 'author', 'genre'
  ];

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <strong key={index} style={{ fontWeight: 600 }}>{part}</strong>
      ) : part
    );
  };

  if (suggestions.length === 0 && !loading) {
    return null;
  }

  return (
    <Paper
      ref={paperRef}
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="caption" color="text.secondary">
          {loading ? 'Loading suggestions...' : `${suggestions.length} suggestions`}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {loading ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading suggestions...
          </Typography>
        </Box>
      ) : (
        <List ref={listRef} dense>
          {typeOrder.map((type, typeIndex) => {
            const typeSuggestions = groupedSuggestions[type];
            if (!typeSuggestions) return null;

            return (
              <React.Fragment key={type}>
                {typeIndex > 0 && <Divider />}
                {typeSuggestions.map((suggestion, index) => {
                  const globalIndex = typeOrder
                    .slice(0, typeIndex)
                    .reduce((acc, t) => acc + (groupedSuggestions[t]?.length || 0), 0) + index;
                  
                  return (
                    <ListItem
                      key={`${type}-${index}`}
                      button
                      selected={selectedIndex === globalIndex}
                      onClick={() => onSuggestionClick(suggestion)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'action.selected',
                        },
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getSuggestionIcon(suggestion.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={highlightText(suggestion.text, query)}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={getSuggestionLabel(suggestion.type)}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            {suggestion.metadata?.resultCount && (
                              <Typography variant="caption" color="text.secondary">
                                {suggestion.metadata.resultCount} results
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};
