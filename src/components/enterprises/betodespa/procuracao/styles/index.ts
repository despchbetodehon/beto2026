// Estilos MUI v5 usando styled-components para o módulo de Procuração
// Usando valores fixos para evitar problemas com theme.spacing quando theme não está disponível

import { styled } from '@mui/material/styles';
import { 
  Paper, 
  Button, 
  IconButton, 
  Typography, 
  Fab, 
  Card,
  Box 
} from '@mui/material';

// Container principal
export const RootContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)',
  padding: 16,
  color: 'black',
  fontFamily: '"Playfair Display", "Crimson Text", "Libre Baskerville", "Georgia", serif',
  transition: 'all 0.3s ease',
  '@media (max-width: 600px)': {
    padding: 8,
  },
});

// Container do formulário
export const FormContainer = styled(Box)({
  display: 'flex',
  marginTop: -8,
  flexDirection: 'column',
  gap: 8,
  background: 'rgba(255, 255, 255, 0.95)',
  maxWidth: '100%',
  color: 'black',
  margin: '0 auto',
  padding: 8,
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(45, 90, 61, 0.1)',
  transition: 'all 0.3s ease',
  '@media (max-width: 600px)': {
    padding: 12,
    gap: 12,
  },
});

// Seção compacta
export const CompactSectionContainer = styled(Box)({
  background: '#ffffff',
  borderRadius: 12,
  padding: 8,
  color: 'black',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0',
  '@media (max-width: 600px)': {
    padding: 4,
  },
});

// Título da seção
export const SectionTitle = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontWeight: 200,
  color: 'black',
  marginBottom: 12,
  fontSize: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '@media (max-width: 600px)': {
    fontSize: '1rem',
    marginBottom: 8,
  },
});

// Título principal
export const MainTitle = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontWeight: 600,
  fontSize: '1.4rem',
  color: 'black',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '0.9rem',
  },
});

// Logo
export const LogoImage = styled('img')({
  width: 80,
  height: 80,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid rgba(45, 90, 61, 0.2)',
  marginBottom: 8,
  '@media (max-width: 600px)': {
    width: 50,
    height: 50,
  },
});

// Botão de upload (aceita component prop para ser usado com label)
export const UploadButton = styled(Button)<{ component?: React.ElementType }>({
  borderRadius: 8,
  padding: 12,
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
  color: 'white',
  boxShadow: '0 2px 8px rgba(45, 90, 61, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(45, 90, 61, 0.4)',
    background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '@media (max-width: 600px)': {
    padding: 8,
    fontSize: '0.8rem',
  },
});

// Botão manual
export const ManualButton = styled(Button)({
  borderRadius: 8,
  padding: 8,
  fontWeight: 500,
  color: 'black',
  textTransform: 'none',
  border: '1px solid #2d5a3d',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(45, 90, 61, 0.05)',
    border: '1px solid #2d5a3d',
  },
  '@media (max-width: 600px)': {
    padding: 4,
    fontSize: '0.75rem',
  },
});

// Container de thumbnails
export const ThumbnailContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
});

// Thumbnail
export const Thumbnail = styled(Box)({
  position: 'relative',
  width: 60,
  height: 60,
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '@media (max-width: 600px)': {
    width: 50,
    height: 50,
  },
});

// Thumbnail de PDF
export const PdfThumbnail = styled(Box)({
  position: 'relative',
  width: 60,
  height: 60,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '@media (max-width: 600px)': {
    width: 50,
    height: 50,
  },
});

// Botão de deletar
export const DeleteButton = styled(IconButton)({
  position: 'absolute',
  top: -6,
  right: -6,
  backgroundColor: '#ff1744',
  color: 'white',
  width: 20,
  height: 20,
  '&:hover': {
    backgroundColor: '#d50000',
  },
});

