import React, { memo } from 'react';
import { Grid, Paper, Box, Typography, Chip } from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import { Timeline, LocationOn, ShowChart, Map as MapIcon } from '@mui/icons-material';

interface Props {
  tendencias: any[];
  dadosGraficoTendencias: any;
  opcoesGraficoTendencias: any;
  topCidades: any[];
  dadosGraficoDistribuicao: any;
  classes?: any;
}

const ChartSection: React.FC<Props> = ({ tendencias, dadosGraficoTendencias, opcoesGraficoTendencias, topCidades, dadosGraficoDistribuicao, classes }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Paper className={classes?.chartCard || ''}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography className={classes?.sectionTitle}>
              <ShowChart /> Evolução de Receita e Volume
            </Typography>
            <Box>
              <Chip
                label={`${tendencias.length} períodos`}
                size="small"
                style={{
                  background: tendencias.length > 0 ? '#e8f5e9' : '#ffebee',
                  color: tendencias.length > 0 ? '#1a4d3a' : '#c62828',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>
          {tendencias.length > 0 ? (
            <Line data={dadosGraficoTendencias} options={opcoesGraficoTendencias} />
          ) : (
            <Box textAlign="center" py={6}>
              <Timeline style={{ fontSize: 60, color: '#ccc', marginBottom: 16 }} />
              <Typography variant="h6" gutterBottom color="textSecondary">
                Sem dados de tendência
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Não há documentos no período selecionado para gerar o gráfico
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Paper className={classes?.chartCard || ''}>
          <Typography className={classes?.sectionTitle || ''}>
            <LocationOn /> Top 5 Cidades
          </Typography>
          {topCidades.length > 0 ? (
            <Doughnut data={dadosGraficoDistribuicao} options={{ responsive: true, maintainAspectRatio: true }} />
          ) : (
            <Box textAlign="center" py={6}>
              <MapIcon style={{ fontSize: 60, color: '#ccc', marginBottom: 16 }} />
              <Typography variant="h6" gutterBottom color="textSecondary">
                Sem dados de cidades
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Verifique se há documentos com campo "municipiocomprador" preenchido
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default memo(ChartSection);
