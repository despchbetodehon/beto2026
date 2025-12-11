// Consolidated Services Factory Pattern
import { Transacao, Requerimento, Procuracao, Chamado } from '@/types/entities';
import { ApiResponse } from '@/types/entities';

// Base Service Class
export abstract class BaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(filters?: Record<string, any>): Promise<T[]> {
    const query = new URLSearchParams(filters || {});
    const response = await fetch(`${this.endpoint}?${query}`);
    if (!response.ok) throw new Error('Erro ao buscar dados');
    const data: ApiResponse<T[]> = await response.json();
    return data.data || [];
  }

  async getById(id: string): Promise<T> {
    const response = await fetch(`${this.endpoint}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar item');
    const data: ApiResponse<T> = await response.json();
    if (!data.data) throw new Error('Item não encontrado');
    return data.data;
  }

  async create(item: Partial<T>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Erro ao criar item');
    const data: ApiResponse<T> = await response.json();
    if (!data.data) throw new Error('Erro ao salvar');
    return data.data;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Erro ao atualizar item');
    const data: ApiResponse<T> = await response.json();
    if (!data.data) throw new Error('Erro ao salvar');
    return data.data;
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar item');
  }
}

// Specialized Services
export class FinancasService extends BaseService<Transacao> {
  constructor() {
    super('/api/financas');
  }

  async getByPeriod(dataInicio: Date, dataFim: Date): Promise<Transacao[]> {
    const query = new URLSearchParams({
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
    });
    return this.getAll(Object.fromEntries(query));
  }

  async getSummary(): Promise<{
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
  }> {
    const response = await fetch(`${this.endpoint}/resumo`);
    if (!response.ok) throw new Error('Erro ao buscar resumo');
    const data = await response.json();
    return data.data;
  }

  async exportToPDF(): Promise<Blob> {
    const response = await fetch(`${this.endpoint}/export/pdf`);
    if (!response.ok) throw new Error('Erro ao exportar');
    return response.blob();
  }
}

export class RequerimentoService extends BaseService<Requerimento> {
  constructor() {
    super('/api/requerimentos');
  }

  async getByStatus(status: string): Promise<Requerimento[]> {
    return this.getAll({ status });
  }

  async uploadDocuments(id: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetch(`${this.endpoint}/${id}/documentos`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Erro ao fazer upload');
    const data = await response.json();
    return data.data || [];
  }

  async changeStatus(id: string, newStatus: string): Promise<Requerimento> {
    return this.update(id, { status: newStatus } as any);
  }
}

export class ProcuracaoService extends BaseService<Procuracao> {
  constructor() {
    super('/api/procuracoes');
  }

  async sign(id: string, signature: string): Promise<Procuracao> {
    return this.update(id, { signature } as any);
  }

  async generateDocument(id: string): Promise<Blob> {
    const response = await fetch(`${this.endpoint}/${id}/gerar-documento`);
    if (!response.ok) throw new Error('Erro ao gerar documento');
    return response.blob();
  }
}

export class ChamadoService extends BaseService<Chamado> {
  constructor() {
    super('/api/chamados');
  }

  async getMyTickets(): Promise<Chamado[]> {
    return this.getAll({ meus: true });
  }

  async assignTo(id: string, userId: string): Promise<Chamado> {
    return this.update(id, { atribuidoA: userId } as any);
  }

  async addComment(id: string, comment: string): Promise<void> {
    const response = await fetch(`${this.endpoint}/${id}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentario: comment }),
    });
    if (!response.ok) throw new Error('Erro ao adicionar comentário');
  }
}

// Services Factory
export class ServiceFactory {
  private static services: Map<string, BaseService<any>> = new Map();

  static getFinancasService(): FinancasService {
    if (!this.services.has('financas')) {
      this.services.set('financas', new FinancasService());
    }
    return this.services.get('financas') as FinancasService;
  }

  static getRequerimentoService(): RequerimentoService {
    if (!this.services.has('requerimento')) {
      this.services.set('requerimento', new RequerimentoService());
    }
    return this.services.get('requerimento') as RequerimentoService;
  }

  static getProcuracaoService(): ProcuracaoService {
    if (!this.services.has('procuracao')) {
      this.services.set('procuracao', new ProcuracaoService());
    }
    return this.services.get('procuracao') as ProcuracaoService;
  }

  static getChamadoService(): ChamadoService {
    if (!this.services.has('chamado')) {
      this.services.set('chamado', new ChamadoService());
    }
    return this.services.get('chamado') as ChamadoService;
  }
}

// Export para uso fácil
export const financasService = ServiceFactory.getFinancasService();
export const requerimentoService = ServiceFactory.getRequerimentoService();
export const procuracaoService = ServiceFactory.getProcuracaoService();
export const chamadoService = ServiceFactory.getChamadoService();
