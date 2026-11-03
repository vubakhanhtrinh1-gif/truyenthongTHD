import React, { useEffect, useState } from 'react';
import { sourceRepository } from '../../repositories';
import { Source } from '../../types';
import { BookOpen, Check, ExternalLink } from 'lucide-react';

interface Props {
  selectedSourceIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
}

export const SourceSelector: React.FC<Props> = ({
  selectedSourceIds = [],
  onChange,
  label = 'Nguồn tư liệu đối chiếu (Source Attribution)',
}) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sourceRepository.getAll().then((data) => {
      setSources(data);
      setLoading(false);
    });
  }, []);

  const toggleSource = (id: string) => {
    if (selectedSourceIds.includes(id)) {
      onChange(selectedSourceIds.filter((sId) => sId !== id));
    } else {
      onChange([...selectedSourceIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          {label} ({selectedSourceIds.length} đã chọn)
        </label>
        <span className="text-[11px] text-zinc-400">
          Gán nguồn để đảm bảo tính xác thực lịch sử
        </span>
      </div>

      {loading ? (
        <div className="text-xs text-zinc-500 py-2">Đang tải danh mục nguồn tư liệu...</div>
      ) : sources.length === 0 ? (
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400">
          Chưa có nguồn tư liệu nào trong hệ thống. Hãy thêm nguồn tư liệu trước tại mục{' '}
          <span className="text-cyan-400 font-medium">Nguồn tư liệu</span>.
        </div>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
          {sources.map((src) => {
            const isSelected = selectedSourceIds.includes(src.id);
            return (
              <div
                key={src.id}
                onClick={() => toggleSource(src.id)}
                className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-colors text-xs ${
                  isSelected
                    ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200'
                    : 'bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800/60 text-zinc-300'
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-zinc-950'
                      : 'border-zinc-700 bg-zinc-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{src.title}</span>
                    {src.referenceCode && (
                      <span className="text-[10px] font-mono px-1 py-0.2 bg-zinc-800 rounded text-cyan-400">
                        {src.referenceCode}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {src.organization || src.author ? `${src.author} • ${src.organization}` : src.type}
                  </div>
                </div>

                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-500 hover:text-cyan-400 p-1"
                    title="Mở liên kết nguồn"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
