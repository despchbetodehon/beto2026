import React, { memo } from 'react';
import { Grid, Card, Typography } from '@mui/material';
import { Assessment, AttachMoney, TrendingUp, Person, LocationOn, Timeline } from '@mui/icons-material';

interface MetricasGerais {
  totalDocumentos: number;
  totalReceita: number;
  ticketMedio: number;
  crescimentoMensal: number;
  clientesUnicos: number;
  cidadesAtendidas: number;
}

interface Props {
  metricas: MetricasGerais;
}

const formatCurrency = (value: number) => {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  } catch (e) {
    return `R$ ${value.toFixed(2)}`;
  }
};

const StatsGrid: React.FC<Props> = ({ metricas }) => {
  return (
    <Grid container spacing={2} style={{ marginBottom: 16 }}>
      <Grid item xs={6} sm={4} md={2}>
        <Card style={{ padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <Assessment style={{ color: '#1a4d3a', fontSize: 20 }} />
          <Typography style={{ fontSize: '0.7rem', color: '#666', marginTop: 4 }}>Documentos</Typography>
          <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a4d3a' }}>
            {metricas.totalDocumentos}
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Card style={{ padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <AttachMoney style={{ color: '#4caf50', fontSize: 20 }} />
          <Typography style={{ fontSize: '0.7rem', color: '#666', marginTop: 4 }}>Receita Total</Typography>
          <Typography style={{ fontSize: metricas.totalReceita > 999999 ? '1.2rem' : '1.5rem', fontWeight: 'bold', color: '#4caf50' }}>
            {formatCurrency(metricas.totalReceita)}
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Card style={{ padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <TrendingUp style={{ color: '#2196f3', fontSize: 20 }} />
          <Typography style={{ fontSize: '0.7rem', color: '#666', marginTop: 4 }}>Ticket Médio</Typography>
          <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196f3' }}>
            {formatCurrency(metricas.ticketMedio)}
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Card style={{ padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <Person style={{ color: '#ff9800', fontSize: 20 }} />
          <Typography style={{ fontSize: '0.7rem', color: '#666', marginTop: 4 }}>Clientes</Typography>
          <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff9800' }}>
            {metricas.clientesUnicos}
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Card style={{ padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <LocationOn style={{ color: '#9c27b0', fontSize: 20 }} />
          <Typography style={{ fontSize: '0.7rem', color: '#666', marginTop: 4 }}>Cidades SC</Typography>
          <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9c27b0' }}>
            {metricas.cidadesAtendidas}
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Card style={{ padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <Timeline style={{ color: metricas.crescimentoMensal >= 0 ? '#4caf50' : '#f44336', fontSize: 20 }} />
          <Typography style={{ fontSize: '0.7rem', color: '#666', marginTop: 4 }}>Crescimento</Typography>
          <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold', color: metricas.crescimentoMensal >= 0 ? '#4caf50' : '#f44336' }}>
            {metricas.crescimentoMensal.toFixed(1)}%
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export default memo(StatsGrid);
