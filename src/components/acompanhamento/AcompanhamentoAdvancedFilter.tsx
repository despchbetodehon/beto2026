import React, { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Filters {
  startDate: string;
  endDate: string;
  tipo: string;
  status: string;
  valorMin: string;
  valorMax: string;
  urgencia: string;
}

interface AcompanhamentoAdvancedFilterProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (key: string, value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

const AcompanhamentoAdvancedFilter = memo(
  ({ open, onClose, filters, onFilterChange, onApply, onClear }: AcompanhamentoAdvancedFilterProps) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
              Filtros Avançados
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} style={{ paddingTop: 16 }}>
            {/* Período */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                📅 Período
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data Início"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={filters.startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data Fim"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={filters.endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
              />
            </Grid>

            {/* Categorização */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                🏷️ Categorização
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo de Processo</InputLabel>
                <Select
                  value={filters.tipo}
                  onChange={(e) => onFilterChange('tipo', e.target.value)}
                  label="Tipo de Processo"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="Requerimento">Requerimento</MenuItem>
                  <MenuItem value="Transferência">Transferência</MenuItem>
                  <MenuItem value="Anuência">Anuência</MenuItem>
                  <MenuItem value="Requerimento Digital">Requerimento Digital</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                  <MenuItem value="Concluído">Concluído</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Valor Estimado */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                💰 Valor Estimado
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor Mínimo (R$)"
                type="number"
                fullWidth
                variant="outlined"
                value={filters.valorMin}
                onChange={(e) => onFilterChange('valorMin', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor Máximo (R$)"
                type="number"
                fullWidth
                variant="outlined"
                value={filters.valorMax}
                onChange={(e) => onFilterChange('valorMax', e.target.value)}
              />
            </Grid>

            {/* Urgência */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                🚨 Urgência
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Nível de Urgência</InputLabel>
                <Select
                  value={filters.urgencia}
                  onChange={(e) => onFilterChange('urgencia', e.target.value)}
                  label="Nível de Urgência"
                >
                  <MenuItem value="todas">Todas</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="media">Média</MenuItem>
                  <MenuItem value="baixa">Baixa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions style={{ padding: 16, gap: 8 }}>
          <Button variant="outlined" onClick={onClear}>
            Limpar
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={onApply} style={{ backgroundColor: '#4a7c59', color: '#fff' }}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

AcompanhamentoAdvancedFilter.displayName = 'AcompanhamentoAdvancedFilter';
export default AcompanhamentoAdvancedFilter;
