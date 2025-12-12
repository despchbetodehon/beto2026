import React, { memo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {
  SwapHoriz,
  Storage,
} from '@mui/icons-material';

interface FirebaseCredentials {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

interface ExportSourceConfigProps {
  customSourceMode: boolean;
  sourceCredentials: FirebaseCredentials;
  useEnvCredentials: boolean;
  onToggleCustomSource: () => void;
  onSourceCredentialsChange: (credentials: FirebaseCredentials) => void;
  onLoadCollections: () => void;
}

const ExportSourceConfig = memo(({
  customSourceMode,
  sourceCredentials,
  useEnvCredentials,
  onToggleCustomSource,
  onSourceCredentialsChange,
  onLoadCollections,
}: ExportSourceConfigProps) => {
  const isSourceValid = sourceCredentials.projectId && sourceCredentials.clientEmail && sourceCredentials.privateKey;

  return (
    <>
      {/* Botão para alternar origem */}
      <Box mb={3}>
        <Button
          variant="contained"
          color={customSourceMode ? 'inherit' : 'primary'}
          size="large"
          startIcon={customSourceMode ? <Storage /> : <SwapHoriz />}
          onClick={onToggleCustomSource}
          style={{ marginRight: 16 }}
        >
          {customSourceMode ? 'Voltar para ENV (.env.local)' : 'Usar Origem Customizada'}
        </Button>

        {useEnvCredentials && !customSourceMode && sourceCredentials.projectId && (
          <Typography variant="caption" style={{ color: '#4caf50', marginLeft: 8 }}>
            ✅ Conectado ao projeto: <strong>{sourceCredentials.projectId}</strong>
          </Typography>
        )}
      </Box>

      {/* Origem Customizada (apenas se ativado) */}
      {customSourceMode && (
        <Card style={{ marginBottom: 24 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Storage style={{ marginRight: 8, verticalAlign: 'middle', color: '#1976d2' }} />
              Configurar Origem Customizada
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project ID *"
                  value={sourceCredentials.projectId}
                  onChange={(e) => onSourceCredentialsChange({ ...sourceCredentials, projectId: e.target.value })}
                  placeholder="meu-projeto-origem"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client Email *"
                  value={sourceCredentials.clientEmail}
                  onChange={(e) => onSourceCredentialsChange({ ...sourceCredentials, clientEmail: e.target.value })}
                  placeholder="firebase-adminsdk-xxxxx@meu-projeto.iam.gserviceaccount.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Private Key *"
                  value={sourceCredentials.privateKey}
                  onChange={(e) => onSourceCredentialsChange({ ...sourceCredentials, privateKey: e.target.value })}
                  placeholder="Cole a private key aqui (ou use o arquivo JSON de service account). Não compartilhe chaves em repositório."
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onLoadCollections}
                  disabled={!isSourceValid}
                >
                  Conectar e Carregar Coleções
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
});

ExportSourceConfig.displayName = 'ExportSourceConfig';

export default ExportSourceConfig;
