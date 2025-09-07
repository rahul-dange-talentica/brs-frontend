/**
 * ReviewGuidelines Component
 * Guidelines and tips for writing good reviews
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as DoNotIcon,
  Star as StarIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface ReviewGuidelinesProps {
  compact?: boolean;
  showAsAccordion?: boolean;
}

const DO_ITEMS = [
  'Be honest and constructive in your feedback',
  'Focus on specific aspects like plot, characters, writing style',
  'Consider the target audience when rating',
  'Mention what you liked and what could be improved',
  'Keep your review relevant to the book content'
];

const DONT_ITEMS = [
  'Include spoilers without warning',
  'Attack the author personally',
  'Review based on price or delivery issues',
  'Copy reviews from other sources',
  'Use offensive or inappropriate language'
];

const RATING_GUIDE = [
  { stars: 5, label: 'Excellent', description: 'Outstanding book, highly recommended' },
  { stars: 4, label: 'Very Good', description: 'Good book with minor flaws' },
  { stars: 3, label: 'Good', description: 'Decent book, worth reading' },
  { stars: 2, label: 'Fair', description: 'Has some redeeming qualities but significant issues' },
  { stars: 1, label: 'Poor', description: 'Major problems, not recommended' }
];

export const ReviewGuidelines: React.FC<ReviewGuidelinesProps> = ({
  compact = false,
  showAsAccordion = false
}) => {
  const content = (
    <Box>
      {/* Writing Tips */}
      <Box sx={{ mb: compact ? 2 : 3 }}>
        <Typography
          variant={compact ? 'subtitle2' : 'h6'}
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <InfoIcon fontSize="small" color="primary" />
          Writing Tips
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          <Chip label="Be specific" size="small" variant="outlined" />
          <Chip label="Stay relevant" size="small" variant="outlined" />
          <Chip label="Be constructive" size="small" variant="outlined" />
          <Chip label="Consider others" size="small" variant="outlined" />
        </Stack>
      </Box>

      {/* Rating Guide */}
      {!compact && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon fontSize="small" color="warning" />
            Rating Guide
          </Typography>
          
          <List dense>
            {RATING_GUIDE.map((item) => (
              <ListItem key={item.stars} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      {item.stars}
                    </Typography>
                    <StarIcon fontSize="small" color="warning" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Do's and Don'ts */}
      {!compact && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {/* Do's */}
          <Box>
            <Typography variant="subtitle1" gutterBottom color="success.main" sx={{ fontWeight: 600 }}>
              <CheckIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Do
            </Typography>
            <List dense>
              {DO_ITEMS.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Don'ts */}
          <Box>
            <Typography variant="subtitle1" gutterBottom color="error.main" sx={{ fontWeight: 600 }}>
              <DoNotIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Don't
            </Typography>
            <List dense>
              {DONT_ITEMS.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <DoNotIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </Box>
  );

  if (showAsAccordion) {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Review Guidelines
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {content}
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Paper sx={{ p: compact ? 2 : 3, backgroundColor: 'background.default' }}>
      <Typography variant={compact ? 'subtitle1' : 'h6'} gutterBottom sx={{ fontWeight: 600 }}>
        Review Guidelines
      </Typography>
      {content}
    </Paper>
  );
};

export default ReviewGuidelines;
