import React from 'react';
import {
  TimelineMilestone,
  TIMELINE_CHAPTERS,
} from '../config/timelineContentData';
import {
  X,
  Calendar,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface Props {
  milestone: TimelineMilestone | null;
  onClose: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function TimelineMilestoneModal({
  milestone,
  onClose,
  onNavigateNext,
  onNavigatePrev,
  hasNext,
  hasPrev,
}: Props) {
  if (!milestone) return null;

  const currentChapter = TIMELINE_CHAPTERS.find((c) => c.id === milestone.chapterId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141B30]/95 border-2 border-[#CBA45B] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#F0E7D6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-[#CBA45B]/30 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0B1020] border border-[#CBA45B]/50 text-[11px] font-mono font-bold text-[#F4D58B]">
                {milestone.periodLabel}
              </span>
              {currentChapter && (
                <span className="text-xs text-zinc-400 font-mono">
                  • Chương {currentChapter.number}: {currentChapter.titleVi}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4D58B] tracking-wide">
              {milestone.year}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0B1020] border border-[#CBA45B]/40 hover:border-[#CBA45B] text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Đóng bảng tư liệu (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Title */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F0E7D6] leading-snug">
            {milestone.titleVi}
          </h3>
          <p className="text-xs text-[#CBA45B] italic font-serif">
            {milestone.titleEn}
          </p>
        </div>

        {/* Core Concise Summary (Highlighted Quote Box) */}
        <div className="p-4 rounded-xl bg-[#0B1020]/80 border-l-4 border-[#CBA45B] shadow-inner">
          <p className="text-sm sm:text-base font-medium text-[#F4D58B] leading-relaxed">
            « {milestone.summaryVi} »
          </p>
        </div>

        {/* Real historical photograph only if available (Zero empty frames) */}
        {milestone.customUrl && (
          <div className="rounded-xl overflow-hidden border border-[#CBA45B]/40 bg-[#0B1020] p-1.5 shadow-lg">
            <img
              src={milestone.customUrl}
              alt={milestone.titleVi}
              className="w-full max-h-72 object-contain rounded-lg"
            />
            <div className="p-2 text-center text-xs text-zinc-400 italic">
              Ảnh tư liệu lịch sử lưu trữ của Trường THPT A Trần Hưng Đạo
            </div>
          </div>
        )}

        {/* Detailed Historical Narrative */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#CBA45B] uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#F4D58B]" />
            <span>Nội Dung Ghi Chép Chi Tiết</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed text-justify whitespace-pre-line font-sans">
            {milestone.detailVi}
          </p>
        </div>

        {/* Source Citation & Verification Seal */}
        <div className="pt-4 border-t border-[#CBA45B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Nguồn tư liệu: <strong className="text-zinc-300">{milestone.sourceNote}</strong>
            </span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 self-start sm:self-auto">
            XÁC THỰC LỊCH SỬ 100%
          </span>
        </div>

        {/* Bottom Pagination & Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigatePrev}
              disabled={!hasPrev}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                hasPrev
                  ? 'bg-[#0B1020] border-[#CBA45B]/50 text-[#F4D58B] hover:bg-[#CBA45B]/20'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Mốc trước</span>
            </button>
            <button
              onClick={onNavigateNext}
              disabled={!hasNext}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                hasNext
                  ? 'bg-[#0B1020] border-[#CBA45B]/50 text-[#F4D58B] hover:bg-[#CBA45B]/20'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span>Mốc tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#CBA45B] to-[#F4D58B] hover:from-[#F4D58B] hover:to-[#CBA45B] transition-all cursor-pointer shadow-lg font-serif"
          >
            Quay lại không gian 3D
          </button>
        </div>
      </div>
    </div>
  );
}
