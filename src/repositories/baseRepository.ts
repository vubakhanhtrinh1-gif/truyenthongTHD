/**
 * Base Repository for Firestore Entities
 * Provides strongly-typed CRUD, subscriptions, and standardized error handling
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { handleFirestoreError, OperationType } from '../services/errorHandler';
import { VerificationStatus } from '../types';
import { sanitizeFirestorePayload } from '../services/firestoreSanitizer';

export interface QueryOptions {
  publishedOnly?: boolean;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

export class BaseRepository<T extends { id: string; createdAt?: string; updatedAt?: string; isPublished?: boolean; verificationStatus?: VerificationStatus; displayOrder?: number }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollectionRef() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    try {
      let q = query(this.getCollectionRef());

      if (options?.publishedOnly) {
        q = query(q, where('isPublished', '==', true));
      }

      if (options?.orderByField) {
        q = query(q, orderBy(options.orderByField, options.orderDirection || 'asc'));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, this.collectionName);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as T;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${this.collectionName}/${id}`);
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, customId?: string): Promise<T> {
    const id = customId || doc(this.getCollectionRef()).id;
    const now = new Date().toISOString();
    const rawPayload = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const payload = sanitizeFirestorePayload(rawPayload);

    try {
      await setDoc(this.getDocRef(id), payload);
      return payload as unknown as T;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `${this.collectionName}/${id}`);
    }
  }

  async update(id: string, updates: Partial<T>): Promise<void> {
    const now = new Date().toISOString();
    const rawPayload = {
      ...updates,
      updatedAt: now,
    };
    const payload = sanitizeFirestorePayload(rawPayload);

    try {
      await updateDoc(this.getDocRef(id), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${this.collectionName}/${id}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(this.getDocRef(id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${this.collectionName}/${id}`);
    }
  }

  async togglePublish(id: string, currentStatus: boolean): Promise<void> {
    await this.update(id, { isPublished: !currentStatus } as unknown as Partial<T>);
  }

  async updateVerification(id: string, status: VerificationStatus): Promise<void> {
    await this.update(id, { verificationStatus: status } as unknown as Partial<T>);
  }

  async updateOrder(id: string, displayOrder: number): Promise<void> {
    await this.update(id, { displayOrder } as unknown as Partial<T>);
  }

  subscribe(
    onUpdate: (items: T[]) => void,
    onError?: (error: Error) => void,
    options?: QueryOptions
  ): () => void {
    let q = query(this.getCollectionRef());

    if (options?.publishedOnly) {
      q = query(q, where('isPublished', '==', true));
    }

    if (options?.orderByField) {
      q = query(q, orderBy(options.orderByField, options.orderDirection || 'asc'));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        onUpdate(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, this.collectionName);
      }
    );
  }
}
