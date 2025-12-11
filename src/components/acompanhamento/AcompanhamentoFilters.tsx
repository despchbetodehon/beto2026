import React, { memo } from 'react';
import {
  Box,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Button,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

interface AcompanhamentoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
  onAdvancedFilterOpen: () => void;
  loading: boolean;
  searchError: string | null;
}

const AcompanhamentoFilters = memo(
  ({
    searchTerm,
    onSearchChange,
    onSearchSubmit,
    filterStatus,
    onFilterChange,
    onAdvancedFilterOpen,
    loading,
    searchError,
  }: AcompanhamentoFiltersProps) => {
    return (
      <Box display="flex" alignItems="center" marginBottom={6} style={{ gap: 8 }}>
        <TextField
          label="Pesquisar"
          variant="outlined"
          size="small"
          style={{ flexGrow: 1 }}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
          error={!!searchError}
          helperText={searchError}
          placeholder="Ex: 123.456.789-00"
        />
        <Tooltip title="Buscar">
          <IconButton onClick={onSearchSubmit} disabled={loading}>
            <Search />
          </IconButton>
        </Tooltip>
        <FormControl variant="outlined" size="small">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            label="Status"
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="Em Andamento">Em Andamento</MenuItem>
            <MenuItem value="Pendente">Pendente</MenuItem>
            <MenuItem value="Concluído">Concluído</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Filtros Avançados">
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterList />}
            onClick={onAdvancedFilterOpen}
          >
            Filtros
          </Button>
        </Tooltip>
      </Box>
    );
  }
);

AcompanhamentoFilters.displayName = 'AcompanhamentoFilters';
export default AcompanhamentoFilters;
