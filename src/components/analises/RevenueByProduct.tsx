import React, { memo } from 'react';
import { Paper, Typography, Grid, Card } from '@mui/material';

interface ProdutoData {
  quantidade: number;
  receita: number;
}

interface Props {
  data: { [key: string]: ProdutoData };
}

const formatCurrency = (value: number) => {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  } catch (e) {
    return `R$ ${value.toFixed(2)}`;
  }
};

const RevenueByProduct: React.FC<Props> = ({ data }) => {
  const entries = Object.entries(data || {});

  if (entries.length === 0) {
    return null;
  }

  const cores = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ];

  return (
    <Paper style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}>
      <Typography style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 12, color: '#1a4d3a' }}>
        Receita por Produto
      </Typography>
      <Grid container spacing={2}>
        {entries.sort((a, b) => a[0].localeCompare(b[0])).map(([categoria, dados], index) => (
          <Grid item xs={6} sm={3} key={categoria}>
            <Card style={{
              padding: 12,
              background: cores[index] || cores[0],
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              textAlign: 'center'
            }}>
              <Typography style={{ fontSize: '0.65rem', opacity: 0.9, marginBottom: 4 }}>
                {categoria.replace(/^\d+\.\s*/, '')}
              </Typography>
              <Typography style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: 2 }}>
                {formatCurrency(dados.receita)}
              </Typography>
              <Typography style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                {dados.quantidade} doc{dados.quantidade !== 1 ? 's' : ''}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default memo(RevenueByProduct);
