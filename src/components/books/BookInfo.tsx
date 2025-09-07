/**
 * BookInfo Component
 * Displays detailed book information for book detail pages
 */

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import {
  Book as BookIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { BookDisplay } from '@/types';
import { RatingDisplay } from './RatingDisplay';
import { getPublicationYear } from '@/utils/bookTransformers';

interface BookInfoProps {
  book: BookDisplay;
  showFullDescription?: boolean;
}

export const BookInfo: React.FC<BookInfoProps> = ({
  book,
  showFullDescription = true
}) => {
  const publicationYear = getPublicationYear(book);

  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
  }> = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Title and Author */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'text.primary'
          }}
        >
          {book.title}
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          by {book.author}
        </Typography>
      </Box>

      {/* Rating Summary */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <RatingDisplay
            value={book.averageRating}
            size="large"
            showValue
            readOnly
          />
          <Typography variant="h6" color="text.secondary">
            {book.averageRating.toFixed(1)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Based on {book.totalReviews.toLocaleString()} review{book.totalReviews !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Book Details Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <InfoItem
              icon={<PersonIcon color="action" />}
              label="Author"
              value={book.author}
            />
            
            {book.isbn && (
              <InfoItem
                icon={<BookIcon color="action" />}
                label="ISBN"
                value={book.isbn}
              />
            )}
            
            <InfoItem
              icon={<CalendarIcon color="action" />}
              label="Published"
              value={publicationYear}
            />
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <InfoItem
              icon={<StarIcon color="action" />}
              label="Average Rating"
              value={`${book.averageRating.toFixed(1)} / 5.0`}
            />
            
            <InfoItem
              icon={<CategoryIcon color="action" />}
              label="Genres"
              value={
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {book.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Stack>
              }
            />
          </Stack>
        </Grid>
      </Grid>

      {/* Description */}
      {book.description && showFullDescription && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Description
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.7,
                whiteSpace: 'pre-line'
              }}
            >
              {book.description}
            </Typography>
          </Box>
        </>
      )}

      {/* Quick Stats */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 2,
          mt: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {book.averageRating.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Average Rating
          </Typography>
        </Box>
        
        <Divider orientation="vertical" flexItem />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {book.totalReviews.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Reviews
          </Typography>
        </Box>
        
        <Divider orientation="vertical" flexItem />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {book.genres.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Genre{book.genres.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BookInfo;
