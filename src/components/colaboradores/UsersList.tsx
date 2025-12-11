import React from 'react';
import { Avatar, Box, Chip, IconButton, Paper, Typography, FormControlLabel, Switch } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

interface User {
  id: string;
  nome?: string;
  email?: string;
  permissao?: string;
  ativo?: boolean;
  imagemUrl?: string;
  temSenhaTextoPlano?: boolean;
  temSenhaSegura?: boolean;
}

interface Props {
  usuariosList: User[];
  isMobile?: boolean;
  isLoading?: boolean;
  onToggleStatus: (u: User) => void;
  onOpenMenu: (e: React.MouseEvent<HTMLElement>, u: User) => void;
}

const UsersList: React.FC<Props> = ({ usuariosList, isMobile, isLoading, onToggleStatus, onOpenMenu }) => {
  return (
    <Paper sx={{ borderRadius: isMobile ? 1 : 2, boxShadow: isMobile ? 1 : 4, overflow: 'hidden' }}>
      <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', fontWeight: 'bold', fontSize: '0.875rem' }}>
        <Box sx={{ flex: isMobile ? 2 : 1, minWidth: isMobile ? 120 : 150 }}>Usuário</Box>
        {!isMobile && <Box sx={{ flex: 1 }}>Email</Box>}
        <Box sx={{ flex: 1 }}>Permissão</Box>
        <Box sx={{ flex: 1 }}>Status</Box>
        <Box sx={{ flex: 0.5, minWidth: 80 }}>Ações</Box>
      </Box>

      <Box>
        {usuariosList && usuariosList.length > 0 ? (
          usuariosList.map((usuario, index) => (
            <Box key={usuario.id || usuario.email || index} sx={{ p: 2, borderBottom: index < usuariosList.length - 1 ? '1px solid #e0e0e0' : 'none', display: 'flex', alignItems: 'center', backgroundColor: usuario.temSenhaTextoPlano ? '#fff3cd' : 'white', transition: 'background-color 0.2s' }}>
              <Box sx={{ flex: isMobile ? 2 : 1, minWidth: isMobile ? 120 : 150, display: 'flex', alignItems: 'center' }}>
                <Avatar src={usuario.imagemUrl || '/betologo.jpeg'} sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, mr: isMobile ? 1 : 1.5, border: usuario.temSenhaTextoPlano ? '2px solid #ff9800' : undefined }}>{(usuario.nome || usuario.email || '?')[0]?.toUpperCase()}</Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : undefined }}>{usuario.nome || usuario.email || 'Nome não informado'}</Typography>
                  {isMobile && <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{usuario.email}</Typography>}
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.65rem' : undefined }}>ID: {usuario.id || usuario.email || 'N/A'}</Typography>
                </Box>
              </Box>

              {!isMobile && <Box sx={{ flex: 1 }}><Typography variant="body2" sx={{ fontSize: isMobile ? '0.75rem' : undefined }}>{usuario.email || 'Email não informado'}</Typography></Box>}

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip label={usuario.permissao || 'Visualizador'} color={usuario.permissao === 'Administrador' ? 'secondary' : 'default'} size="small" sx={{ fontSize: isMobile ? '0.65rem' : undefined }} />
                  {usuario.temSenhaTextoPlano && <Chip label="⚠️ Senha insegura" size="small" sx={{ backgroundColor: '#ff9800', color: 'white', fontSize: isMobile ? '0.6rem' : '0.65rem' }} />}
                  {usuario.temSenhaSegura && <Chip label="🔒 Seguro" size="small" sx={{ backgroundColor: '#4caf50', color: 'white', fontSize: isMobile ? '0.6rem' : '0.65rem' }} />}
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControlLabel control={<Switch checked={usuario.ativo !== false} onChange={() => onToggleStatus(usuario)} color="primary" size="small" />} label={usuario.ativo !== false ? 'Ativo' : 'Inativo'} />
              </Box>

              <Box sx={{ flex: 0.5, minWidth: 80 }}>
                <IconButton onClick={(e) => onOpenMenu(e, usuario)} size="small"><MoreVert /></IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', p: 6 }}>
            <Typography variant="h6" color="text.secondary">{isLoading ? 'Carregando usuários...' : 'Nenhum usuário encontrado'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{!isLoading && 'Adicione o primeiro usuário clicando no botão "Novo Usuário"'}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default UsersList;
