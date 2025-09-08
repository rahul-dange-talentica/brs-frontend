import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  Category as CategoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchGenreBasedRecommendations,
  selectGenreBasedRecommendations,
  selectGenreBasedRecommendationsLoading,
} from '@/store/booksSlice';
import { booksService } from '@/services';
import { Genre, Book } from '@/types/api';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationCarousel } from './RecommendationCarousel';

export interface GenreRecommendationsProps {
  selectedGenreId?: string;
  limit?: number;
  onBookClick?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  getFavoriteStatus?: (bookId: string) => boolean;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export const GenreRecommendations: React.FC<GenreRecommendationsProps> = ({
  selectedGenreId,
  limit = 12,
  onBookClick,
  onToggleFavorite,
  getFavoriteStatus,
  showHeader = true,
  compact = false,
  className,
}) => {
  const dispatch = useAppDispatch();
  const genreRecommendations = useAppSelector(selectGenreBasedRecommendations);
  const loading = useAppSelector(selectGenreBasedRecommendationsLoading);
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentGenreId, setCurrentGenreId] = useState(selectedGenreId || '');
  const [currentGenreName, setCurrentGenreName] = useState('');

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await booksService.getGenres();
        setGenres(genresList);
        
        if (!currentGenreId && genresList.length > 0) {
          setCurrentGenreId(genresList[0].id);
          setCurrentGenreName(genresList[0].name);
        }
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    
    loadGenres();
  }, []);

  // Fetch recommendations when genre changes
  useEffect(() => {
    if (currentGenreId) {
      dispatch(fetchGenreBasedRecommendations({ genreId: currentGenreId, limit }));
      const genre = genres.find(g => g.id === currentGenreId);
      setCurrentGenreName(genre?.name || '');
    }
  }, [dispatch, currentGenreId, limit, genres]);

  const handleGenreChange = (genreId: string) => {
    setCurrentGenreId(genreId);
  };

  const handleRefresh = () => {
    if (currentGenreId) {
      dispatch(fetchGenreBasedRecommendations({ genreId: currentGenreId, limit }));
    }
  };

  const getRecommendationReason = (): string => {
    return `Popular in ${currentGenreName}`;
  };

  if (loading && genreRecommendations.length === 0) {
    return (
      <Box className={className}>
        {showHeader && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Genre Recommendations
            </Typography>
          </Box>
        )}
        <RecommendationCarousel>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={compact ? 180 : 200} />
          ))}
        </RecommendationCarousel>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {showHeader && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              {currentGenreName} Books
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover great books in this genre
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={currentGenreId}
                label="Genre"
                onChange={(e) => handleGenreChange(e.target.value)}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              size="small"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      )}

      {genreRecommendations.length > 0 ? (
        <RecommendationCarousel 
          itemWidth={compact ? 160 : 200}
          showControls={genreRecommendations.length > 4}
        >
          {genreRecommendations.map((book) => (
            <RecommendationCard
              key={book.id}
              book={book}
              type="genre-based"
              reason={getRecommendationReason()}
              onViewDetails={onBookClick}
              onToggleFavorite={onToggleFavorite}
              isFavorite={getFavoriteStatus?.(book.id) || false}
              compact={compact}
            />
          ))}
        </RecommendationCarousel>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No recommendations available for this genre
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
