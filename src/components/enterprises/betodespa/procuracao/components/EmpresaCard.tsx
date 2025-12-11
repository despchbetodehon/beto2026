// Componente EmpresaCard para exibição de cards de empresa

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { Edit, Delete, Business } from '@mui/icons-material';
import { Empresa } from '../types';

interface EmpresaCardProps {
  empresa: Empresa;
  isSelected: boolean;
  onSelect: (empresa: Empresa) => void;
  onEdit: (empresa: Empresa, e: React.MouseEvent) => void;
  onDelete: (empresa: Empresa, e: React.MouseEvent) => void;
}

const EmpresaCard: React.FC<EmpresaCardProps> = ({
  empresa,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      onClick={() => onSelect(empresa)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isSelected ? '2px solid #2d5a3d' : '1px solid #e0e0e0',
        backgroundColor: isSelected ? 'rgba(45, 90, 61, 0.05)' : '#fff',
        borderRadius: 2,
        minWidth: 120,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Business sx={{ color: isSelected ? '#2d5a3d' : '#666', fontSize: 20 }} />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={(e) => onEdit(empresa, e)}
                sx={{ 
                  width: 24, 
                  height: 24,
                  backgroundColor: 'rgba(45, 90, 61, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(45, 90, 61, 0.2)',
                  },
                }}
              >
                <Edit sx={{ fontSize: 14, color: '#2d5a3d' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton
                size="small"
                onClick={(e) => onDelete(empresa, e)}
                sx={{ 
                  width: 24, 
                  height: 24,
                  backgroundColor: 'rgba(255, 23, 68, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 23, 68, 0.2)',
                  },
                }}
              >
                <Delete sx={{ fontSize: 14, color: '#ff1744' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: isSelected ? '#2d5a3d' : '#333',
            fontSize: '0.75rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {empresa.nomeEmpresa}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            color: '#666',
            fontSize: '0.65rem',
          }}
        >
          {empresa.quantidadeProcuradores} procurador{empresa.quantidadeProcuradores > 1 ? 'es' : ''}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmpresaCard;
