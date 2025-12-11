// Consolidated Common Types
export interface BaseEntity {
  id: string;
  dataCriacao: Date;
  dataAtualizacao?: Date;
}

export interface Usuario extends BaseEntity {
  nome: string;
  email: string;
  cpf?: string;
  role: 'admin' | 'user' | 'colaborador' | 'empresa';
  ativo: boolean;
  telefone?: string;
  avatar?: string;
}

export interface Transacao extends BaseEntity {
  usuarioId: string;
  valor: number;
  tipo: 'entrada' | 'saída';
  descricao: string;
  categoria?: string;
  status: 'pendente' | 'concluída' | 'cancelada';
}

export interface Requerimento extends BaseEntity {
  usuarioId: string;
  empresaId?: string;
  status: 'pendente' | 'analisando' | 'faltando_doc' | 'concluído' | 'cancelado';
  tipo: string;
  titulo: string;
  descricao?: string;
  valor?: number;
  documentos?: string[];
}

export interface Procuracao extends BaseEntity {
  usuarioId: string;
  dataConclusao?: Date;
  status: 'pendente' | 'processando' | 'concluída' | 'cancelada';
  arquivos?: string[];
}

export interface Chamado extends BaseEntity {
  usuarioId: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'média' | 'alta' | 'crítica';
  status: 'aberto' | 'em_análise' | 'em_progresso' | 'resolvido' | 'fechado';
  atribuidoA?: string;
  anexos?: string[];
}

export interface Empresa extends BaseEntity {
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  usuarios?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}
