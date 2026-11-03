import React from 'react';
import { GratitudeEssayData } from '../config/memoryContentData';
import { X, BookOpen, Heart, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface Props {
  essay: GratitudeEssayData;
  isOpen: boolean;
  onClose: () => void;
  onOpenCmd?: () => void;
}

export function EssayReadingModal({ essay, isOpen, onClose, onOpenCmd }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#FFFDF8] border-2 border-[#CBA45B] rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6 text-[#2B303A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-[#CBA45B]/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#1B263B] text-[11px] font-mono font-bold text-[#F4D58B]">
                VĂN BIA TRI ÂN TRUYỀN THỐNG 60 NĂM
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#9C2A2A] tracking-wide pt-1">
              {essay.title}
            </h2>
            <p className="text-xs text-[#7A6242] italic font-serif">
              {essay.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#FAF5EA] border border-[#CBA45B]/40 hover:border-[#CBA45B] text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
            title="Đóng bảng đọc (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Decorative Lotus Medallion Bar */}
        <div className="flex items-center justify-center gap-3 text-[#CBA45B]">
          <div className="h-0.5 w-16 sm:w-32 bg-gradient-to-r from-transparent to-[#CBA45B]" />
          <Heart className="w-4 h-4 fill-[#CBA45B]" />
          <Sparkles className="w-4 h-4" />
          <Heart className="w-4 h-4 fill-[#CBA45B]" />
          <div className="h-0.5 w-16 sm:w-32 bg-gradient-to-l from-transparent to-[#CBA45B]" />
        </div>

        {/* Full Essay Body Text */}
        <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed text-[#2B303A] text-justify px-2 sm:px-4">
          {essay.paragraphs.map((p, idx) => (
            <p key={idx} className="indent-6 sm:indent-8 first:indent-0">
              {p}
            </p>
          ))}
        </div>

        {/* Closing & Signoff */}
        <div className="pt-6 border-t border-[#CBA45B]/30 text-center space-y-2">
          <p className="font-serif font-bold italic text-lg sm:text-xl text-[#9C2A2A]">
            {essay.closing}
          </p>
          <p className="text-xs sm:text-sm font-sans font-medium text-[#7A6242]">
            {essay.signoff}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Nội dung quản lý & cập nhật trực tiếp qua CMD Admin</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCmd && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCmd();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#1B263B] hover:bg-[#283854] text-[#F4D58B] border border-[#CBA45B]/60 transition-all cursor-pointer shadow-sm"
                title="Mở bảng điều khiển Quản trị CMD để cập nhật nội dung văn bia"
              >
                <Shield className="w-3.5 h-3.5 text-[#F4D58B]" />
                <span>Chỉnh sửa văn bia (CMD)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#9C2A2A] to-[#CBA45B] hover:from-[#7D2121] hover:to-[#B68E46] transition-all cursor-pointer shadow-md font-serif"
            >
              Đã đọc xong • Về phòng 3D
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
