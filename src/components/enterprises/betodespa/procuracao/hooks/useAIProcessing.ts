// Hook para processamento de imagens com IA (Gemini)

import { useState, useCallback } from 'react';
import { AIExtractedData } from '../types';

interface UseAIProcessingReturn {
  processImage: (file: File, section: string) => Promise<AIExtractedData | null>;
  isProcessing: boolean;
  error: string | null;
}

export function useAIProcessing(): UseAIProcessingReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPromptForSection = (section: string): string => {
    const prompts: Record<string, string> = {
      veiculo: `Analise este documento de veículo (CRV/CRLV) e extraia TODOS os dados possíveis em JSON, INCLUINDO os dados do PROPRIETÁRIO/VENDEDOR. Procure por:

      DADOS DO VEÍCULO: placa, renavam, chassi, modelo, marca, ano fabricação, ano modelo, cor, combustível, categoria, espécie, valor de venda ou IPVA.

      DADOS DO PROPRIETÁRIO/VENDEDOR: nome completo do proprietário, CPF do proprietário, endereço se houver.

      IMPORTANTE: Extraia "anoFabricacao" e "anoModelo" separadamente. Se houver apenas um ano, use-o para ambos. Para combustível, identifique o tipo (GASOLINA, ALCOOL, FLEX, DIESEL, GNV, etc).

      Formato JSON completo: {"placa": "", "renavam": "", "crv": "", "chassi": "", "modelo": "", "valordevenda": "", "anoFabricacao": "", "anoModelo": "", "cor": "", "combustivel": "", "marca": "", "nomeVendedor": "", "cpfVendedor": "", "enderecoVendedor": ""}`,

      proprietario_doc: `Extraia dados do proprietário em JSON. Para o RG, extraia o NÚMERO COMPLETO DO DOCUMENTO DE IDENTIDADE incluindo o ÓRGÃO EMISSOR e a UF (Unidade Federativa). Exemplos de formato: "1234567 /SSP SC", "9876543 /SSP SP", "5432109 /SSP RJ", "8765432 /PC GO", "2345678 /DETRAN PR". JSON: {"nome": "", "cpf": "", "rg": "", "rgOrgaoEmissor": "", "rgUF": "", "dataNascimento": "", "nomePai": "", "nomeMae": "", "endereco": "", "cep": "", "bairro": "", "municipio": "", "estado": ""}`,

      proprietario_conta: `Analise este comprovante de residência (Conta de Água/Luz) e extraia o endereço completo em JSON. Procure por: logradouro, número, complemento, bairro, município, estado, CEP. Formato: {"endereco": "", "complemento": "", "bairro": "", "municipio": "", "estado": "", "cep": ""}`,

      procurador_doc: `Analise este documento pessoal (RG/CPF/CNH) do procurador e extraia TODOS os dados em JSON. Procure por: nome completo, CPF, RG, nacionalidade, data de nascimento, estado civil, profissão, número de registro. Formato: {"nome": "", "cpf": "", "rg": "", "nregistro": "", "nacionalidade": "", "dataNascimento": "", "estadoCivil": "", "profissao": ""}`,

      procurador_conta: `Analise este comprovante de residência (Conta de Água/Luz) do procurador e extraia o endereço completo em JSON. Procure por: logradouro, número, complemento, bairro, município, estado, CEP. Formato: {"endereco": "", "complemento": "", "bairro": "", "municipio": "", "estado": "", "cep": ""}`,

      empresa_juridico: `Analise este documento empresarial (Cartão CNPJ, Contrato Social ou Comprovante de Inscrição) e extraia TODOS os dados em JSON. Procure especificamente por: CNPJ, razão social, nome fantasia, endereço completo (logradouro, número, complemento, bairro, município, estado, CEP), atividade principal, situação cadastral, data de abertura. Formato: {"cnpj": "", "razaoSocial": "", "nomeFantasia": "", "endereco": "", "bairro": "", "municipio": "", "estado": "", "cep": "", "atividadePrincipal": "", "situacao": "", "dataAbertura": ""}`,

      socio_administrador: `Analise este documento pessoal (RG/CPF/CNH) do sócio administrador e extraia TODOS os dados em JSON. Procure por: nome completo, CPF, RG, nacionalidade, data de nascimento, estado civil, profissão, endereço completo se houver. Formato: {"nome": "", "cpf": "", "rg": "", "nacionalidade": "", "dataNascimento": "", "estadoCivil": "", "profissao": "", "endereco": "", "complemento": "", "municipio": "", "estado": "", "cep": ""}`,

      contato: `Extraia dados pessoais em JSON: {"nome": "", "cpf": "", "cnpj": "", "rg": "", "nregistro": "", "nacionalidade": "", "estadoCivil": "", "profissao": "", "endereco": "", "complemento": "", "bairro": "", "municipio": "", "estado": "", "cep": ""}`,
    };

    return prompts[section] || prompts.contato;
  };

  const processImage = useCallback(async (file: File, section: string): Promise<AIExtractedData | null> => {
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!geminiKey) {
      console.warn('Chave da API Gemini não configurada. Processamento de IA desabilitado.');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Converter arquivo para base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const prompt = getPromptForSection(section);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: file.type, data: base64 } }
              ]
            }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Erro desconhecido');
        throw new Error(`Erro na requisição para IA: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]) as AIExtractedData;
          console.log(`Dados extraídos da seção ${section}:`, data);
          return data;
        }
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar imagem';
      console.error('Erro ao processar imagem com IA:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { processImage, isProcessing, error };
}

export default useAIProcessing;
