import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  PersonOutline as PersonOutlineIcon,
  AutoAwesome as AutoAwesomeIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';

export interface RecommendationReasonProps {
  reason: string;
  type: 'popular' | 'genre-based' | 'personalized' | 'similar' | 'diverse';
  compact?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const RecommendationReason: React.FC<RecommendationReasonProps> = ({
  reason,
  type,
  compact = false,
  showIcon = true,
  className,
}) => {
  const getReasonIcon = () => {
    switch (type) {
      case 'popular':
        return <TrendingUpIcon />;
      case 'genre-based':
        return <CategoryIcon />;
      case 'personalized':
        return <PersonOutlineIcon />;
      case 'similar':
        return <AutoAwesomeIcon />;
      case 'diverse':
        return <ThumbUpIcon />;
      default:
        return <AutoAwesomeIcon />;
    }
  };

  const getReasonColor = () => {
    switch (type) {
      case 'popular':
        return 'error.main';
      case 'genre-based':
        return 'primary.main';
      case 'personalized':
        return 'secondary.main';
      case 'similar':
        return 'success.main';
      case 'diverse':
        return 'warning.main';
      default:
        return 'text.secondary';
    }
  };

  const formatReason = (reasonText: string) => {
    // Clean up and format the reason text
    if (reasonText.length > 50 && compact) {
      return reasonText.substring(0, 47) + '...';
    }
    return reasonText;
  };

  const formattedReason = formatReason(reason);

  if (compact) {
    return (
      <Tooltip title={reason} placement="bottom">
        <Box
          className={className}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
          }}
        >
          {showIcon && (
            <Box
              sx={{
                color: getReasonColor(),
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.8rem',
              }}
            >
              {React.cloneElement(getReasonIcon(), { fontSize: 'inherit' })}
            </Box>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              lineHeight: 1.2,
            }}
          >
            {formattedReason}
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        mt: 1,
        p: 1,
        backgroundColor: 'grey.50',
        borderRadius: 1,
        borderLeft: 3,
        borderLeftColor: getReasonColor(),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {showIcon && (
          <Box
            sx={{
              color: getReasonColor(),
              mt: 0.1,
              fontSize: '1rem',
            }}
          >
            {React.cloneElement(getReasonIcon(), { fontSize: 'inherit' })}
          </Box>
        )}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontStyle: 'italic',
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {formattedReason}
        </Typography>
      </Box>
    </Box>
  );
};
