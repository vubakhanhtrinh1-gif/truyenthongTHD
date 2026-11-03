import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Settings, Globe, Shield } from 'lucide-react';
import { siteSettingsRepository } from '../../repositories';
import { SiteSettings } from '../../types';
import { DEFAULT_SITE_SETTINGS } from '../../data/initialSeedData';

export const SiteSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    ...DEFAULT_SITE_SETTINGS,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    siteSettingsRepository
      .getSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await siteSettingsRepository.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu cấu hình.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-xs text-zinc-400 py-12 text-center">Đang tải cấu hình dự án...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-3 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Cài đặt chung Dự án (Site Settings)</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Lưu trữ cấu hình toàn cục của dự án số Cosmic Heritage. Dữ liệu được bảo toàn độc lập với
          giao diện hiển thị.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-900 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>Đã lưu thành công các cài đặt vào Firestore!</span>
          </div>
        )}

        {/* Section 1: Branding & Concept */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            1. Định vị Thương hiệu & Khái niệm Dự án
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Tiêu đề Dự án (Project Title)
              </label>
              <input
                type="text"
                value={settings.projectTitle || ''}
                onChange={(e) => handleChange('projectTitle', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Tiêu đề phụ (Project Subtitle)
              </label>
              <input
                type="text"
                value={settings.projectSubtitle || ''}
                onChange={(e) => handleChange('projectSubtitle', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Khẩu hiệu / Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-zinc-500">
                Chuẩn: &quot;60 năm – một điểm tựa, một quỹ đạo tương lai.&quot;
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Tên trường chính thức (School Name)
              </label>
              <input
                type="text"
                value={settings.schoolName || ''}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Multilingual & Language */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>2. Đa ngôn ngữ (Multilingual Readiness)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Ngôn ngữ mặc định
              </label>
              <select
                value={settings.defaultLanguage || 'vi'}
                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="vi">Tiếng Việt (vi)</option>
                <option value="en">English (en)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Các ngôn ngữ hỗ trợ
              </label>
              <div className="flex items-center gap-3 pt-2 text-xs text-zinc-300">
                <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-700 rounded-md font-mono">
                  vi (Tiếng Việt)
                </span>
                <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-700 rounded-md font-mono">
                  en (English)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Thông điệp chào mừng (Tiếng Việt)
              </label>
              <textarea
                rows={2}
                value={settings.welcomeMessageVi || ''}
                onChange={(e) => handleChange('welcomeMessageVi', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Thông điệp chào mừng (English)
              </label>
              <textarea
                rows={2}
                value={settings.welcomeMessageEn || ''}
                onChange={(e) => handleChange('welcomeMessageEn', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & System Mode */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>3. Thông tin Liên hệ & Chế độ Vận hành</span>
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Thông tin liên hệ chính thức (Contact Information)
            </label>
            <input
              type="text"
              value={settings.contactInformation || ''}
              onChange={(e) => handleChange('contactInformation', e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500"
              placeholder="Email: REPLACE_WITH_OFFICIAL_SCHOOL_EMAIL | Điện thoại: ..."
            />
            <span className="text-[11px] text-zinc-500">
              Cung cấp địa chỉ email/số điện thoại liên hệ chính thức của nhà trường.
            </span>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={!!settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-cyan-500 focus:ring-cyan-500/20 bg-zinc-900"
              />
              <div>
                <span className="font-semibold text-zinc-200">
                  Bật chế độ bảo trì hệ thống (Maintenance Mode)
                </span>
                <p className="text-[11px] text-zinc-500">
                  Khi bật, khách tham quan bên ngoài sẽ thấy thông báo bảo trì, chỉ có Quản trị viên
                  được truy cập CMS.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl transition-all shadow-lg shadow-cyan-950 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu cài đặt...' : 'Lưu cài đặt dự án'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
