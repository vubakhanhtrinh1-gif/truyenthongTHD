/**
 * Authentication and Admin Authorization Service
 * COSMIC HERITAGE – DẤU ẤN 60 NĂM
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO (1966–2026)
 */
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  updatePassword as firebaseUpdatePassword,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AdminUser } from '../types';

export const ADMIN_EMAIL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL) ||
  'vubakhanhtrinh30102009@gmail.com'
).trim();
export const BOOTSTRAP_ADMIN_EMAIL = ADMIN_EMAIL;

export class AuthConfigurationError extends Error {
  code = 'auth/operation-not-allowed';
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigurationError';
  }
}

export class CredentialError extends Error {
  code = 'auth/invalid-credential';
  constructor(message: string = 'Mật khẩu không chính xác.') {
    super(message);
    this.name = 'CredentialError';
  }
}

export class AuthorizationError extends Error {
  code = 'auth/unauthorized-admin';
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export interface AdminAuthResult {
  isAdmin: boolean;
  adminProfile?: AdminUser;
  error?: string;
  errorCode?: string;
}

export interface AuthDiagnosticInfo {
  firebaseInitialized: boolean;
  projectId: string;
  adminEmailConfigured: boolean;
  adminEmail: string;
  currentUserUid: string | null;
  currentUserEmail: string | null;
  isAdmin: boolean;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
}

let lastDiagnosticCode: string | null = null;
let lastDiagnosticMessage: string | null = null;

function logAuth(stage: string, detail?: any) {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.log(`[AUTH] ${stage}`, detail ? JSON.stringify(detail) : '');
  }
}

export function getAuthDiagnostics(currentUser: User | null, isAdmin: boolean): AuthDiagnosticInfo {
  return {
    firebaseInitialized: !!auth && !!auth.app,
    projectId: auth.app?.options?.projectId || 'unknown',
    adminEmailConfigured: !!ADMIN_EMAIL && ADMIN_EMAIL.includes('@'),
    adminEmail: ADMIN_EMAIL,
    currentUserUid: currentUser?.uid || null,
    currentUserEmail: currentUser?.email || null,
    isAdmin,
    lastErrorCode: lastDiagnosticCode,
    lastErrorMessage: lastDiagnosticMessage,
  };
}

/**
 * CMD Password-Only Authentication
 * Strictly follows requirements:
 * - Administrator enters ONLY password in the CMD UI.
 * - System uses internal configured ADMIN_EMAIL with Firebase Authentication.
 * - Differentiates CREDENTIAL FAILURE from AUTH CONFIGURATION FAILURE from AUTHORIZATION FAILURE.
 * - Automatically bootstraps initial admin user when valid password is used.
 * - Never leaks or logs the password.
 */
export async function loginWithPasswordOnly(password: string): Promise<User> {
  logAuth('CMD password submit');
  lastDiagnosticCode = null;
  lastDiagnosticMessage = null;

  if (!password || password.trim() === '') {
    lastDiagnosticCode = 'auth/empty-password';
    lastDiagnosticMessage = 'Mật khẩu trống';
    throw new CredentialError('Mật khẩu không được để trống.');
  }

  if (!ADMIN_EMAIL || !ADMIN_EMAIL.includes('@')) {
    lastDiagnosticCode = 'auth/missing-admin-email';
    lastDiagnosticMessage = 'ADMIN_EMAIL is not configured';
    logAuth('ADMIN_EMAIL configured: false');
    throw new AuthConfigurationError(
      'Hệ thống chưa được cấu hình ADMIN_EMAIL hợp lệ. Vui lòng kiểm tra biến ADMIN_EMAIL.'
    );
  }

  logAuth('ADMIN_EMAIL configured: true', { email: ADMIN_EMAIL });
  logAuth('Firebase sign-in started');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    logAuth('Firebase sign-in result: success', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });
    return userCredential.user;
  } catch (err: any) {
    const code = err.code || 'unknown';
    logAuth('Firebase sign-in result: failure', { code, message: err.message });
    lastDiagnosticCode = code;
    lastDiagnosticMessage = err.message;

    // 1. Firebase Auth Provider Disabled
    if (code === 'auth/operation-not-allowed') {
      const projectId = auth.app?.options?.projectId || 'gen-lang-client-0730324164';
      throw new AuthConfigurationError(
        `Phương thức đăng nhập Email/Password chưa được kích hoạt trong Firebase Console cho dự án "${projectId}". Vui lòng truy cập Firebase Console > Authentication > Sign-in method và bật "Email/Password".`
      );
    }

    // 2. Incorrect credentials / user not found
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password' ||
      code === 'auth/invalid-email'
    ) {
      throw new CredentialError('Mật khẩu không chính xác.');
    }

    // 3. Rate limiting / account lock
    if (code === 'auth/too-many-requests') {
      throw new Error(
        'Tài khoản tạm thời bị giới hạn do nhập sai mật khẩu nhiều lần. Vui lòng đợi vài phút rồi thử lại.'
      );
    }

    // 4. Network connectivity
    if (code === 'auth/network-request-failed') {
      throw new Error('Không thể kết nối đến máy chủ xác thực Firebase. Vui lòng kiểm tra kết nối mạng.');
    }

    // Default error
    throw new CredentialError(err.message || 'Mật khẩu không chính xác.');
  }
}

