import React, { memo } from 'react';
import {
  Box,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import { Info } from '@mui/icons-material';

interface MigrationProgress {
  totalCollections: number;
  processedCollections: number;
  currentCollection: string | null;
  totalDocuments: number;
  processedDocuments: number;
  currentDocument: string | null;
  storage: {
    totalFiles: number;
    processedFiles: number;
    currentFile: string | null;
    status: 'idle' | 'processing' | 'completed' | 'error';
  };
  status: 'idle' | 'loading_collections' | 'processing' | 'completed' | 'error';
  error: string | null;
}

interface ExportProgressProps {
  migrationProgress: MigrationProgress;
  migrateStorage: boolean;
  collectionProgress: number;
  documentProgress: number;
  storageProgress: number;
  classes: {
    progressBarContainer: string;
    progressBarItem: string;
    progressBarLabel: string;
    progressBarDetails: string;
    progressBarAnimated: string;
  };
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('pt-BR');
};

const ExportProgress = memo(({
  migrationProgress,
  migrateStorage,
  collectionProgress,
  documentProgress,
  storageProgress,
  classes,
}: ExportProgressProps) => {
  const showProgress = migrationProgress.status === 'processing' || 
                      migrationProgress.status === 'completed' || 
                      migrationProgress.status === 'error';

  if (!showProgress) {
    return null;
  }

  return (
    <Paper className={classes.progressBarContainer}>
      <Typography variant="h6" gutterBottom>
        <Info style={{ marginRight: 8, verticalAlign: 'middle' }} /> Progresso da Migração
      </Typography>

      {/* Progresso de Coleções */}
      <Box className={classes.progressBarItem}>
        <Box className={classes.progressBarLabel}>
          <Typography variant="subtitle1">
            Coleções ({migrationProgress.processedCollections}/{migrationProgress.totalCollections})
          </Typography>
          <Typography className={classes.progressBarDetails}>
            {migrationProgress.currentCollection || 'Nenhuma coleção em processamento'}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={collectionProgress} 
          className={migrationProgress.status === 'processing' ? classes.progressBarAnimated : ''}
        />
      </Box>

      {/* Progresso de Documentos */}
      {migrationProgress.totalDocuments > 0 && (
        <Box className={classes.progressBarItem}>
          <Box className={classes.progressBarLabel}>
            <Typography variant="subtitle1">
              Documentos ({formatNumber(migrationProgress.processedDocuments)}/{formatNumber(migrationProgress.totalDocuments)})
            </Typography>
            <Typography className={classes.progressBarDetails}>
              {migrationProgress.currentDocument || 'Nenhum documento em processamento'}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={documentProgress} 
            className={migrationProgress.status === 'processing' ? classes.progressBarAnimated : ''}
          />
        </Box>
      )}

      {/* Progresso de Storage */}
      {migrateStorage && migrationProgress.storage.status !== 'idle' && (
        <Box className={classes.progressBarItem}>
          <Box className={classes.progressBarLabel}>
            <Typography variant="subtitle1">
              Storage ({migrationProgress.storage.processedFiles}/{migrationProgress.storage.totalFiles})
            </Typography>
            <Typography className={classes.progressBarDetails}>
              {migrationProgress.storage.currentFile || 'Nenhum arquivo em processamento'}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={storageProgress} 
            className={migrationProgress.storage.status === 'processing' ? classes.progressBarAnimated : ''}
          />
          {migrationProgress.storage.status === 'error' && (
            <Typography variant="caption" color="error" style={{ marginTop: 4 }}>
              Erro ao migrar Storage
            </Typography>
          )}
        </Box>
      )}

      {/* Mensagem de Status Geral */}
      {migrationProgress.status === 'completed' && !migrationProgress.error && (
        <Typography variant="body2" style={{ marginTop: 8, color: '#4caf50' }}>
          ✅ Migração concluída com sucesso!
        </Typography>
      )}
      {migrationProgress.status === 'error' && (
        <Typography variant="body2" style={{ marginTop: 8, color: 'red' }}>
          ❌ Erro durante a migração: {migrationProgress.error}
        </Typography>
      )}
    </Paper>
  );
});

ExportProgress.displayName = 'ExportProgress';

export default ExportProgress;
