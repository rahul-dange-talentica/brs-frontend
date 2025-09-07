import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'name' | 'control'> {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  control,
  label,
  type = 'text',
  multiline = false,
  rows,
  disabled = false,
  ...textFieldProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          disabled={disabled}
          error={!!error}
          helperText={error?.message}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: error ? 'error.main' : 'primary.main',
              },
            },
            ...textFieldProps.sx,
          }}
        />
      )}
    />
  );
};

export default FormField;
