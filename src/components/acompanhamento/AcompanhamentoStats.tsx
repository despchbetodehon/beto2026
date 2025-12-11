import React, { memo } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
  statCard: {
    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  statIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(1),
  },
}));

interface Stats {
  total: number;
  emAndamento: number;
  concluidos: number;
  pendentes: number;
}

interface AcompanhamentoStatsProps {
  stats: Stats;
  loading: boolean;
}

const AcompanhamentoStats = memo(({ stats, loading }: AcompanhamentoStatsProps) => {
  const classes = useStyles();

  const statItems = [
    {
      label: 'Total de Processos',
      value: stats.total,
      color: '#2196F3',
      icon: '📋',
    },
    {
      label: 'Em Andamento',
      value: stats.emAndamento,
      color: '#FF9800',
      icon: '⏳',
    },
    {
      label: 'Concluídos',
      value: stats.concluidos,
      color: '#4CAF50',
      icon: '✅',
    },
    {
      label: 'Pendentes',
      value: stats.pendentes,
      color: '#F44336',
      icon: '⚠️',
    },
  ];

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
      <Box>
        <Typography variant="h6" style={{ color: '#4a7c59', fontWeight: 'bold' }}>
          Seus Processos {loading && <CircularProgress size={10} style={{ marginLeft: 8 }} />}
        </Typography>
        <Typography variant="body2" style={{ color: '#666', marginTop: 6 }}>
          Acompanhe o andamento de todos os seus serviços
        </Typography>
      </Box>

      <Grid container spacing={2} style={{ maxWidth: 600 }}>
        {statItems.map((item, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card className={classes.statCard}>
              <CardContent style={{ padding: 16 }}>
                <Typography variant="h4" style={{ fontSize: 24, marginBottom: 8 }}>
                  {item.icon}
                </Typography>
                <Typography variant="h6" style={{ color: item.color, fontWeight: 'bold' }}>
                  {stats.total === 0 && loading ? (
                    <CircularProgress size={24} style={{ color: item.color }} />
                  ) : (
                    item.value
                  )}
                </Typography>
                <Typography variant="body2" style={{ color: '#999', marginTop: 4 }}>
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

AcompanhamentoStats.displayName = 'AcompanhamentoStats';
export default AcompanhamentoStats;
