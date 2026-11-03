import React from 'react';
import { TeacherItem, MomentItem } from '../config/memoryContentData';
import {
  X,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
  GraduationCap,
  Sparkles,
  Shield,
} from 'lucide-react';

interface Props {
  item: TeacherItem | MomentItem | null;
  type: 'teacher' | 'moment' | null;
  onClose: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onOpenCmd?: () => void;
}

export function PhotoDetailModal({
  item,
  type,
  onClose,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
  onOpenCmd,
}: Props) {
  if (!item || !type) return null;

  const isTeacher = type === 'teacher';
  const teacher = isTeacher ? (item as TeacherItem) : null;
  const moment = !isTeacher ? (item as MomentItem) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#FFFDF8] border-2 border-[#CBA45B] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#2B303A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-[#CBA45B]/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#1B263B] text-[11px] font-mono font-bold text-[#F4D58B]">
                {isTeacher ? 'VÁCH TẢ • NHỮNG NGƯỜI LÁI ĐÒ' : 'VÁCH HỮU • KHOẢNH KHẮC KHÔNG QUÊN'}
              </span>
              <span className="text-xs text-[#7A6242] font-mono">
                {isTeacher ? (teacher?.period ? `Thời kỳ: ${teacher.period}` : 'Trường THPT A Trần Hưng Đạo') : (moment?.schoolYear ? `Năm học: ${moment.schoolYear}` : 'Kỷ niệm thầy trò')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#9C2A2A] tracking-wide pt-1">
              {item.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#FAF5EA] border border-[#CBA45B]/40 hover:border-[#CBA45B] text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
            title="Đóng cửa sổ (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enlarged Photograph Display */}
        <div className="rounded-xl overflow-hidden border-2 border-[#CBA45B]/40 bg-[#F4EDE0] shadow-inner">
          {item.customUrl ? (
            <img
              src={item.customUrl}
              alt={item.title}
              className="w-full max-h-96 object-contain bg-[#172030]"
            />
          ) : (
            <div className="p-8 sm:p-12 text-center space-y-3 bg-[#FAF5EA]">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#CBA45B]/20 flex items-center justify-center text-[#9C2A2A]">
                {isTeacher ? <GraduationCap className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
              </div>
              <h4 className="text-sm font-serif font-bold text-[#9C2A2A]">
                {isTeacher ? teacher?.teacherName || teacher?.title : moment?.title}
              </h4>
              <p className="text-xs text-zinc-500 italic max-w-md mx-auto">
                Tư liệu hình ảnh gốc lưu trữ của Trường THPT A Trần Hưng Đạo. Người quản trị có thể tải lên ảnh chất lượng cao thông qua hệ thống CMD Admin.
              </p>
            </div>
          )}
        </div>

        {/* Structured Metadata Fields */}
        <div className="space-y-4">
          {isTeacher && teacher && (
            <div className="p-4 rounded-xl bg-[#FAF5EA] border-l-4 border-[#CBA45B] space-y-1.5">
              {teacher.teacherName && (
                <div className="text-sm font-bold text-[#9C2A2A] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#CBA45B]" />
                  <span>{teacher.teacherName}</span>
                </div>
              )}
              {teacher.role && (
                <div className="text-xs text-[#6B5432] font-medium">
                  Vai trò / Chức vụ: <strong className="text-[#2B303A]">{teacher.role}</strong>
                </div>
              )}
              {teacher.period && (
                <div className="text-xs text-[#6B5432] font-medium">
                  Thời gian công tác: <strong className="text-[#2B303A]">{teacher.period}</strong>
                </div>
              )}
            </div>
          )}

          {!isTeacher && moment && (
            <div className="p-4 rounded-xl bg-[#FAF5EA] border-l-4 border-[#CBA45B] space-y-1.5">
              <div className="text-sm font-bold text-[#9C2A2A]">
                « {moment.caption} »
              </div>
              {moment.category && (
                <div className="text-xs text-[#6B5432] font-medium">
                  Phân loại: <strong className="text-[#2B303A]">{moment.category}</strong>
                </div>
              )}
              {moment.schoolYear && (
                <div className="text-xs text-[#6B5432] font-medium">
                  Năm học / Mốc thời gian: <strong className="text-[#2B303A]">{moment.schoolYear}</strong>
                </div>
              )}
            </div>
          )}

          {/* Narrative Story / Biography */}
          {(isTeacher ? teacher?.bio : moment?.story) && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7A6242] uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#CBA45B]" />
                <span>{isTeacher ? 'Tiểu Sử & Đóng Góp Sư Phạm' : 'Câu Chuyện & Kỷ Niệm Thầy Trò'}</span>
              </div>
              <p className="text-sm text-[#333A42] leading-relaxed text-justify whitespace-pre-line font-sans">
                {isTeacher ? teacher?.bio : moment?.story}
              </p>
            </div>
          )}
        </div>

        {/* Verification Footer */}
        <div className="pt-4 border-t border-[#CBA45B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Tư liệu truyền thống Trường THPT A Trần Hưng Đạo</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto font-bold">
            XÁC THỰC 100%
          </span>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigatePrev}
              disabled={!hasPrev}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                hasPrev
                  ? 'bg-[#FAF5EA] border-[#CBA45B]/50 text-[#9C2A2A] hover:bg-[#CBA45B]/20'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Khung trước</span>
            </button>
            <button
              onClick={onNavigateNext}
              disabled={!hasNext}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                hasNext
                  ? 'bg-[#FAF5EA] border-[#CBA45B]/50 text-[#9C2A2A] hover:bg-[#CBA45B]/20'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <span>Khung kế tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCmd && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCmd();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#1B263B] hover:bg-[#283854] text-[#F4D58B] border border-[#CBA45B]/60 transition-all cursor-pointer shadow-sm"
                title="Mở bảng điều khiển Quản trị CMD để cập nhật nội dung hoặc ảnh triển lãm này"
              >
                <Shield className="w-3.5 h-3.5 text-[#F4D58B]" />
                <span>Chỉnh sửa (CMD)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#9C2A2A] to-[#CBA45B] hover:from-[#7D2121] hover:to-[#B68E46] transition-all cursor-pointer shadow-md font-serif"
            >
              Quay lại không gian 3D
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
