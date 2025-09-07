import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface FormErrorProps {
  error: string | null;
  title?: string;
  variant?: 'filled' | 'outlined' | 'standard';
  severity?: 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const FormError: React.FC<FormErrorProps> = ({
  error,
  title = 'Error',
  variant = 'filled',
  severity = 'error',
  onClose,
}) => {
  if (!error) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        variant={variant}
        severity={severity}
        onClose={onClose}
        icon={<ErrorOutline />}
        sx={{
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {error}
      </Alert>
    </Box>
  );
};

export default FormError;
