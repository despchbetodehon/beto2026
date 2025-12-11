// Utilitários para formatação de dados

/**
 * Formata CPF ou CNPJ
 */
export const formatCpfCnpj = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 11) {
    // CPF: 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) => {
      return [p1, p2, p3].filter(Boolean).join('.') + (p4 ? `-${p4}` : '');
    });
  } else {
    // CNPJ: 00.000.000/0000-00
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, p1, p2, p3, p4, p5) => {
      return `${p1}.${p2}.${p3}/${p4}-${p5}`;
    });
  }
};

/**
 * Valida se é CPF ou CNPJ válido (apenas tamanho)
 */
export const isValidCpfCnpj = (value: string): boolean => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 11 || cleaned.length === 14;
};

/**
 * Formata CEP
 */
export const formatCep = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.replace(/(\d{5})(\d{0,3})/, '$1-$2');
};

/**
 * Formata telefone
 */
export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 10) {
    // Fixo: (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    // Celular: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
};

/**
 * Formata data de DD/MM/YYYY para Date
 */
export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Tenta DD/MM/YYYY
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime()) ? null : date;
  }
  
  // Tenta YYYY-MM-DD
  if (dateStr.includes('-')) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }
  
  return null;
};

/**
 * Formata data para DD/MM/YYYY
 */
export const formatDateBR = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Converte texto para maiúsculas
 */
export const toUpperCase = (value: string): string => {
  return value.toUpperCase();
};

/**
 * Remove caracteres especiais de uma string
 */
export const sanitizeString = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9\s-]/g, '');
};

/**
 * Gera ID aleatório de 8 dígitos
 */
export const generateRandomId = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

/**
 * Gera assinatura única para arquivo
 */
export const getFileSignature = (file: File): string => {
  return `${file.name}|${file.size}|${file.lastModified}`;
};

/**
 * Remove arquivos duplicados baseado na assinatura
 */
export const uniqueFiles = (files: File[]): File[] => {
  const seen = new Set<string>();
  return files.filter(file => {
    const sig = getFileSignature(file);
    if (seen.has(sig)) return false;
    seen.add(sig);
    return true;
  });
};

/**
 * Extrai CEP de um endereço string
 */
export const extractCepFromAddress = (address: string): string | null => {
  if (!address) return null;
  const cepMatch = address.match(/(\d{5})-?(\d{3})/);
  return cepMatch ? cepMatch[0].replace('-', '') : null;
};
