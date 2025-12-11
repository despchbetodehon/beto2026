import React, { memo } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Schedule,
  Assignment,
  TransferWithinAStation,
  BusinessCenter,
  Description,
} from '@mui/icons-material';

interface Etapa {
  nome: string;
  concluida: boolean;
  id?: string;
  ativa?: boolean;
  descricao?: string;
  dataPrevisao?: Date;
  dataConclusao?: Date;
}

interface Processo {
  id: string;
  tipo: string;
  titulo: string;
  status: string;
  progresso: number;
  etapas: Etapa[];
  descricao: string;
  dataInicio: string;
  previsao: string;
  color: string;
  icon: React.ReactNode;
  documentos?: string[];
  dadosCompletos?: any;
}

interface AcompanhamentoListProps {
  processos: Processo[];
  expandedProcess: string | null;
  onExpandChange: (processId: string | null) => void;
  loading: boolean;
}

const getProcessIcon = (tipo: string) => {
  const iconProps = { style: { marginRight: 8 } };
  switch (tipo) {
    case 'Requerimento':
    case 'Requerimento Digital':
      return <Assignment {...iconProps} />;
    case 'Transferência':
      return <TransferWithinAStation {...iconProps} />;
    case 'Anuência':
      return <BusinessCenter {...iconProps} />;
    default:
      return <Description {...iconProps} />;
  }
};

const AcompanhamentoList = memo(
  ({ processos, expandedProcess, onExpandChange, loading }: AcompanhamentoListProps) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      );
    }

    if (processos.length === 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="body1" style={{ color: '#999' }}>
            Nenhum processo encontrado. Use a busca para localizar seus processos.
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {processos.map((processo) => (
          <Accordion
            key={processo.id}
            expanded={expandedProcess === processo.id}
            onChange={() =>
              onExpandChange(expandedProcess === processo.id ? null : processo.id)
            }
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" width="100%">
                {getProcessIcon(processo.tipo)}
                <Typography variant="subtitle1" style={{ fontWeight: 'bold', flexGrow: 1 }}>
                  {processo.titulo}
                </Typography>
                <Chip
                  label={processo.status}
                  style={{
                    backgroundColor: processo.color,
                    color: '#fff',
                    fontWeight: 'bold',
                    marginRight: 8,
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column', padding: 16 }}>
              <Typography variant="body2" style={{ color: '#558b2f', marginBottom: 8 }}>
                {processo.descricao}
              </Typography>

              <Grid container spacing={2} style={{ marginBottom: 16 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                    Data de Início:
                  </Typography>
                  <Typography variant="body2">{processo.dataInicio}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                    Previsão de Conclusão:
                  </Typography>
                  <Typography variant="body2">{processo.previsao}</Typography>
                </Grid>
              </Grid>

              <Box style={{ marginBottom: 16 }}>
                <Typography variant="subtitle2" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  Progresso: {processo.progresso}%
                </Typography>
                <LinearProgress variant="determinate" value={processo.progresso} />
              </Box>

              <Divider style={{ margin: '16px 0' }} />

              <Typography variant="subtitle2" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                Etapas do Processo:
              </Typography>
              <List dense>
                {processo.etapas.map((etapa, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {etapa.concluida ? (
                        <CheckCircle style={{ color: '#2e7d32' }} />
                      ) : (
                        <Schedule style={{ color: '#bdbdbd' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={etapa.nome} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  }
);

AcompanhamentoList.displayName = 'AcompanhamentoList';
export default AcompanhamentoList;
