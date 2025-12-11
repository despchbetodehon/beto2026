import React, { memo } from 'react';
import { Paper, Avatar, Typography, Chip, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface Usuario {
  nome?: string;
  email?: string;
  imagemUrl?: string | null;
  permissao?: string;
}

interface Props {
  usuario: Usuario;
  hasColaboradorAccess: boolean;
  classes?: any;
}

const ColaboradoresHeader: React.FC<Props> = ({ usuario, hasColaboradorAccess, classes }) => {

  const getPermissaoColor = (permissao?: string) => {
    switch (permissao) {
      case 'Administrador':
        return '#f44336';
      case 'CEO':
        return '#9c27b0';
      case 'EnygmaDeveloper':
        return '#00bcd4';
      case 'Operador':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  return (
    <Paper
      className={classes?.header}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: 32,
        textAlign: 'center',
        borderRadius: '0 0 30px 30px',
        boxShadow: '0px 5px 22px rgba(0, 0, 0, 0.4)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mt={-3}>
          <Avatar
            src={usuario?.imagemUrl || '/betologo.jpeg'}
            style={{ width: 50, height: 50, marginRight: 8 }}
          >
            {usuario?.nome?.charAt(0)?.toUpperCase() ||
              usuario?.email?.charAt(0)?.toUpperCase() ||
              '?'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
              {usuario?.nome || usuario?.email || 'Usuário'}
            </Typography>
            <Box display="flex" gap={1}>
              <Chip
                label="Online"
                size="small"
                style={{ backgroundColor: '#4caf50' }}
              />
              {usuario?.permissao && (
                <Chip
                  label={usuario.permissao}
                  size="small"
                  style={{
                    backgroundColor: getPermissaoColor(usuario.permissao),
                    color: 'white',
                  }}
                />
              )}
              {hasColaboradorAccess && (
                <Chip
                  label="Colaborador"
                  size="small"
                  style={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontSize: '0.6rem',
                    height: '18px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Paper>
  );
};

export default memo(ColaboradoresHeader);
