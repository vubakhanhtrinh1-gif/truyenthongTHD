import React from 'react';
import { ColumnDef } from './ContentTable';
import { FormFieldDef } from './ContentFormModal';
import {
  Artifact,
  HistoryPeriod,
  TimelineEvent,
  DevelopmentMilestone,
  Achievement,
  Person,
  Memory,
  NewsEvent,
  DigitalResource,
  Hotspot,
  Source,
  License,
  Credit,
  Room,
} from '../../types';
import { Sparkles, BookOpen, ExternalLink, Image as ImageIcon } from 'lucide-react';

// ==========================================
// 1. ARTIFACTS (REFERENCE CRUD MODULE)
// ==========================================
export const artifactColumns: ColumnDef<Artifact>[] = [
  {
    header: 'Hiện vật',
    accessor: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {item.imageGallery && item.imageGallery[0] ? (
            <img src={item.imageGallery[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-4 h-4 text-zinc-600" />
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-zinc-100 truncate">{item.titleVi}</div>
          <div className="text-[11px] text-zinc-400 truncate">{item.titleEn || item.subtitleVi}</div>
        </div>
      </div>
    ),
  },
  {
    header: 'Phân loại',
    accessor: (item) => {
      const typeLabels: Record<string, string> = {
        medal: '🎖️ Huân/Huy chương',
        certificate: '📜 Bằng khen/Cờ thi đua',
        document: '📑 Văn bản lịch sử',
        photo: '📷 Ảnh tư liệu',
        photo_album: '📚 Album ảnh',
        object: '🏺 Kỷ vật hiện vật',
        other: 'Khác',
      };
      return <span className="text-zinc-300">{typeLabels[item.type] || item.type}</span>;
    },
  },
  {
    header: 'Năm / Thời kỳ',
    accessor: (item) => <span className="font-mono text-zinc-400">{item.year || '—'}</span>,
  },
  {
    header: 'Nguồn đối chiếu',
    accessor: (item) => (
      <span className="text-[11px] text-zinc-400 font-mono">
        {item.sourceIds?.length ? `${item.sourceIds.length} nguồn` : 'Chưa gán'}
      </span>
    ),
  },
];

export const artifactFields: FormFieldDef[] = [
  {
    name: 'type',
    label: 'Loại hiện vật',
    type: 'select',
    required: true,
    options: [
      { value: 'medal', label: 'Huân chương / Huy chương' },
      { value: 'certificate', label: 'Bằng khen / Cờ thi đua / Bằng di tích' },
      { value: 'document', label: 'Văn bản lưu trữ / Quyết định lịch sử' },
      { value: 'photo', label: 'Bức ảnh tư liệu quý' },
      { value: 'photo_album', label: 'Album tư liệu' },
      { value: 'object', label: 'Hiện vật thể khối / Kỷ vật trường xưa' },
      { value: 'other', label: 'Hiện vật khác' },
    ],
  },
  {
    name: 'title',
    label: 'Tên hiện vật',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Ví dụ: Cờ Thi Đua Luân Lưu Năm 1970',
  },
  {
    name: 'subtitle',
    label: 'Phụ đề / Thông tin ngắn',
    type: 'bilingual_text',
    placeholder: 'Ví dụ: Hiện vật do Phòng Truyền thống lưu giữ',
  },
  {
    name: 'year',
    label: 'Năm xác lập / Niên đại',
    type: 'number',
    placeholder: '1970',
  },
  {
    name: 'description',
    label: 'Mô tả chi tiết hiện vật',
    type: 'bilingual_textarea',
    placeholder: 'Mô tả hình dáng, kích thước, chất liệu và ý nghĩa lịch sử...',
  },
  {
    name: 'story',
    label: 'Câu chuyện lịch sử gắn liền',
    type: 'bilingual_textarea',
    placeholder: 'Bối cảnh lịch sử xác thực gắn với hiện vật...',
  },
  {
    name: 'caption',
    label: 'Chú thích trưng bày',
    type: 'bilingual_text',
    placeholder: 'Chú thích ngắn khi hiển thị...',
  },
  {
    name: 'gallery',
    label: 'Hình ảnh hiện vật (Thư viện ảnh)',
    type: 'gallery',
  },
  {
    name: 'sources',
    label: 'Nguồn tư liệu đối chiếu (Authoritative Sources)',
    type: 'sources',
  },
];

// ==========================================
// 2. TIMELINE 1966-2026 (ORBITAL TIMELINE)
// ==========================================
export const timelineColumns: ColumnDef<TimelineEvent>[] = [
  {
    header: 'Năm / Mốc',
    accessor: (item) => (
      <span className="font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded text-xs">
        {item.year}
      </span>
    ),
  },
  {
    header: 'Sự kiện mốc son',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.titleVi}</div>
        <div className="text-[11px] text-zinc-400 truncate max-w-xs">{item.titleEn}</div>
      </div>
    ),
  },
  {
    header: 'Phân loại',
    accessor: (item) => {
      const catLabels: Record<string, string> = {
        foundation: '🏛️ Thành lập',
        war_period: '🛡️ Thời kỳ kháng chiến',
        development: '🏗️ Phát triển & Mở rộng',
        achievement: '🏆 Thành tích lớn',
        milestone: '🚩 Mốc son đổi mới',
        anniversary: '🎉 Kỷ niệm thành lập',
        other: 'Khác',
      };
      return <span className="text-zinc-300">{catLabels[item.category] || item.category}</span>;
    },
  },
  {
    header: 'Nguồn',
    accessor: (item) => (
      <span className="text-[11px] font-mono text-zinc-400">
        {item.sourceIds?.length ? `${item.sourceIds.length} tài liệu` : '—'}
      </span>
    ),
  },
];

export const timelineFields: FormFieldDef[] = [
  {
    name: 'year',
    label: 'Năm sự kiện (1966 – 2026)',
    type: 'number',
    required: true,
    placeholder: '1966',
  },
  {
    name: 'date',
    label: 'Ngày tháng chính xác (nếu có tư liệu)',
    type: 'text',
    placeholder: 'Ví dụ: 15/10/1966 hoặc Tháng 9/1966',
  },
  {
    name: 'category',
    label: 'Phân loại mốc sự kiện',
    type: 'select',
    required: true,
    options: [
      { value: 'foundation', label: 'Thành lập & Khởi dựng' },
      { value: 'war_period', label: 'Thời kỳ kháng chiến & Sơ tán' },
      { value: 'development', label: 'Giai đoạn phát triển & Đổi mới' },
      { value: 'achievement', label: 'Thành tựu xuất sắc & Vinh danh' },
      { value: 'milestone', label: 'Mốc son đặc biệt' },
      { value: 'anniversary', label: 'Đại lễ kỷ niệm' },
      { value: 'other', label: 'Khác' },
    ],
  },
  {
    name: 'title',
    label: 'Tiêu đề sự kiện',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Ví dụ: Thành lập Trường Cấp 3 Trần Hưng Đạo',
  },
  {
    name: 'description',
    label: 'Nội dung chi tiết mốc sự kiện',
    type: 'bilingual_textarea',
    placeholder: 'Nội dung lịch sử xác thực...',
  },
  {
    name: 'gallery',
    label: 'Ảnh tư liệu mốc sự kiện',
    type: 'gallery',
  },
  {
    name: 'sources',
    label: 'Nguồn tư liệu kiểm chứng',
    type: 'sources',
  },
];

// ==========================================
// 3. HISTORY PERIODS
// ==========================================
export const historyColumns: ColumnDef<HistoryPeriod>[] = [
  {
    header: 'Giai đoạn',
    accessor: (item) => (
      <span className="font-mono font-bold text-indigo-400 bg-indigo-950/70 border border-indigo-800/50 px-2 py-0.5 rounded text-xs">
        {item.yearStart} – {item.yearEnd || 'nay'}
      </span>
    ),
  },
  {
    header: 'Tiêu đề giai đoạn',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.titleVi}</div>
        <div className="text-[11px] text-zinc-400">{item.subtitleVi}</div>
      </div>
    ),
  },
  {
    header: 'Tư liệu đính kèm',
    accessor: (item) => (
      <span className="text-[11px] text-zinc-400">
        {item.imageGallery?.length ? `${item.imageGallery.length} ảnh` : '0 ảnh'}
      </span>
    ),
  },
];

