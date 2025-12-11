// Componente ContactDialog para gerenciamento de contatos

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Close, Save, CloudUpload } from '@mui/icons-material';
import SafeGrid from '@/components/common/SafeGrid';
import { Contact } from '../types';
import { textFieldSx, contactDialogSx, contactFormSx } from '../styles';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  contactData: Contact;
  onContactChange: (field: string, value: string) => void;
  onSave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  processingImage: boolean;
  files: File[];
  onCpfCnpjSearch?: (doc: string) => void;
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  contactData,
  onContactChange,
  onSave,
  onFileChange,
  isLoading,
  processingImage,
  files,
  onCpfCnpjSearch,
}) => {
  const formatCpfCnpj = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) => {
        return [p1, p2, p3].filter(Boolean).join('.') + (p4 ? `-${p4}` : '');
      });
    } else {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, p1, p2, p3, p4, p5) => {
        return `${p1}.${p2}.${p3}/${p4}-${p5}`;
      });
    }
  };

  const handleCpfCnpjChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    onContactChange('cpfCnpj', cleaned);
    
    // Buscar automaticamente quando completo
    if ((cleaned.length === 11 || cleaned.length === 14) && onCpfCnpjSearch) {
      onCpfCnpjSearch(cleaned);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={contactDialogSx}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Cadastrar Contato
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={contactFormSx}>
          {/* Upload de documento */}
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              id="contact-upload"
              type="file"
              onChange={onFileChange}
            />
            <label htmlFor="contact-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<CloudUpload />}
                disabled={processingImage}
                sx={{
                  borderColor: '#2d5a3d',
                  color: '#2d5a3d',
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#1e3d28',
                    backgroundColor: 'rgba(45, 90, 61, 0.05)',
                  },
                }}
              >
                {processingImage ? 'Processando...' : 'Enviar Documento (opcional)'}
              </Button>
            </label>
            {processingImage && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption">Analisando documento...</Typography>
              </Box>
            )}
          </Box>

          <SafeGrid container spacing={2}>
            <SafeGrid item xs={12} sm={4}>
              <TextField
                label="Código (5 dígitos)"
                value={contactData.id}
                onChange={(e) => onContactChange('id', e.target.value.slice(0, 5))}
                fullWidth
                required
                inputProps={{ maxLength: 5 }}
                sx={textFieldSx}
              />
            </SafeGrid>
            
            <SafeGrid item xs={12} sm={8}>
              <TextField
                label="CPF/CNPJ"
                value={formatCpfCnpj(contactData.cpfCnpj)}
                onChange={(e) => handleCpfCnpjChange(e.target.value)}
                fullWidth
                required
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12}>
              <TextField
                label="Nome Completo"
                value={contactData.nome}
                onChange={(e) => onContactChange('nome', e.target.value.toUpperCase())}
                fullWidth
                required
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="RG"
                value={contactData.rg}
                onChange={(e) => onContactChange('rg', e.target.value)}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="Nº Registro"
                value={contactData.nregistro}
                onChange={(e) => onContactChange('nregistro', e.target.value)}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="Nacionalidade"
                value={contactData.nacionalidade}
                onChange={(e) => onContactChange('nacionalidade', e.target.value.toLowerCase())}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="Estado Civil"
                value={contactData.estadoCivil}
                onChange={(e) => onContactChange('estadoCivil', e.target.value.toUpperCase())}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12}>
              <TextField
                label="Profissão"
                value={contactData.profissao}
                onChange={(e) => onContactChange('profissao', e.target.value.toUpperCase())}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={4}>
              <TextField
                label="CEP"
                value={contactData.cep}
                onChange={(e) => onContactChange('cep', e.target.value.replace(/\D/g, ''))}
                fullWidth
                inputProps={{ maxLength: 8 }}
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={8}>
              <TextField
                label="Endereço"
                value={contactData.endereco}
                onChange={(e) => onContactChange('endereco', e.target.value.toUpperCase())}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="Bairro/Complemento"
                value={contactData.complemento}
                onChange={(e) => onContactChange('complemento', e.target.value.toUpperCase())}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={4}>
              <TextField
                label="Município"
                value={contactData.municipio}
                onChange={(e) => onContactChange('municipio', e.target.value.toUpperCase())}
                fullWidth
                sx={textFieldSx}
              />
            </SafeGrid>

            <SafeGrid item xs={12} sm={2}>
              <TextField
                label="Estado"
                value={contactData.estado}
                onChange={(e) => onContactChange('estado', e.target.value.toUpperCase())}
                fullWidth
                inputProps={{ maxLength: 2 }}
                sx={textFieldSx}
              />
            </SafeGrid>
          </SafeGrid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#2d5a3d',
            color: '#2d5a3d',
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isLoading || !contactData.id || !contactData.nome || !contactData.cpfCnpj}
          startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
          sx={{
            background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e3d28 0%, #3a6b47 100%)',
            },
          }}
        >
          {isLoading ? 'Salvando...' : 'Salvar Contato'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactDialog;
