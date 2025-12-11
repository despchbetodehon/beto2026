import React, { memo } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

/**
 * Componente reutilizável para estado de erro
 */
export const ErrorState = memo<ErrorStateProps>(({ 
  title = 'Erro',
  message, 
  onRetry, 
  fullScreen = false 
}) => {
  const content = (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
      <ErrorOutline sx={{ fontSize: 48, color: 'error.main' }} />
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="textSecondary" textAlign="center">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry} size="small">
          Tentar Novamente
        </Button>
      )}
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

ErrorState.displayName = 'ErrorState';
