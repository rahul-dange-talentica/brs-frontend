import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link as MuiLink,
  Typography,
  Box,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { BreadcrumbItem } from '../../types/common';

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
  maxItems?: number;
  sx?: object;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  showHome = true,
  separator = <NavigateNextIcon fontSize="small" />,
  maxItems = 8,
  sx = {},
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from current path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Add home breadcrumb
    if (showHome && location.pathname !== '/') {
      breadcrumbs.push({
        label: 'Home',
        path: '/',
      });
    }

    // Generate breadcrumbs from path segments
    pathnames.forEach((pathname, index) => {
      const path = '/' + pathnames.slice(0, index + 1).join('/');
      const isActive = index === pathnames.length - 1;
      
      // Convert path segment to readable label
      const label = pathname
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: isActive ? undefined : path,
        active: isActive,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  // Don't show breadcrumbs for root path unless explicitly provided
  if (breadcrumbItems.length <= 1 && location.pathname === '/') {
    return null;
  }

  return (
    <Box
      sx={{
        py: 1,
        ...sx,
      }}
    >
      <MuiBreadcrumbs
        separator={separator}
        maxItems={maxItems}
        aria-label="breadcrumb navigation"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1,
            color: 'text.secondary',
          },
          '& .MuiBreadcrumbs-li': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isHome = item.path === '/' && showHome;

          if (isLast || !item.path) {
            return (
              <Typography
                key={item.label}
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                {isHome && <HomeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />}
                {item.label}
              </Typography>
            );
          }

          return (
            <MuiLink
              key={item.label}
              component={Link}
              to={item.path}
              underline="hover"
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
                transition: 'color 0.2s ease-in-out',
              }}
            >
              {isHome && <HomeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />}
              {item.label}
            </MuiLink>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
