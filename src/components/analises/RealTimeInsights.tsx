import React, { memo } from 'react';
import { Card, Typography, Box, LinearProgress } from '@mui/material';

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
  cidades: CidadeFluxo[];
}

const formatCurrency = (value: number) => {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  } catch (e) {
    return `R$ ${value.toFixed(2)}`;
  }
};

const RealTimeInsights: React.FC<Props> = ({ cidades }) => {
  const topCidades = cidades.slice(0, 5);

  if (topCidades.length === 0) {
    return null;
  }

  return (
    <>
      <Typography style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 12, color: '#1a4d3a' }}>
        ⚡ Insights em Tempo Real
      </Typography>
      {topCidades.map((cidade, index) => (
        <Card key={cidade.nome} style={{
          marginBottom: 12,
          padding: 12,
          background: `linear-gradient(135deg, ${index % 2 === 0 ? '#667eea' : '#f093fb'} 0%, ${index % 2 === 0 ? '#764ba2' : '#f5576c'} 100%)`,
          color: '#fff'
        }}>
          <Typography style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: 6 }}>
            {index + 1}. {cidade.nome}
          </Typography>
          <Box display="flex" justifyContent="space-between" style={{ marginBottom: 4 }}>
            <Typography style={{ fontSize: '0.75rem' }}>
              📊 {cidade.documentos} docs
            </Typography>
            <Typography style={{ fontSize: '0.75rem' }}>
              💰 {formatCurrency(cidade.receita)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" style={{ marginBottom: 4 }}>
            <Typography style={{ fontSize: '0.75rem' }}>
              🕐 Pico: {cidade.horaPico}
            </Typography>
            <Typography style={{ fontSize: '0.75rem' }}>
              {cidade.tendencia === 'up' ? '📈' : cidade.tendencia === 'down' ? '📉' : '➡️'} {cidade.crescimento.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={cidade.potencialMarketing}
            style={{
              height: 6,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.3)',
              marginTop: 8
            }}
          />
          <Typography style={{ fontSize: '0.7rem', marginTop: 4, textAlign: 'right' }}>
            Potencial: {cidade.potencialMarketing}%
          </Typography>
        </Card>
      ))}
    </>
  );
};

export default memo(RealTimeInsights);
