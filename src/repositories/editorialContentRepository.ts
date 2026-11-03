/**
 * Repository for Editorial Content Records
 * Manages Layer 1 (Text) & Layer 2 (Files) in Firestore collection 'editorial_contents'
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { StoredEditorialContent } from '../types/contentRegistry';
import { handleFirestoreError, OperationType } from '../services/errorHandler';
import { sanitizeFirestorePayload } from '../services/firestoreSanitizer';

const COLLECTION_NAME = 'editorial_contents';

export const editorialContentRepository = {
  /**
   * Get single editorial content by ID
   */
  async getContent(contentId: string): Promise<StoredEditorialContent | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, contentId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as StoredEditorialContent;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${COLLECTION_NAME}/${contentId}`);
      return null;
    }
  },

  /**
   * Get all stored editorial content items
   */
  async getAllContent(): Promise<StoredEditorialContent[]> {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StoredEditorialContent));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  /**
   * Save or update an editorial content item directly to Firestore
   * Defense-in-depth: Deeply sanitizes payload to guarantee zero `undefined` values.
   */
  async saveContent(
    contentId: string,
    data: Partial<StoredEditorialContent>,
    adminUid?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, contentId);
      const now = new Date().toISOString();
      const rawPayload: Record<string, any> = {
        ...data,
        contentId,
        id: contentId,
        updatedAt: now,
        ...(adminUid ? { updatedBy: adminUid } : {}),
      };

      const sanitizedPayload = sanitizeFirestorePayload(rawPayload);
      await setDoc(docRef, sanitizedPayload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${contentId}`);
      throw err;
    }
  },

  /**
   * Subscribe to real-time updates for a single content item
   */
  subscribeContent(
    contentId: string,
    onUpdate: (data: StoredEditorialContent | null) => void,
    onError?: (err: any) => void
  ): () => void {
    const docRef = doc(db, COLLECTION_NAME, contentId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          onUpdate(null);
        } else {
          onUpdate({ id: snap.id, ...snap.data() } as StoredEditorialContent);
        }
      },
      (err) => {
        console.warn(`Realtime subscription error for ${contentId}:`, err);
        if (onError) onError(err);
      }
    );
  },

  /**
   * Subscribe to real-time updates for all editorial content items
   */
  subscribeAll(
    onUpdate: (data: StoredEditorialContent[]) => void,
    onError?: (err: any) => void
  ): () => void {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as StoredEditorialContent));
        onUpdate(items);
      },
      (err) => {
        console.warn(`Realtime subscription error for all editorial contents:`, err);
        if (onError) onError(err);
      }
    );
  },

  /**
   * Subscribe to real-time updates for editorial content items in a specific room
   */
  subscribeByRoom(
    roomId: string,
    onUpdate: (data: StoredEditorialContent[]) => void,
    onError?: (err: any) => void
  ): () => void {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as StoredEditorialContent))
          .filter(
            (item) =>
              item.roomId === roomId ||
              item.contentId?.startsWith(`${roomId}.`) ||
              item.id?.startsWith(`${roomId}.`)
          );
        onUpdate(items);
      },
      (err) => {
        console.warn(`Realtime subscription error for room ${roomId}:`, err);
        if (onError) onError(err);
      }
    );
  },
};
