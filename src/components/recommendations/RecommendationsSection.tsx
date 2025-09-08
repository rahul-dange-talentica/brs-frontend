import React from 'react';
import {
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Book } from '@/types/api';
import { PopularBooks } from './PopularBooks';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { GenreRecommendations } from './GenreRecommendations';
import { SimilarBooks } from './SimilarBooks';

export interface RecommendationsSectionProps {
  onBookClick?: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  getFavoriteStatus?: (bookId: string) => boolean;
  
  // Optional props to customize which sections to show
  showPopular?: boolean;
  showPersonalized?: boolean;
  showGenreBased?: boolean;
  showSimilar?: boolean;
  
  // Similar books specific props
  similarToBookId?: string;
  currentBook?: Book;
  
  // Genre recommendations specific props
  selectedGenreId?: string;
  
  // Layout props
  compact?: boolean;
  spacing?: number;
  className?: string;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  onBookClick,
  onToggleFavorite,
  getFavoriteStatus,
  showPopular = true,
  showPersonalized = true,
  showGenreBased = true,
  showSimilar = false,
  similarToBookId,
  currentBook,
  selectedGenreId,
  compact = false,
  spacing = 4,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Adjust spacing for different screen sizes
  const responsiveSpacing = isMobile ? spacing / 2 : isTablet ? spacing * 0.75 : spacing;
  const isCompactMode = compact || isMobile;

  const sectionProps = {
    onBookClick,
    onToggleFavorite,
    getFavoriteStatus,
    compact: isCompactMode,
    limit: isCompactMode ? 8 : 12,
  };

  return (
    <Box className={className}>
      {/* Similar Books - Show first if we have a current book */}
      {showSimilar && similarToBookId && (
        <>
          <SimilarBooks
            bookId={similarToBookId}
            currentBook={currentBook}
            {...sectionProps}
          />
          {(showPersonalized || showPopular || showGenreBased) && (
            <Divider sx={{ my: responsiveSpacing }} />
          )}
        </>
      )}

      {/* Personalized Recommendations - Show first for logged-in users */}
      {showPersonalized && (
        <>
          <PersonalizedRecommendations {...sectionProps} />
          {(showPopular || showGenreBased) && (
            <Divider sx={{ my: responsiveSpacing }} />
          )}
        </>
      )}

      {/* Popular Books */}
      {showPopular && (
        <>
          <PopularBooks {...sectionProps} />
          {showGenreBased && (
            <Divider sx={{ my: responsiveSpacing }} />
          )}
        </>
      )}

      {/* Genre-based Recommendations */}
      {showGenreBased && (
        <GenreRecommendations 
          selectedGenreId={selectedGenreId}
          {...sectionProps}
        />
      )}
    </Box>
  );
};
