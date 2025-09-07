import React from 'react';
import { Box, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';

interface AuthFormWrapperProps {
  children: React.ReactNode;
  maxWidth?: number | string;
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ 
  children, 
  maxWidth = 400 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        width: '100%',
      }}
    >
      <Card
        elevation={isMobile ? 0 : 3}
        sx={{
          width: '100%',
          maxWidth,
          mx: 'auto',
          backgroundColor: 'background.paper',
          borderRadius: isMobile ? 0 : 2,
          overflow: 'visible',
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, sm: 4 },
            '&:last-child': {
              pb: { xs: 3, sm: 4 },
            },
          }}
        >
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthFormWrapper;
