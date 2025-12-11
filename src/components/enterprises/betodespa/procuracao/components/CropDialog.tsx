// Componente CropDialog para cortar imagens

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Box,
  Typography,
} from '@mui/material';
import { Close, Check } from '@mui/icons-material';
import Cropper from 'react-easy-crop';
import { CroppedAreaPixels } from '../types';
import { getCroppedImg } from '../cropUtils';

interface CropDialogProps {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

const CropDialog: React.FC<CropDialogProps> = ({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const blob = await fetch(croppedImage).then(r => r.blob());
      const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      onCropComplete(file);
      onClose();
    } catch (e) {
      console.error('Erro ao cortar imagem:', e);
      alert('Ocorreu um erro ao processar a imagem. Por favor, tente novamente.');
    }
  };

  if (!imageSrc) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Recortar Imagem
        <Button onClick={onClose} color="inherit">
          <Close />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: 'relative',
            height: { xs: '55vh', md: '65vh' },
            backgroundColor: '#0A1A2F',
            borderRadius: 2,
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </Box>
        
        <Box sx={{ mt: 2, px: 2 }}>
          <Typography gutterBottom>Zoom</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, value) => setZoom(value as number)}
            sx={{
              color: '#2d5a3d',
              '& .MuiSlider-thumb': {
                backgroundColor: '#2d5a3d',
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          startIcon={<Close />}
          sx={{
            borderColor: '#2d5a3d',
            color: '#2d5a3d',
            borderRadius: 3,
            px: 3,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleCrop}
          startIcon={<Check />}
          sx={{
            background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
            borderRadius: 3,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #1e3d28 0%, #3a6b47 100%)',
            },
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropDialog;
