// Componente CameraDialog para captura de fotos

import React, { useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';

interface CameraDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraDialog: React.FC<CameraDialogProps> = ({
  open,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      alert("Não foi possível acessar a câmera. Por favor, verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          onClose();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Capturar Foto
        <Button onClick={onClose} color="inherit">
          <Close />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '4/3',
          backgroundColor: '#000',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          variant="contained"
          onClick={takePhoto}
          startIcon={<PhotoCamera />}
          sx={{
            background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
            borderRadius: 3,
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(135deg, #1e3d28 0%, #3a6b47 100%)',
            },
          }}
        >
          Tirar Foto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CameraDialog;