export const historyFields: FormFieldDef[] = [
  {
    name: 'title',
    label: 'Tiêu đề giai đoạn',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Ví dụ: Những năm tháng khởi dựng (1966 – 1975)',
  },
  {
    name: 'yearStart',
    label: 'Năm bắt đầu',
    type: 'number',
    required: true,
    placeholder: '1966',
  },
  {
    name: 'yearEnd',
    label: 'Năm kết thúc',
    type: 'number',
    required: true,
    placeholder: '1975',
  },
  {
    name: 'subtitle',
    label: 'Chủ đề tư tưởng / Phụ đề',
    type: 'bilingual_text',
    placeholder: 'Ví dụ: Bền gan vượt khó dưới làn mưa bom bão đạn',
  },
  {
    name: 'description',
    label: 'Tổng quan lịch sử giai đoạn',
    type: 'bilingual_textarea',
  },
  {
    name: 'story',
    label: 'Câu chuyện lịch sử chi tiết',
    type: 'bilingual_textarea',
  },
  {
    name: 'gallery',
    label: 'Thư viện ảnh thời kỳ',
    type: 'gallery',
  },
  {
    name: 'sources',
    label: 'Nguồn tư liệu đối chiếu',
    type: 'sources',
  },
];

// ==========================================
// 4. DEVELOPMENT MILESTONES
// ==========================================
export const developmentColumns: ColumnDef<DevelopmentMilestone>[] = [
  {
    header: 'Thời kỳ',
    accessor: (item) => <span className="font-mono text-zinc-300">{item.period || item.yearStart}</span>,
  },
  {
    header: 'Dấu mốc phát triển',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.titleVi}</div>
        <div className="text-[11px] text-zinc-400 truncate max-w-sm">{item.descriptionVi}</div>
      </div>
    ),
  },
];

