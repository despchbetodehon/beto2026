// Hook para consulta de CPF/CNPJ

import { useState, useCallback } from 'react';

interface CpfCnpjSearchResult {
  nome?: string;
  nascimento?: string;
  nomePai?: string;
  nomeMae?: string;
  rg?: string;
  endereco?: {
    logradouro?: string;
    bairro?: string;
    municipio?: string;
    uf?: string;
    cep?: string;
  };
}

interface UseCpfCnpjSearchReturn {
  search: (doc: string, callback: (data: CpfCnpjSearchResult, tipo: 'cpf' | 'cnpj') => void) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useCpfCnpjSearch(): UseCpfCnpjSearchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (
    doc: string,
    callback: (data: CpfCnpjSearchResult, tipo: 'cpf' | 'cnpj') => void
  ) => {
    const cleaned = doc.replace(/\D/g, '');
    
    if (cleaned.length !== 11 && cleaned.length !== 14) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tipo = cleaned.length === 14 ? 'cnpj' : 'cpf';
      
      console.log(`Iniciando consulta de ${tipo.toUpperCase()}:`, cleaned);

      const response = await fetch(`/api/${tipo}?${tipo}=${cleaned}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Erro ${response.status} ao buscar ${tipo.toUpperCase()}: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`Resposta da consulta de ${tipo.toUpperCase()}:`, data);

      callback(data, tipo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro na consulta CPF/CNPJ:', errorMessage);
      setError(errorMessage);
      
      if (errorMessage.includes('Erro 404')) {
        console.log('Serviço de consulta temporariamente indisponível.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { search, isLoading, error };
}

export default useCpfCnpjSearch;
