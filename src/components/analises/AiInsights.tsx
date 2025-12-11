import React, { memo } from 'react';
import { Grid, Paper, Box, Chip, Typography } from '@mui/material';
import { Whatshot as AutoAwesome } from '@mui/icons-material';

interface AIInsight {
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

interface Props {
  insights: AIInsight[];
  classes?: any;
}

const AiInsights: React.FC<Props> = ({ insights, classes }) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={2} style={{ marginBottom: 24 }}>
      {insights.map((insight, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Paper className={classes?.insightCard} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
          }}>
            <Box display="flex" alignItems="center" style={{ gap: 8 }} mb={1}>
              <AutoAwesome />
              <Chip
                label={insight.prioridade.toUpperCase()}
                size="small"
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 600
                }}
              />
            </Box>
            <Typography variant="h6" gutterBottom>{insight.titulo}</Typography>
            <Typography variant="body2">{insight.descricao}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(AiInsights);
