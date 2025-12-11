import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  FormControlLabel,
  Switch,
  Checkbox,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  CloudUpload,
  Storage,
  CheckCircle,
  Error as ErrorIcon,
  ExpandMore,
  Info,
  SwapHoriz,
  SelectAll,
  Folder,
  Image as ImageIcon
} from '@mui/icons-material';
import {
  ExportHeader,
  ExportSourceConfig,
  ExportCollectionsSection,
  ExportStorageSection,
  ExportDestination,
  ExportProgress,
  ExportResults,
} from '@/components/export';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

// Adicionar animação CSS global
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `;
  document.head.appendChild(style);
}

const useStyles = makeStyles({
  container: {
    maxWidth: 1200,
    margin: '40px auto',
    padding: '24px',
  },
  card: {
    marginBottom: '24px',
  },
  button: {
    marginTop: '16px',
  },
  formField: {
    marginBottom: '16px',
  },
  resultado: {
    marginTop: '24px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  statItem: {
    textAlign: 'center',
    minWidth: 120,
    marginBottom: '16px',
  },
  credentialsSection: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  alertBox: {
    padding: '16px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'flex-start',
  },
  alertWarning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    color: '#856404',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  alertInfo: {
    backgroundColor: '#d1ecf1',
    borderColor: '#17a2b8',
    color: '#0c5460',
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  alertSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    color: '#155724',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  alertError: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    color: '#721c24',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  collectionList: {
    maxHeight: 400,
    overflow: 'auto',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
  },
  // Estilos para a barra de progresso inteligente
  progressBarContainer: {
    width: '100%',
    marginTop: '16px',
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
  },
  progressBarItem: {
    marginBottom: '12px',
  },
  progressBarLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressBarDetails: {
    fontSize: '0.875rem',
    color: '#666',
    marginLeft: '8px',
  },
  progressBarAnimated: {
    animation: '$pulse 2s infinite',
  },
  dropZone: {
    border: '2px dashed #2d5a3d',
    borderRadius: '4px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    '&:hover': {
      borderColor: '#1a4d3a',
      backgroundColor: '#f5f5f5',
    },
  },
  dropZoneActive: {
    borderColor: '#1a4d3a',
    backgroundColor: '#e8f5e9',
  },
  dropZoneSuccess: {
    borderColor: '#4caf50',
    backgroundColor: '#c8e6c9',
  },
});

interface FirebaseCredentials {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

interface MigrationProgress {
  totalCollections: number;
  processedCollections: number;
  currentCollection: string | null;
  totalDocuments: number;
  processedDocuments: number;
  currentDocument: string | null;
  storage: {
    totalFiles: number;
    processedFiles: number;
    currentFile: string | null;
    status: 'idle' | 'processing' | 'completed' | 'error';
  };
  status: 'idle' | 'loading_collections' | 'processing' | 'completed' | 'error';
  error: string | null;
}

export default function ExportPage() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState('');

  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [migrateStorage, setMigrateStorage] = useState(false);
  const [migrateAllCollections, setMigrateAllCollections] = useState(false);
  
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [migrateAllFolders, setMigrateAllFolders] = useState(false);

  const [sourceCredentials, setSourceCredentials] = useState<FirebaseCredentials>({
    projectId: '',
    clientEmail: '',
    privateKey: '',
  });

  const [targetCredentials, setTargetCredentials] = useState<FirebaseCredentials>({
    projectId: '',
    clientEmail: '',
    privateKey: '',
  });

  const [useEnvCredentials, setUseEnvCredentials] = useState(true); // Já iniciar usando ENV
  const [customSourceMode, setCustomSourceMode] = useState(false); // Modo de origem customizada
  const [targetFileLoaded, setTargetFileLoaded] = useState(false);
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress>({
    totalCollections: 0,
    processedCollections: 0,
    currentCollection: null,
    totalDocuments: 0,
    processedDocuments: 0,
    currentDocument: null,
    storage: {
      totalFiles: 0,
      processedFiles: 0,
      currentFile: null,
      status: 'idle',
    },
    status: 'idle',
    error: null,
  });

  // Carregar automaticamente ao montar o componente
  useEffect(() => {
    handleLoadEnvCredentials();
  }, []);

  // Carregar coleções e storage automaticamente quando credenciais estiverem disponíveis
  useEffect(() => {
    if ((useEnvCredentials && sourceCredentials.projectId) || (!useEnvCredentials && sourceCredentials.projectId && sourceCredentials.clientEmail && sourceCredentials.privateKey)) {
      handleLoadCollections();
      handleLoadStorageFolders();
    }
  }, [useEnvCredentials, sourceCredentials.projectId]);

  // Carregar storage sempre que a opção de migrar storage for ativada
  useEffect(() => {
    if (migrateStorage && sourceCredentials.projectId) {
      handleLoadStorageFolders();
    }
  }, [migrateStorage]);

  const handleLoadEnvCredentials = () => {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';

    if (!projectId) {
      setErro('NEXT_PUBLIC_FIREBASE_PROJECT_ID não encontrado no .env.local');
      return;
    }

    setSourceCredentials({
      projectId: projectId,
      clientEmail: '',
      privateKey: '',
    });

    setUseEnvCredentials(true);
    setCustomSourceMode(false);
    setErro('');
  };

  const handleToggleCustomSource = () => {
    if (customSourceMode) {
      // Voltar para ENV
      handleLoadEnvCredentials();
    } else {
      // Ativar modo customizado
      setCustomSourceMode(true);
      setUseEnvCredentials(false);
      setSourceCredentials({
        projectId: '',
        clientEmail: '',
        privateKey: '',
      });
      setAvailableCollections([]);
    }
  };

  const handleTargetFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);

        // Validar se tem os campos necessários
        if (!jsonData.project_id || !jsonData.client_email || !jsonData.private_key) {
          setErro('Arquivo JSON inválido. Certifique-se de que é um arquivo de service account do Firebase.');
          return;
        }

        setTargetCredentials({
          projectId: jsonData.project_id,
          clientEmail: jsonData.client_email,
          privateKey: jsonData.private_key,
        });

        setTargetFileLoaded(true);
        setErro('');
        console.log('✅ Credenciais de destino carregadas do arquivo JSON');
      } catch (error) {
        setErro('Erro ao processar arquivo JSON. Verifique se o formato está correto.');
        console.error('Erro ao processar JSON:', error);
      }
    };

    reader.onerror = () => {
      setErro('Erro ao ler o arquivo');
    };

    reader.readAsText(file);
  };

  const handleTargetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        setErro('Por favor, selecione um arquivo JSON válido');
        return;
      }
      handleTargetFileUpload(file);
    }
  };

  const handleTargetDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingTarget(true);
  };

  const handleTargetDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingTarget(false);
  };

  const handleTargetDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingTarget(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        setErro('Por favor, arraste um arquivo JSON válido');
        return;
      }
      handleTargetFileUpload(file);
    }
  };

  const handleClearTargetCredentials = () => {
    setTargetCredentials({
      projectId: '',
      clientEmail: '',
      privateKey: '',
    });
    setTargetFileLoaded(false);
  };

  const handleLoadCollections = async () => {
    setLoadingCollections(true);
    setErro('');
    setMigrationProgress(prev => ({ ...prev, status: 'loading_collections', error: null }));

    try {
      const response = await fetch('/api/export/list-collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCredentials: useEnvCredentials ? null : sourceCredentials,
          useEnvCredentials,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao listar coleções');
      }

      setAvailableCollections(data.collections || []);
      setMigrationProgress(prev => ({
        ...prev,
        totalCollections: data.collections.length,
        status: 'idle',
      }));
    } catch (error: any) {
      setErro(error.message || 'Erro ao carregar coleções');
      setMigrationProgress(prev => ({ ...prev, status: 'error', error: error.message }));
    } finally {
      setLoadingCollections(false);
    }
  };

  const handleToggleCollection = (collection: string) => {
    setSelectedCollections(prev => 
      prev.includes(collection)
        ? prev.filter(c => c !== collection)
        : [...prev, collection]
    );
  };

  const handleSelectAll = () => {
    if (selectedCollections.length === availableCollections.length) {
      setSelectedCollections([]);
    } else {
      setSelectedCollections([...availableCollections]);
    }
  };

  const handleLoadStorageFolders = async () => {
    setLoadingFolders(true);
    setErro('');

    try {
      const response = await fetch('/api/export/list-storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCredentials: useEnvCredentials ? null : sourceCredentials,
          useEnvCredentials,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao listar pastas do Storage');
      }

      setAvailableFolders(data.folders || []);
    } catch (error: any) {
      console.error('Erro ao carregar pastas do Storage:', error);
      setAvailableFolders([]);
    } finally {
      setLoadingFolders(false);
    }
  };

  const handleToggleFolder = (folder: string) => {
    setSelectedFolders(prev => 
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const handleSelectAllFolders = () => {
    if (selectedFolders.length === availableFolders.length) {
      setSelectedFolders([]);
    } else {
      setSelectedFolders([...availableFolders]);
    }
  };

  const handleMigrate = async () => {
    setLoading(true);
    setErro('');
    setResultado(null);
    setMigrationProgress(prev => ({
      totalCollections: 0,
      processedCollections: 0,
      currentCollection: null,
      totalDocuments: 0,
      processedDocuments: 0,
      currentDocument: null,
      storage: {
        totalFiles: 0,
        processedFiles: 0,
        currentFile: null,
        status: 'idle',
      },
      status: 'processing',
      error: null,
    }));

    try {
      // Validações
      const collectionsToMigrate = migrateAllCollections 
        ? availableCollections 
        : selectedCollections;

      if (collectionsToMigrate.length === 0) {
        throw new Error('Selecione pelo menos uma coleção para migrar');
      }

      if (!useEnvCredentials) {
        if (!sourceCredentials.projectId || !sourceCredentials.clientEmail || !sourceCredentials.privateKey) {
          throw new Error('Credenciais de origem incompletas');
        }
      } else {
        if (!sourceCredentials.projectId) {
          throw new Error('Project ID de origem não carregado do .env.local');
        }
      }

      if (!targetCredentials.projectId || !targetCredentials.clientEmail || !targetCredentials.privateKey) {
        throw new Error('Credenciais de destino incompletas');
      }

      // Atualiza o total de coleções no progresso
      setMigrationProgress(prev => ({ ...prev, totalCollections: collectionsToMigrate.length }));

      // Migrar cada coleção
      const results = [];
      for (let i = 0; i < collectionsToMigrate.length; i++) {
        const collectionName = collectionsToMigrate[i].trim();

        // Atualiza o progresso da coleção atual
        setMigrationProgress(prev => ({
          ...prev,
          currentCollection: collectionName,
          processedCollections: i,
          totalDocuments: 0, // Resetar contagem de documentos para cada nova coleção
          processedDocuments: 0,
          currentDocument: null,
        }));

        const response = await fetch('/api/export/migrate-collection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceCredentials,
            targetCredentials,
            collectionName,
            useEnvCredentials,
            migrateStorage: migrateStorage && i === collectionsToMigrate.length - 1, // Storage só na última
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          results.push({
            collectionName,
            success: false,
            error: data.error || 'Erro ao migrar coleção',
            totalDocuments: data.totalDocuments || 0,
            migrated: data.migrated || 0,
            errors: data.errors || 0,
          });
          setMigrationProgress(prev => ({
            ...prev,
            error: data.error || 'Erro ao migrar coleção',
            status: 'error',
          }));
          // Se ocorrer um erro em uma coleção, paramos a migração das coleções
          break; 
        } else {
          results.push(data);
          // Atualiza o progresso com os dados da coleção migrada
          setMigrationProgress(prev => ({
            ...prev,
            totalDocuments: prev.totalDocuments + (data.totalDocuments || 0),
            processedDocuments: prev.processedDocuments + (data.migrated || 0),
            storage: {
              ...prev.storage,
              totalFiles: data.storage?.totalFiles || prev.storage.totalFiles,
              processedFiles: data.storage?.migrated || prev.storage.processedFiles,
              status: data.storage?.status || prev.storage.status,
            }
          }));
        }
      }

      // Migrar Storage separadamente se solicitado
      if (migrateStorage && !migrationProgress.error) {
        setMigrationProgress(prev => ({ ...prev, storage: { ...prev.storage, status: 'processing' } }));
        
        try {
          const storageResponse = await fetch('/api/export/migrate-storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              sourceCredentials, 
              targetCredentials, 
              useEnvCredentials,
              selectedFolders: migrateAllFolders ? [] : selectedFolders,
              migrateAll: migrateAllFolders,
            }),
          });

          if (!storageResponse.ok) {
            const errorData = await storageResponse.json();
            throw new Error(errorData.error || 'Erro ao migrar Storage');
          }

          const storageData = await storageResponse.json();

          setMigrationProgress(prev => ({
            ...prev,
            storage: {
              ...prev.storage,
              totalFiles: storageData.totalFiles,
              processedFiles: storageData.migrated,
              status: 'completed',
            },
            status: 'completed',
          }));

          results.push({ storage: storageData });
        } catch (storageError: any) {
          console.error('Erro na migração do Storage:', storageError);
          setMigrationProgress(prev => ({
            ...prev,
            storage: {
              ...prev.storage,
              status: 'error',
            },
            error: storageError.message,
          }));
        }
      } else if (!migrateStorage) {
         setMigrationProgress(prev => ({ ...prev, status: 'completed' }));
      }


      // Consolidar resultados
      const totalDocs = results.reduce((sum, r) => sum + (r.totalDocuments || 0), 0);
      const totalMigrated = results.reduce((sum, r) => sum + (r.migrated || 0), 0);
      const totalErrors = results.reduce((sum, r) => sum + (r.errors || 0), 0);
      const finalStorageResult = results.find(r => r.storage)?.storage;


      const consolidatedResult = {
        success: totalErrors === 0 && migrationProgress.status !== 'error',
        collections: results.filter(r => r.collectionName), // Filtra apenas os resultados de coleções
        totalCollections: collectionsToMigrate.length,
        totalDocuments: totalDocs,
        migrated: totalMigrated,
        errors: totalErrors,
        storage: finalStorageResult,
      };

      setResultado(consolidatedResult);
      setMigrationProgress(prev => ({ ...prev, status: 'completed' }));

    } catch (error: any) {
      setErro(error.message || 'Erro ao processar migração');
      setMigrationProgress(prev => ({ ...prev, status: 'error', error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  // Função para migrar apenas Firestore
  const handleMigrateFirestore = async () => {
    setLoading(true);
    setErro('');
    setResultado(null);
    setMigrationProgress(prev => ({
      totalCollections: 0,
      processedCollections: 0,
      currentCollection: null,
      totalDocuments: 0,
      processedDocuments: 0,
      currentDocument: null,
      storage: {
        totalFiles: 0,
        processedFiles: 0,
        currentFile: null,
        status: 'idle',
      },
      status: 'processing',
      error: null,
    }));

    try {
      const collectionsToMigrate = migrateAllCollections 
        ? availableCollections 
        : selectedCollections;

      if (collectionsToMigrate.length === 0) {
        throw new Error('Selecione pelo menos uma coleção para migrar');
      }

      if (!useEnvCredentials) {
        if (!sourceCredentials.projectId || !sourceCredentials.clientEmail || !sourceCredentials.privateKey) {
          throw new Error('Credenciais de origem incompletas');
        }
      } else {
        if (!sourceCredentials.projectId) {
          throw new Error('Project ID de origem não carregado do .env.local');
        }
      }

      if (!targetCredentials.projectId || !targetCredentials.clientEmail || !targetCredentials.privateKey) {
        throw new Error('Credenciais de destino incompletas');
      }

      setMigrationProgress(prev => ({ ...prev, totalCollections: collectionsToMigrate.length }));

      const results = [];
      for (let i = 0; i < collectionsToMigrate.length; i++) {
        const collectionName = collectionsToMigrate[i].trim();

        setMigrationProgress(prev => ({
          ...prev,
          currentCollection: collectionName,
          processedCollections: i,
          totalDocuments: 0,
          processedDocuments: 0,
          currentDocument: null,
        }));

        const response = await fetch('/api/export/migrate-collection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceCredentials,
            targetCredentials,
            collectionName,
            useEnvCredentials,
            migrateStorage: false, // Não migrar storage
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          results.push({
            collectionName,
            success: false,
            error: data.error || 'Erro ao migrar coleção',
            totalDocuments: data.totalDocuments || 0,
            migrated: data.migrated || 0,
            errors: data.errors || 0,
          });
          setMigrationProgress(prev => ({
            ...prev,
            error: data.error || 'Erro ao migrar coleção',
            status: 'error',
          }));
          break;
        } else {
          results.push(data);
          setMigrationProgress(prev => ({
            ...prev,
            totalDocuments: prev.totalDocuments + (data.totalDocuments || 0),
            processedDocuments: prev.processedDocuments + (data.migrated || 0),
          }));
        }
      }

      const totalDocs = results.reduce((sum, r) => sum + (r.totalDocuments || 0), 0);
      const totalMigrated = results.reduce((sum, r) => sum + (r.migrated || 0), 0);
      const totalErrors = results.reduce((sum, r) => sum + (r.errors || 0), 0);

      const consolidatedResult = {
        success: totalErrors === 0 && migrationProgress.status !== 'error',
        collections: results.filter(r => r.collectionName),
        totalCollections: collectionsToMigrate.length,
        totalDocuments: totalDocs,
        migrated: totalMigrated,
        errors: totalErrors,
        storage: null, // Não há storage nesta migração
      };

      setResultado(consolidatedResult);
      setMigrationProgress(prev => ({ ...prev, status: 'completed' }));

    } catch (error: any) {
      setErro(error.message || 'Erro ao processar migração do Firestore');
      setMigrationProgress(prev => ({ ...prev, status: 'error', error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  // Função para migrar apenas Storage
  const handleMigrateStorageOnly = async () => {
    setLoading(true);
    setErro('');
    setResultado(null);
    setMigrationProgress(prev => ({
      totalCollections: 0,
      processedCollections: 0,
      currentCollection: null,
      totalDocuments: 0,
      processedDocuments: 0,
      currentDocument: null,
      storage: {
        totalFiles: 0,
        processedFiles: 0,
        currentFile: null,
        status: 'processing',
      },
      status: 'processing',
      error: null,
    }));

    try {
      if (!useEnvCredentials) {
        if (!sourceCredentials.projectId || !sourceCredentials.clientEmail || !sourceCredentials.privateKey) {
          throw new Error('Credenciais de origem incompletas');
        }
      } else {
        if (!sourceCredentials.projectId) {
          throw new Error('Project ID de origem não carregado do .env.local');
        }
      }

      if (!targetCredentials.projectId || !targetCredentials.clientEmail || !targetCredentials.privateKey) {
        throw new Error('Credenciais de destino incompletas');
      }

      const storageResponse = await fetch('/api/export/migrate-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sourceCredentials, 
          targetCredentials, 
          useEnvCredentials,
          selectedFolders: migrateAllFolders ? [] : selectedFolders,
          migrateAll: migrateAllFolders,
        }),
      });

      if (!storageResponse.ok) {
        const errorData = await storageResponse.json();
        throw new Error(errorData.error || 'Erro ao migrar Storage');
      }

      const storageData = await storageResponse.json();

      setMigrationProgress(prev => ({
        ...prev,
        storage: {
          ...prev.storage,
          totalFiles: storageData.totalFiles,
          processedFiles: storageData.migrated,
          status: 'completed',
        },
        status: 'completed',
      }));

      const consolidatedResult = {
        success: true,
        collections: [], // Não há coleções nesta migração
        totalCollections: 0,
        totalDocuments: 0,
        migrated: 0,
        errors: 0,
        storage: storageData,
      };

      setResultado(consolidatedResult);

    } catch (error: any) {
      setErro(error.message || 'Erro ao processar migração do Storage');
      setMigrationProgress(prev => ({
        ...prev,
        storage: {
          ...prev.storage,
          status: 'error',
        },
        status: 'error',
        error: error.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para formatar números grandes
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Calcula a porcentagem de progresso
  const collectionProgress = migrationProgress.totalCollections > 0
    ? (migrationProgress.processedCollections / migrationProgress.totalCollections) * 100
    : 0;

  const documentProgress = migrationProgress.totalDocuments > 0
    ? (migrationProgress.processedDocuments / migrationProgress.totalDocuments) * 100
    : 0;

  const storageProgress = migrationProgress.storage.totalFiles > 0
    ? (migrationProgress.storage.processedFiles / migrationProgress.storage.totalFiles) * 100
    : 0;

  return (
    <div className={classes.container}>
      {/* Header Dashboard */}
      <Box mb={3}>
        <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: 8 }}>
          <SwapHoriz style={{ marginRight: 12, verticalAlign: 'middle', fontSize: 40 }} />
          Dashboard de Migração Firestore
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Migração inteligente e segura entre projetos Firebase
        </Typography>
      </Box>

      {/* Status Cards */}
      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {availableCollections.length}
                  </Typography>
                  <Typography variant="caption">Coleções Disponíveis</Typography>
                </div>
                <Folder style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {selectedCollections.length}
                  </Typography>
                  <Typography variant="caption">Coleções Selecionadas</Typography>
                </div>
                <CheckCircle style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {useEnvCredentials && !customSourceMode ? '🔗' : '📁'}
                  </Typography>
                  <Typography variant="caption">
                    {useEnvCredentials && !customSourceMode ? 'Origem: ENV' : 'Origem: Custom'}
                  </Typography>
                </div>
                <Storage style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {targetFileLoaded ? '✅' : '⏳'}
                  </Typography>
                  <Typography variant="caption">
                    Destino {targetFileLoaded ? 'Configurado' : 'Pendente'}
                  </Typography>
                </div>
                <CloudUpload style={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas Informativos Compactos */}
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 12, background: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
            <Typography variant="caption" style={{ fontWeight: 'bold', color: '#1976d2' }}>
              ✅ SEGURANÇA TOTAL
            </Typography>
            <Typography variant="caption" display="block">
              Apenas COPIA dados. Origem permanece intacta.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 12, background: '#f3e5f5', borderLeft: '4px solid #9c27b0' }}>
            <Typography variant="caption" style={{ fontWeight: 'bold', color: '#7b1fa2' }}>
              🔒 CONVERSÃO AUTOMÁTICA
            </Typography>
            <Typography variant="caption" display="block">
              Senhas convertidas para hash SHA-256.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 12, background: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
            <Typography variant="caption" style={{ fontWeight: 'bold', color: '#e65100' }}>
              ⚡ MIGRAÇÃO INTELIGENTE
            </Typography>
            <Typography variant="caption" display="block">
              Batches de 500 docs. Storage incluído.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Botão para alternar origem */}
      <Box mb={3}>
        <Button
          variant="contained"
          color={customSourceMode ? 'inherit' : 'primary'}
          size="large"
          startIcon={customSourceMode ? <Storage /> : <SwapHoriz />}
          onClick={handleToggleCustomSource}
          style={{ marginRight: 16 }}
        >
          {customSourceMode ? 'Voltar para ENV (.env.local)' : 'Usar Origem Customizada'}
        </Button>

        {useEnvCredentials && !customSourceMode && sourceCredentials.projectId && (
          <Typography variant="caption" style={{ color: '#4caf50', marginLeft: 8 }}>
            ✅ Conectado ao projeto: <strong>{sourceCredentials.projectId}</strong>
          </Typography>
        )}
      </Box>

          {/* Origem Customizada (apenas se ativado) */}
          {customSourceMode && (
            <Card className={classes.card} style={{ marginBottom: 24 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Storage style={{ marginRight: 8, verticalAlign: 'middle', color: '#1976d2' }} />
                  Configurar Origem Customizada
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project ID *"
                      value={sourceCredentials.projectId}
                      onChange={(e) => setSourceCredentials({ ...sourceCredentials, projectId: e.target.value })}
                      placeholder="meu-projeto-origem"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Client Email *"
                      value={sourceCredentials.clientEmail}
                      onChange={(e) => setSourceCredentials({ ...sourceCredentials, clientEmail: e.target.value })}
                      placeholder="firebase-adminsdk-xxxxx@meu-projeto.iam.gserviceaccount.com"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      label="Private Key *"
                      value={sourceCredentials.privateKey}
                      onChange={(e) => setSourceCredentials({ ...sourceCredentials, privateKey: e.target.value })}
                      placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleLoadCollections}
                      disabled={!sourceCredentials.projectId || !sourceCredentials.clientEmail || !sourceCredentials.privateKey}
                    >
                      Conectar e Carregar Coleções
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Seleção de Coleções */}
          <Card className={classes.card} style={{ marginBottom: 24 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  <Folder style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Coleções Disponíveis
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleLoadCollections}
                  disabled={loadingCollections || (!useEnvCredentials && !sourceCredentials.projectId)}
                  startIcon={loadingCollections ? <CircularProgress size={20} /> : <Storage />}
                >
                  {loadingCollections ? 'Carregando...' : 'Atualizar Lista'}
                </Button>
              </Box>

              {availableCollections.length > 0 ? (
                <>
                  <Box display="flex" style={{ gap:2 }} mb={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<SelectAll />}
                      onClick={handleSelectAll}
                    >
                      {selectedCollections.length === availableCollections.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                    </Button>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={migrateAllCollections}
                          onChange={(e) => setMigrateAllCollections(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Migrar TODAS automaticamente"
                    />
                  </Box>

                  <Paper className={classes.collectionList}>
                    <List dense>
                      {availableCollections.map((collection) => (
                        <ListItem
                          key={collection}
                          button
                          onClick={() => handleToggleCollection(collection)}
                          disabled={migrateAllCollections}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={migrateAllCollections || selectedCollections.includes(collection)}
                              disabled={migrateAllCollections}
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={collection}
                            secondary={migrateAllCollections ? 'Será migrada automaticamente' : ''}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: 'block' }}>
                    {migrateAllCollections 
                      ? `✅ Todas as ${availableCollections.length} coleções serão migradas`
                      : `${selectedCollections.length} de ${availableCollections.length} coleções selecionadas`
                    }
                  </Typography>

                  <Box mt={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={migrateStorage}
                          onChange={(e) => setMigrateStorage(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center">
                          <ImageIcon style={{ marginRight: 8 }} />
                          Migrar também Firebase Storage
                        </Box>
                      }
                    />
                  </Box>
                </>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="textSecondary">
                    {loadingCollections ? 'Carregando coleções...' : 'Nenhuma coleção disponível'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Seleção de Pastas do Storage */}
          {migrateStorage && (
            <Card className={classes.card} style={{ marginBottom: 24 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    <ImageIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Pastas do Storage Disponíveis
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleLoadStorageFolders}
                    disabled={loadingFolders}
                    startIcon={loadingFolders ? <CircularProgress size={20} /> : <Storage />}
                  >
                    {loadingFolders ? 'Carregando...' : 'Atualizar Lista'}
                  </Button>
                </Box>

                {availableFolders.length > 0 ? (
                  <>
                    <Box display="flex" style={{ gap: 2 }} mb={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<SelectAll />}
                        onClick={handleSelectAllFolders}
                      >
                        {selectedFolders.length === availableFolders.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                      </Button>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={migrateAllFolders}
                            onChange={(e) => setMigrateAllFolders(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Migrar TODAS as pastas automaticamente"
                      />
                    </Box>

                    <Paper className={classes.collectionList}>
                      <List dense>
                        {availableFolders.map((folder) => (
                          <ListItem
                            key={folder}
                            button
                            onClick={() => handleToggleFolder(folder)}
                            disabled={migrateAllFolders}
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={migrateAllFolders || selectedFolders.includes(folder)}
                                disabled={migrateAllFolders}
                              />
                            </ListItemIcon>
                            <ListItemText 
                              primary={folder}
                              secondary={migrateAllFolders ? 'Será migrada automaticamente' : ''}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                    <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: 'block' }}>
                      {migrateAllFolders 
                        ? `✅ Todas as ${availableFolders.length} pastas serão migradas`
                        : `${selectedFolders.length} de ${availableFolders.length} pastas selecionadas`
                      }
                    </Typography>
                  </>
                ) : (
                  <Box textAlign="center" py={4}>
                    <ImageIcon style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {loadingFolders ? 'Carregando pastas do Storage...' : 'Nenhuma pasta encontrada no Storage'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {!loadingFolders && 'Todos os arquivos do bucket serão migrados automaticamente'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}


      <ExportDestination
        targetCredentials={targetCredentials}
        targetFileLoaded={targetFileLoaded}
        isDraggingTarget={isDraggingTarget}
        onTargetFileChange={handleTargetFileChange}
        onTargetDragOver={handleTargetDragOver}
        onTargetDragLeave={handleTargetDragLeave}
        onTargetDrop={handleTargetDrop}
        onTargetCredentialsChange={setTargetCredentials}
        onClearTargetCredentials={handleClearTargetCredentials}
        classes={{ card: classes.card, dropZone: classes.dropZone, dropZoneActive: classes.dropZoneActive, dropZoneSuccess: classes.dropZoneSuccess }}
      />

          {/* Botões de Migração Individual */}
          <Box display="flex" gap={2} mb={2}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={handleMigrateFirestore}
              disabled={loading || (selectedCollections.length === 0 && !migrateAllCollections && !loadingCollections)}
              startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
              size="large"
              style={{ flex: 1 }}
            >
              {loading ? 'Migrando Firestore...' : 'Migrar Firestore'}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={handleMigrateStorageOnly}
              disabled={loading || (selectedFolders.length === 0 && !migrateAllFolders && !loadingFolders)}
              startIcon={loading ? <CircularProgress size={20} /> : <Storage />}
              size="large"
              style={{ flex: 1 }}
            >
              {loading ? 'Migrando Storage...' : 'Migrar Storage'}
            </Button>
          </Box>

          {/* Botão de Iniciar Migração Completa */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleMigrate}
            disabled={loading || (selectedCollections.length === 0 && !migrateAllCollections && !loadingCollections)}
            startIcon={loading ? <CircularProgress size={20} /> : <SwapHoriz />}
            size="large"
          >
            {loading ? 'Migrando...' : `Iniciar Migração Completa ${migrateAllCollections ? '(TODAS)' : `(${selectedCollections.length} coleções)`}`}
          </Button>


      <ExportProgress
        migrationProgress={migrationProgress}
        migrateStorage={migrateStorage}
        collectionProgress={collectionProgress}
        documentProgress={documentProgress}
        storageProgress={storageProgress}
        classes={{
          progressBarContainer: classes.progressBarContainer,
          progressBarItem: classes.progressBarItem,
          progressBarLabel: classes.progressBarLabel,
          progressBarDetails: classes.progressBarDetails,
          progressBarAnimated: classes.progressBarAnimated,
        }}
      />

          {/* Mensagens de Erro e Resultado */}
          {erro && (
            <Box className={classes.resultado}>
              <Paper className={`${classes.alertBox} ${classes.alertError}`} elevation={1}>
                <ErrorIcon style={{ marginRight: 8, flexShrink: 0 }} />
                <Typography variant="body1">
                  {erro}
                </Typography>
              </Paper>
            </Box>
          )}

          {resultado && (
            <Box className={classes.resultado}>
              <Paper className={`${classes.alertBox} ${resultado.success ? classes.alertSuccess : classes.alertError}`} elevation={1}>
                <Box width="100%">
                  <Typography variant="h6" gutterBottom>
                    {resultado.success ? '✅ Migração Concluída!' : '⚠️ Migração Concluída com Erros'}
                  </Typography>

                  <div className={classes.stats}>
                    <div className={classes.statItem}>
                      <Typography variant="h4" color="primary">
                        {resultado.totalCollections || 0}
                      </Typography>
                      <Typography variant="caption">Coleções</Typography>
                    </div>

                    <div className={classes.statItem}>
                      <Typography variant="h4" color="primary">
                        {resultado.totalDocuments || 0}
                      </Typography>
                      <Typography variant="caption">Total Docs</Typography>
                    </div>

                    <div className={classes.statItem}>
                      <Typography variant="h4" style={{ color: '#4caf50' }}>
                        {resultado.migrated || 0}
                      </Typography>
                      <Typography variant="caption">Migrados</Typography>
                    </div>

                    <div className={classes.statItem}>
                      <Typography variant="h4" color="error">
                        {resultado.errors || 0}
                      </Typography>
                      <Typography variant="caption">Erros</Typography>
                    </div>

                    {resultado.convertedUsers !== undefined && resultado.convertedUsers > 0 && (
                      <div className={classes.statItem}>
                        <Typography variant="h4" style={{ color: '#ff9800' }}>
                          {resultado.convertedUsers}
                        </Typography>
                        <Typography variant="caption">Usuários Convertidos</Typography>
                      </div>
                    )}

                    {resultado.storage && (
                      <>
                        <div className={classes.statItem}>
                          <Typography variant="h4" color="primary">
                            {resultado.storage.totalFiles || 0}
                          </Typography>
                          <Typography variant="caption">Arquivos Total</Typography>
                        </div>

                        <div className={classes.statItem}>
                          <Typography variant="h4" style={{ color: '#4caf50' }}>
                            {resultado.storage.migrated || 0}
                          </Typography>
                          <Typography variant="caption">Arquivos Migrados</Typography>
                        </div>
                      </>
                    )}
                  </div>

                  {resultado.collections && resultado.collections.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Detalhes por Coleção:
                      </Typography>
                      <List dense>
                        {resultado.collections.map((coll: any, idx: number) => (
                          <ListItem key={idx}>
                            {coll.success ? (
                              <CheckCircle fontSize="small" style={{ color: '#4caf50', marginRight: 8 }} />
                            ) : (
                              <ErrorIcon fontSize="small" color="error" style={{ marginRight: 8 }} />
                            )}
                            <ListItemText
                              primary={coll.collectionName}
                              secondary={
                                coll.collectionName === 'usuarios' && coll.convertedUsers > 0
                                  ? `${coll.migrated || 0} docs migrados (${coll.convertedUsers} convertidos para estrutura segura)${coll.errors > 0 ? `, ${coll.errors} erros` : ''}`
                                  : `${coll.migrated || 0} docs migrados${coll.errors > 0 ? `, ${coll.errors} erros` : ''}`
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          )}

      </div>
    );
}