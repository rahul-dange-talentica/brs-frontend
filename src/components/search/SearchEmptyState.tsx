import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  SearchOff as SearchOffIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

export interface SearchEmptyStateProps {
  query: string;
  onTryQuery?: (query: string) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  popularSearches?: Array<{ query: string; count: number }>;
  suggestions?: string[];
  className?: string;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  onTryQuery,
  onClearFilters,
  hasActiveFilters = false,
  popularSearches = [],
  suggestions = [],
  className,
}) => {
  // Generate search suggestions based on common misspellings and variations
  const generateSuggestions = (searchQuery: string): string[] => {
    const suggestions: string[] = [];
    
    // Common book-related search terms
    const bookTerms = ['fiction', 'mystery', 'romance', 'science fiction', 'biography', 'history'];
    const authorTerms = ['stephen king', 'j.k. rowling', 'agatha christie', 'dan brown'];
    
    // If query is short, suggest popular categories
    if (searchQuery.length <= 3) {
      suggestions.push(...bookTerms.slice(0, 3));
    }
    
    // Suggest similar terms
    const lowerQuery = searchQuery.toLowerCase();
    bookTerms.forEach(term => {
      if (term.includes(lowerQuery) || lowerQuery.includes(term.split(' ')[0])) {
        suggestions.push(term);
      }
    });
    
    authorTerms.forEach(author => {
      if (author.includes(lowerQuery)) {
        suggestions.push(author);
      }
    });
    
    return suggestions.slice(0, 5);
  };

  const searchSuggestions = suggestions.length > 0 ? suggestions : generateSuggestions(query);
  const topPopularSearches = popularSearches.slice(0, 6);

  return (
    <Box className={className} sx={{ textAlign: 'center', py: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          backgroundColor: 'grey.50',
          borderRadius: 2,
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        {/* Icon and Main Message */}
        <SearchOffIcon 
          sx={{ 
            fontSize: 80, 
            color: 'text.secondary',
            mb: 2,
          }} 
        />
        
        <Typography variant="h5" gutterBottom>
          No results found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We couldn't find any books matching{' '}
          <strong>"{query}"</strong>
        </Typography>

        {/* Clear Filters Option */}
        {hasActiveFilters && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try removing some filters to see more results
            </Typography>
            <Button
              variant="outlined"
              onClick={onClearFilters}
              startIcon={<RefreshIcon />}
            >
              Clear All Filters
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Search Tips */}
        <Box sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LightbulbIcon sx={{ mr: 1 }} />
            Search Tips
          </Typography>
          <Box component="ul" sx={{ 
            textAlign: 'left', 
            color: 'text.secondary',
            pl: 2,
            '& li': { mb: 1 }
          }}>
            <li>Check your spelling and try again</li>
            <li>Try using fewer or different keywords</li>
            <li>Search for the author's name instead of the book title</li>
            <li>Try searching by genre (e.g., "mystery", "romance", "sci-fi")</li>
            <li>Use broader terms (e.g., "cooking" instead of "Italian cooking")</li>
          </Box>
        </Box>

        {/* Search Suggestions */}
        {searchSuggestions.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Try These Searches
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {searchSuggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  variant="outlined"
                  clickable
                  onClick={() => onTryQuery?.(suggestion)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Popular Searches */}
        {topPopularSearches.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              Popular Searches
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {topPopularSearches.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.query} (${item.count})`}
                  variant="outlined"
                  clickable
                  onClick={() => onTryQuery?.(item.query)}
                  color="primary"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
