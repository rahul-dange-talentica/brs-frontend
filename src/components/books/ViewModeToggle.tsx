/**
 * ViewModeToggle Component
 * Toggle between grid and list view modes
 */

import React from 'react';
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ViewModule,
  ViewList,
  ViewComfy,
} from '@mui/icons-material';

export type ViewMode = 'grid' | 'list' | 'compact';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
  availableModes?: ViewMode[];
}

const viewModeConfig = {
  grid: {
    icon: <ViewModule />,
    label: 'Grid View',
    description: 'Display books in a grid layout',
  },
  list: {
    icon: <ViewList />,
    label: 'List View',
    description: 'Display books in a detailed list',
  },
  compact: {
    icon: <ViewComfy />,
    label: 'Compact Grid',
    description: 'Display more books in a compact grid',
  },
};

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  value,
  onChange,
  size = 'small',
  showLabels = false,
  orientation = 'horizontal',
  availableModes = ['grid', 'list', 'compact']
}) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  return (
    <Box>
      {showLabels && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          View Mode
        </Typography>
      )}
      
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size={size}
        orientation={orientation}
        sx={{
          '& .MuiToggleButton-root': {
            border: '1px solid',
            borderColor: 'divider',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      >
        {availableModes.map((mode) => {
          const config = viewModeConfig[mode];
          return (
            <ToggleButton
              key={mode}
              value={mode}
              aria-label={config.label}
            >
              <Tooltip title={config.description} placement="top">
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: showLabels ? 1 : 0,
                  flexDirection: orientation === 'vertical' ? 'column' : 'row'
                }}>
                  {config.icon}
                  {showLabels && (
                    <Typography 
                      variant="caption"
                      sx={{ 
                        fontSize: size === 'small' ? '0.65rem' : '0.75rem',
                        display: { xs: 'none', sm: 'inline' }
                      }}
                    >
                      {config.label.replace(' View', '')}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ViewModeToggle;
