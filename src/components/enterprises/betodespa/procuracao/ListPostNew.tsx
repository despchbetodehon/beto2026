/**
 * ListPost - Componente principal de Procuração Eletrônica
 * 
 * Versão refatorada usando MUI v5 (styled-components e sx prop)
 * Mantém toda a lógica e funcionalidade do componente original
 * 
 * Estrutura modular:
 * - types/ - Interfaces e tipos TypeScript
 * - styles/ - Componentes estilizados MUI v5
 * - components/ - Componentes auxiliares
 * - hooks/ - Hooks customizados
 * - utils/ - Funções utilitárias
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Button,
  Paper,
  Typography,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Fab,
  Tooltip,
  Collapse,
  Card,
  CardContent,
  TextField,
  Box,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  PhotoCamera,
  Delete,
  Close,
  CloudUpload,
  Send,
  HelpOutline,
  ExpandMore,
  ExpandLess,
  Edit,
  PictureAsPdf,
  Add,
  Save,
  PersonAdd,
  Business,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';
import { v4 as uuidv4 } from 'uuid';
import Colecao from '@/logic/firebase/db/Colecao';

// Componentes modularizados
import { CompactSection, CameraDialog, CropDialog, ProcuracaoPreview, EmpresaCard } from './components';
import SignaturePad from './SingnaturePad';
import Item from './Item';

// Hooks customizados
import { useDebounce, useCpfCnpjSearch, useCepSearch, useAIProcessing, useFileUpload, usePDFGenerator } from './hooks';

// SafeGrid para evitar problemas com theme
import SafeGrid from '@/components/common/SafeGrid';

// Estilos MUI v5
import {
  RootContainer,
  FormContainer,
  CompactSectionContainer,
  SectionTitle,
  MainTitle,
  UploadButton,
  ThumbnailContainer,
  Thumbnail,
  PdfThumbnail,
  DeleteButton,
  SubmitButton,
  StyledFab,
  SignatureContainer,
  ProcessingIndicator,
  ExpandableContent,
  textFieldSx,
  actionIconButtonSx,
} from './styles';

// Tipos
import {
  Contact,
  Empresa,
  ProcuradorEmpresa,
  ListPostProps,
  initialContactState,
  initialEmpresaState,
  createInitialProcurador,
} from './types';

// Utilitários
import { formatCpfCnpj, isValidCpfCnpj, uniqueFiles, generateRandomId } from './utils';

const ListPost: React.FC<ListPostProps> = ({ setItems, onItemEnviado }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');

  // ===== ESTADOS PRINCIPAIS =====
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const savingRef = useRef(false);

  // Estado para modo jurídico (empresa)
  const [modoJuridico, setModoJuridico] = useState(false);

  // Estados das seções expandidas
  const [veiculoExpanded, setVeiculoExpanded] = useState(false);
  const [proprietarioExpanded, setProprietarioExpanded] = useState(false);
  const [procuradorExpanded, setProcuradorExpanded] = useState(false);
  const [assinaturaExpanded, setAssinaturaExpanded] = useState(false);
  const [empresaExpanded, setEmpresaExpanded] = useState(false);
  const [socioAdministradorExpanded, setSocioAdministradorExpanded] = useState(false);

  // Estados para arquivos de cada seção
  const [veiculoFiles, setVeiculoFiles] = useState<File[]>([]);
  const [proprietarioDocFiles, setProprietarioDocFiles] = useState<File[]>([]);
  const [proprietarioContaFiles, setProprietarioContaFiles] = useState<File[]>([]);
  const [procuradorDocFiles, setProcuradorDocFiles] = useState<File[]>([]);
  const [procuradorContaFiles, setProcuradorContaFiles] = useState<File[]>([]);
  const [empresaFiles, setEmpresaFiles] = useState<File[]>([]);
  const [socioAdministradorFiles, setSocioAdministradorFiles] = useState<File[]>([]);

  // Estados para câmera e crop
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Estados para banco de contatos
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [contactData, setContactData] = useState<Contact>(initialContactState);
  const [contactFiles, setContactFiles] = useState<File[]>([]);

  // Estados para gerenciamento de empresas
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [empresaDialogOpen, setEmpresaDialogOpen] = useState(false);
  const [empresaEditDialogOpen, setEmpresaEditDialogOpen] = useState(false);
  const [empresaDeleteDialogOpen, setEmpresaDeleteDialogOpen] = useState(false);
  const [empresaParaEditar, setEmpresaParaEditar] = useState<Empresa | null>(null);
  const [empresaParaExcluir, setEmpresaParaExcluir] = useState<Empresa | null>(null);
  const [novaEmpresa, setNovaEmpresa] = useState<Empresa>(initialEmpresaState);
  const [empresasPagina, setEmpresasPagina] = useState(1);
  const [empresasPorPagina, setEmpresasPorPagina] = useState(5);
  const empresasContainerRef = useRef<HTMLDivElement>(null);

  // Estado para quantidade de procuradores
  const [quantidadeProcuradores, setQuantidadeProcuradores] = useState<number>(1);

  // Estado principal do formulário
  const [newItem, setNewItem] = useState<Item>({
    id: '',
    cliente: '',
    status: 'Pendente',
    quantidade: 0,
    imagemUrls: [],
    concluido: false,
    placa: '',
    renavam: '',
    crv: '',
    valordevenda: '',
    nomevendedor: '',
    cpfvendedor: '',
    nregistro: '',
    enderecovendedor: '',
    complementovendedor: '',
    municipiovendedor: '',
    emailvendedor: '',
    bairrocomprador: '',
    nomecomprador: '',
    cpfcomprador: '',
    enderecocomprador: '',
    complementocomprador: '',
    municipiocomprador: '',
    emailcomprador: '',
    celtelcomprador: '',
    cepvendedor: '',
    cepcomprador: '',
    tipo: '',
    cnpjempresa: '',
    nomeempresa: '',
    celtelvendedor: '',
    chassi: '',
    modelo: '',
    anoFabricacao: '',
    anoModelo: '',
    cor: '',
    combustivel: '',
    nomeProprietario: '',
    cpfProprietario: '',
    rgProprietario: '',
    nacionalidadeProprietario: 'brasileiro(a)',
    dataNascimentoProprietario: '',
    nomePaiProprietario: '',
    nomeMaeProprietario: '',
    enderecoProprietario: '',
    complementoProprietario: '',
    municipioProprietario: '',
    estadoProprietario: '',
    cepProprietario: '',
    nomeProcurador: '',
    cpfProcurador: '',
    rgProcurador: '',
    nacionalidadeProcurador: 'brasileiro',
    estadoCivilProcurador: '',
    profissaoProcurador: '',
    enderecoProcurador: '',
    complementoProcurador: '',
    municipioProcurador: '',
    estadoProcuradorEnd: '',
    cepProcurador: '',
    nregistroProcurador: '',
    nregistroProcurador1: '',
    nregistroProcurador2: '',
    nregistroProcurador3: '',
    nregistroProcurador4: '',
    nregistroProcurador5: '',
    nomeProcurador2: '',
    cpfProcurador2: '',
    rgProcurador2: '',
    nacionalidadeProcurador2: 'brasileiro',
    estadoCivilProcurador2: '',
    profissaoProcurador2: '',
    enderecoProcurador2: '',
    complementoProcurador2: '',
    municipioProcurador2: '',
    estadoProcuradorEnd2: '',
    cepProcurador2: '',
    nomeProcurador3: '',
    cpfProcurador3: '',
    rgProcurador3: '',
    nacionalidadeProcurador3: 'brasileiro',
    estadoCivilProcurador3: '',
    profissaoProcurador3: '',
    enderecoProcurador3: '',
    complementoProcurador3: '',
    municipioProcurador3: '',
    estadoProcuradorEnd3: '',
    cepProcurador3: '',
    nomeProcurador4: '',
    cpfProcurador4: '',
    rgProcurador4: '',
    nacionalidadeProcurador4: 'brasileiro',
    estadoCivilProcurador4: '',
    profissaoProcurador4: '',
    enderecoProcurador4: '',
    complementoProcurador4: '',
    municipioProcurador4: '',
    estadoProcuradorEnd4: '',
    cepProcurador4: '',
    nomeProcurador5: '',
    cpfProcurador5: '',
    rgProcurador5: '',
    nacionalidadeProcurador5: 'brasileiro',
    estadoCivilProcurador5: '',
    profissaoProcurador5: '',
    enderecoProcurador5: '',
    complementoProcurador5: '',
    municipioProcurador5: '',
    estadoProcuradorEnd5: '',
    cepProcurador5: '',
    dataCriacao: Timestamp.fromDate(new Date()),
    signature: '',
    cnpjEmpresaJuridico: '',
    nomeEmpresaJuridico: '',
    enderecoEmpresaJuridico: '',
    bairroEmpresaJuridico: '',
    municipioEmpresaJuridico: '',
    estadoEmpresaJuridico: '',
    cepEmpresaJuridico: '',
    nomeSocioAdministrador: '',
    cpfSocioAdministrador: '',
    rgSocioAdministrador: '',
    nacionalidadeSocioAdministrador: 'brasileiro(a)',
    estadoCivilSocioAdministrador: '',
    profissaoSocioAdministrador: '',
    enderecoSocioAdministrador: '',
    complementoSocioAdministrador: '',
    municipioSocioAdministrador: '',
    estadoSocioAdministrador: '',
    cepSocioAdministrador: '',
    dataNascimentoSocioAdministrador: '',
  });

  // ===== HOOKS CUSTOMIZADOS =====
  const { search: searchCpfCnpj, isLoading: isLoadingSearch } = useCpfCnpjSearch();
  const { searchCep } = useCepSearch();
  const { processImage, isProcessing: processingImage } = useAIProcessing();
  const { uploadFiles: uploadFilesToStorage, isUploading } = useFileUpload();
  const { generatePDF } = usePDFGenerator();

  // Debounce para busca de CPF/CNPJ
  const debouncedSearch = useDebounce(async (doc: string, field: string) => {
    await searchCpfCnpj(doc, (data, tipo) => {
      if (data?.nome) {
        setNewItem(prev => ({
          ...prev,
          [field]: data.nome!.toUpperCase(),
        }));
      }
    });
  }, 1000);

  // ===== EFEITOS =====

  // Carregar empresas do Firestore
  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        const colecao = new Colecao();
        const empresasData = await colecao.consultar('empresasProcuracao');
        const empresasCarregadas = empresasData.map((empresa: any) => ({
          id: empresa.id,
          nomeEmpresa: empresa.nomeEmpresa,
          quantidadeProcuradores: empresa.quantidadeProcuradores,
          procuradores: empresa.procuradores || []
        } as Empresa));
        setEmpresas(empresasCarregadas);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
      }
    };
    carregarEmpresas();
  }, []);

  // Calcular cards por página
  useEffect(() => {
    const calcularCardsPorPagina = () => {
      if (!empresasContainerRef.current) return;
      const containerWidth = empresasContainerRef.current.offsetWidth;
      const cardMinWidth = 126;
      const gap = 6;
      const cardsPossiveis = Math.floor((containerWidth + gap) / (cardMinWidth + gap));
      setEmpresasPorPagina(Math.max(1, cardsPossiveis));
    };

    calcularCardsPorPagina();
    window.addEventListener('resize', calcularCardsPorPagina);
    return () => window.removeEventListener('resize', calcularCardsPorPagina);
  }, [empresas.length]);

  // ===== HANDLERS =====

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Item
  ) => {
    const { value } = e.target;

    setNewItem(prev => {
      const updated = { ...prev };

      // Tratamento especial para placa
      if (field === 'placa') {
        updated.id = value.toUpperCase();
        updated.placa = value.toUpperCase();
        return updated;
      }

      // Busca automática por CEP
      const camposCep = ['cepProprietario', 'cepProcurador', 'cepProcurador2', 'cepProcurador3', 'cepProcurador4', 'cepProcurador5', 'cepEmpresaJuridico', 'cepSocioAdministrador'];
      if (camposCep.includes(field)) {
        const cepLimpo = value.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
          handleCepSearch(cepLimpo, field);
        }
      }

      // Busca automática por CPF/CNPJ
      const camposCpfCnpj = ['cpfProprietario', 'cpfProcurador', 'cpfProcurador2', 'cpfProcurador3', 'cpfProcurador4', 'cpfProcurador5', 'cpfSocioAdministrador'];
      if (camposCpfCnpj.includes(field)) {
        const raw = value.replace(/\D/g, '');
        (updated as any)[field] = raw;

        if (isValidCpfCnpj(raw)) {
          const targetField = field.replace('cpf', 'nome');
          debouncedSearch(raw, targetField);
        }
        return updated;
      }

      (updated as any)[field] = value;
      return updated;
    });
  };

  const handleCepSearch = async (cep: string, fieldType: string) => {
    const address = await searchCep(cep);
    if (!address) return;

    setNewItem(prev => {
      const updated = { ...prev };

      if (fieldType === 'cepProprietario') {
        updated.enderecoProprietario = address.endereco;
        updated.complementoProprietario = address.bairro;
        updated.municipioProprietario = address.municipio;
        updated.estadoProprietario = address.estado;
      } else if (fieldType === 'cepEmpresaJuridico') {
        updated.enderecoEmpresaJuridico = address.endereco;
        updated.bairroEmpresaJuridico = address.bairro;
        updated.municipioEmpresaJuridico = address.municipio;
        updated.estadoEmpresaJuridico = address.estado;
      } else if (fieldType.startsWith('cepProcurador')) {
        const suffix = fieldType.replace('cepProcurador', '');
        (updated as any)[`enderecoProcurador${suffix}`] = address.endereco;
        (updated as any)[`complementoProcurador${suffix}`] = address.bairro;
        (updated as any)[`municipioProcurador${suffix}`] = address.municipio;
        (updated as any)[`estadoProcuradorEnd${suffix}`] = address.estado;
      } else if (fieldType === 'cepSocioAdministrador') {
        updated.enderecoSocioAdministrador = address.endereco;
        updated.complementoSocioAdministrador = address.bairro;
        updated.municipioSocioAdministrador = address.municipio;
        updated.estadoSocioAdministrador = address.estado;
      }

      return updated;
    });
  };

  // Handler para upload de veículo
  const handleVeiculoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setVeiculoFiles(prev => [...prev, ...selectedFiles]);

    if (selectedFiles.length > 0) {
      const data = await processImage(selectedFiles[0], 'veiculo');
      if (data) {
        setNewItem(prev => ({
          ...prev,
          placa: data.placa?.toUpperCase() || prev.placa,
          id: data.placa?.toUpperCase() || prev.id,
          renavam: data.renavam?.replace(/\D/g, '') || prev.renavam,
          chassi: data.chassi?.toUpperCase() || prev.chassi,
          modelo: data.modelo?.toUpperCase() || prev.modelo,
          anoFabricacao: data.anoFabricacao || prev.anoFabricacao,
          anoModelo: data.anoModelo || prev.anoModelo,
          cor: data.cor?.toUpperCase() || prev.cor,
          combustivel: data.combustivel?.toUpperCase() || prev.combustivel,
        }));
      }
    }
  };

  // Handler para upload de documento do proprietário
  const handleProprietarioDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setProprietarioDocFiles(prev => [...prev, ...selectedFiles]);

    if (selectedFiles.length > 0) {
      const data = await processImage(selectedFiles[0], 'proprietario_doc');
      if (data) {
        setNewItem(prev => ({
          ...prev,
          nomeProprietario: data.nome?.toUpperCase() || prev.nomeProprietario,
          cpfProprietario: data.cpf?.replace(/\D/g, '') || prev.cpfProprietario,
          rgProprietario: data.rg || prev.rgProprietario,
          dataNascimentoProprietario: data.dataNascimento || prev.dataNascimentoProprietario,
          nomePaiProprietario: data.nomePai?.toUpperCase() || prev.nomePaiProprietario,
          nomeMaeProprietario: data.nomeMae?.toUpperCase() || prev.nomeMaeProprietario,
        }));
      }
    }
  };

  // Handler para upload de comprovante de endereço do proprietário
  const handleProprietarioContaFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setProprietarioContaFiles(prev => [...prev, ...selectedFiles]);

    if (selectedFiles.length > 0) {
      const data = await processImage(selectedFiles[0], 'proprietario_conta');
      if (data) {
        setNewItem(prev => ({
          ...prev,
          enderecoProprietario: data.endereco?.toUpperCase() || prev.enderecoProprietario,
          complementoProprietario: data.bairro?.toUpperCase() || prev.complementoProprietario,
          municipioProprietario: data.municipio?.toUpperCase() || prev.municipioProprietario,
          estadoProprietario: data.estado?.toUpperCase() || prev.estadoProprietario,
          cepProprietario: data.cep?.replace(/\D/g, '') || prev.cepProprietario,
        }));
      }
    }
  };

  // Handler para upload de documento do procurador
  const handleProcuradorDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>, procuradorNumber: number = 1) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setProcuradorDocFiles(prev => [...prev, ...selectedFiles]);

    if (selectedFiles.length > 0) {
      const data = await processImage(selectedFiles[0], 'procurador_doc');
      if (data) {
        const suffix = procuradorNumber === 1 ? '' : procuradorNumber.toString();
        setNewItem(prev => ({
          ...prev,
          [`nomeProcurador${suffix}`]: data.nome?.toUpperCase() || (prev as any)[`nomeProcurador${suffix}`],
          [`cpfProcurador${suffix}`]: data.cpf?.replace(/\D/g, '') || (prev as any)[`cpfProcurador${suffix}`],
          [`rgProcurador${suffix}`]: data.rg || (prev as any)[`rgProcurador${suffix}`],
          [`nregistroProcurador${suffix}`]: data.nregistro || (prev as any)[`nregistroProcurador${suffix}`],
          [`estadoCivilProcurador${suffix}`]: data.estadoCivil?.toUpperCase() || (prev as any)[`estadoCivilProcurador${suffix}`],
          [`profissaoProcurador${suffix}`]: data.profissao?.toUpperCase() || (prev as any)[`profissaoProcurador${suffix}`],
        }));
      }
    }
  };

  // Handler para câmera
  const handleCameraCapture = (file: File) => {
    setFiles(prev => [...prev, file]);
  };

  // Handler para crop
  const handleCropComplete = (croppedFile: File) => {
    setFiles(prev => [...prev, croppedFile]);
  };

  // Handler para salvar
  const handleAddItem = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSubmitting(true);

    try {
      if (!newItem.id) {
        alert('ID do item (placa) não foi gerado corretamente. Por favor, recarregue a página.');
        return;
      }

      setIsLoading(true);

      // Fazer upload de todos os arquivos
      const allFiles = [
        ...files,
        ...veiculoFiles,
        ...proprietarioDocFiles,
        ...proprietarioContaFiles,
        ...procuradorDocFiles,
        ...procuradorContaFiles,
        ...empresaFiles,
        ...socioAdministradorFiles,
      ];
      const uploadedUrls = await uploadFilesToStorage(allFiles, 'procuracao', newItem.id);

      const itemParaSalvar = {
        ...newItem,
        imagemUrls: uploadedUrls,
        dataCriacao: Timestamp.fromDate(new Date()),
      };

      const docUuid = uuidv4();

      await setDoc(
        doc(db, 'Betodespachanteprocuracaoeletronica', docUuid),
        { ...itemParaSalvar, docUuid },
        { merge: true }
      );

      setItems(prev => [...prev, { ...itemParaSalvar, id: newItem.id, docUuid }]);

      const pdfURL = await generatePDF('pdf-content', newItem.id);
      
      const numeroWhatsApp = '5548988449379';
      const mensagemInicial = `Olá! Tudo certo, a procuração eletrônica foi preenchida!\n\n📌 *Placa:* ${newItem.id}\n📄 *Documento:* ${pdfURL}`;

      window.location.href = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagemInicial)}`;

      resetForm();

      setTimeout(() => {
        alert('Procuração eletrônica criada com sucesso! Os dados foram salvos.');
        if (onItemEnviado) onItemEnviado();
      }, 5000);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Ocorreu um erro ao salvar a procuração. Tente novamente.');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
      savingRef.current = false;
    }
  };

  // Reset form
  const resetForm = () => {
    setNewItem({
      ...newItem,
      id: '',
      placa: '',
      renavam: '',
      chassi: '',
      modelo: '',
      anoFabricacao: '',
      anoModelo: '',
      cor: '',
      combustivel: '',
      nomeProprietario: '',
      cpfProprietario: '',
      rgProprietario: '',
      signature: '',
    });
    setFiles([]);
    setVeiculoFiles([]);
    setProprietarioDocFiles([]);
    setProprietarioContaFiles([]);
    setProcuradorDocFiles([]);
    setProcuradorContaFiles([]);
    setEmpresaFiles([]);
    setSocioAdministradorFiles([]);
  };

  // Selecionar empresa
  const selecionarEmpresa = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);
    setQuantidadeProcuradores(empresa.quantidadeProcuradores);

    empresa.procuradores.forEach((proc, index) => {
      const suffix = index === 0 ? '' : (index + 1).toString();
      setNewItem(prev => ({
        ...prev,
        [`nomeProcurador${suffix}`]: proc.nome,
        [`cpfProcurador${suffix}`]: proc.cpfCnpj.replace(/\D/g, ''),
        [`rgProcurador${suffix}`]: proc.rg,
        [`nregistroProcurador${suffix}`]: proc.nregistro,
        [`nacionalidadeProcurador${suffix}`]: proc.nacionalidade,
        [`estadoCivilProcurador${suffix}`]: proc.estadoCivil,
        [`profissaoProcurador${suffix}`]: proc.profissao,
        [`enderecoProcurador${suffix}`]: proc.endereco,
        [`complementoProcurador${suffix}`]: proc.complemento,
        [`municipioProcurador${suffix}`]: proc.municipio,
        [`estadoProcuradorEnd${suffix}`]: proc.estado,
        [`cepProcurador${suffix}`]: proc.cep,
      }));
    });
  };

  // ===== RENDER =====
  return (
    <RootContainer>
      <FormContainer>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <MainTitle variant="h5">
            Procuração Eletrônica
          </MainTitle>
        </Box>

        {/* Toggle Pessoa Física/Jurídica */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={modoJuridico}
                onChange={(e) => setModoJuridico(e.target.checked)}
                color="primary"
              />
            }
            label={modoJuridico ? 'Pessoa Jurídica' : 'Pessoa Física'}
          />
        </Box>

        {/* Seção Veículo */}
        <CompactSection
          title="Documento do Veículo"
          files={veiculoFiles}
          setFiles={setVeiculoFiles}
          onFileChange={handleVeiculoFileChange}
          onManualEdit={() => setVeiculoExpanded(!veiculoExpanded)}
          processingImage={processingImage}
          manualExpanded={veiculoExpanded}
          setCameraOpen={setCameraOpen}
        >
          <SafeGrid container spacing={2} sx={{ mt: 1 }}>
            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="Placa"
                name="placa"
                value={newItem.placa}
                onChange={(e) => handleInputChange(e, 'placa')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="Renavam"
                name="renavam"
                value={newItem.renavam}
                onChange={(e) => handleInputChange(e, 'renavam')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
            <SafeGrid item xs={12}>
              <TextField
                label="Chassi"
                name="chassi"
                value={newItem.chassi}
                onChange={(e) => handleInputChange(e, 'chassi')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
            <SafeGrid item xs={12} sm={6}>
              <TextField
                label="Modelo"
                name="modelo"
                value={newItem.modelo}
                onChange={(e) => handleInputChange(e, 'modelo')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
            <SafeGrid item xs={6} sm={3}>
              <TextField
                label="Ano Fab."
                name="anoFabricacao"
                value={newItem.anoFabricacao}
                onChange={(e) => handleInputChange(e, 'anoFabricacao')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
            <SafeGrid item xs={6} sm={3}>
              <TextField
                label="Ano Mod."
                name="anoModelo"
                value={newItem.anoModelo}
                onChange={(e) => handleInputChange(e, 'anoModelo')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
            <SafeGrid item xs={6}>
              <TextField
                label="Cor"
                name="cor"
                value={newItem.cor}
                onChange={(e) => handleInputChange(e, 'cor')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
            <SafeGrid item xs={6}>
              <TextField
                label="Combustível"
                name="combustivel"
                value={newItem.combustivel}
                onChange={(e) => handleInputChange(e, 'combustivel')}
                fullWidth
                size="small"
                sx={textFieldSx}
              />
            </SafeGrid>
          </SafeGrid>
        </CompactSection>

        <Divider sx={{ my: 2 }} />

        {/* Seção Proprietário/Empresa */}
        {!modoJuridico ? (
          // Pessoa Física
          <CompactSection
            title="Dados do Proprietário"
            files={proprietarioDocFiles}
            setFiles={setProprietarioDocFiles}
            onFileChange={handleProprietarioDocFileChange}
            onManualEdit={() => setProprietarioExpanded(!proprietarioExpanded)}
            processingImage={processingImage}
            manualExpanded={proprietarioExpanded}
            setCameraOpen={setCameraOpen}
          >
            <SafeGrid container spacing={2} sx={{ mt: 1 }}>
              <SafeGrid item xs={12}>
                <TextField
                  label="Nome Completo"
                  name="nomeProprietario"
                  value={newItem.nomeProprietario}
                  onChange={(e) => handleInputChange(e, 'nomeProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={6}>
                <TextField
                  label="CPF"
                  name="cpfProprietario"
                  value={formatCpfCnpj(newItem.cpfProprietario || '')}
                  onChange={(e) => handleInputChange(e, 'cpfProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={6}>
                <TextField
                  label="RG"
                  name="rgProprietario"
                  value={newItem.rgProprietario}
                  onChange={(e) => handleInputChange(e, 'rgProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={6}>
                <TextField
                  label="Data de Nascimento"
                  name="dataNascimentoProprietario"
                  value={newItem.dataNascimentoProprietario}
                  onChange={(e) => handleInputChange(e, 'dataNascimentoProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={6}>
                <TextField
                  label="Nacionalidade"
                  name="nacionalidadeProprietario"
                  value={newItem.nacionalidadeProprietario}
                  onChange={(e) => handleInputChange(e, 'nacionalidadeProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={6}>
                <TextField
                  label="Nome do Pai"
                  name="nomePaiProprietario"
                  value={newItem.nomePaiProprietario}
                  onChange={(e) => handleInputChange(e, 'nomePaiProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={6}>
                <TextField
                  label="Nome da Mãe"
                  name="nomeMaeProprietario"
                  value={newItem.nomeMaeProprietario}
                  onChange={(e) => handleInputChange(e, 'nomeMaeProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={4}>
                <TextField
                  label="CEP"
                  name="cepProprietario"
                  value={newItem.cepProprietario}
                  onChange={(e) => handleInputChange(e, 'cepProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                  helperText="Endereço preenchido automaticamente"
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={8}>
                <TextField
                  label="Endereço"
                  name="enderecoProprietario"
                  value={newItem.enderecoProprietario}
                  onChange={(e) => handleInputChange(e, 'enderecoProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={4}>
                <TextField
                  label="Bairro"
                  name="complementoProprietario"
                  value={newItem.complementoProprietario}
                  onChange={(e) => handleInputChange(e, 'complementoProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={5}>
                <TextField
                  label="Município"
                  name="municipioProprietario"
                  value={newItem.municipioProprietario}
                  onChange={(e) => handleInputChange(e, 'municipioProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
              <SafeGrid item xs={12} sm={3}>
                <TextField
                  label="Estado"
                  name="estadoProprietario"
                  value={newItem.estadoProprietario}
                  onChange={(e) => handleInputChange(e, 'estadoProprietario')}
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              </SafeGrid>
            </SafeGrid>
          </CompactSection>
        ) : (
          // Pessoa Jurídica
          <>
            <CompactSection
              title="Dados da Empresa"
              files={empresaFiles}
              setFiles={setEmpresaFiles}
              onFileChange={(e) => {
                if (!e.target.files) return;
                const selectedFiles = Array.from(e.target.files);
                setEmpresaFiles(prev => [...prev, ...selectedFiles]);
              }}
              onManualEdit={() => setEmpresaExpanded(!empresaExpanded)}
              processingImage={processingImage}
              manualExpanded={empresaExpanded}
              setCameraOpen={setCameraOpen}
            >
              <SafeGrid container spacing={2} sx={{ mt: 1 }}>
                <SafeGrid item xs={12}>
                  <TextField
                    label="CNPJ"
                    name="cnpjEmpresaJuridico"
                    value={formatCpfCnpj(newItem.cnpjEmpresaJuridico || '')}
                    onChange={(e) => handleInputChange(e, 'cnpjEmpresaJuridico')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12}>
                  <TextField
                    label="Razão Social"
                    name="nomeEmpresaJuridico"
                    value={newItem.nomeEmpresaJuridico}
                    onChange={(e) => handleInputChange(e, 'nomeEmpresaJuridico')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12} sm={4}>
                  <TextField
                    label="CEP"
                    name="cepEmpresaJuridico"
                    value={newItem.cepEmpresaJuridico}
                    onChange={(e) => handleInputChange(e, 'cepEmpresaJuridico')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12} sm={8}>
                  <TextField
                    label="Endereço"
                    name="enderecoEmpresaJuridico"
                    value={newItem.enderecoEmpresaJuridico}
                    onChange={(e) => handleInputChange(e, 'enderecoEmpresaJuridico')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12} sm={4}>
                  <TextField
                    label="Bairro"
                    name="bairroEmpresaJuridico"
                    value={newItem.bairroEmpresaJuridico}
                    onChange={(e) => handleInputChange(e, 'bairroEmpresaJuridico')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12} sm={5}>
                  <TextField
                    label="Município"
                    name="municipioEmpresaJuridico"
                    value={newItem.municipioEmpresaJuridico}
                    onChange={(e) => handleInputChange(e, 'municipioEmpresaJuridico')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12} sm={3}>
                  <TextField
                    label="Estado"
                    name="estadoEmpresaJuridico"
                    value={newItem.estadoEmpresaJuridico}
                    onChange={(e) => handleInputChange(e, 'estadoEmpresaJuridico')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
              </SafeGrid>
            </CompactSection>

            <Divider sx={{ my: 2 }} />

            <CompactSection
              title="Sócio Administrador"
              files={socioAdministradorFiles}
              setFiles={setSocioAdministradorFiles}
              onFileChange={(e) => {
                if (!e.target.files) return;
                const selectedFiles = Array.from(e.target.files);
                setSocioAdministradorFiles(prev => [...prev, ...selectedFiles]);
              }}
              onManualEdit={() => setSocioAdministradorExpanded(!socioAdministradorExpanded)}
              processingImage={processingImage}
              manualExpanded={socioAdministradorExpanded}
              setCameraOpen={setCameraOpen}
            >
              <SafeGrid container spacing={2} sx={{ mt: 1 }}>
                <SafeGrid item xs={12}>
                  <TextField
                    label="Nome Completo"
                    name="nomeSocioAdministrador"
                    value={newItem.nomeSocioAdministrador}
                    onChange={(e) => handleInputChange(e, 'nomeSocioAdministrador')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12} sm={6}>
                  <TextField
                    label="CPF"
                    name="cpfSocioAdministrador"
                    value={formatCpfCnpj(newItem.cpfSocioAdministrador || '')}
                    onChange={(e) => handleInputChange(e, 'cpfSocioAdministrador')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
                <SafeGrid item xs={12} sm={6}>
                  <TextField
                    label="RG"
                    name="rgSocioAdministrador"
                    value={newItem.rgSocioAdministrador}
                    onChange={(e) => handleInputChange(e, 'rgSocioAdministrador')}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </SafeGrid>
              </SafeGrid>
            </CompactSection>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Seção Procurador(es) */}
        <CompactSectionContainer>
          <SectionTitle>
            Dados do(s) Procurador(es)
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                select
                size="small"
                value={quantidadeProcuradores}
                onChange={(e) => setQuantidadeProcuradores(Number(e.target.value))}
                SelectProps={{ native: true }}
                sx={{ width: 80 }}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </TextField>
              <Tooltip title="Preencher Manual">
                <IconButton
                  size="small"
                  onClick={() => setProcuradorExpanded(!procuradorExpanded)}
                  sx={actionIconButtonSx}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </SectionTitle>

          {/* Seleção de Empresas */}
          {empresas.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#666', mb: 1, display: 'block' }}>
                Selecione uma empresa cadastrada:
              </Typography>
              <Box
                ref={empresasContainerRef}
                sx={{
                  display: 'flex',
                  gap: 1,
                  overflowX: 'auto',
                  pb: 1,
                }}
              >
                {empresas.slice((empresasPagina - 1) * empresasPorPagina, empresasPagina * empresasPorPagina).map(empresa => (
                  <EmpresaCard
                    key={empresa.id}
                    empresa={empresa}
                    isSelected={empresaSelecionada?.id === empresa.id}
                    onSelect={selecionarEmpresa}
                    onEdit={(emp, e) => {
                      e.stopPropagation();
                      setEmpresaParaEditar(emp);
                      setEmpresaEditDialogOpen(true);
                    }}
                    onDelete={(emp, e) => {
                      e.stopPropagation();
                      setEmpresaParaExcluir(emp);
                      setEmpresaDeleteDialogOpen(true);
                    }}
                  />
                ))}
              </Box>
              
              {/* Paginação */}
              {empresas.length > empresasPorPagina && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => setEmpresasPagina(prev => Math.max(1, prev - 1))}
                    disabled={empresasPagina === 1}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                    {empresasPagina} / {Math.ceil(empresas.length / empresasPorPagina)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setEmpresasPagina(prev => Math.min(Math.ceil(empresas.length / empresasPorPagina), prev + 1))}
                    disabled={empresasPagina >= Math.ceil(empresas.length / empresasPorPagina)}
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}

          {/* Campos do procurador */}
          <Collapse in={procuradorExpanded}>
            {Array.from({ length: quantidadeProcuradores }).map((_, index) => {
              const suffix = index === 0 ? '' : (index + 1).toString();
              return (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Procurador {index + 1}
                  </Typography>
                  <SafeGrid container spacing={2}>
                    <SafeGrid item xs={12}>
                      <TextField
                        label="Nome Completo"
                        name={`nomeProcurador${suffix}`}
                        value={(newItem as any)[`nomeProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `nomeProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={6}>
                      <TextField
                        label="CPF"
                        name={`cpfProcurador${suffix}`}
                        value={formatCpfCnpj((newItem as any)[`cpfProcurador${suffix}`] || '')}
                        onChange={(e) => handleInputChange(e, `cpfProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={6}>
                      <TextField
                        label="RG"
                        name={`rgProcurador${suffix}`}
                        value={(newItem as any)[`rgProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `rgProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={6}>
                      <TextField
                        label="Nacionalidade"
                        name={`nacionalidadeProcurador${suffix}`}
                        value={(newItem as any)[`nacionalidadeProcurador${suffix}`] || 'brasileiro'}
                        onChange={(e) => handleInputChange(e, `nacionalidadeProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={6}>
                      <TextField
                        label="Estado Civil"
                        name={`estadoCivilProcurador${suffix}`}
                        value={(newItem as any)[`estadoCivilProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `estadoCivilProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12}>
                      <TextField
                        label="Profissão"
                        name={`profissaoProcurador${suffix}`}
                        value={(newItem as any)[`profissaoProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `profissaoProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={4}>
                      <TextField
                        label="CEP"
                        name={`cepProcurador${suffix}`}
                        value={(newItem as any)[`cepProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `cepProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={8}>
                      <TextField
                        label="Endereço"
                        name={`enderecoProcurador${suffix}`}
                        value={(newItem as any)[`enderecoProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `enderecoProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={4}>
                      <TextField
                        label="Bairro"
                        name={`complementoProcurador${suffix}`}
                        value={(newItem as any)[`complementoProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `complementoProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={5}>
                      <TextField
                        label="Município"
                        name={`municipioProcurador${suffix}`}
                        value={(newItem as any)[`municipioProcurador${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `municipioProcurador${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                    <SafeGrid item xs={12} sm={3}>
                      <TextField
                        label="Estado"
                        name={`estadoProcuradorEnd${suffix}`}
                        value={(newItem as any)[`estadoProcuradorEnd${suffix}`] || ''}
                        onChange={(e) => handleInputChange(e, `estadoProcuradorEnd${suffix}` as keyof Item)}
                        fullWidth
                        size="small"
                        sx={textFieldSx}
                      />
                    </SafeGrid>
                  </SafeGrid>
                </Box>
              );
            })}
          </Collapse>
        </CompactSectionContainer>

        <Divider sx={{ my: 2 }} />

        {/* Seção Assinatura */}
        <CompactSectionContainer>
          <SectionTitle>
            Assinatura Digital
            <Tooltip title="Expandir">
              <IconButton
                size="small"
                onClick={() => setAssinaturaExpanded(!assinaturaExpanded)}
                sx={actionIconButtonSx}
              >
                {assinaturaExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            </Tooltip>
          </SectionTitle>

          <Collapse in={assinaturaExpanded}>
            <SignatureContainer>
              <SignaturePad
                onSave={(signature: string) => {
                  setNewItem(prev => ({ ...prev, signature }));
                }}
              />
            </SignatureContainer>
          </Collapse>
        </CompactSectionContainer>

        <Divider sx={{ my: 2 }} />

        {/* Preview do documento */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Visualização do Documento
          </Typography>
          <ProcuracaoPreview
            newItem={newItem}
            modoJuridico={modoJuridico}
            signature={newItem.signature}
          />
        </Box>

        {/* Botão de enviar */}
        <SubmitButton
          fullWidth
          onClick={handleAddItem}
          disabled={isSubmitting || isLoading || !newItem.id}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
        >
          {isSubmitting ? 'Enviando...' : 'Gerar e Enviar Procuração'}
        </SubmitButton>
      </FormContainer>

      {/* FAB para adicionar empresa */}
      <StyledFab onClick={() => setEmpresaDialogOpen(true)}>
        <Tooltip title="Cadastrar Empresa">
          <Add />
        </Tooltip>
      </StyledFab>

      {/* Dialogs */}
      <CameraDialog
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      <CropDialog
        open={cropOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropOpen(false)}
        onCropComplete={handleCropComplete}
      />

      {/* Dialog de exclusão de empresa */}
      <Dialog open={empresaDeleteDialogOpen} onClose={() => setEmpresaDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a empresa "{empresaParaExcluir?.nomeEmpresa}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmpresaDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={async () => {
              if (!empresaParaExcluir) return;
              try {
                const colecao = new Colecao();
                await colecao.excluir('empresasProcuracao', empresaParaExcluir.id);
                setEmpresas(prev => prev.filter(e => e.id !== empresaParaExcluir.id));
                if (empresaSelecionada?.id === empresaParaExcluir.id) {
                  setEmpresaSelecionada(null);
                }
                setEmpresaDeleteDialogOpen(false);
                setEmpresaParaExcluir(null);
              } catch (error) {
                console.error('Erro ao excluir empresa:', error);
                alert('Erro ao excluir empresa.');
              }
            }}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </RootContainer>
  );
};

export default ListPost;
