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
  Image as ImageIcon,
  SelectAll,
} from '@mui/icons-material';

interface ExportStorageSectionProps {
  availableFolders: string[];
  selectedFolders: string[];
  loadingFolders: boolean;
  migrateAllFolders: boolean;
  onLoadStorageFolders: () => void;
  onSelectAllFolders: () => void;
  onToggleFolder: (folder: string) => void;
  onMigrateAllFoldersChange: (checked: boolean) => void;
  classes?: {
    card?: string;
    collectionList?: string;
  };
}

const ExportStorageSection = memo(({
  availableFolders,
  selectedFolders,
  loadingFolders,
  migrateAllFolders,
  onLoadStorageFolders,
  onSelectAllFolders,
  onToggleFolder,
  onMigrateAllFoldersChange,
  classes,
}: ExportStorageSectionProps) => {
  return (
    <Card className={classes?.card} style={{ marginBottom: 24 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            <ImageIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Pastas do Storage Disponíveis
          </Typography>
          <Button
            variant="outlined"
            onClick={onLoadStorageFolders}
            disabled={loadingFolders}
            startIcon={loadingFolders ? <CircularProgress size={20} /> : <SelectAll />}
          >
            {loadingFolders ? 'Carregando...' : 'Atualizar Lista'}
          </Button>
        </Box>

        {availableFolders.length > 0 ? (
          <>
            <Box display="flex" style={{ gap: 2 }} mb={2}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SelectAll />}
                onClick={onSelectAllFolders}
              >
                {selectedFolders.length === availableFolders.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={migrateAllFolders}
                    onChange={(e) => onMigrateAllFoldersChange(e.target.checked)}
                    color="primary"
                  />
                }
                label="Migrar TODAS as pastas automaticamente"
              />
            </Box>

            <Paper className={classes?.collectionList}>
              <List dense>
                {availableFolders.map((folder) => (
                  <ListItem
                    key={folder}
                    button
                    onClick={() => onToggleFolder(folder)}
                    disabled={migrateAllFolders}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={migrateAllFolders || selectedFolders.includes(folder)}
                        disabled={migrateAllFolders}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={folder}
                      secondary={migrateAllFolders ? 'Será migrada automaticamente' : ''}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: 'block' }}>
              {migrateAllFolders 
                ? `✅ Todas as ${availableFolders.length} pastas serão migradas`
                : `${selectedFolders.length} de ${availableFolders.length} pastas selecionadas`
              }
            </Typography>
          </>
        ) : (
          <Box textAlign="center" py={4}>
            <ImageIcon style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {loadingFolders ? 'Carregando pastas do Storage...' : 'Nenhuma pasta encontrada no Storage'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {!loadingFolders && 'Todos os arquivos do bucket serão migrados automaticamente'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

ExportStorageSection.displayName = 'ExportStorageSection';

export default ExportStorageSection;
