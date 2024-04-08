import React from 'react';
import { styled, CircularProgress, Typography, Button } from '@mui/material';

const StyledButton = styled(Button)(() => ({
  textTransform: 'none',
  color: 'white',
  variant: 'contained',
  borderRadius: 20,
  width: '80px',
}));

interface LoadingButtonProps {
  label: string;
  isLoading: boolean;
  handleClick: () => void;
}

export const LoadingButton = ({
  label,
  handleClick,
  isLoading,
}: LoadingButtonProps) => {
  return (
    <StyledButton
      sx={{
        bgcolor: isLoading ? 'secondary.light' : 'secondary.main',
      }}
      variant="contained"
      onClick={handleClick}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: 'white' }} size="20px" />
      ) : (
        <Typography variant="body2">{label}</Typography>
      )}
    </StyledButton>
  );
};