export const developmentFields: FormFieldDef[] = [
  {
    name: 'title',
    label: 'Tên dấu mốc / Đột phá',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Ví dụ: Khởi công xây dựng khu giảng đường cao tầng mới',
  },
  {
    name: 'period',
    label: 'Khoảng thời gian / Niên khóa',
    type: 'text',
    placeholder: '1995 – 2000',
  },
  {
    name: 'yearStart',
    label: 'Năm khởi đầu',
    type: 'number',
    required: true,
    placeholder: '1995',
  },
  {
    name: 'yearEnd',
    label: 'Năm hoàn thành (nếu có)',
    type: 'number',
  },
  {
    name: 'description',
    label: 'Mô tả chi tiết quá trình phát triển',
    type: 'bilingual_textarea',
  },
  {
    name: 'gallery',
    label: 'Ảnh cơ sở vật chất / Đội ngũ',
    type: 'gallery',
  },
  {
    name: 'sources',
    label: 'Nguồn tài liệu kiểm chứng',
    type: 'sources',
  },
];

// ==========================================
// 5. ACHIEVEMENTS
// ==========================================
export const achievementColumns: ColumnDef<Achievement>[] = [
  {
    header: 'Hình ảnh',
    accessor: (item) => (
      <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
        {item.imageGallery && item.imageGallery[0] ? (
          <img src={item.imageGallery[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] font-mono text-zinc-500">Chưa tải</span>
        )}
      </div>
    ),
  },
  {
    header: 'Năm / Thời kỳ',
    accessor: (item) => (
      <div>
        <span className="font-mono font-bold text-amber-400">{item.year}</span>
        {item.date && <div className="text-[10px] text-zinc-400 font-mono">{item.date}</div>}
      </div>
    ),
  },
  {
    header: 'Thành tích / Danh hiệu',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
          <span>{item.titleVi}</span>
          {item.featuredInHonorWall && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ĐÀI VINH DANH
            </span>
          )}
        </div>
        <div className="text-[11px] text-zinc-400">{item.titleEn || item.authorityVi}</div>
      </div>
    ),
  },
  {
    header: 'Phân loại',
    accessor: (item) => {
      const catMap: Record<string, string> = {
        labor_medal: '🥇 Huân chương Lao động',
        independence_medal: '⭐ Huân chương Độc lập / Khác',
        prime_minister: '🎖️ Bằng khen Thủ tướng',
        ministry_local: '📜 Bộ ngành & Địa phương',
        other_award: '🏅 Danh hiệu & Khen thưởng khác',
        academic_olympiad: '🏆 Thi HSG Cấp Tỉnh / QG',
        stem_science: '🔬 Sáng tạo KHKT & STEM',
        graduation_exam: '📊 Tốt nghiệp THPT',
        school: 'Toàn trường / Huân chương',
        academic: 'Học sinh Giỏi / Thi QG',
        student: 'Phong trào học sinh',
        science: 'KHKT & Sáng tạo',
        arts: 'Văn hóa nghệ thuật',
        sports: 'Thể dục thể thao',
        youth: 'Đoàn TNCS / Đội',
        other: 'Khác',
      };
      return <span className="text-zinc-300 text-xs">{catMap[item.category] || item.category}</span>;
    },
  },
  {
    header: 'Tư liệu ảnh',
    accessor: (item) => (
      <span className="text-xs font-mono text-zinc-400">
        {item.imageGallery?.length ? `${item.imageGallery.length} ảnh` : '0 ảnh'}
      </span>
    ),
  },
];

