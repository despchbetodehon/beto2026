import React, { memo } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  permissao: string;
  ativo: boolean;
  dataCriacao?: Date;
}

interface Props {
  usuarios: Usuario[];
  isLoading: boolean;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  onToggleStatus: (usuario: Usuario) => void;
  userMenuAnchor: any;
  selectedUser: Usuario | null;
  onMenuOpen: (event: React.MouseEvent, usuario: Usuario) => void;
  onMenuClose: () => void;
  classes?: any;
}

const ColaboradoresTable: React.FC<Props> = ({
  usuarios,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  userMenuAnchor,
  selectedUser,
  onMenuOpen,
  onMenuClose,
  classes,
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (usuarios.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="textSecondary">
          Nenhum usuário encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell style={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Permissão</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="center">Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} hover>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Chip
                    label={usuario.permissao}
                    size="small"
                    style={{
                      backgroundColor:
                        usuario.permissao === 'Administrador'
                          ? '#f44336'
                          : usuario.permissao === 'CEO'
                          ? '#9c27b0'
                          : usuario.permissao === 'EnygmaDeveloper'
                          ? '#00bcd4'
                          : usuario.permissao === 'Operador'
                          ? '#ff9800'
                          : '#2196f3',
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={usuario.ativo ? 'Ativo' : 'Inativo'}
                    size="small"
                    style={{
                      backgroundColor: usuario.ativo ? '#4caf50' : '#f44336',
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuOpen(e, usuario)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={onMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedUser) onEdit(selectedUser);
            onMenuClose();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedUser) onToggleStatus(selectedUser);
            onMenuClose();
          }}
        >
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.ativo ? 'Desativar' : 'Ativar'}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedUser) onDelete(selectedUser);
            onMenuClose();
          }}
          style={{ color: '#f44336' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" style={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>Deletar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default memo(ColaboradoresTable);
