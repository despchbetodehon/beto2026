import React, { memo } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface AnalysisFiltersProps {
  period: string;
  onPeriodChange: (period: string) => void;
  status?: string;
  onStatusChange?: (status: string) => void;
}

/**
 * Componente de filtros para análises
 * Extraído de análises/index.tsx
 */
export const AnalysisFilters = memo<AnalysisFiltersProps>(({
  period,
  onPeriodChange,
  status,
  onStatusChange
}) => {
  return (
    <Box display="flex" gap={2} mb={3}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Período</InputLabel>
        <Select
          value={period}
          onChange={(e: SelectChangeEvent) => onPeriodChange(e.target.value)}
          label="Período"
        >
          <MenuItem value="7">Últimos 7 dias</MenuItem>
          <MenuItem value="30">Últimos 30 dias</MenuItem>
          <MenuItem value="90">Últimos 90 dias</MenuItem>
          <MenuItem value="365">Último ano</MenuItem>
        </Select>
      </FormControl>
      
      {status !== undefined && onStatusChange && (
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e: SelectChangeEvent) => onStatusChange(e.target.value)}
            label="Status"
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="ativo">Ativo</MenuItem>
            <MenuItem value="inativo">Inativo</MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
});

AnalysisFilters.displayName = 'AnalysisFilters';