/**
 * Sign in using Firebase Authentication with Email and Password
 */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
}

/**
 * Sign out current administrator
 */
export async function logout(): Promise<void> {
  logAuth('Administrator logout requested');
  await firebaseSignOut(auth);
}

/**
 * Check if the authenticated user is an authorized administrator
 */
export async function verifyAdminStatus(user: User | null): Promise<AdminAuthResult> {
  if (!user) {
    return { isAdmin: false };
  }

  logAuth('Admin authorization check started', { uid: user.uid, email: user.email });

  const normalizedUserEmail = user.email?.toLowerCase().trim() || '';
  const normalizedAdminEmail = ADMIN_EMAIL.toLowerCase().trim();
  const isMasterAdminEmail = normalizedUserEmail === normalizedAdminEmail;

  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    // Timeout wrapper to prevent hanging when Firestore connection is slow/offline
    const snap = (await Promise.race([
      getDoc(adminDocRef),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore authorization check timeout')), 3500)
      ),
    ])) as any;

    if (snap && snap.exists()) {
      const data = snap.data() as AdminUser;
      if (data.role === 'ADMIN' && data.isActive !== false) {
        logAuth('Admin authorization result: success (document verified)', { uid: user.uid });
        return { isAdmin: true, adminProfile: { ...data, id: snap.id } };
      }
      logAuth('Admin authorization result: failure (account inactive or role mismatch)');
      return {
        isAdmin: false,
        errorCode: 'ADMIN_INACTIVE',
        error: 'Tài khoản quản trị đã bị vô hiệu hóa hoặc không có quyền.',
      };
    }

    // If user's authenticated email matches configured master admin email:
    // provision their admin record in Firestore and grant access
    if (isMasterAdminEmail) {
      logAuth('Master admin document absent, creating profile');
      const now = new Date().toISOString();
      const newAdmin: AdminUser = {
        id: user.uid,
        uid: user.uid,
        email: user.email || ADMIN_EMAIL,
        role: 'ADMIN',
        displayName: user.displayName || 'Ban Quản Trị Hệ Thống',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      try {
        await setDoc(adminDocRef, newAdmin);
      } catch (writeErr) {
        console.warn('Could not persist admin profile to Firestore, falling back to memory profile:', writeErr);
      }
      logAuth('Admin authorization result: success (admin profile confirmed)');
      return { isAdmin: true, adminProfile: newAdmin };
    }

    // Other authenticated users without admin document are strictly rejected!
    logAuth('Admin authorization result: failure (not in admins collection and not master admin email)');
    return {
      isAdmin: false,
      errorCode: 'NOT_AUTHORIZED_ADMIN',
      error: 'Tài khoản đã xác thực nhưng không nằm trong danh sách Quản trị viên (ADMIN) được cấp quyền.',
    };
  } catch (err: any) {
    console.error('Error verifying admin authorization:', err);
    logAuth('Admin authorization check encountered error', { message: err?.message });

    // Fallback: only if user's authenticated email matches configured master admin email
    if (isMasterAdminEmail) {
      logAuth('Admin authorization result: granted via verified master admin email');
      return {
        isAdmin: true,
        adminProfile: {
          id: user.uid,
          uid: user.uid,
          email: user.email || ADMIN_EMAIL,
          role: 'ADMIN',
          displayName: user.displayName || 'Ban Quản Trị Hệ Thống',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // Non-admin users are strictly denied on any Firestore error or timeout
    return {
      isAdmin: false,
      errorCode: 'UNAUTHORIZED_OR_PERMISSION_ERROR',
      error: 'Không thể xác thực quyền Quản trị viên: ' + (err?.message || 'Quyền hạn bị từ chối.'),
    };
  }
}

/**
 * Change administrator password via Firebase Authentication
 */
export async function changeAdminPassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Chưa đăng nhập.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
  }
  await firebaseUpdatePassword(auth.currentUser, newPassword);
}

/**
 * Bootstrap or register a new admin account
 */
export async function createAdminAccount(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const now = new Date().toISOString();
  const adminData: AdminUser = {
    id: credential.user.uid,
    uid: credential.user.uid,
    email: email.trim(),
    role: 'ADMIN',
    displayName: displayName.trim() || email.split('@')[0],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, 'admins', credential.user.uid), adminData);
  return credential.user;
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return firebaseOnAuthStateChanged(auth, callback);
}
