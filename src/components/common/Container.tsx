import React from 'react';
import { Container as MuiContainer, ContainerProps as MuiContainerProps, SxProps, Theme } from '@mui/material';

interface ContainerProps extends Omit<MuiContainerProps, 'maxWidth'> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fluid?: boolean;
  centered?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  fluid = false,
  centered = false,
  sx = {},
  ...props
}) => {
  const containerSx: SxProps<Theme> = {
    ...(centered && {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    ...(fluid && {
      px: { xs: 2, sm: 3, md: 4 },
    }),
    ...sx,
  };

  return (
    <MuiContainer
      maxWidth={fluid ? false : maxWidth}
      sx={containerSx}
      {...props}
    >
      {children}
    </MuiContainer>
  );
};

export default Container;
