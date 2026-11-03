import React, { useState } from 'react';
import { X, Save, AlertCircle, Sparkles, Globe2 } from 'lucide-react';
import { VerificationStatus } from '../../types';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { ImageGalleryManager } from './ImageGalleryManager';
import { SourceSelector } from './SourceSelector';
import { LicenseSelector } from './LicenseSelector';

export interface FormFieldDef {
  name: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'boolean'
    | 'gallery'
    | 'sources'
    | 'licenses'
    | 'verification'
    | 'bilingual_text'
    | 'bilingual_textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  placeholderEn?: string;
  helpText?: string;
}

interface Props {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  fields: FormFieldDef[];
  initialData?: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void> | void;
  onClose: () => void;
  isSaving?: boolean;
}

export const ContentFormModal: React.FC<Props> = ({
  isOpen,
  title,
  subtitle,
  fields,
  initialData = {},
  onSave,
  onClose,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => ({
    isPublished: true,
    verificationStatus: 'unverified',
    displayOrder: 1,
    ...initialData,
  }));
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate required fields
    for (const field of fields) {
      if (field.required) {
        if (field.type === 'bilingual_text' || field.type === 'bilingual_textarea') {
          const viVal = formData[`${field.name}Vi`];
          if (!viVal || String(viVal).trim() === '') {
            setFormError(`Vui lòng điền nội dung Tiếng Việt cho "${field.label}".`);
            return;
          }
        } else {
          const val = formData[field.name];
          if (val === undefined || val === null || String(val).trim() === '') {
            setFormError(`Vui lòng nhập trường "${field.label}".`);
            return;
          }
        }
      }
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi lưu dữ liệu vào Firestore.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                Heritage Core CMS
              </span>
            </h3>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher for Bilingual Fields */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setActiveLangTab('vi')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeLangTab === 'vi'
                    ? 'bg-cyan-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Tiếng Việt (VI)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeLangTab === 'en'
                    ? 'bg-cyan-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                English (EN)
              </button>
            </div>

            <button
              onClick={onClose}
              disabled={isSaving}
              className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {formError && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* Top Status & Verification Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Thẩm định tư liệu lịch sử
              </label>
              <VerificationStatusBadge
                status={formData.verificationStatus || 'unverified'}
                interactive={true}
                onChange={(s: VerificationStatus) => handleChange('verificationStatus', s)}
              />
              <span className="block text-[11px] text-zinc-500 mt-1">
                Chỉ đánh dấu &apos;Đã xác minh&apos; khi có căn cứ nguồn chuẩn.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Trạng thái hiển thị
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.isPublished}
                    onChange={(e) => handleChange('isPublished', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 text-cyan-500 focus:ring-cyan-500/20 bg-zinc-900"
                  />
                  <span>Công khai cho khách tham quan</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                value={formData.displayOrder ?? 1}
                onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
                className="w-24 px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="space-y-4">
            {fields.map((field) => {
              if (field.type === 'bilingual_text') {
                const viKey = `${field.name}Vi`;
                const enKey = `${field.name}En`;
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      {field.label}{' '}
                      {field.required && <span className="text-red-400">*</span>}
                      <span className="text-zinc-500 text-[11px] font-normal ml-2">
                        ({activeLangTab === 'vi' ? 'Tiếng Việt' : 'English'})
                      </span>
                    </label>

                    {activeLangTab === 'vi' ? (
                      <input
                        type="text"
                        value={formData[viKey] || ''}
                        onChange={(e) => handleChange(viKey, e.target.value)}
                        placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()} (Tiếng Việt)...`}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[enKey] || ''}
                        onChange={(e) => handleChange(enKey, e.target.value)}
                        placeholder={field.placeholderEn || `Enter ${field.label.toLowerCase()} in English...`}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                      />
                    )}
                    {field.helpText && (
                      <p className="text-[11px] text-zinc-500">{field.helpText}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'bilingual_textarea') {
                const viKey = `${field.name}Vi`;
                const enKey = `${field.name}En`;
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      {field.label}{' '}
                      {field.required && <span className="text-red-400">*</span>}
                      <span className="text-zinc-500 text-[11px] font-normal ml-2">
                        ({activeLangTab === 'vi' ? 'Tiếng Việt' : 'English'})
                      </span>
                    </label>

                    {activeLangTab === 'vi' ? (
                      <textarea
                        rows={4}
                        value={formData[viKey] || ''}
                        onChange={(e) => handleChange(viKey, e.target.value)}
                        placeholder={field.placeholder || `Nhập nội dung Tiếng Việt...`}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-y"
                      />
                    ) : (
                      <textarea
                        rows={4}
                        value={formData[enKey] || ''}
                        onChange={(e) => handleChange(enKey, e.target.value)}
                        placeholder={field.placeholderEn || `Enter content in English...`}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-y"
                      />
                    )}
                    {field.helpText && (
                      <p className="text-[11px] text-zinc-500">{field.helpText}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">-- Chọn {field.label} --</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {field.helpText && (
                      <p className="text-[11px] text-zinc-500">{field.helpText}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'number') {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="number"
                      value={formData[field.name] ?? ''}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value ? parseInt(e.target.value) : undefined)
                      }
                      placeholder={field.placeholder}
                      className="w-full sm:w-48 px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    {field.helpText && (
                      <p className="text-[11px] text-zinc-500">{field.helpText}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'text') {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                    {field.helpText && (
                      <p className="text-[11px] text-zinc-500">{field.helpText}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <textarea
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-y"
                    />
                    {field.helpText && (
                      <p className="text-[11px] text-zinc-500">{field.helpText}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'boolean') {
                return (
                  <div key={field.name} className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`cb_${field.name}`}
                      checked={!!formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 text-cyan-500 focus:ring-cyan-500/20 bg-zinc-900"
                    />
                    <label
                      htmlFor={`cb_${field.name}`}
                      className="text-xs font-medium text-zinc-300 cursor-pointer"
                    >
                      {field.label}
                    </label>
                    {field.helpText && (
                      <span className="text-[11px] text-zinc-500">({field.helpText})</span>
                    )}
                  </div>
                );
              }

              if (field.type === 'gallery') {
                return (
                  <div key={field.name} className="pt-2">
                    <ImageGalleryManager
                      images={formData.imageGallery || []}
                      onChange={(imgs) => handleChange('imageGallery', imgs)}
                      label={field.label}
                    />
                  </div>
                );
              }

              if (field.type === 'sources') {
                return (
                  <div key={field.name} className="pt-2">
                    <SourceSelector
                      selectedSourceIds={formData.sourceIds || []}
                      onChange={(ids) => handleChange('sourceIds', ids)}
                      label={field.label}
                    />
                  </div>
                );
              }

              if (field.type === 'licenses') {
                return (
                  <div key={field.name} className="pt-2">
                    <LicenseSelector
                      selectedLicenseIds={formData.licenseIds || []}
                      onChange={(ids) => handleChange('licenseIds', ids)}
                      label={field.label}
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg transition-all shadow-lg shadow-cyan-950/40 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang lưu vào Firestore...' : 'Lưu bản ghi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
