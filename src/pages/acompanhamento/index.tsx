import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Tooltip,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Container,
} from '@mui/material';

import {
  Dashboard,
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  Error,
  Info,
  Visibility,
  Print,
  Share,
  Add,
  Refresh,
  FilterList,
  Search,
  ExpandMore,
  Phone,
  Email,
  WhatsApp,
  AccountCircle,
  BusinessCenter,
  Description,
  AttachMoney,
  Today,
  Update,
  Star,
  Group,
  Settings,
  Help,
  Security,
  Payment,
  Receipt,
  Gavel,
  DirectionsCar,
  CreditCard,
  AccountBalance,
  LocalShipping,
  Build,
  Assessment,
  Public,
  Lock,
  Home,
  Close,
  Person,
  TransferWithinAStation
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import ResponsiveAppBar from '@/components/home/home';
import {
  AcompanhamentoStats,
  AcompanhamentoFilters,
  AcompanhamentoList,
  AcompanhamentoAdvancedFilter,
} from '@/components/acompanhamento';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
  },
  appBar: {
    background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  tabs: {
    '& .MuiTab-root': {
      color: 'rgba(255,255,255,0.7)',
      fontWeight: 'bold',
      minWidth: 120,
    },
    '& .Mui-selected': {
      color: '#fff',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#fff',
      height: 3,
    },
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
    cursor: 'pointer',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
  },
  dashboardCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'linear-gradient(90deg, #1a4d3a, #2d5a3d)',
    },
  },
  statCard: {
    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  statIcon: {
    fontSize: 40,
    color: '#2d5a3d',
    marginBottom: '8px',
  },
  processCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
  },
  processStep: {
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '8px',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
  },
  activeStep: {
    borderColor: '#4CAF50',
    background: '#e8f5e8',
  },
  completedStep: {
    borderColor: '#2196F3',
    background: '#e3f2fd',
  },
  urgentStep: {
    borderColor: '#FF5722',
    background: '#ffebee',
    animation: '$blink 1.5s infinite',
  },
  '@keyframes blink': {
    '0%, 50%': { opacity: 1 },
    '51%, 100%': { opacity: 0.7 },
  },
  statusChip: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
    padding: '8px 16px',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    background: 'linear-gradient(90deg, #1a4d3a, #2d5a3d)',
  },
  documentUpload: {
    border: '2px dashed #ccc',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#667eea',
      background: 'rgba(102, 126, 234, 0.05)',
    },
  },
  chatFab: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
    color: '#fff',
    animation: '$bounce 2s infinite',
  },
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
    '40%': { transform: 'translateY(-10px)' },
    '60%': { transform: 'translateY(-5px)' },
  },
  vipBadge: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)' },
    '70%': { boxShadow: '0 0 0 10px rgba(255, 215, 0, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)' },
  },
  formContainer: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  profileAvatar: {
    width: 120,
    height: 120,
    background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  summaryCards: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  noAccessCard: {
    background: '#f5f5f5',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  accessDeniedIcon: {
    fontSize: 64,
    color: '#757575',
    marginBottom: '16px',
  },
  allServicesButton: {
    background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
    color: '#fff',
    fontWeight: 'bold',
    padding: '16px 32px',
    borderRadius: '24px',
    fontSize: '1.1rem',
    textTransform: 'none',
    '&:hover': {
      background: 'linear-gradient(135deg, #4a7c59 0%, #5d8f6c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(45, 90, 61, 0.4)',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface ProcessData {
  id: string;
  tipo: string;
  status: 'Pendente' | 'Em Análise' | 'Aguardando Documentos' | 'Aguardando Detran' | 'Pronto' | 'Concluído';
  progresso: number;
  etapas: EtapaData[];
  documentosFaltando: string[];
  prazoEstimado: string;
  valor: number;
  urgencia: 'baixa' | 'media' | 'alta';
  ultimaAtualizacao: Date;
  dataInicio: Date;
  clienteId: string;
}

interface EtapaData {
  id: string;
  nome: string;
  concluida: boolean;
  ativa: boolean;
  descricao: string;
  dataPrevisao?: Date;
  dataConclusao?: Date;
}

export default function AreaCliente() {
  const classes = useStyles();
 

  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [contactDialog, setContactDialog] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    tipo: 'todos',
    status: 'todos',
    valorMin: '',
    valorMax: '',
    urgencia: 'todas',
  });

  // Estados para dados reais do Firebase
  const [userProcesses, setUserProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    total: 0,
    emAndamento: 0,
    concluidos: 0,
    pendentes: 0,
  });

  // Função para validar identificadores
  const validateSearchTerm = (term: string): boolean => {
    const identifiers = term
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    if (identifiers.length === 0) {
      setSearchError('Por favor, insira pelo menos um identificador (CPF, CNPJ).');
      return false;
    }
    setSearchError(null);
    return true;
  };

  // 🔍 Função principal: busca processos sem exigir login
  const fetchUserData = async () => {
    const identifiers = searchTerm
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter((v) => v.length > 0);

    if (!validateSearchTerm(searchTerm)) return;

    setLoading(true);

    try {
      console.log('🔄 Buscando dados para:', identifiers);
      const allProcesses: any[] = [];

      // 🔍 Função auxiliar: busca em uma coleção
      const searchInCollection = async (collectionName: string, searchFields: string[]) => {
        try {
          const { getFirestore, collection, query, where, getDocs, or } = await import('firebase/firestore');
          const { app } = await import('@/logic/firebase/config/app');

          const db = getFirestore(app);
          const collectionRef = collection(db, collectionName);

          const queries = searchFields
            .map((field) => identifiers.map((identifier) => where(field, '==', identifier)))
            .flat();

          const chunkedQueries = [];
          for (let i = 0; i < queries.length; i += 10) {
            chunkedQueries.push(queries.slice(i, i + 10));
          }

          for (const queryChunk of chunkedQueries) {
            const q = queryChunk.length === 1
              ? query(collectionRef, queryChunk[0])
              : query(collectionRef, or(...queryChunk));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              allProcesses.push({
                id: doc.id,
                type: collectionName,
                ...doc.data(),
                timestamp: doc.data().timestamp || new Date(),
              });
            });
          }
        } catch (error) {
          console.error(`❌ Erro ao buscar na coleção ${collectionName}:`, error);
          setSearchError('Erro ao buscar documentos. Tente novamente.');
        }
      };

      // 🗂️ Coleções públicas consultadas
      await Promise.all([
        searchInCollection('Betodespachanteintrncaodevendaoficial', [
          'email', 'nome', 'placa', 'cpf', 'cnpj',
          'nomevendedor', 'nomecomprador', 'emailvendedor', 'emailcomprador',
          'cpfvendedor', 'cpfcomprador', 'cnpjvendedor', 'cnpjcomprador', 'id',
        ]),
        searchInCollection('transferencias', [
          'email', 'nomevendedor', 'nomecomprador', 'emailvendedor', 'emailcomprador',
          'cpfvendedor', 'cpfcomprador', 'cnpjvendedor', 'cnpjcomprador',
        ]),
        searchInCollection('anuencias', [
          'email', 'nomesocio1', 'nomesocio2', 'nomesocio3', 'emailempresa',
          'cpfsocio1', 'cpfsocio2', 'cpfsocio3', 'cnpjempresa',
        ]),
        searchInCollection('requerimentosdigitais', [
          'email', 'nomevendedor', 'nomecomprador', 'emailvendedor', 'emailcomprador',
          'cpfvendedor', 'cpfcomprador', 'cnpjvendedor', 'cnpjcomprador',
        ]),
      ]);

      // 🧹 Remove duplicatas
      const uniqueProcesses = allProcesses.filter(
        (process, index, self) =>
          index === self.findIndex((p) => p.id === process.id && p.type === process.type)
      );

      // 🕒 Ordena por data
      uniqueProcesses.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('✅ Processos encontrados:', uniqueProcesses.length);
      setUserProcesses(uniqueProcesses);

      const stats = {
        total: uniqueProcesses.length,
        emAndamento: uniqueProcesses.filter((p) =>
          ['Em Andamento', 'Processando', 'Aguardando'].includes(p.status)
        ).length,
        concluidos: uniqueProcesses.filter((p) =>
          ['Concluído', 'Finalizado', 'Aprovado'].includes(p.status)
        ).length,
        pendentes: uniqueProcesses.filter((p) =>
          ['Pendente', 'Aguardando Documentos', 'Revisão'].includes(p.status)
        ).length,
      };

      setUserStats(stats);
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      setSearchError('Erro ao buscar documentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Busca inicial se desejar (ou use botão para buscar)
  useEffect(() => {
    fetchUserData();
  }, []);

  // Processar dados reais do Firebase
  const processos = userProcesses.map((process) => {
    let tipo = 'Processo';
    let titulo = 'Processo';
    let icon = <Assignment />;
    let color = '#2196F3';

    switch (process.type) {
      case 'requerimentos':
        tipo = 'Requerimento';
        titulo = process.servicosolicitado || 'Requerimento de Veículo';
        icon = <Assignment />;
        color = '#2196F3';
        break;
      case 'transferencias':
        tipo = 'Transferência';
        titulo = `Transferência - ${process.marcaveiculo || ''} ${process.modeloveiculo || ''}`.trim();
        icon = <TransferWithinAStation />;
        color = '#4CAF50';
        break;
      case 'anuencias':
        tipo = 'Anuência';
        titulo = process.nomeempresa || 'Anuência Empresarial';
        icon = <BusinessCenter />;
        color = '#FF9800';
        break;
      case 'requerimentosdigitais':
        tipo = 'Requerimento Digital';
        titulo = process.servicosolicitado || 'Requerimento Digital';
        icon = <Description />;
        color = '#9C27B0';
        break;
    }

    const status = process.status || 'Pendente';

    let progresso = 25;
    switch (status.toLowerCase()) {
      case 'concluído':
      case 'finalizado':
      case 'aprovado':
        progresso = 100;
        break;
      case 'em andamento':
      case 'processando':
        progresso = 60;
        break;
      case 'aguardando':
      case 'revisão':
        progresso = 40;
        break;
      default:
        progresso = 25;
    }

    const dataInicio = process.timestamp?.toDate
      ? process.timestamp.toDate().toLocaleDateString('pt-BR')
      : new Date(process.timestamp || Date.now()).toLocaleDateString('pt-BR');

    return {
      id: process.id,
      tipo,
      titulo,
      status,
      dataInicio,
      previsao: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      progresso,
      icon,
      color,
      descricao: process.observacoes || `${tipo} em processamento`,
      documentos: ['Documento de Identificação', 'Comprovante de Residência'],
      etapas: [
        { nome: 'Documentação', concluida: true },
        { nome: 'Análise', concluida: progresso >= 40 },
        { nome: 'Processamento', concluida: progresso >= 60 },
        { nome: 'Finalização', concluida: progresso >= 100 },
      ],
      dadosCompletos: process,
    };
  });

  const estatisticas = [
    {
      titulo: 'Total de Processos',
      valor: userStats.total,
      icon: <Dashboard />,
      color: '#2196F3',
      descricao: 'Todos os seus processos',
    },
    {
      titulo: 'Em Andamento',
      valor: userStats.emAndamento,
      icon: <Schedule />,
      color: '#FF9800',
      descricao: 'Processos ativos',
    },
    {
      titulo: 'Concluídos',
      valor: userStats.concluidos,
      icon: <CheckCircle />,
      color: '#4CAF50',
      descricao: 'Processos finalizados',
    },
    {
      titulo: 'Pendentes',
      valor: userStats.pendentes,
      icon: <Warning />,
      color: '#F44336',
      descricao: 'Requer atenção',
    },
  ];

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleExpandProcess = (processId: string) => {
    setExpandedProcess(expandedProcess === processId ? null : processId);
  };

  const handleFilterChange = (event: any) => {
    setFilterStatus(event.target.value as string);
  };

  const handleAdvancedFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearAdvancedFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      tipo: 'todos',
      status: 'todos',
      valorMin: '',
      valorMax: '',
      urgencia: 'todas',
    });
    setFilterStatus('todos');
    setSearchTerm('');
    setSearchError(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.tipo !== 'todos') count++;
    if (filters.status !== 'todos') count++;
    if (filters.valorMin) count++;
    if (filters.valorMax) count++;
    if (filters.urgencia !== 'todas') count++;
    if (filterStatus !== 'todos') count++;
    if (searchTerm) count++;
    return count;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSearchError(null);
  };

  const handleSearchChangeWrapper = (value: string) => {
    setSearchTerm(value);
    setSearchError(null);
  };

  const handleSearchSubmit = () => {
    if (validateSearchTerm(searchTerm)) {
      fetchUserData();
    }
  };

  const filteredProcesses = searchTerm
  ? processos
  : processos.filter((processo) => {
      const statusMatch = filterStatus === 'todos' || processo.status === filterStatus;
      const searchMatch =
        searchTerm === '' ||
        processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        processo.tipo.toLowerCase().includes(searchTerm.toLowerCase());
      const statusAdvancedMatch = filters.status === 'todos' || processo.status === filters.status;
      const tipoMatch = filters.tipo === 'todos' || processo.tipo === filters.tipo;

      let dateMatch = true;
      if (filters.startDate || filters.endDate) {
        const processDate = new Date(processo.dataInicio.split('/').reverse().join('-'));
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          dateMatch = dateMatch && processDate >= startDate;
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          dateMatch = dateMatch && processDate <= endDate;
        }
      }

      let valorMatch = true;
      if (filters.valorMin || filters.valorMax) {
        const valorEstimado = processo.progresso * 50;
        if (filters.valorMin) {
          valorMatch = valorMatch && valorEstimado >= parseFloat(filters.valorMin);
        }
        if (filters.valorMax) {
          valorMatch = valorMatch && valorEstimado <= parseFloat(filters.valorMax);
        }
      }

      let urgenciaMatch = true;
      if (filters.urgencia !== 'todas') {
        const urgenciaNivel = processo.progresso < 30 ? 'alta' : processo.progresso < 70 ? 'media' : 'baixa';
        urgenciaMatch = filters.urgencia === urgenciaNivel;
      }

      return statusMatch && searchMatch && statusAdvancedMatch && tipoMatch && dateMatch && valorMatch && urgenciaMatch;
    });


  return (
    <Box className={classes.root}>
  
      <Container maxWidth="lg" style={{ marginTop: 24 }}>
        <Paper elevation={3} style={{ padding: 32, borderRadius: 16 }}>
          {/* Título e Estatísticas */}
          <AcompanhamentoStats stats={userStats} loading={loading} />

          {/* Barra de Busca e Filtros */}
          <AcompanhamentoFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChangeWrapper}
            onSearchSubmit={handleSearchSubmit}
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
            onAdvancedFilterOpen={() => setAdvancedFilterOpen(true)}
            loading={loading}
            searchError={searchError}
          />

          {/* Lista de Processos */}
          <AcompanhamentoList
            processos={filteredProcesses}
            expandedProcess={expandedProcess}
            onExpandChange={setExpandedProcess}
            loading={loading}
          />

          {/* Advanced Filter Dialog */}
          <AcompanhamentoAdvancedFilter
            open={advancedFilterOpen}
            onClose={() => setAdvancedFilterOpen(false)}
            filters={filters}
            onFilterChange={handleAdvancedFilterChange}
            onApply={() => setAdvancedFilterOpen(false)}
            onClear={clearAdvancedFilters}
          />

          {/* Dialog de Solicitação de Serviço */}
          <Dialog open={serviceDialog} onClose={() => setServiceDialog(false)}>
            <DialogTitle>Solicitar Novo Serviço</DialogTitle>
            <DialogContent>
              <Typography>Em construção...</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setServiceDialog(false)} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog de Contato */}
          <Dialog open={contactDialog} onClose={() => setContactDialog(false)}>
            <DialogTitle>Entrar em Contato</DialogTitle>
            <DialogContent>
              <Typography>Em construção...</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setContactDialog(false)} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
}
