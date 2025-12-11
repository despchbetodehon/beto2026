// Componente CompactSection para upload de documentos

import React from 'react';
import {
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Collapse,
  useMediaQuery,
} from '@mui/material';
import {
  PhotoCamera,
  Delete,
  CloudUpload,
  Edit,
  PictureAsPdf,
} from '@mui/icons-material';

import SafeGrid from '@/components/common/SafeGrid';

import { CompactSectionProps } from '../types';
import {
  CompactSectionContainer,
  SectionTitle,
  UploadButton,
  ThumbnailContainer,
  Thumbnail,
  PdfThumbnail,
  DeleteButton,
  ProcessingIndicator,
  ExpandableContent,
  actionIconButtonSx,
} from '../styles';

const CompactSection: React.FC<CompactSectionProps> = ({
  title,
  files,
  setFiles,
  onFileChange,
  onManualEdit,
  processingImage,
  manualExpanded,
  children,
  uploadLabel,
  setCameraOpen,
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <CompactSectionContainer>
      <SectionTitle>
        {title}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Tooltip title="Tirar Foto">
            <IconButton
              size="small"
              onClick={() => setCameraOpen(true)}
              disabled={processingImage}
              sx={actionIconButtonSx}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Preencher Manual">
            <IconButton
              size="small"
              onClick={onManualEdit}
              sx={actionIconButtonSx}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </SectionTitle>

      {processingImage && (
        <ProcessingIndicator>
          <CircularProgress size={16} />
          <Typography variant="caption">Analisando documento...</Typography>
        </ProcessingIndicator>
      )}

      <SafeGrid container spacing={2} alignItems="center">
        <SafeGrid item xs={12}>
          <input
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            id={`upload-${title.replace(/\s+/g, '-')}`}
            type="file"
            onChange={onFileChange}
            multiple
          />
          <label htmlFor={`upload-${title.replace(/\s+/g, '-')}`}>
            <UploadButton
              variant="contained"
              component="span"
              fullWidth
              startIcon={<CloudUpload />}
              disabled={processingImage}
            >
              {uploadLabel || (isMobile ? 'Enviar' : `Enviar ${title}`)}
            </UploadButton>
          </label>
        </SafeGrid>

        {files.length > 0 && (
          <SafeGrid item xs={12}>
            <ThumbnailContainer>
              {files.map((file, index) => (
                file.type === 'application/pdf' ? (
                  <PdfThumbnail key={index}>
                    <PictureAsPdf style={{ color: '#d32f2f', fontSize: 30 }} />
                    <DeleteButton
                      size="small"
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      <Delete fontSize="small" />
                    </DeleteButton>
                  </PdfThumbnail>
                ) : (
                  <Thumbnail key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`${title} ${index}`}
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', e);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <DeleteButton
                      size="small"
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      <Delete fontSize="small" />
                    </DeleteButton>
                  </Thumbnail>
                )
              ))}
            </ThumbnailContainer>
          </SafeGrid>
        )}
      </SafeGrid>

      <Collapse in={manualExpanded}>
        <ExpandableContent>
          {children}
        </ExpandableContent>
      </Collapse>
    </CompactSectionContainer>
  );
};

export default CompactSection;
