// Generic Data List Component - Reutilizável
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Pagination,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';



export interface DataListColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

export interface DataListProps<T> {
  items: T[];
  columns?: DataListColumn<T>[];
  loading?: boolean;
  error?: string;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (id: string) => void;
  onRowClick?: (item: T) => void;
  itemsPerPage?: number;
  renderItem?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

export const DataList = <T extends { id: string }>({
  items,
  columns,
  loading = false,
  error,
  onDelete,
  onEdit,
  onRowClick,
  itemsPerPage = 10,
  renderItem,
  emptyMessage = 'Nenhum item encontrado',
}: DataListProps<T>) => {
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = items.slice(startIndex, endIndex);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete && onDelete) {
      setDeleting(true);
      try {
        await onDelete(itemToDelete);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (err) {
        console.error('Erro ao deletar:', err);
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          backgroundColor: '#ffebee',
          borderLeft: '4px solid #d32f2f',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <WarningIcon sx={{ color: '#d32f2f' }} />
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          color: 'text.secondary',
        }}
      >
        <Typography variant="h6">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <List>
        {renderItem ? (
          displayedItems.map((item, index) => (
            <Box
              key={item.id}
              onClick={() => onRowClick?.(item)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {renderItem(item, startIndex + index)}
            </Box>
          ))
        ) : (
          displayedItems.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                borderBottom: '1px solid #e0e0e0',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onClick={() => onRowClick?.(item)}
            >
              <ListItemText
                primary={
                  columns
                    ? columns.map((col) => (
                        <span key={String(col.key)}>
                          {col.render
                            ? col.render(item[col.key], item)
                            : String(item[col.key])}
                          {' '}
                        </span>
                      ))
                    : String(item)
                }
              />
              {(onDelete || onEdit) && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onEdit && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item.id);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              )}
            </ListItem>
          ))
        )}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Você tem certeza que deseja excluir este item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting}
            variant="contained"
          >
            {deleting ? <CircularProgress size={24} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default React.memo(DataList);