export const achievementFields: FormFieldDef[] = [
  {
    name: 'year',
    label: 'Năm trao tặng / Niên khóa',
    type: 'number',
    required: true,
    placeholder: '2026',
    helpText: 'Năm dương lịch chính thức của danh hiệu hoặc niên khóa (ví dụ: 2006, 2026).',
  },
  {
    name: 'date',
    label: 'Ngày tháng / Thời kỳ cụ thể',
    type: 'text',
    placeholder: 'Ví dụ: 15/10/2006 hoặc Năm học 2025–2026',
  },
  {
    name: 'category',
    label: 'Phân loại danh hiệu & thành tích',
    type: 'select',
    required: true,
    options: [
      { value: 'labor_medal', label: 'Huân chương Lao động (Hạng Nhất, Nhì, Ba)' },
      { value: 'independence_medal', label: 'Huân chương Độc lập và các huân chương khác' },
      { value: 'prime_minister', label: 'Bằng khen của Thủ tướng Chính phủ' },
      { value: 'ministry_local', label: 'Khen thưởng của bộ, ngành và địa phương' },
      { value: 'other_award', label: 'Các huân chương, huy chương và hình thức khen thưởng khác' },
      { value: 'academic_olympiad', label: 'Thành tích học sinh giỏi và STEM' },
      { value: 'graduation_exam', label: 'Thành tích tốt nghiệp THPT' },
      { value: 'school', label: 'Danh hiệu truyền thống toàn trường khác' },
    ],
  },
  {
    name: 'title',
    label: 'Tên danh hiệu / Bằng khen / Thành tích',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Ví dụ: Huân chương Lao động hạng Nhất',
  },
  {
    name: 'authorityVi',
    label: 'Cơ quan / Cấp có thẩm quyền trao tặng',
    type: 'text',
    placeholder: 'Ví dụ: Chủ tịch nước, Thủ tướng Chính phủ, Bộ GD&ĐT',
  },
  {
    name: 'description',
    label: 'Mô tả chi tiết, ý nghĩa lịch sử & căn cứ quyết định',
    type: 'bilingual_textarea',
    placeholder: 'Nhập nội dung trích lục quyết định khen thưởng, thành tích đạt được...',
  },
  {
    name: 'featuredInHonorWall',
    label: 'Hiển thị nổi bật trên Đài Vinh Danh (phía cuối phòng triển lãm)',
    type: 'boolean',
  },
  {
    name: 'documentUrl',
    label: 'Số hiệu văn bản / Quyết định lưu trữ',
    type: 'text',
    placeholder: 'Ví dụ: Quyết định số 565-KT/CTN hoặc liên kết số',
  },
  {
    name: 'gallery',
    label: 'Hình ảnh bằng khen / huân huy chương (Tải lên Firebase Storage)',
    type: 'gallery',
  },
  {
    name: 'sources',
    label: 'Nguồn xác thực tư liệu',
    type: 'sources',
  },
];

// ==========================================
// 6. PEOPLE / LEADERS & TEACHERS
// ==========================================
export const peopleColumns: ColumnDef<Person>[] = [
  {
    header: 'Nhân vật',
    accessor: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-950 border border-zinc-700 overflow-hidden flex items-center justify-center flex-shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-cyan-400 text-xs">{item.name[0]}</span>
          )}
        </div>
        <div>
          <div className="font-semibold text-zinc-100">{item.name}</div>
          <div className="text-[11px] text-zinc-400">{item.roleVi}</div>
        </div>
      </div>
    ),
  },
  {
    header: 'Thời gian công tác',
    accessor: (item) => <span className="font-mono text-zinc-400 text-xs">{item.period || '—'}</span>,
  },
];

export const peopleFields: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Họ và tên',
    type: 'text',
    required: true,
    placeholder: 'Ví dụ: Thầy/Cô...',
  },
  {
    name: 'role',
    label: 'Chức danh / Vai trò',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Hiệu trưởng (1966–1972) / Giáo viên Tiêu biểu',
  },
  {
    name: 'period',
    label: 'Thời kỳ công tác / Khóa học',
    type: 'text',
    placeholder: '1966 – 1975',
  },
  {
    name: 'imageUrl',
    label: 'Ảnh chân dung tư liệu (URL)',
    type: 'text',
    placeholder: 'https://...',
  },
  {
    name: 'shortBio',
    label: 'Tóm tắt tiểu sử công tác',
    type: 'bilingual_textarea',
  },
  {
    name: 'bio',
    label: 'Tiểu sử & Cống hiến đầy đủ',
    type: 'bilingual_textarea',
  },
  {
    name: 'sources',
    label: 'Nguồn hồ sơ lưu trữ',
    type: 'sources',
  },
];

