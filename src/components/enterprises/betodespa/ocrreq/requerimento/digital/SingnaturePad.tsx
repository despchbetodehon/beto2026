import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Box, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Estilos personalizados
const useStyles = makeStyles((theme: any) => ({
  signatureContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: 'rgba(190, 190, 190, 0.42)',
    marginTop: '24px',
    marginBottom: '24px',
  },
  signatureCanvas: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    
    
    height: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
      width: '100%',
    height: 'auto',
  },
  errorMessage: {
    color: '#f44336',
    marginTop: '8px',
  },
}));






interface SignaturePadProps {
  onSave: (signature: string) => void; // Callback para salvar a assinatura automaticamente
}



const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const classes = useStyles();
  const sigCanvas = useRef<any>(null);
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro
  useEffect(() => {
    const handleSaveSignature = () => {
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const signature = sigCanvas.current.toDataURL('image/png');
        onSave(signature);
      }
    };
  
    const interval = setInterval(handleSaveSignature, 2000); // Salva a cada 2 segundos
    
    return () => clearInterval(interval);
  }, [onSave]);

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 600;

  // Define largura e altura diferentes dependendo do tamanho da tela
  const canvasWidth = isSmallScreen ? 300 : 500;
  const canvasHeight = isSmallScreen ? 150 : 200;

  // Limpa o canvas de assinatura
  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setError(null); // Limpa o erro ao limpar a assinatura
    }
  };

  
  // Salva a assinatura
  const handleSave = () => {
    if (sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        setError('Por favor, assine antes de salvar.'); 
        return;
      }
      const signature = sigCanvas.current.toDataURL('image/png');
      onSave(signature);
      setError(null); 
    }
  };
  

  return (
    <Paper elevation={3} className={classes.signatureContainer}>
      <Typography variant="h6" gutterBottom>
       
      </Typography>
      <SignatureCanvas
        ref={(ref: any) => (sigCanvas.current = ref)}
        canvasProps={{
          width: 300,
          height: 200,
          className: classes.signatureCanvas,
        }}
      />
      {error && (
        <Typography variant="body2" className={classes.errorMessage}>
          {error}
        </Typography>
      )}
      <Box className={classes.buttonGroup}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClear}
          aria-label="Limpar assinatura"
        >
          Limpar
        </Button>
        
      </Box>
    </Paper>
  );
};

export default SignaturePad;
