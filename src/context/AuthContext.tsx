/**
 * Auth Context Provider
 * Manages admin authentication state, RBAC status, and prevents redirect loops
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AdminUser } from '../types';
import {
  subscribeToAuthState,
  loginWithEmail,
  loginWithPasswordOnly,
  logout as authLogout,
  verifyAdminStatus,
  AuthorizationError,
  AuthConfigurationError,
} from '../services/authService';

export type AuthState =
  | 'INITIALIZING'
  | 'UNAUTHENTICATED'
  | 'AUTHENTICATED_NON_ADMIN'
  | 'AUTHENTICATED_ADMIN';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  authStatus: AuthState;
  authError: string | null;
  errorType: 'credential' | 'config' | 'authorization' | 'network' | null;
  login: (email: string, pass: string) => Promise<void>;
  loginWithPassword: (pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authStatus, setAuthStatus] = useState<AuthState>('INITIALIZING');
  const [authError, setAuthError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<
    'credential' | 'config' | 'authorization' | 'network' | null
  >(null);

  const checkStatus = async (currentUser: User | null) => {
    if (!currentUser) {
      setUser(null);
      setAdminProfile(null);
      setIsAdmin(false);
      setAuthStatus('UNAUTHENTICATED');
      setLoading(false);
      return;
    }

    setUser(currentUser);
    const result = await verifyAdminStatus(currentUser);
    setIsAdmin(result.isAdmin);
    setAdminProfile(result.adminProfile || null);

    if (result.isAdmin) {
      setAuthStatus('AUTHENTICATED_ADMIN');
      setAuthError(null);
      setErrorType(null);
    } else {
      setAuthStatus('AUTHENTICATED_NON_ADMIN');
      if (result.error) {
        setAuthError(result.error);
        setErrorType('authorization');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      await checkStatus(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setAuthError(null);
    setErrorType(null);
    try {
      const loggedUser = await loginWithEmail(email, pass);
      await checkStatus(loggedUser);
    } catch (err: any) {
      setLoading(false);
      let message = 'Đăng nhập không thành công.';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        message = 'Email hoặc mật khẩu không chính xác.';
        setErrorType('credential');
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Tính năng đăng nhập bằng Email/Password chưa được bật trong Firebase Console.';
        setErrorType('config');
      } else {
        message = err.message || message;
      }
      setAuthError(message);
      throw err;
    }
  };

  const loginWithPassword = async (pass: string) => {
    setAuthError(null);
    setErrorType(null);
    try {
      const loggedUser = await loginWithPasswordOnly(pass);
      setUser(loggedUser);
      const authResult = await verifyAdminStatus(loggedUser);

      if (!authResult.isAdmin) {
        // Immediately destroy session if user is not an authorized admin
        await authLogout();
        setUser(null);
        setIsAdmin(false);
        setAdminProfile(null);
        setAuthStatus('UNAUTHENTICATED');
        setErrorType('authorization');
        const errMessage =
          authResult.error ||
          'Tài khoản đã xác thực nhưng không nằm trong danh sách Quản trị viên (ADMIN) được cấp quyền.';
        setAuthError(errMessage);
        throw new AuthorizationError(errMessage);
      }

      setIsAdmin(true);
      setAdminProfile(authResult.adminProfile || null);
      setAuthStatus('AUTHENTICATED_ADMIN');
    } catch (err: any) {
      if (err instanceof AuthConfigurationError) {
        setErrorType('config');
      } else if (err instanceof AuthorizationError) {
        setErrorType('authorization');
      } else {
        setErrorType('credential');
      }
      const message = err.message || 'Mật khẩu không chính xác.';
      setAuthError(message);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
      setAdminProfile(null);
      setIsAdmin(false);
      setAuthStatus('UNAUTHENTICATED');
      setAuthError(null);
      setErrorType(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshAdminStatus = async () => {
    if (user) {
      setLoading(true);
      await checkStatus(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        isAdmin,
        loading,
        authStatus,
        authError,
        errorType,
        login,
        loginWithPassword,
        logout,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
