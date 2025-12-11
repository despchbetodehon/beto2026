import React, { memo } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ExpandMore,
  ExpandLess,
  Delete,
  Edit,
  PictureAsPdf,
} from '@mui/icons-material';

const useStyles = makeStyles(() => ({
  listItem: {
    backgroundColor: '#f5f5f5',
    marginBottom: '8px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#eeeeee',
    },
  },
  listItemExpanded: {
    backgroundColor: '#e0e0e0',
  },
  expandedContent: {
    padding: '16px',
    backgroundColor: '#fafafa',
    borderLeft: '4px solid #1976d2',
  },
  actionButton: {
    marginLeft: '8px',
  },
}));

interface Item {
  id: string;
  cliente: string;
  nomeempresa: string;
  cnpjempresa: string;
  status: string;
  dataCriacao: any;
  quantidade?: number;
  concluido?: boolean;
  [key: string]: any;
}

interface DashboardDocumentListProps {
  documents: Item[];
  expandedId: string | null;
  onExpand: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (item: Item) => void;
  onGeneratePDF: (item: Item) => Promise<void>;
  loading: boolean;
}

const DashboardDocumentList = memo(
  ({
    documents,
    expandedId,
    onExpand,
    onDelete,
    onEdit,
    onGeneratePDF,
    loading,
  }: DashboardDocumentListProps) => {
    const classes = useStyles();

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      );
    }

    if (documents.length === 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <Typography variant="body1" color="textSecondary">
            Nenhum documento encontrado
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {documents.map((doc) => (
          <React.Fragment key={doc.id}>
            <ListItem
              className={`${classes.listItem} ${
                expandedId === doc.id ? classes.listItemExpanded : ''
              }`}
            >
              <ListItemText
                primary={doc.nomeempresa || doc.cliente}
                secondary={`CNPJ: ${doc.cnpjempresa || 'N/A'} | Status: ${doc.status}`}
              />
              <Box>
                <IconButton
                  size="small"
                  onClick={() => onGeneratePDF(doc)}
                  className={classes.actionButton}
                  title="Gerar PDF"
                >
                  <PictureAsPdf fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onEdit(doc)}
                  className={classes.actionButton}
                  title="Editar"
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(doc.id)}
                  className={classes.actionButton}
                  title="Deletar"
                >
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onExpand(expandedId === doc.id ? '' : doc.id)}
                >
                  {expandedId === doc.id ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
              </Box>
            </ListItem>

            {expandedId === doc.id && (
              <Box className={classes.expandedContent}>
                <Typography variant="body2" paragraph>
                  <strong>Informações Detalhadas:</strong>
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  {Object.entries(doc).map(([key, value]) => {
                    if (
                      key !== 'id' &&
                      key !== 'imagemUrls' &&
                      key !== 'signature' &&
                      value
                    ) {
                      return (
                        <Typography key={key} variant="body2">
                          <strong>{key}:</strong> {String(value)}
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </Box>
              </Box>
            )}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  }
);

DashboardDocumentList.displayName = 'DashboardDocumentList';
export default DashboardDocumentList;