// ==========================================
// 7. MEMORIES
// ==========================================
export const memoryColumns: ColumnDef<Memory>[] = [
  {
    header: 'Ký ức & Câu chuyện',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.titleVi}</div>
        <div className="text-[11px] text-zinc-400">
          Tác giả: <strong className="text-zinc-300">{item.author}</strong>{' '}
          {item.generation && `(${item.generation})`}
        </div>
      </div>
    ),
  },
  {
    header: 'Năm hồi ức',
    accessor: (item) => <span className="font-mono text-zinc-400">{item.year || '—'}</span>,
  },
];

export const memoryFields: FormFieldDef[] = [
  {
    name: 'title',
    label: 'Tiêu đề ký ức / Dòng hồi tưởng',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Ví dụ: Kỷ niệm lớp học hầm kèo thời sơ tán',
  },
  {
    name: 'author',
    label: 'Tác giả / Người chia sẻ',
    type: 'text',
    required: true,
    placeholder: 'Cựu học sinh / Cựu giáo viên...',
  },
  {
    name: 'generation',
    label: 'Thế hệ / Khóa học (nếu có)',
    type: 'text',
    placeholder: 'Khóa 1970 – 1973',
  },
  {
    name: 'year',
    label: 'Năm ghi chép',
    type: 'number',
    placeholder: '2026',
  },
  {
    name: 'content',
    label: 'Nội dung câu chuyện ký ức',
    type: 'bilingual_textarea',
    required: true,
  },
  {
    name: 'audioUrl',
    label: 'File ghi âm / Podcast ký ức (URL)',
    type: 'text',
    placeholder: 'https://...',
  },
  {
    name: 'gallery',
    label: 'Ảnh kỷ niệm đính kèm',
    type: 'gallery',
  },
  {
    name: 'sources',
    label: 'Nguồn tiếp nhận / Phỏng vấn',
    type: 'sources',
  },
];

// ==========================================
// 8. NEWS & EVENTS
// ==========================================
export const newsColumns: ColumnDef<NewsEvent>[] = [
  {
    header: 'Tin tức / Sự kiện',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.titleVi}</div>
        <div className="text-[11px] text-zinc-400">{item.publishedDate}</div>
      </div>
    ),
  },
  {
    header: 'Chuyên mục',
    accessor: (item) => <span className="text-zinc-300">{item.category || 'Hoạt động 60 năm'}</span>,
  },
];

export const newsFields: FormFieldDef[] = [
  {
    name: 'title',
    label: 'Tiêu đề tin tức',
    type: 'bilingual_text',
    required: true,
  },
  {
    name: 'publishedDate',
    label: 'Ngày đăng (YYYY-MM-DD)',
    type: 'text',
    required: true,
    placeholder: '2026-10-15',
  },
  {
    name: 'category',
    label: 'Chuyên mục',
    type: 'text',
    placeholder: 'Đại lễ 60 năm / Thi đua',
  },
  {
    name: 'coverImage',
    label: 'Ảnh bìa đại diện (URL)',
    type: 'text',
    placeholder: 'https://...',
  },
  {
    name: 'summary',
    label: 'Tóm tắt bài viết',
    type: 'bilingual_textarea',
  },
  {
    name: 'content',
    label: 'Nội dung chi tiết',
    type: 'bilingual_textarea',
  },
  {
    name: 'gallery',
    label: 'Thư viện ảnh sự kiện',
    type: 'gallery',
  },
];

// ==========================================
// 9. HOTSPOTS (CONTENT LAYER)
// ==========================================
export const hotspotColumns: ColumnDef<Hotspot>[] = [
  {
    header: 'Mã phòng (Room ID)',
    accessor: (item) => (
      <span className="font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50">
        {item.roomId}
      </span>
    ),
  },
  {
    header: 'Điểm tương tác',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.titleVi}</div>
        <div className="text-[11px] text-zinc-400 truncate max-w-sm">{item.descriptionVi}</div>
      </div>
    ),
  },
];

