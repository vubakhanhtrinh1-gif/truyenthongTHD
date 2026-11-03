import React, { useState } from 'react';
import { Lock, Loader2, AlertCircle, ArrowLeft, Terminal, ExternalLink, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAuthDiagnostics, AuthConfigurationError, AuthorizationError } from '../../services/authService';

interface Props {
  onBackToPublic?: () => void;
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onBackToPublic, onSuccess }) => {
  const { loginWithPassword, user, isAdmin, authStatus, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const diagnostics = getAuthDiagnostics(user, isAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsConfigError(false);

    if (!password) {
      setLocalError('Mật khẩu không chính xác.');
      return;
    }

    setSubmitting(true);
    try {
      await loginWithPassword(password);
      setPassword('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err instanceof AuthConfigurationError || err.code === 'auth/operation-not-allowed') {
        setIsConfigError(true);
        setLocalError(
          'Tính năng đăng nhập Email/Password chưa được kích hoạt trong Firebase Console của dự án. Vui lòng bật "Email/Password" trong mục Authentication > Sign-in method.'
        );
      } else if (err instanceof AuthorizationError) {
        setLocalError(
          err.message || 'Tài khoản đã xác thực nhưng chưa được cấp quyền Quản trị viên (ADMIN) trên Firestore.'
        );
      } else {
        setLocalError(err.message || 'Mật khẩu không chính xác.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${diagnostics.projectId}/authentication/providers`;

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm sm:max-w-md relative z-10 space-y-5">
        {/* Back to public link */}
        {onBackToPublic && (
          <button
            onClick={onBackToPublic}
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Không gian Di Sản Số</span>
          </button>
        )}

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/80 text-zinc-100">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
              QUẢN TRỊ HỆ THỐNG (CMD)
            </h2>
          </div>

          {/* Configuration Error Alert */}
          {isConfigError && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-semibold block text-amber-300">Yêu cầu kích hoạt Email/Password Provider:</strong>
                  <p className="text-[11px] leading-relaxed text-amber-200/90">
                    {localError}
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
                    setLocalError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] transition-colors cursor-pointer"
                >
                  Đã kích hoạt, thử lại
                </button>
              </div>
            </div>
          )}

          {/* Regular Credential Error Alert */}
          {!isConfigError && localError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{localError}</span>
            </div>
          )}

          {/* Exactly ONE User Input: Password */}
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
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-zinc-950 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>

          {/* Developer Diagnostics Panel (Shown in dev mode only) */}
          {import.meta.env.DEV && (
            <div className="pt-2 border-t border-zinc-800 text-left">
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
                <div className="mt-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1">
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

          <div className="pt-2 text-[10px] text-zinc-600 text-center font-mono">
            COSMIC HERITAGE • THPT A TRẦN HƯNG ĐẠO (1966 – 2026)
          </div>
        </div>
      </div>
    </div>
  );
};
