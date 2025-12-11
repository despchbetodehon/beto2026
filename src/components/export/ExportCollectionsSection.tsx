import React, { memo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import {
  Folder,
  SelectAll,
  Image as ImageIcon,
} from '@mui/icons-material';

interface ExportCollectionsSectionProps {
  availableCollections: string[];
  selectedCollections: string[];
  loadingCollections: boolean;
  migrateAllCollections: boolean;
  migrateStorage: boolean;
  useEnvCredentials: boolean;
  sourceProjectId?: string;
  onLoadCollections: () => void;
  onSelectAll: () => void;
  onToggleCollection: (collection: string) => void;
  onMigrateAllCollectionsChange: (checked: boolean) => void;
  onMigrateStorageChange: (checked: boolean) => void;
  classes: {
    card: string;
    collectionList: string;
  };
}

const ExportCollectionsSection = memo(({
  availableCollections,
  selectedCollections,
  loadingCollections,
  migrateAllCollections,
  migrateStorage,
  useEnvCredentials,
  sourceProjectId,
  onLoadCollections,
  onSelectAll,
  onToggleCollection,
  onMigrateAllCollectionsChange,
  onMigrateStorageChange,
  classes,
}: ExportCollectionsSectionProps) => {
  return (
    <Card className={classes.card} style={{ marginBottom: 24 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            <Folder style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Coleções Disponíveis
          </Typography>
          <Button
            variant="outlined"
            onClick={onLoadCollections}
            disabled={loadingCollections || (!useEnvCredentials && !sourceProjectId)}
            startIcon={loadingCollections ? <CircularProgress size={20} /> : <SelectAll />}
          >
            {loadingCollections ? 'Carregando...' : 'Atualizar Lista'}
          </Button>
        </Box>

        {availableCollections.length > 0 ? (
          <>
            <Box display="flex" style={{ gap: 2 }} mb={2}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SelectAll />}
                onClick={onSelectAll}
              >
                {selectedCollections.length === availableCollections.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={migrateAllCollections}
                    onChange={(e) => onMigrateAllCollectionsChange(e.target.checked)}
                    color="primary"
                  />
                }
                label="Migrar TODAS automaticamente"
              />
            </Box>

            <Paper className={classes.collectionList}>
              <List dense>
                {availableCollections.map((collection) => (
                  <ListItem
                    key={collection}
                    button
                    onClick={() => onToggleCollection(collection)}
                    disabled={migrateAllCollections}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={migrateAllCollections || selectedCollections.includes(collection)}
                        disabled={migrateAllCollections}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={collection}
                      secondary={migrateAllCollections ? 'Será migrada automaticamente' : ''}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: 'block' }}>
              {migrateAllCollections 
                ? `✅ Todas as ${availableCollections.length} coleções serão migradas`
                : `${selectedCollections.length} de ${availableCollections.length} coleções selecionadas`
              }
            </Typography>

            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={migrateStorage}
                    onChange={(e) => onMigrateStorageChange(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <ImageIcon style={{ marginRight: 8 }} />
                    Migrar também Firebase Storage
                  </Box>
                }
              />
            </Box>
          </>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body2" color="textSecondary">
              {loadingCollections ? 'Carregando coleções...' : 'Nenhuma coleção disponível'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

ExportCollectionsSection.displayName = 'ExportCollectionsSection';

export default ExportCollectionsSection;