export const hotspotFields: FormFieldDef[] = [
  {
    name: 'roomId',
    label: 'Phòng triển lãm (Canonical Room)',
    type: 'select',
    required: true,
    options: [
      { value: 'gate', label: '01. GATE – Cổng Vũ Trụ Di Sản' },
      { value: 'lobby', label: '02. LOBBY – Sảnh Chào & Giới Thiệu' },
      { value: 'history', label: '03. HISTORY – Lịch Sử Hình Thành' },
      { value: 'timeline', label: '04. TIMELINE – Dòng Thời Gian (1966–2026)' },
      { value: 'development', label: '05. DEVELOPMENT – Quá Trình Phát Triển' },
      { value: 'achievements', label: '06. ACHIEVEMENTS – Thành Tích & Tự Hào' },
      { value: 'memory', label: '07. MEMORY – Ký Ức & Tri Ân' },
      { value: 'ending', label: '08. ENDING – Điểm Tựa Tương Lai' },
    ],
  },
  {
    name: 'title',
    label: 'Tên điểm tương tác (Hotspot)',
    type: 'bilingual_text',
    required: true,
    placeholder: 'Ví dụ: Kỷ vật bàn ghế gỗ thời kháng chiến',
  },
  {
    name: 'description',
    label: 'Thông tin chi tiết khi tương tác',
    type: 'bilingual_textarea',
  },
  {
    name: 'audioUrl',
    label: 'Thuyết minh âm thanh (Audio Guide URL)',
    type: 'text',
    placeholder: 'https://...',
  },
  {
    name: 'sources',
    label: 'Nguồn tư liệu',
    type: 'sources',
  },
];

// ==========================================
// 10. DIGITAL RESOURCES
// ==========================================
export const resourceColumns: ColumnDef<DigitalResource>[] = [
  {
    header: 'Tài nguyên',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.titleVi}</div>
        <div className="text-[11px] text-zinc-400 font-mono truncate max-w-sm">{item.url}</div>
      </div>
    ),
  },
  {
    header: 'Loại tệp',
    accessor: (item) => <span className="font-mono text-zinc-300 uppercase">{item.type}</span>,
  },
  {
    header: 'Liên kết',
    accessor: (item) => (
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="text-cyan-400 hover:text-cyan-300 p-1 inline-flex items-center gap-1 text-[11px]"
      >
        <span>Mở</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    ),
  },
];

export const resourceFields: FormFieldDef[] = [
  {
    name: 'type',
    label: 'Loại tài nguyên số',
    type: 'select',
    required: true,
    options: [
      { value: 'video', label: 'Video phim tài liệu' },
      { value: 'podcast', label: 'Tập Podcast / Thuyết minh' },
      { value: 'document', label: 'Tài liệu số hóa PDF' },
      { value: 'online_archive', label: 'Kho lưu trữ trực tuyến' },
      { value: 'external_reference', label: 'Liên kết tham chiếu ngoài' },
      { value: 'source_material', label: 'Tư liệu gốc chuyên đề' },
    ],
  },
  {
    name: 'title',
    label: 'Tiêu đề tài nguyên',
    type: 'bilingual_text',
    required: true,
  },
  {
    name: 'url',
    label: 'Đường dẫn tài nguyên (URL)',
    type: 'text',
    required: true,
    placeholder: 'https://...',
  },
  {
    name: 'thumbnailUrl',
    label: 'Ảnh thu nhỏ (Thumbnail URL)',
    type: 'text',
  },
  {
    name: 'description',
    label: 'Mô tả tài nguyên',
    type: 'bilingual_textarea',
  },
  {
    name: 'year',
    label: 'Năm xuất bản / sản xuất',
    type: 'number',
  },
  {
    name: 'sources',
    label: 'Nguồn gốc tài nguyên',
    type: 'sources',
  },
  {
    name: 'licenses',
    label: 'Bản quyền & Công bố cấp phép',
    type: 'licenses',
  },
];

// ==========================================
// 11. SOURCES (AUTHORITATIVE CITATION)
// ==========================================
export const sourceColumns: ColumnDef<Source>[] = [
  {
    header: 'Mã lưu trữ',
    accessor: (item) => (
      <span className="font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
        {item.referenceCode || 'TL-THD'}
      </span>
    ),
  },
  {
    header: 'Nguồn tư liệu',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.title}</div>
        <div className="text-[11px] text-zinc-400">
          {item.organization || item.author ? `${item.author} • ${item.organization}` : item.type}
        </div>
      </div>
    ),
  },
  {
    header: 'Loại nguồn',
    accessor: (item) => {
      const typeMap: Record<string, string> = {
        school_document: 'Văn bản nhà trường',
        official_document: 'Văn bản ngành GD / Tỉnh',
        photo: 'Ảnh gốc lưu trữ',
        interview: 'Phỏng vấn nhân chứng',
        book: 'Sách kỷ yếu / Lịch sử',
        website: 'Cổng thông tin',
        archive: 'Kho lưu trữ lịch sử',
        other: 'Khác',
      };
      return <span className="text-zinc-300 text-xs">{typeMap[item.type] || item.type}</span>;
    },
  },
];

