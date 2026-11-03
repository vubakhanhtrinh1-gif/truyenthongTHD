import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  currentOrder: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onDirectChange?: (newVal: number) => void;
}

export const OrderControl: React.FC<Props> = ({
  currentOrder,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}) => {
  return (
    <div className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-700/60 rounded px-1.5 py-0.5">
      <span className="text-xs font-mono font-bold text-zinc-300 w-6 text-center">
        #{currentOrder}
      </span>
      <div className="flex flex-col">
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="text-zinc-400 hover:text-cyan-400 disabled:opacity-20 p-0.5"
            title="Đẩy lên trên"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="text-zinc-400 hover:text-cyan-400 disabled:opacity-20 p-0.5"
            title="Đẩy xuống dưới"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
