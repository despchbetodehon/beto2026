import React, { memo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface FirebaseCredentials {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

interface ExportDestinationProps {
  targetCredentials: FirebaseCredentials;
  targetFileLoaded: boolean;
  isDraggingTarget: boolean;
  onTargetFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTargetDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onTargetDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onTargetDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onTargetCredentialsChange: (credentials: FirebaseCredentials) => void;
  onClearTargetCredentials: () => void;
  classes: {
    card: string;
    dropZone: string;
    dropZoneActive: string;
    dropZoneSuccess: string;
  };
}

const ExportDestination = memo(({
  targetCredentials,
  targetFileLoaded,
  isDraggingTarget,
  onTargetFileChange,
  onTargetDragOver,
  onTargetDragLeave,
  onTargetDrop,
  onTargetCredentialsChange,
  onClearTargetCredentials,
  classes,
}: ExportDestinationProps) => {
  return (
    <Card className={classes.card} style={{ marginBottom: 24 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <CloudUpload style={{ marginRight: 8, verticalAlign: 'middle', color: '#4caf50' }} />
          Banco de Dados de DESTINO
        </Typography>
        <Grid container spacing={2}>
          {/* Área de Upload de Arquivo JSON */}
          <Grid item xs={12}>
            <input
              accept=".json,application/json"
              style={{ display: 'none' }}
              id="target-credentials-file"
              type="file"
              onChange={onTargetFileChange}
            />
            <label htmlFor="target-credentials-file">
              <Box
                className={`${classes.dropZone} ${isDraggingTarget ? classes.dropZoneActive : ''} ${targetFileLoaded ? classes.dropZoneSuccess : ''}`}
                onDragOver={onTargetDragOver}
                onDragLeave={onTargetDragLeave}
                onDrop={onTargetDrop}
                component="div"
              >
                <CloudUpload style={{ fontSize: 48, color: targetFileLoaded ? '#4caf50' : '#1976d2', marginBottom: 8 }} />
                <Typography variant="h6" gutterBottom>
                  {targetFileLoaded ? '✅ Arquivo Carregado' : 'Arraste o arquivo JSON aqui'}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  ou clique para selecionar o arquivo de service account (.json)
                </Typography>
                {targetFileLoaded && (
                  <Box mt={2}>
                    <Typography variant="caption" style={{ color: '#4caf50' }}>
                      <strong>Project ID:</strong> {targetCredentials.projectId}
                    </Typography>
                    <br />
                    <Typography variant="caption" style={{ color: '#4caf50' }}>
                      <strong>Client Email:</strong> {targetCredentials.clientEmail}
                    </Typography>
                    <Box mt={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={onClearTargetCredentials}
                      >
                        Limpar e usar preenchimento manual
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </label>
          </Grid>

          {/* Divider com "OU" */}
          {!targetFileLoaded && (
            <>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" my={2}>
                  <Divider style={{ flex: 1 }} />
                  <Typography variant="body2" style={{ margin: '0 16px', color: '#666' }}>
                    OU PREENCHA MANUALMENTE
                  </Typography>
                  <Divider style={{ flex: 1 }} />
                </Box>
              </Grid>

              {/* Campos Manuais */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project ID *"
                  value={targetCredentials.projectId}
                  onChange={(e) => onTargetCredentialsChange({ ...targetCredentials, projectId: e.target.value })}
                  placeholder="meu-projeto-destino"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client Email *"
                  value={targetCredentials.clientEmail}
                  onChange={(e) => onTargetCredentialsChange({ ...targetCredentials, clientEmail: e.target.value })}
                  placeholder="firebase-adminsdk-xxxxx@meu-projeto.iam.gserviceaccount.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Private Key *"
                  value={targetCredentials.privateKey}
                  onChange={(e) => onTargetCredentialsChange({ ...targetCredentials, privateKey: e.target.value })}
                  placeholder="Cole a private key aqui (ou use o arquivo JSON de service account). Não compartilhe chaves em repositório."
                />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
});

ExportDestination.displayName = 'ExportDestination';

export default ExportDestination;
