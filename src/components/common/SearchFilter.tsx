import React, { memo } from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useDebounce } from '@/hooks';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Componente de busca reutilizável com debounce
 * Melhora performance em listas grandes
 */
export const SearchFilter = memo<SearchFilterProps>(({
  value,
  onChange,
  placeholder = 'Buscar...'
}) => {
  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      size="small"
    />
  );
});

SearchFilter.displayName = 'SearchFilter';
