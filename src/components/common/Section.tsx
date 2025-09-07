import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'highlighted' | 'bordered' | 'elevated';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  showDivider?: boolean;
  sx?: object;
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  component?: React.ElementType;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  spacing = 'medium',
  showDivider = false,
  sx = {},
  titleVariant = 'h4',
  component = 'section',
}) => {
  const getSpacingValue = () => {
    switch (spacing) {
      case 'none':
        return 0;
      case 'small':
        return { xs: 2, md: 3 };
      case 'medium':
        return { xs: 3, md: 4 };
      case 'large':
        return { xs: 4, md: 6 };
      default:
        return { xs: 3, md: 4 };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'highlighted':
        return {
          bgcolor: 'background.paper',
          border: (theme: any) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: { xs: 3, md: 4 },
        };
      case 'bordered':
        return {
          border: (theme: any) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: { xs: 3, md: 4 },
        };
      case 'elevated':
        return {
          bgcolor: 'background.paper',
          boxShadow: (theme: any) => theme.shadows[2],
          borderRadius: 2,
          p: { xs: 3, md: 4 },
        };
      default:
        return {};
    }
  };

  return (
    <Box
      component={component}
      sx={{
        py: getSpacingValue(),
        ...getVariantStyles(),
        ...sx,
      }}
    >
      {/* Section Header */}
      {(title || subtitle) && (
        <Box sx={{ mb: title || subtitle ? 3 : 0 }}>
          {title && (
            <Typography
              variant={titleVariant}
              component="h2"
              gutterBottom={!!subtitle}
              sx={{
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                maxWidth: '70ch',
              }}
            >
              {subtitle}
            </Typography>
          )}
          {showDivider && (
            <Divider sx={{ mt: 2, mb: 0 }} />
          )}
        </Box>
      )}

      {/* Section Content */}
      <Box>{children}</Box>
    </Box>
  );
};

export default Section;
