/**
 * Firebase Client Initialization
 * COSMIC HERITAGE – DẤU ẤN 60 NĂM
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with explicit databaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Initialize Firebase Storage with explicit bucket reference and bounded retry limits
const storageBucketUrl = firebaseConfig.storageBucket
  ? (firebaseConfig.storageBucket.startsWith('gs://')
      ? firebaseConfig.storageBucket
      : `gs://${firebaseConfig.storageBucket}`)
  : undefined;

export const storage = getStorage(app, storageBucketUrl);
storage.maxUploadRetryTime = 5000; // 5s timeout instead of 120s default
storage.maxOperationRetryTime = 5000;
export const firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;

/**
 * Validate Firestore connection
 * Conforms to Firebase Skill handshake standard
 */
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    // Handshake with Firestore server via test/connection
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach Cloud Firestore backend'))) {
      console.warn('Firestore is operating in offline mode.');
      return false;
    }
    // Any permission error still indicates a successful connection to the server
    return true;
  }
}

export default app;
