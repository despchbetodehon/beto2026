import React, { memo } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

/**
 * Componente para exibir estatísticas
 * Extraído de análises/index.tsx
 */
export const StatCard = memo<StatCardProps>(({
  title,
  value,
  icon,
  color = 'primary.main',
  trend
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box sx={{ fontSize: '2rem', color }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';
