import React, { memo } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { LocationOn, TrendingUp, Map as MapIcon } from '@mui/icons-material';
import MapaLeaflet from '@/components/analytics/MapaLeaflet';
import ListaFluxoCidades from '@/components/analytics/ListaFluxoCidades';
import RealTimeInsights from './RealTimeInsights';

interface CidadeFluxo {
  nome: string;
  documentos: number;
  receita: number;
  horaPico: string;
  tendencia: 'up' | 'down' | 'stable';
  crescimento: number;
  potencialMarketing: number;
}

interface Props {
  cidadesFluxo: CidadeFluxo[];
  onGerarEstrategia: (cidade: string) => Promise<string>;
}

const MapSection: React.FC<Props> = ({ cidadesFluxo, onGerarEstrategia }) => {
  return (
    <Grid container spacing={2} style={{ marginBottom: 16 }}>
      <Grid item xs={12} md={5}>
        <Typography style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 8, color: '#1a4d3a' }}>
          <MapIcon style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8 }} /> Mapa Interativo
        </Typography>
        <Box style={{ height: 500 }}>
          <MapaLeaflet dados={cidadesFluxo} />
        </Box>
      </Grid>
      <Grid item xs={12} md={3}>
        <ListaFluxoCidades
          cidades={cidadesFluxo}
          onGerarEstrategia={onGerarEstrategia}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper style={{ padding: 16, borderRadius: 12, height: '500px', overflowY: 'auto' }}>
          <RealTimeInsights cidades={cidadesFluxo} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default memo(MapSection);
