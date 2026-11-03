import React from 'react';
import { EditorialFieldDefinition } from '../../../types/contentRegistry';
import { HelpCircle } from 'lucide-react';

interface Props {
  fields: EditorialFieldDefinition[];
  values: Record<string, any>;
  onChange: (key: string, val: any) => void;
  disabled?: boolean;
}

export const Layer1TextEditor: React.FC<Props> = ({
  fields,
  values,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200">
        <strong className="block font-semibold mb-1 text-cyan-100">
          📝 LỚP 1: SOẠN THẢO VĂN BẢN (TEXT EDITING LAYER)
        </strong>
        Các trường nội dung dưới đây được đồng bộ trực tiếp tới cơ sở dữ liệu và hiển thị trên không gian triển lãm công chúng. Hỗ trợ đầy đủ tiếng Việt Unicode có dấu.
      </div>

      <div className="grid grid-cols-1 gap-4">
        {fields.map((field) => {
          const val = values[field.key] ?? '';

          return (
            <div
              key={field.key}
              className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 focus-within:border-cyan-500/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <span>{field.labelVi}</span>
                  {field.required && <span className="text-amber-400 font-bold">*</span>}
                </label>
                <span className="text-[10px] font-mono text-zinc-500">{field.key}</span>
              </div>

              {field.helpText && (
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                  <span>{field.helpText}</span>
                </div>
              )}

              {field.type === 'textarea' || field.type === 'string_list' ? (
                <textarea
                  value={val}
                  disabled={disabled}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  rows={field.rows || 4}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700/80 text-zinc-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-y font-sans placeholder:text-zinc-600 disabled:opacity-50"
                />
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={val}
                  disabled={disabled}
                  onChange={(e) => onChange(field.key, Number(e.target.value))}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700/80 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono disabled:opacity-50"
                />
              ) : field.type === 'select' ? (
                <select
                  value={val}
                  disabled={disabled}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700/80 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={val}
                  disabled={disabled}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700/80 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
