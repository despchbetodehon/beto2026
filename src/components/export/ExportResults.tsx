import React, { memo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface MigrationResult {
  success?: boolean;
  totalCollections?: number;
  totalDocuments?: number;
  migrated?: number;
  errors?: number;
  convertedUsers?: number;
  storage?: {
    totalFiles?: number;
    migrated?: number;
  };
  collections?: Array<{
    collectionName: string;
    success: boolean;
    migrated?: number;
    convertedUsers?: number;
    errors?: number;
  }>;
}

interface ExportResultsProps {
  error: string;
  resultado: MigrationResult | null;
  classes: {
    resultado: string;
    alertBox: string;
    alertError: string;
    alertSuccess: string;
    stats: string;
    statItem: string;
  };
}

const ExportResults = memo(({
  error,
  resultado,
  classes,
}: ExportResultsProps) => {
  if (!error && !resultado) {
    return null;
  }

  return (
    <Box className={classes.resultado}>
      {/* Mensagens de Erro */}
      {error && (
        <Paper className={`${classes.alertBox} ${classes.alertError}`} elevation={1}>
          <ErrorIcon style={{ marginRight: 8, flexShrink: 0 }} />
          <Typography variant="body1">
            {error}
          </Typography>
        </Paper>
      )}

      {/* Resultado da Migração */}
      {resultado && (
        <Paper className={`${classes.alertBox} ${resultado.success ? classes.alertSuccess : classes.alertError}`} elevation={1}>
          <Box width="100%">
            <Typography variant="h6" gutterBottom>
              {resultado.success ? '✅ Migração Concluída!' : '⚠️ Migração Concluída com Erros'}
            </Typography>

            <div className={classes.stats}>
              <div className={classes.statItem}>
                <Typography variant="h4" color="primary">
                  {resultado.totalCollections || 0}
                </Typography>
                <Typography variant="caption">Coleções</Typography>
              </div>

              <div className={classes.statItem}>
                <Typography variant="h4" color="primary">
                  {resultado.totalDocuments || 0}
                </Typography>
                <Typography variant="caption">Total Docs</Typography>
              </div>

              <div className={classes.statItem}>
                <Typography variant="h4" style={{ color: '#4caf50' }}>
                  {resultado.migrated || 0}
                </Typography>
                <Typography variant="caption">Migrados</Typography>
              </div>

              <div className={classes.statItem}>
                <Typography variant="h4" color="error">
                  {resultado.errors || 0}
                </Typography>
                <Typography variant="caption">Erros</Typography>
              </div>

              {resultado.convertedUsers !== undefined && resultado.convertedUsers > 0 && (
                <div className={classes.statItem}>
                  <Typography variant="h4" style={{ color: '#ff9800' }}>
                    {resultado.convertedUsers}
                  </Typography>
                  <Typography variant="caption">Usuários Convertidos</Typography>
                </div>
              )}

              {resultado.storage && (
                <>
                  <div className={classes.statItem}>
                    <Typography variant="h4" color="primary">
                      {resultado.storage.totalFiles || 0}
                    </Typography>
                    <Typography variant="caption">Arquivos Total</Typography>
                  </div>

                  <div className={classes.statItem}>
                    <Typography variant="h4" style={{ color: '#4caf50' }}>
                      {resultado.storage.migrated || 0}
                    </Typography>
                    <Typography variant="caption">Arquivos Migrados</Typography>
                  </div>
                </>
              )}
            </div>

            {resultado.collections && resultado.collections.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Detalhes por Coleção:
                </Typography>
                <List dense>
                  {resultado.collections.map((coll, idx) => (
                    <ListItem key={idx}>
                      {coll.success ? (
                        <CheckCircle fontSize="small" style={{ color: '#4caf50', marginRight: 8 }} />
                      ) : (
                        <ErrorIcon fontSize="small" color="error" style={{ marginRight: 8 }} />
                      )}
                      <ListItemText
                        primary={coll.collectionName}
                        secondary={
                          coll.collectionName === 'usuarios' && coll.convertedUsers && coll.convertedUsers > 0
                            ? `${coll.migrated || 0} docs migrados (${coll.convertedUsers} convertidos para estrutura segura)${coll.errors && coll.errors > 0 ? `, ${coll.errors} erros` : ''}`
                            : `${coll.migrated || 0} docs migrados${coll.errors && coll.errors > 0 ? `, ${coll.errors} erros` : ''}`
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
});

ExportResults.displayName = 'ExportResults';

export default ExportResults;
