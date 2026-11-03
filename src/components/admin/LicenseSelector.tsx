import React, { useEffect, useState } from 'react';
import { licenseRepository } from '../../repositories';
import { License } from '../../types';
import { ShieldCheck, Sparkles, Check } from 'lucide-react';

interface Props {
  selectedLicenseIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
}

export const LicenseSelector: React.FC<Props> = ({
  selectedLicenseIds = [],
  onChange,
  label = 'Bản quyền & Công bố AI (License & AI Disclosure)',
}) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    licenseRepository.getAll().then((data) => {
      setLicenses(data);
      setLoading(false);
    });
  }, []);

  const toggleLicense = (id: string) => {
    if (selectedLicenseIds.includes(id)) {
      onChange(selectedLicenseIds.filter((lId) => lId !== id));
    } else {
      onChange([...selectedLicenseIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          {label} ({selectedLicenseIds.length} đã chọn)
        </label>
        <span className="text-[11px] text-zinc-400">Minh bạch bản quyền & nội dung do AI tạo</span>
      </div>

      {loading ? (
        <div className="text-xs text-zinc-500 py-2">Đang tải danh mục bản quyền...</div>
      ) : licenses.length === 0 ? (
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400">
          Chưa có hồ sơ bản quyền nào. Hãy tạo hồ sơ tại mục{' '}
          <span className="text-cyan-400 font-medium">Bản quyền & AI</span>.
        </div>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
          {licenses.map((lic) => {
            const isSelected = selectedLicenseIds.includes(lic.id);
            return (
              <div
                key={lic.id}
                onClick={() => toggleLicense(lic.id)}
                className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-colors text-xs ${
                  isSelected
                    ? 'bg-purple-950/40 border border-purple-500/40 text-purple-200'
                    : 'bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800/60 text-zinc-300'
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
                    isSelected
                      ? 'bg-purple-500 border-purple-400 text-zinc-950'
                      : 'border-zinc-700 bg-zinc-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{lic.assetName}</span>
                    <span className="text-[10px] px-1 py-0.2 bg-zinc-800 rounded text-zinc-300">
                      {lic.licenseType}
                    </span>
                    {lic.aiGenerated && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded-full font-mono">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI ({lic.aiTool || 'GenAI'})
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    Tác giả: {lic.creator || 'Chưa rõ'} • Loại: {lic.assetType}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
