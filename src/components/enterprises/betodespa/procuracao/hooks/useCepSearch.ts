// Hook para busca de endereço por CEP

import { useCallback } from 'react';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

interface AddressData {
  endereco: string;
  bairro: string;
  municipio: string;
  estado: string;
}

export function useCepSearch() {
  const searchCep = useCallback(async (cep: string): Promise<AddressData | null> => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return null;
    }

    try {
      console.log(`Buscando endereço para CEP: ${cepLimpo}`);

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        console.warn('CEP não encontrado no ViaCEP');
        return null;
      }

      console.log('Dados do ViaCEP:', data);

      return {
        endereco: data.logradouro || '',
        bairro: data.bairro || '',
        municipio: data.localidade || '',
        estado: data.uf || '',
      };
    } catch (error) {
      console.error('Erro ao buscar CEP no ViaCEP:', error);
      return null;
    }
  }, []);

  return { searchCep };
}

export default useCepSearch;
