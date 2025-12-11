import React, { memo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  SwapHoriz,
  Folder,
  CheckCircle,
  Storage,
  CloudUpload,
} from '@mui/icons-material';

interface ExportHeaderProps {
  availableCollections: string[];
  selectedCollections: string[];
  useEnvCredentials: boolean;
  customSourceMode: boolean;
  targetFileLoaded: boolean;
}

const ExportHeader = memo(({
  availableCollections,
  selectedCollections,
  useEnvCredentials,
  customSourceMode,
  targetFileLoaded,
}: ExportHeaderProps) => {
  return (
    <>
      {/* Header Dashboard */}
      <Box mb={3}>
        <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: 8 }}>
          <SwapHoriz style={{ marginRight: 12, verticalAlign: 'middle', fontSize: 40 }} />
          Dashboard de Migração Firestore
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Migração inteligente e segura entre projetos Firebase
        </Typography>
      </Box>

      {/* Status Cards */}
      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {availableCollections.length}
                  </Typography>
                  <Typography variant="caption">Coleções Disponíveis</Typography>
                </div>
                <Folder style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {selectedCollections.length}
                  </Typography>
                  <Typography variant="caption">Coleções Selecionadas</Typography>
                </div>
                <CheckCircle style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {useEnvCredentials && !customSourceMode ? '🔗' : '📁'}
                  </Typography>
                  <Typography variant="caption">
                    {useEnvCredentials && !customSourceMode ? 'Origem: ENV' : 'Origem: Custom'}
                  </Typography>
                </div>
                <Storage style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {targetFileLoaded ? '✅' : '⏳'}
                  </Typography>
                  <Typography variant="caption">
                    Destino {targetFileLoaded ? 'Configurado' : 'Pendente'}
                  </Typography>
                </div>
                <CloudUpload style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas Informativos Compactos */}
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 12, background: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
            <Typography variant="caption" style={{ fontWeight: 'bold', color: '#1976d2' }}>
              ✅ SEGURANÇA TOTAL
            </Typography>
            <Typography variant="caption" display="block">
              Apenas COPIA dados. Origem permanece intacta.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 12, background: '#f3e5f5', borderLeft: '4px solid #9c27b0' }}>
            <Typography variant="caption" style={{ fontWeight: 'bold', color: '#7b1fa2' }}>
              🔒 CONVERSÃO AUTOMÁTICA
            </Typography>
            <Typography variant="caption" display="block">
              Senhas convertidas para hash SHA-256.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 12, background: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
            <Typography variant="caption" style={{ fontWeight: 'bold', color: '#e65100' }}>
              ⚡ MIGRAÇÃO INTELIGENTE
            </Typography>
            <Typography variant="caption" display="block">
              Batches de 500 docs. Storage incluído.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
});

ExportHeader.displayName = 'ExportHeader';

export default ExportHeader;
