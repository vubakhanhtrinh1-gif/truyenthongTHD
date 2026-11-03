import React from 'react';
import { Globe, EyeOff } from 'lucide-react';

interface Props {
  isPublished: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const PublishToggle: React.FC<Props> = ({ isPublished, onToggle, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        isPublished
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isPublished ? 'Đang công khai cho khách tham quan' : 'Đang ẩn (chỉ Admin nhìn thấy)'}
    >
      {isPublished ? (
        <>
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Công khai</span>
        </>
      ) : (
        <>
          <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
          <span>Bản nháp</span>
        </>
      )}
    </button>
  );
};
