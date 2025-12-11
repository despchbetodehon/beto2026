/**
 * Serviço para operações com Firestore
 * Centraliza lógica de dados, melhora testing
 */

import { collection, doc, query, where, getDocs, getDoc, setDoc, updateDoc, deleteDoc, Query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';

export class FirestoreService {
  /**
   * Buscar documentos com filtros
   */
  static async getDocuments<T>(
    collectionName: string,
    constraints?: QueryConstraint[]
  ): Promise<T[]> {
    try {
      const q = constraints
        ? query(collection(db, collectionName), ...constraints)
        : query(collection(db, collectionName));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Buscar documento único
   */
  static async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
    } catch (error) {
      console.error(`Error fetching ${collectionName}/${docId}:`, error);
      throw error;
    }
  }

  /**
   * Criar documento
   */
  static async createDocument<T>(collectionName: string, data: T): Promise<string> {
    try {
      const docRef = doc(collection(db, collectionName));
      await setDoc(docRef, data as any);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Atualizar documento
   */
  static async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data as any);
    } catch (error) {
      console.error(`Error updating ${collectionName}/${docId}:`, error);
      throw error;
    }
  }

  /**
   * Deletar documento
   */
  static async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${collectionName}/${docId}:`, error);
      throw error;
    }
  }
}
