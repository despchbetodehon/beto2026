import React, { memo } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

/**
 * Componente reutilizável para loading state
 * Reduz duplicação em múltiplas páginas
 */
export const LoadingSpinner = memo<LoadingSpinnerProps>(({ 
  size = 40, 
  message = 'Carregando...', 
  fullScreen = false 
}) => {
  const content = (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
      <CircularProgress size={size} />
      {message && <Typography variant="body2">{message}</Typography>}
    </Box>
  );

  if (fullScreen) {
    return (
      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </Container>
    );
  }

  return content;
});

LoadingSpinner.displayName = 'LoadingSpinner';
