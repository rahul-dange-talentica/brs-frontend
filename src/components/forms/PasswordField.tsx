import React, { useState } from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  control,
  label,
  disabled = false,
  autoComplete = 'current-password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          autoComplete={autoComplete}
          error={!!error}
          helperText={error?.message}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={`${showPassword ? 'Hide' : 'Show'} password`}
                  onClick={handleTogglePasswordVisibility}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  disabled={disabled}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default PasswordField;