export const sourceFields: FormFieldDef[] = [
  {
    name: 'referenceCode',
    label: 'Mã tra cứu / Số hiệu lưu trữ (Reference Code)',
    type: 'text',
    required: true,
    placeholder: 'TL-THD-1966-01',
  },
  {
    name: 'title',
    label: 'Tên tài liệu / Tên nguồn',
    type: 'text',
    required: true,
    placeholder: 'Ví dụ: Kỷ yếu 50 năm Trường THPT A Trần Hưng Đạo',
  },
  {
    name: 'type',
    label: 'Phân loại nguồn',
    type: 'select',
    required: true,
    options: [
      { value: 'school_document', label: 'Văn bản lưu hành nội bộ trường' },
      { value: 'official_document', label: 'Văn bản chính thức Sở GD&ĐT / Tỉnh' },
      { value: 'photo', label: 'Ảnh tư liệu gốc có thẩm định' },
      { value: 'interview', label: 'Biên bản phỏng vấn nhân chứng lịch sử' },
      { value: 'book', label: 'Sách lịch sử Đảng bộ / Kỷ yếu truyền thống' },
      { value: 'website', label: 'Cổng thông tin điện tử chính thống' },
      { value: 'archive', label: 'Kho lưu trữ Quốc gia / Tỉnh' },
      { value: 'other', label: 'Nguồn tư liệu khác' },
    ],
  },
  {
    name: 'organization',
    label: 'Cơ quan ban hành / Lưu trữ',
    type: 'text',
    placeholder: 'Trường THPT A Trần Hưng Đạo / Sở GD&ĐT Nam Định',
  },
  {
    name: 'author',
    label: 'Tác giả / Người biên soạn / Người cung cấp',
    type: 'text',
  },
  {
    name: 'date',
    label: 'Thời gian ban hành / Thu thập',
    type: 'text',
    placeholder: '1966 hoặc Tháng 10/2016',
  },
  {
    name: 'url',
    label: 'Đường dẫn liên kết trực tuyến (nếu có)',
    type: 'text',
    placeholder: 'https://...',
  },
  {
    name: 'description',
    label: 'Mô tả giá trị & nội dung trích yếu của nguồn',
    type: 'textarea',
  },
];

// ==========================================
// 12. LICENSES & AI DISCLOSURE
// ==========================================
export const licenseColumns: ColumnDef<License>[] = [
  {
    header: 'Tài sản số',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
          <span>{item.assetName}</span>
          {item.aiGenerated && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 bg-indigo-950 text-indigo-300 border border-indigo-700/40 rounded-full font-mono">
              <Sparkles className="w-2.5 h-2.5" />
              AI
            </span>
          )}
        </div>
        <div className="text-[11px] text-zinc-400">
          Loại: {item.assetType} • Tác giả: {item.creator || 'Chưa rõ'}
        </div>
      </div>
    ),
  },
  {
    header: 'Giấy phép (License)',
    accessor: (item) => <span className="font-mono text-zinc-300 text-xs">{item.licenseType}</span>,
  },
  {
    header: 'Công bố AI',
    accessor: (item) =>
      item.aiGenerated ? (
        <span className="text-indigo-400 text-xs">{item.aiTool || 'Công nghệ AI'}</span>
      ) : (
        <span className="text-zinc-500 text-xs">Tài sản thực (Non-AI)</span>
      ),
  },
];

export const licenseFields: FormFieldDef[] = [
  {
    name: 'assetName',
    label: 'Tên tài sản / File / Tác phẩm',
    type: 'text',
    required: true,
    placeholder: 'Ví dụ: Mô hình 3D cổng trường xưa / Nhạc nền không gian',
  },
  {
    name: 'assetType',
    label: 'Loại tài sản',
    type: 'text',
    required: true,
    placeholder: '3D Model / Audio / Ảnh tư liệu / Thiết kế đồ họa',
  },
  {
    name: 'creator',
    label: 'Tác giả / Chủ sở hữu bản quyền',
    type: 'text',
    placeholder: 'Trường THPT A Trần Hưng Đạo / Tác giả...',
  },
  {
    name: 'licenseType',
    label: 'Loại giấy phép / Tình trạng bản quyền',
    type: 'text',
    required: true,
    placeholder: 'Bản quyền trường / CC BY-NC 4.0 / Public Domain / AI Generated',
  },
  {
    name: 'licenseUrl',
    label: 'Đường dẫn điều khoản giấy phép',
    type: 'text',
    placeholder: 'https://...',
  },
  {
    name: 'sourceUrl',
    label: 'Đường dẫn nguồn gốc file gốc',
    type: 'text',
    placeholder: 'https://...',
  },
  {
    name: 'aiGenerated',
    label: 'Tài sản do AI tạo lập (AI-Generated Asset)',
    type: 'boolean',
    helpText: 'Tích chọn để minh bạch theo yêu cầu chuẩn dự án',
  },
  {
    name: 'aiTool',
    label: 'Công cụ AI sử dụng (nếu có)',
    type: 'text',
    placeholder: 'Gemini / Midjourney / Suno / Khác...',
  },
  {
    name: 'aiDisclosure',
    label: 'Bản tuyên bố công bố AI (AI Disclosure Statement)',
    type: 'textarea',
    placeholder: 'Ví dụ: Hình ảnh phục chế được hỗ trợ bởi công nghệ AI dựa trên ảnh tư liệu gốc năm 1970...',
  },
  {
    name: 'notes',
    label: 'Ghi chú thẩm định bản quyền',
    type: 'textarea',
  },
];

