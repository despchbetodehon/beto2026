import React, { memo } from 'react';
import { Paper, Grid, Card, Typography, Badge } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Assignment, CheckCircle } from '@mui/icons-material';

const useStyles = makeStyles(() => ({
  dashboardHeader: {
    marginBottom: '16px',
    padding: '16px',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: '#000',
  },
  statCard: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#fff',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    },
    width: '100px',
    maxWidth: '100px',
    margin: '0 auto',
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '8px',
    color: '#1976d2',
  },
}));

interface Stats {
  total: number;
  pendentes: number;
  concluidos: number;
  valorTotal: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

const DashboardStats = memo(({ stats }: DashboardStatsProps) => {
  const classes = useStyles();

  return (
    <Paper className={classes.dashboardHeader}>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <Assignment className={classes.statIcon} />
            <Typography variant="h6">Total Documentos</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <Badge color="secondary" badgeContent={stats.pendentes}>
              <Assignment className={classes.statIcon} />
            </Badge>
            <Typography variant="h6">Pendentes</Typography>
            <Typography variant="h4">{stats.pendentes}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CheckCircle className={classes.statIcon} style={{ color: '#4CAF50' }} />
            <Typography variant="h6">Concluídos</Typography>
            <Typography variant="h4">{stats.concluidos}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <Typography variant="h6">Valor Total</Typography>
            <Typography variant="h4">R$ {stats.valorTotal.toLocaleString('pt-BR')}</Typography>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
});

DashboardStats.displayName = 'DashboardStats';
export default DashboardStats;
