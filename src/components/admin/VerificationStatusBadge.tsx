import React from 'react';
import { VerificationStatus } from '../../types';
import { ShieldCheck, AlertCircle, Eye } from 'lucide-react';

interface Props {
  status: VerificationStatus;
  onChange?: (newStatus: VerificationStatus) => void;
  interactive?: boolean;
}

export const VerificationStatusBadge: React.FC<Props> = ({
  status,
  onChange,
  interactive = false,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
          icon: ShieldCheck,
          label: 'Đã xác minh',
          subLabel: 'Tư liệu chuẩn',
        };
      case 'needs_review':
        return {
          bg: 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300',
          icon: Eye,
          label: 'Cần kiểm tra',
          subLabel: 'Chờ đối chiếu',
        };
      case 'unverified':
      default:
        return {
          bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
          icon: AlertCircle,
          label: 'Chưa xác minh',
          subLabel: 'Cần thẩm định',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  if (interactive && onChange) {
    return (
      <div className="relative inline-block">
        <select
          value={status}
          onChange={(e) => onChange(e.target.value as VerificationStatus)}
          className={`appearance-none cursor-pointer text-xs font-medium px-2.5 py-1 pr-6 rounded-full border ${config.bg} focus:outline-none focus:ring-1 focus:ring-emerald-400`}
        >
          <option value="unverified" className="bg-slate-900 text-amber-300">
            ⚠️ Chưa xác minh (Cần thẩm định)
          </option>
          <option value="needs_review" className="bg-slate-900 text-indigo-300">
            🔍 Cần kiểm tra (Chờ đối chiếu)
          </option>
          <option value="verified" className="bg-slate-900 text-emerald-300">
            ✓ Đã xác minh (Tư liệu chuẩn)
          </option>
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-70">
          ▼
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}
      title={config.subLabel}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
