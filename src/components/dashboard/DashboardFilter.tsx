import React, { memo } from 'react';
import { Grid, Paper, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Refresh, PictureAsPdf } from '@mui/icons-material';

const useStyles = makeStyles(() => ({
  paper: {
    padding: '32px',
    margin: '20px auto',
    maxWidth: '1000px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 3px 5px -1px rgba(0,0,0,0.2)',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  searchField: {
    width: '100%',
  },
  dateFilter: {
    minWidth: '150px',
  },
  button: {
    width: '100%',
  },
  noPrint: {
    '@media print': {
      display: 'none !important',
    },
  },
}));

interface DashboardFilterProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onRefresh: () => void;
  onExportPDF: () => void;
  showOnlyPendentes: boolean;
  onTogglePendentes: () => void;
}

const DashboardFilter = memo(
  ({
    searchText,
    onSearchChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    onRefresh,
    onExportPDF,
    showOnlyPendentes,
    onTogglePendentes,
  }: DashboardFilterProps) => {
    const classes = useStyles();

    return (
      <Paper className={classes.paper}>
        <div className={classes.filterContainer}>
          <TextField
            label="Buscar Nome/CNPJ (mínimo 5 caracteres)"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            className={classes.searchField}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data Início"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data Fim"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                onClick={onRefresh}
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                fullWidth
              >
                Atualizar
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                onClick={onExportPDF}
                variant="contained"
                color="secondary"
                startIcon={<PictureAsPdf />}
                fullWidth
              >
                Exportar PDF
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                onClick={onTogglePendentes}
                variant="contained"
                color={showOnlyPendentes ? 'primary' : 'inherit'}
                fullWidth
              >
                {showOnlyPendentes ? 'Mostrar Todos' : 'Pendentes'}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
);

DashboardFilter.displayName = 'DashboardFilter';
export default DashboardFilter;