// ==========================================
// 13. CREDITS
// ==========================================
export const creditColumns: ColumnDef<Credit>[] = [
  {
    header: 'Người tham gia / Đơn vị',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.name}</div>
        <div className="text-[11px] text-zinc-400">{item.organization}</div>
      </div>
    ),
  },
  {
    header: 'Vai trò',
    accessor: (item) => <span className="text-cyan-400 text-xs">{item.role}</span>,
  },
];

export const creditFields: FormFieldDef[] = [
  {
    name: 'name',
    label: 'Họ và tên / Đơn vị',
    type: 'text',
    required: true,
  },
  {
    name: 'role',
    label: 'Vai trò trong dự án',
    type: 'text',
    required: true,
    placeholder: 'Chỉ đạo nội dung / Thẩm định lịch sử / Kỹ thuật số hóa',
  },
  {
    name: 'organization',
    label: 'Đơn vị / Ban phụ trách',
    type: 'text',
    placeholder: 'Ban Giám hiệu / Tổ Lịch sử / Cựu học sinh',
  },
  {
    name: 'description',
    label: 'Mô tả đóng góp',
    type: 'textarea',
  },
];

// ==========================================
// 14. ROOMS (EXHIBITION SECTIONS)
// ==========================================
export const roomColumns: ColumnDef<Room>[] = [
  {
    header: 'Mã phòng (Stable ID)',
    accessor: (item) => (
      <span className="font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
        {item.id}
      </span>
    ),
  },
  {
    header: 'Tên không gian',
    accessor: (item) => (
      <div>
        <div className="font-semibold text-zinc-100">{item.nameVi}</div>
        <div className="text-[11px] text-zinc-400">{item.nameEn}</div>
      </div>
    ),
  },
  {
    header: 'Trạng thái chuẩn bị',
    accessor: (item) => {
      const statusLabels: Record<string, { label: string; color: string }> = {
        planned: { label: 'Đã lên kế hoạch', color: 'text-zinc-400 bg-zinc-900 border-zinc-800' },
        draft: { label: 'Bản thảo nội dung', color: 'text-amber-400 bg-amber-950/40 border-amber-800/40' },
        in_progress: { label: 'Đang số hóa', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40' },
        completed: { label: 'Hoàn thiện nội dung', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' },
      };
      const cfg = statusLabels[item.status] || { label: item.status, color: 'text-zinc-400' };
      return (
        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${cfg.color}`}>
          {cfg.label}
        </span>
      );
    },
  },
];

export const roomFields: FormFieldDef[] = [
  {
    name: 'id',
    label: 'Mã phòng vĩnh viễn (Stable Room ID)',
    type: 'text',
    required: true,
    helpText: 'Định danh vĩnh viễn (gate, lobby, history, timeline, development, achievements, memory, ending)',
  },
  {
    name: 'slug',
    label: 'Đường dẫn Slug',
    type: 'text',
    required: true,
  },
  {
    name: 'name',
    label: 'Tên không gian phòng',
    type: 'bilingual_text',
    required: true,
  },
  {
    name: 'description',
    label: 'Giới thiệu chủ đề phòng',
    type: 'bilingual_textarea',
  },
  {
    name: 'status',
    label: 'Trạng thái chuẩn bị',
    type: 'select',
    required: true,
    options: [
      { value: 'planned', label: 'Đã lên kế hoạch (Planned)' },
      { value: 'draft', label: 'Bản thảo nội dung (Draft)' },
      { value: 'in_progress', label: 'Đang số hóa tư liệu (In Progress)' },
      { value: 'completed', label: 'Hoàn thiện nội dung (Completed)' },
    ],
  },
];
