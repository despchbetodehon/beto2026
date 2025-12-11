// Hook para gerenciamento de upload de arquivos

import { useState, useRef, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/logic/firebase/config/app';

interface UseFileUploadReturn {
  uploadFiles: (files: File[], folder: string, placa?: string) => Promise<string[]>;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const uploadCacheRef = useRef(new Map<string, string>());

  // Gera uma assinatura única para o arquivo
  const fileSig = (f: File) => `${f.name}|${f.size}|${f.lastModified}`;

  // Remove arquivos duplicados
  const uniqueFiles = (arr: File[]) => {
    const seen = new Set<string>();
    return arr.filter(f => {
      const k = fileSig(f);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  const uploadFiles = useCallback(async (files: File[], folder: string, placa?: string): Promise<string[]> => {
    const toUpload = uniqueFiles(files);
    if (toUpload.length === 0) return [];

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const uploadPromises = toUpload.map(async (file, index) => {
        const k = fileSig(file);
        const cached = uploadCacheRef.current.get(k);
        if (cached) return cached;

        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
        const fileName = `${timestamp}-${sanitizedName}`;
        const storageRef = ref(storage, `uploads/${folder}/${fileName}`);

        const metadata = {
          contentType: file.type,
          customMetadata: {
            'originalName': file.name,
            'uploadedAt': new Date().toISOString(),
            'placa': placa || 'sem-placa',
            'fileSignature': k
          }
        };

        const snap = await uploadBytes(storageRef, file, metadata);
        const url = await getDownloadURL(snap.ref);
        uploadCacheRef.current.set(k, url);

        // Atualizar progresso
        setProgress(((index + 1) / toUpload.length) * 100);

        return url;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload';
      console.error('Erro ao fazer upload:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadFiles, isUploading, progress, error };
}

export default useFileUpload;