// Botão de submit
export const SubmitButton = styled(Button)({
  padding: 8,
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: 12,
  background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
  color: '#fff',
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(45, 90, 61, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(45, 90, 61, 0.4)',
    background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 3px 12px rgba(45, 90, 61, 0.35)',
  },
  '@media (max-width: 600px)': {
    padding: 12,
    fontSize: '1rem',
  },
});

// FAB Button
export const StyledFab = styled(Fab)({
  position: 'fixed',
  bottom: 24,
  right: 24,
  background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
  color: '#fff',
  boxShadow: '0 5px 15px rgba(45, 90, 61, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1e3d28 0%, #3a6b47 100%)',
    transform: 'scale(1.1)',
  },
  zIndex: 1000,
  '@media (max-width: 600px)': {
    bottom: 16,
    right: 16,
  },
});

// Card de estatísticas
export const StatCard = styled(Card)({
  padding: 16,
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
  },
  '@media (max-width: 600px)': {
    padding: 12,
  },
});

// Container de assinatura
export const SignatureContainer = styled(Box)({
  background: '#f8f9fa',
  borderRadius: 12,
  padding: 16,
  textAlign: 'center',
  border: '2px dashed #2d5a3d',
  marginTop: 8,
});

// Indicador de processamento
export const ProcessingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#2d5a3d',
  fontSize: '0.9rem',
  marginTop: 8,
});

// Dialog Content para Crop
export const CropDialogContent = styled(Box)({
  position: 'relative',
  height: '65vh',
  backgroundColor: '#0A1A2F',
  borderRadius: 16,
  '@media (max-width: 600px)': {
    height: '55vh',
  },
});

// Controles de Crop
export const CropControls = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: 20,
  display: 'flex',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
  zIndex: 1,
});

// Paper do documento
export const DocumentPaper = styled(Paper)({
  padding: 32,
  margin: 'auto',
  maxWidth: 1077,
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #ccc',
  fontFamily: 'Arial, sans-serif',
  lineHeight: 1.6,
  fontSize: '12pt',
  '@media print': {
    boxShadow: 'none',
    margin: 0,
    padding: 10,
    width: '100%',
    fontSize: '12pt',
    boxSizing: 'border-box',
    pageBreakBefore: 'auto',
  },
});

// Título do documento
export const DocumentTitle = styled(Typography)({
  fontSize: '18pt',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 24,
  textTransform: 'uppercase',
});

// Texto do documento
export const DocumentText = styled(Typography)({
  fontSize: '12pt',
  lineHeight: 1.8,
  textAlign: 'justify',
  marginBottom: 16,
});

// Seção de assinatura do documento
export const SignatureSection = styled(Box)({
  marginTop: 64,
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
});

// Bloco de assinatura
export const SignatureBlock = styled(Box)({
  textAlign: 'center',
  width: 'auto',
  borderTop: '2px solid #000',
  paddingTop: 8,
  margin: '0 auto',
  fontSize: '12pt',
});

// Footer do documento
export const DocumentFooter = styled(Typography)({
  fontSize: '10pt',
  textAlign: 'center',
  marginTop: 32,
  fontStyle: 'italic',
});

// Conteúdo expansível
export const ExpandableContent = styled(Box)({
  marginTop: -8,
  transition: 'all 0.3s ease',
});

// Estilos para TextField customizado (sx prop)
export const textFieldSx = {
  marginBottom: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2d5a3d',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2d5a3d',
    },
  },
};

// Estilos para Dialog de contato
export const contactDialogSx = {
  '& .MuiDialog-paper': {
    borderRadius: 4,
    padding: 1,
  },
};

// Estilos para form de contato
export const contactFormSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: { xs: 300, sm: 400 },
};

// Classe para ocultar na impressão
export const noPrintSx = {
  '@media print': {
    display: 'none !important',
  },
};

// Estilos para ícone de ação
export const actionIconButtonSx = {
  backgroundColor: 'rgba(45, 90, 61, 0.1)',
  color: '#2d5a3d',
  width: 32,
  height: 32,
};
