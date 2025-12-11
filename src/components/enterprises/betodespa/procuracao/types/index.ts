// Tipos e interfaces para o módulo de Procuração

import { Timestamp } from 'firebase/firestore';

// Interface para o contato do banco de dados
export interface Contact {
  id: string;
  nome: string;
  cpfCnpj: string;
  rg: string;
  nacionalidade: string;
  estadoCivil: string;
  nregistro: string;
  profissao: string;
  endereco: string;
  complemento: string;
  municipio: string;
  estado: string;
  cep: string;
}

// Interface para Procurador da Empresa
export interface ProcuradorEmpresa {
  id: string;
  cpfCnpj: string;
  nome: string;
  rg: string;
  nacionalidade: string;
  estadoCivil: string;
  nregistro: string;
  profissao: string;
  endereco: string;
  complemento: string;
  municipio: string;
  estado: string;
  cep: string;
}

// Interface para Empresa
export interface Empresa {
  id: string;
  nomeEmpresa: string;
  quantidadeProcuradores: number;
  procuradores: ProcuradorEmpresa[];
}

// Interface para props do CompactSection
export interface CompactSectionProps {
  title: string;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManualEdit: () => void;
  processingImage: boolean;
  manualExpanded: boolean;
  children?: React.ReactNode;
  uploadLabel?: string;
  setCameraOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Interface para props do ListPost
export interface ListPostProps {
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  onItemEnviado?: () => void;
}

// Tipo para seções de arquivo
export type FileSectionType = 
  | 'geral' 
  | 'veiculo' 
  | 'proprietario_doc' 
  | 'proprietario_conta' 
  | 'procurador_doc' 
  | 'procurador_conta' 
  | 'empresa_juridico' 
  | 'socio_administrador';

// Tipo para modo de visualização de empresas
export type ModoVisualizacao = 'cards' | 'lista';

// Interface para dados de crop
export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Interface para dados extraídos pela IA
export interface AIExtractedData {
  nome?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  nregistro?: string;
  nacionalidade?: string;
  estadoCivil?: string;
  profissao?: string;
  endereco?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  estado?: string;
  cep?: string;
  dataNascimento?: string;
  nomePai?: string;
  nomeMae?: string;
  placa?: string;
  renavam?: string;
  crv?: string;
  chassi?: string;
  modelo?: string;
  anoFabricacao?: string;
  anoModelo?: string;
  cor?: string;
  combustivel?: string;
  valordevenda?: string;
  rgOrgaoEmissor?: string;
  rgUF?: string;
}

// Interface para estado inicial de contato
export const initialContactState: Contact = {
  id: '',
  nome: '',
  cpfCnpj: '',
  rg: '',
  nacionalidade: 'brasileiro',
  estadoCivil: '',
  profissao: '',
  endereco: '',
  nregistro: '',
  complemento: '',
  municipio: '',
  estado: '',
  cep: ''
};

// Interface para estado inicial de empresa
export const initialEmpresaState: Empresa = {
  id: '',
  nomeEmpresa: '',
  quantidadeProcuradores: 1,
  procuradores: []
};

// Interface para estado inicial de procurador
export const createInitialProcurador = (index: number): ProcuradorEmpresa => ({
  id: `proc-${index + 1}`,
  cpfCnpj: '',
  nome: '',
  rg: '',
  nacionalidade: 'brasileiro',
  estadoCivil: '',
  profissao: '',
  nregistro: '',
  endereco: '',
  complemento: '',
  municipio: '',
  estado: '',
  cep: ''
});
