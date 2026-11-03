import React, { useState } from 'react';
import { Lock, X, Loader2, AlertCircle, Terminal, ExternalLink, ChevronDown, ChevronUp, Wrench, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAuthDiagnostics, AuthConfigurationError, AuthorizationError } from '../../services/authService';
import { useSchoolBranding } from '../../services/brandingService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CmdLoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithPassword, user, isAdmin, authStatus } = useAuth();
  const { branding } = useSchoolBranding();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);
  const [isAuthzError, setIsAuthzError] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  if (!isOpen) return null;

  const diagnostics = getAuthDiagnostics(user, isAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsConfigError(false);
    setIsAuthzError(false);

    if (!password) {
      setErrorMessage('Mật khẩu không chính xác.');
      return;
    }

    setLoading(true);
    try {
      await loginWithPassword(password);
      setPassword('');
      // Only execute success callback if login was truly authenticated & authorized
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      if (err instanceof AuthConfigurationError || err.code === 'auth/operation-not-allowed') {
        setIsConfigError(true);
        setErrorMessage(
          'Tính năng đăng nhập Email/Password chưa được kích hoạt trong Firebase Console của dự án. Vui lòng bật "Email/Password" trong mục Authentication > Sign-in method.'
        );
      } else if (err instanceof AuthorizationError) {
        setIsAuthzError(true);
        setErrorMessage(
          err.message || 'Tài khoản đã xác thực thành công nhưng chưa được cấp quyền Quản trị viên (ADMIN) trên Firestore.'
        );
      } else {
        setErrorMessage(err.message || 'Mật khẩu không chính xác.');
      }
    } finally {
      setLoading(false);
    }
  };

  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${diagnostics.projectId}/authentication/providers`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5 text-zinc-100">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 p-0.5 flex items-center justify-center flex-shrink-0">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Huy hiệu Trường THPT A Trần Hưng Đạo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono">
                QUẢN TRỊ HỆ THỐNG
              </h2>
              <div className="text-[10px] text-zinc-500 font-mono">THPT A TRẦN HƯNG ĐẠO</div>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Error Alert (Specific for Firebase Auth Provider Setup) */}
        {isConfigError && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 space-y-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-semibold block text-amber-300">Yêu cầu kích hoạt Email/Password Provider:</strong>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  {errorMessage}
                </p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-amber-900/60 text-[11px] space-y-1 font-mono text-amber-300/80">
              <div>1. Mở Firebase Console dự án <strong>{diagnostics.projectId}</strong></div>
              <div>2. Vào <strong>Authentication &gt; Sign-in method</strong></div>
              <div>3. Bật <strong>Email/Password</strong> &gt; Lưu (Save)</div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={firebaseConsoleUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/70 hover:bg-amber-800 text-amber-100 font-medium text-[11px] transition-colors"
              >
                <span>Mở Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsConfigError(false);
                  setErrorMessage(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] transition-colors cursor-pointer"
              >
                Đã kích hoạt, thử lại
              </button>
            </div>
          </div>
        )}

        {/* Authorization / Credential Error */}
        {!isConfigError && errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Single Password Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Mật khẩu quản trị
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl transition-all shadow-lg shadow-cyan-950 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </div>
        </form>

        {/* Developer Diagnostics Panel (Shown in dev mode only) */}
        {import.meta.env.DEV && (
          <div className="pt-2 border-t border-zinc-900 text-left">
            <button
              type="button"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="flex items-center justify-between w-full text-[10px] font-mono text-zinc-500 hover:text-zinc-400 transition-colors py-1"
            >
              <div className="flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-cyan-500" />
                <span>DEV DIAGNOSTICS ({authStatus})</span>
              </div>
              {showDiagnostics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showDiagnostics && (
              <div className="mt-2 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1">
                <div>Firebase Project: <strong className="text-zinc-200">{diagnostics.projectId}</strong></div>
                <div>ADMIN_EMAIL configured: <strong className="text-zinc-200">{diagnostics.adminEmailConfigured ? 'YES' : 'NO'}</strong></div>
                <div>Auth Status: <span className="text-cyan-400">{authStatus}</span></div>
                <div>Current UID: <span className="text-zinc-300">{diagnostics.currentUserUid || '(null)'}</span></div>
                <div>Is Admin: <span className={diagnostics.isAdmin ? 'text-emerald-400' : 'text-amber-400'}>{diagnostics.isAdmin ? 'TRUE' : 'FALSE'}</span></div>
                {diagnostics.lastErrorCode && (
                  <div className="text-red-400">Last Code: {diagnostics.lastErrorCode}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
