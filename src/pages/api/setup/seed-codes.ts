import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/logic/firebase/config/app';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🌱 Iniciando população de dados...');

    const codigosDeTest = [
      {
        codigo: 'ABC123',
        tipo: 'temporario',
        observacao: 'Teste - Acesso Temporário',
        criadoEm: Timestamp.now(),
        expiraEm: Timestamp.fromDate(new Date(Date.now() + 3 * 60 * 60 * 1000)),
        ativo: true,
      },
      {
        codigo: 'XYZ789',
        tipo: 'permanente',
        observacao: 'Teste - Acesso Permanente',
        criadoEm: Timestamp.now(),
        expiraEm: null,
        ativo: true,
      },
      {
        codigo: 'TEST456',
        tipo: 'temporario',
        observacao: 'Cliente Premium - 3 horas',
        criadoEm: Timestamp.now(),
        expiraEm: Timestamp.fromDate(new Date(Date.now() + 3 * 60 * 60 * 1000)),
        ativo: true,
      },
      {
        codigo: 'PERM001',
        tipo: 'permanente',
        observacao: 'Administrador - Acesso Ilimitado',
        criadoEm: Timestamp.now(),
        expiraEm: null,
        ativo: true,
      },
    ];

    const codigosRef = collection(db, 'CodigosDeAcesso');
    let count = 0;

    for (const codigo of codigosDeTest) {
      try {
        const docRef = await addDoc(codigosRef, codigo);
        console.log(`✅ Código adicionado: ${codigo.codigo} (ID: ${docRef.id})`);
        count++;
      } catch (error) {
        console.error(`❌ Erro ao adicionar ${codigo.codigo}:`, error);
      }
    }

    return res.status(200).json({
      success: true,
      message: `${count} códigos adicionados com sucesso!`,
      count,
      codes: codigosDeTest.map(c => c.codigo),
    });
  } catch (error) {
    console.error('❌ Erro na população de dados:', error);
    return res.status(500).json({
      error: 'Erro ao adicionar códigos',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}
