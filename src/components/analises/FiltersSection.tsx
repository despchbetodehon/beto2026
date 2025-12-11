import React from 'react';
import { Paper, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { Assessment, Map as MapIcon } from '@mui/icons-material';

interface Props {
  periodoAnalise: string;
  setPeriodoAnalise: (p: string) => void;
  gerarRelatorioCompleto: () => void;
  gerarAnaliseCidadesEstrategicas: () => void;
  loading: boolean;
  documentosPeriodoLength: number;
  classes?: any;
}

const FiltersSection: React.FC<Props> = ({ periodoAnalise, setPeriodoAnalise, gerarRelatorioCompleto, gerarAnaliseCidadesEstrategicas, loading, documentosPeriodoLength, classes }) => {
  return (
    <Paper style={{
      background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
      color: '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16
    }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Dashboard de Análises - SC
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={gerarRelatorioCompleto}
            disabled={loading || documentosPeriodoLength === 0}
            style={{
              background: 'white',
              color: '#1a4d3a',
              fontWeight: 600,
              marginRight: 12,
              textTransform: 'none'
            }}
            startIcon={<Assessment />}
          >
            🖨️ Relatório Completo
          </Button>
          <Button
            variant="contained"
            onClick={gerarAnaliseCidadesEstrategicas}
            disabled={loading || documentosPeriodoLength === 0}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none'
            }}
            startIcon={<MapIcon />}
          >
            📊 Análise 4 Cidades
          </Button>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small" style={{ minWidth: 150, background: 'white', borderRadius: 8 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={periodoAnalise}
              onChange={(e) => setPeriodoAnalise(e.target.value as string)}
              label="Período"
            >
              <MenuItem value="dia">Dia</MenuItem>
              <MenuItem value="semana">Semana</MenuItem>
              <MenuItem value="mes">Mês</MenuItem>
              <MenuItem value="trimestre">Trimestre</MenuItem>
              <MenuItem value="ano">Ano</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FiltersSection;
