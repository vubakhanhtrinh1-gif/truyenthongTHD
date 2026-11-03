import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  KeyRound,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { adminRepository } from '../../repositories';
import { AdminUser } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { changeAdminPassword, createAdminAccount } from '../../services/authService';

export const AdminManagementView: React.FC = () => {
  const { user, adminProfile } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Add new admin state
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [createAdminSuccess, setCreateAdminSuccess] = useState(false);
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      const data = await adminRepository.getAll();
      setAdmins(data);
    } catch (e) {
      console.warn('Could not load admins list:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(false);

    if (newPassword.length < 6) {
      setPasswordChangeError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeAdminPassword(newPassword);
      setPasswordChangeSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordChangeSuccess(false), 4000);
    } catch (err: any) {
      setPasswordChangeError(err.message || 'Không thể đổi mật khẩu. Vui lòng đăng nhập lại rồi thử lại.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAdminError(null);
    setCreateAdminSuccess(false);

    if (!newAdminEmail.includes('@')) {
      setCreateAdminError('Địa chỉ email không hợp lệ.');
      return;
    }
    if (newAdminPassword.length < 6) {
      setCreateAdminError('Mật khẩu quản trị viên mới phải có ít nhất 6 ký tự.');
      return;
    }

    setIsCreatingAdmin(true);
    try {
      await createAdminAccount(newAdminEmail, newAdminPassword, newAdminName);
      setCreateAdminSuccess(true);
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');
      await fetchAdmins();
      setTimeout(() => {
        setCreateAdminSuccess(false);
        setShowAddAdmin(false);
      }, 3000);
    } catch (err: any) {
      setCreateAdminError(err.message || 'Lỗi khi tạo tài khoản quản trị viên mới.');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const toggleAdminStatus = async (admin: AdminUser) => {
    try {
      await adminRepository.update(admin.id, { isActive: !admin.isActive });
      await fetchAdmins();
    } catch (err) {
      console.error('Error toggling admin status:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-3 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <span>Quản trị viên & Phân quyền Hệ thống (RBAC)</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Quản lý tài khoản quản trị có thẩm quyền. Phân tách rõ ràng giữa xác thực (Firebase Auth) và
          phân quyền quản trị (Firestore Rules).
        </p>
      </div>

      {/* Handover Notice */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-300 space-y-1">
        <div className="font-semibold flex items-center gap-1.5 text-cyan-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Bảo mật & Bàn giao Nhà trường</span>
        </div>
        <p className="text-zinc-300">
          Mật khẩu ban đầu được quản lý trực tiếp bằng Firebase Authentication. Không có thời hạn hết hạn
          tự động ở tầng ứng dụng. Nhà trường có thể chủ động đổi mật khẩu hoặc thêm cán bộ quản trị viên
          mới bất kỳ lúc nào tại đây.
        </p>
      </div>

      {/* Admin List */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
              Danh sách Quản trị viên được ủy quyền ({admins.length})
            </h3>
            <p className="text-[11px] text-zinc-400">
              Chỉ các tài khoản có bản ghi trong bảng này mới có quyền ghi dữ liệu vào Firestore.
            </p>
          </div>

          <button
            onClick={() => setShowAddAdmin(!showAddAdmin)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showAddAdmin ? 'Đóng biểu mẫu' : 'Thêm Quản trị viên'}</span>
          </button>
        </div>

        {/* Add Admin Form */}
        {showAddAdmin && (
          <form
            onSubmit={handleCreateAdmin}
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-700/80 space-y-3 animate-in fade-in"
          >
            <h4 className="text-xs font-bold text-cyan-400">Tạo tài khoản Quản trị viên mới</h4>

            {createAdminError && (
              <div className="p-2.5 rounded bg-red-950/40 border border-red-900 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{createAdminError}</span>
              </div>
            )}

            {createAdminSuccess && (
              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-900 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã tạo và kích hoạt thành công Quản trị viên mới!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Email trường / cán bộ</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@namdinh.edu.vn"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Tên hiển thị / Ban phụ trách</label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Thầy/Cô Ban Lịch Sử"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Mật khẩu ban đầu</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isCreatingAdmin}
                className="px-4 py-1.5 text-xs font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors disabled:opacity-50"
              >
                {isCreatingAdmin ? 'Đang tạo...' : 'Xác nhận tạo Quản trị viên'}
              </button>
            </div>
          </form>
        )}

        {/* Admin Table */}
        <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
          {admins.map((adm) => {
            const isCurrentUser = adm.uid === user?.uid || adm.email === user?.email;
            return (
              <div
                key={adm.id}
                className="p-3.5 flex items-center justify-between hover:bg-zinc-900/40 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400 font-bold">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-100 flex items-center gap-2">
                      <span>{adm.displayName || adm.email}</span>
                      {isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                          Bạn
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">{adm.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                    ROLE: {adm.role}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleAdminStatus(adm)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      adm.isActive !== false
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {adm.isActive !== false ? 'Đang hoạt động' : 'Tạm khóa'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-zinc-100">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Đổi mật khẩu Quản trị viên hiện tại
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Đổi mật khẩu Firebase Authentication trực tiếp cho tài khoản{' '}
          <strong className="text-zinc-200">{user?.email}</strong>.
        </p>

        {passwordChangeError && (
          <div className="p-3 bg-red-950/40 border border-red-900 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordChangeError}</span>
          </div>
        )}

        {passwordChangeSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>Mật khẩu đã được cập nhật thành công trên Firebase Authentication!</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">Mật khẩu mới</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl transition-all shadow-lg shadow-cyan-950 cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isChangingPassword ? 'Đang cập nhật mật khẩu...' : 'Cập nhật mật khẩu'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
