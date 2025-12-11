import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

interface Props {
  usuariosCount?: number;
  onReload: () => void;
  onNewUser: () => void;
  disabledNew?: boolean;
}

const Header: React.FC<Props> = ({ usuariosCount = 0, onReload, onNewUser, disabledNew }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        👥 Gestão de Usuários ({usuariosCount})
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" startIcon={<Add />} onClick={onReload} sx={{ borderRadius: 1 }}>Recarregar</Button>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={onNewUser} sx={{ borderRadius: 1 }} disabled={disabledNew}>Novo Usuário</Button>
      </Box>
    </Box>
  );
};

export default Header;
