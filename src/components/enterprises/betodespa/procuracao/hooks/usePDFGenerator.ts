// Hook para geração de PDF

import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/logic/firebase/config/app';

interface UsePDFGeneratorReturn {
  generatePDF: (elementId: string, placa: string) => Promise<string | null>;
  downloadPDF: (elementId: string, fileName: string) => Promise<void>;
}

export function usePDFGenerator(): UsePDFGeneratorReturn {
  const generatePDF = useCallback(async (elementId: string, placa: string): Promise<string | null> => {
    const input = document.getElementById(elementId);
    if (!input) {
      console.error(`Elemento com id "${elementId}" não encontrado`);
      return null;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Se a altura for maior que uma página A4, dividir em múltiplas páginas
      const pageHeight = 297;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const blob = pdf.output('blob');
      const fileName = `Procuracao_${placa}_${Date.now()}.pdf`;
      const pdfRef = ref(storage, `pdfs/procuracao/${fileName}`);

      await uploadBytes(pdfRef, blob);
      const pdfURL = await getDownloadURL(pdfRef);

      console.log('PDF gerado e enviado:', pdfURL);
      return pdfURL;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return null;
    }
  }, []);

  const downloadPDF = useCallback(async (elementId: string, fileName: string): Promise<void> => {
    const input = document.getElementById(elementId);
    if (!input) {
      console.error(`Elemento com id "${elementId}" não encontrado`);
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      throw error;
    }
  }, []);

  return { generatePDF, downloadPDF };
}

export default usePDFGenerator;
