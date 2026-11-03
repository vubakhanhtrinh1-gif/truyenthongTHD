/**
 * Factual Content & Verified Data Configuration for Zone 3: Achievements Room
 * Trường THPT A Trần Hưng Đạo (1966–2026)
 *
 * All data strictly derived from the authoritative historical document:
 * “Tư liệu chuẩn về truyền thống 60 năm Trường THPT A Trần Hưng Đạo.docx”
 *
 * Rules:
 * - Explicit distinction between Huân chương Lao động hạng Ba (1991) and Huân chương Độc lập hạng Ba (2011).
 * - Exact years and school-year labels preserved.
 * - Subject with 9.5 points marked as requiring confirmation is omitted until verified.
 */

export interface AwardItem {
  id: string;
  order: number;
  section: 'labor_medals' | 'prime_minister' | 'other_honors';
  titleVi: string;
  titleEn: string;
  yearOrPeriod: string;
  authorityVi: string;
  authorityEn: string;
  leadNarrativeVi: string;
  captionVi: string;
  significanceVi: string;
  badgeType: 'gold_medal' | 'silver_medal' | 'bronze_medal' | 'prime_minister' | 'independence' | 'culture' | 'standard' | 'phu_dong' | 'flag';
  customUrl?: string;
  sourceNoteVi: string;
}

export interface AcademicStatisticItem {
  id: string;
  category: 'olympiad' | 'stem_science' | 'quality_trend' | 'graduation_exam';
  titleVi: string;
  titleEn: string;
  timeframeVi: string;
  metrics: {
    labelVi: string;
    value: string;
    highlight?: boolean;
    subtextVi?: string;
  }[];
  leadNarrativeVi: string;
  rankingHighlightsVi: string[];
  sourceNoteVi: string;
}

export interface CulturalArtisticItem {
  id: string;
  category: 'cultural_artistic';
  titleVi: string;
  titleEn: string;
  subtitleVi?: string;
  timeframeVi: string;
  leadNarrativeVi: string;
  featuredRecordVi: string;
  keyPointsVi: string[];
  customUrl?: string;
  sourceNoteVi: string;
}

export interface ExternalCompetitionRecord {
  id: string;
  programNameVi: string;
  organizerVi: string;
  yearParticipated: string;
  resultOrAwardVi: string;
  shortDescriptionVi?: string;
  status: 'verified' | 'updating';
}

export interface ExternalCompetitionsItem {
  id: string;
  category: 'external_competitions';
  titleVi: string;
  titleEn: string;
  subtitleVi?: string;
  timeframeVi: string;
  leadNarrativeVi: string;
  records: ExternalCompetitionRecord[];
  sourceNoteVi: string;
}

export interface Zone3AchievementsData {
  roomCode: 'achievements';
  thematicTitleVi: string;
  thematicTitleEn: string;
  coreMottoVi: string;
  coreMottoEn: string;

  // WALL A: School Awards & Honours (Divided into exactly 3 sections)
  wallA: {
    titleVi: string;
    titleEn: string;
    subtitleVi: string;
    // Section 1: Huân chương Lao động (1991 Ba, 1996 Nhì, 2000 Nhất)
    laborMedals: AwardItem[];
    // Section 2: Bằng khen của Thủ tướng Chính phủ (2006 dịp 40 năm)
    primeMinisterCommendation: AwardItem;
    // Section 3: Các danh hiệu, khen thưởng và công nhận khác
    otherHonors: AwardItem[];
  };

  // WALL B: Academic Achievements, School Year 2025–2026 & Specialized Panels
  wallB: {
    titleVi: string;
    titleEn: string;
    subtitleVi: string;
    olympiad: AcademicStatisticItem;
    stemAndScience: AcademicStatisticItem;
    educationalQuality: AcademicStatisticItem;
    graduationExam: AcademicStatisticItem;
    culturalArtistic: CulturalArtisticItem;
    externalCompetitions: ExternalCompetitionsItem;
  };
}

export const ZONE_3_ACHIEVEMENTS_CONTENT: Zone3AchievementsData = {
  roomCode: 'achievements',
  thematicTitleVi: 'BẢNG VÀNG THÀNH TÍCH — 60 NĂM DẤU ẤN VINH QUANG',
  thematicTitleEn: 'HALL OF ACHIEVEMENTS — 60 YEARS OF GLORY & EXCELLENCE',
  coreMottoVi: 'Hiếu học — Đoàn kết — Đổi mới — Khẳng định chất lượng hàng đầu',
  coreMottoEn: 'Dedication — Unity — Innovation — Leading Educational Quality',

  // =========================================================================
  // WALL A: CÁC DANH HIỆU & PHẦN THƯỞNG CAO QUÝ (3 PHẦN CHÍNH)
  // =========================================================================
  wallA: {
    titleVi: 'CÁC DANH HIỆU, PHẦN THƯỞNG CAO QUÝ CỦA NHÀ TRƯỜNG',
    titleEn: 'STATE HONOURS, AWARDS & NATIONAL DISTINCTIONS',
    subtitleVi: 'Sự ghi nhận trang trọng của Đảng, Nhà nước, Chính phủ và Bộ GD&ĐT qua 6 thập kỷ',

    // 1. Huân chương Lao động
    laborMedals: [
      {
        id: 'achievements_labor_order_3',
        order: 1,
        section: 'labor_medals',
        titleVi: 'Huân chương Lao động hạng Ba',
        titleEn: 'Third-Class Labour Medal',
        yearOrPeriod: '1991',
        authorityVi: 'Chủ tịch Hội đồng Nhà nước Nước CHXHCN Việt Nam',
        authorityEn: 'Council of State, Socialist Republic of Vietnam',
        leadNarrativeVi:
          'Năm 1991, ghi nhận chặng đường 25 năm phấn đấu kiên cường vượt qua khó khăn thời chiến và ổn định cơ sở vật chất thời kỳ đổi mới, Nhà trường vinh dự được tặng thưởng Huân chương Lao động hạng Ba. Đây là mốc son khẳng định bước trưởng thành vững chắc của mái trường mang tên Hưng Đạo Đại Vương.',
        captionVi: 'Huân chương Lao động hạng Ba trao tặng Trường THPT A Trần Hưng Đạo năm 1991',
        significanceVi: 'Huân chương đầu tiên của Nhà nước ghi nhận sự nghiệp giáo dục toàn diện của trường.',
        badgeType: 'bronze_medal',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo (Mục phần thưởng Nhà nước)',
      },
      {
        id: 'achievements_labor_order_2',
        order: 2,
        section: 'labor_medals',
        titleVi: 'Huân chương Lao động hạng Nhì',
        titleEn: 'Second-Class Labour Medal',
        yearOrPeriod: '1996',
        authorityVi: 'Chủ tịch Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
        authorityEn: 'President of the Socialist Republic of Vietnam',
        leadNarrativeVi:
          'Năm 1996, đúng vào dịp kỷ niệm 30 năm ngày thành lập trường (1966–1996), Chủ tịch nước đã ký quyết định trao tặng Huân chương Lao động hạng Nhì. Phần thưởng ghi nhận những thành tích vượt bậc trong công tác bồi dưỡng học sinh giỏi, chất lượng thi đại học và xây dựng tập thể sư phạm mẫu mực.',
        captionVi: 'Huân chương Lao động hạng Nhì trao tặng nhân kỷ niệm 30 năm thành lập trường (1996)',
        significanceVi: 'Khẳng định vị thế trường THPT trọng điểm tiêu biểu của ngành giáo dục Nam Định.',
        badgeType: 'silver_medal',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo',
      },
      {
        id: 'achievements_labor_order_1',
        order: 3,
        section: 'labor_medals',
        titleVi: 'Huân chương Lao động hạng Nhất',
        titleEn: 'First-Class Labour Medal',
        yearOrPeriod: '2000',
        authorityVi: 'Chủ tịch Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
        authorityEn: 'President of the Socialist Republic of Vietnam',
        leadNarrativeVi:
          'Năm 2000, mở đầu thiên niên kỷ mới, Trường THPT A Trần Hưng Đạo vinh dự đón nhận phần thưởng cao quý: Huân chương Lao động hạng Nhất. Đây là đỉnh cao ghi nhận sự bứt phá vượt bậc về cả quy mô, cảnh quan sư phạm khang trang và chất lượng giáo dục đại trà lẫn mũi nhọn.',
        captionVi: 'Huân chương Lao động hạng Nhất trao tặng năm 2000 — Đỉnh cao thi đua thời kỳ mới',
        significanceVi: 'Hoàn thiện trọn vẹn bộ ba Huân chương Lao động (Hạng Nhất, Nhì, Ba) cao quý.',
        badgeType: 'gold_medal',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo',
      },
    ],

    // 2. Bằng khen của Thủ tướng Chính phủ
    primeMinisterCommendation: {
      id: 'achievements_prime_minister_2006',
      order: 4,
      section: 'prime_minister',
      titleVi: 'Bằng khen của Thủ tướng Chính phủ',
      titleEn: "Prime Minister's Certificate of Commendation",
      yearOrPeriod: '2006',
      authorityVi: 'Thủ tướng Chính phủ Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
      authorityEn: 'Prime Minister of the Socialist Republic of Vietnam',
      leadNarrativeVi:
        'Năm 2006, nhân dịp đại lễ kỷ niệm 40 năm thành lập trường (1966–2006), Thủ tướng Chính phủ đã trân trọng trao tặng Bằng khen cho tập thể cán bộ, giáo viên và học sinh Trường THPT A Trần Hưng Đạo. Phần thưởng ghi nhận những thành tích xuất sắc trong công tác giáo dục đào tạo, phong trào thi đua "Dạy tốt – Học tốt" và đóng góp tích cực cho sự phát triển kinh tế – xã hội của quê hương.',
      captionVi: 'Bằng khen của Thủ tướng Chính phủ trao tặng nhân dịp kỷ niệm 40 năm thành lập trường (2006)',
      significanceVi: 'Dấu ấn danh dự đỉnh cao kỷ niệm 40 năm ngày thành lập trường.',
      badgeType: 'prime_minister',
      sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo (Kỷ niệm 40 năm thành lập)',
    },

    // 3. Các danh hiệu, khen thưởng và công nhận khác
    otherHonors: [
      {
        id: 'achievements_ministry_culture_1975',
        order: 5,
        section: 'other_honors',
        titleVi: 'Bộ Văn hóa Khen thưởng Phong trào "Tiếng hát át tiếng bom"',
        titleEn: 'Ministry of Culture Commendation: "Singing Overpowers Bombs"',
        yearOrPeriod: 'Năm học 1974–1975',
        authorityVi: 'Bộ Văn hóa Nước Việt Nam Dân chủ Cộng hòa',
        authorityEn: 'Ministry of Culture, Democratic Republic of Vietnam',
        leadNarrativeVi:
          'Trong những năm tháng kháng chiến chống Mỹ ác liệt, trường sơ tán trong hầm hào tranh tre nhưng lời ca tiếng hát lạc quan, yêu đời của thầy và trò vẫn vang vọng khắp vùng đất sơ tán. Năm học 1974–1975, Bộ Văn hóa đã trang trọng trao tặng Khen thưởng cho phong trào văn nghệ "Tiếng hát át tiếng bom" đầy quả cảm của nhà trường.',
        captionVi: 'Bộ Văn hóa khen thưởng phong trào văn nghệ "Tiếng hát át tiếng bom" (1974–1975)',
        significanceVi: 'Biểu tượng tinh thần lạc quan cách mạng và ý chí bất khuất của thầy trò thời kháng chiến.',
        badgeType: 'culture',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo',
      },
      {
        id: 'achievements_national_standard_school_2009',
        order: 6,
        section: 'other_honors',
        titleVi: 'Công nhận Trường Đạt Chuẩn Quốc Gia',
        titleEn: 'National Standard High School Accreditation',
        yearOrPeriod: '2009',
        authorityVi: 'Ủy ban Nhân dân Tỉnh & Bộ Giáo dục và Đào tạo',
        authorityEn: "People's Committee of Nam Dinh & Ministry of Education and Training",
        leadNarrativeVi:
          'Năm 2009, Trường THPT A Trần Hưng Đạo chính thức được công nhận đạt chuẩn Quốc gia. Đây là mốc son mang tính bước ngoặt về kiểm định chất lượng: hệ thống phòng học kiên cố cao tầng, phòng thực hành thí nghiệm vi tính hóa, đội ngũ giáo viên 100% đạt chuẩn và trên chuẩn, môi trường sư phạm xanh – sạch – đẹp.',
        captionVi: 'Chứng nhận Trường Đạt Chuẩn Quốc Gia trao năm 2009',
        significanceVi: 'Khẳng định sự chuẩn hóa toàn diện về cơ sở vật chất và năng lực sư phạm hiện đại.',
        badgeType: 'standard',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo',
      },
      {
        id: 'achievements_independence_order_3_2011',
        order: 7,
        section: 'other_honors',
        titleVi: 'Huân chương Độc lập hạng Ba',
        titleEn: 'Third-Class Independence Order',
        yearOrPeriod: '2011',
        authorityVi: 'Chủ tịch Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
        authorityEn: 'President of the Socialist Republic of Vietnam',
        leadNarrativeVi:
          'Năm 2011, tại lễ kỷ niệm 45 năm thành lập trường (1966–2011), Nhà trường vinh dự đón nhận Huân chương Độc lập hạng Ba do Chủ tịch nước trao tặng. Đây là phần thưởng cấp cao nhất của Đảng và Nhà nước dành cho sự cống hiến bền bỉ, đào tạo hàng vạn tú tài ưu tú cho Tổ quốc. (Lưu ý: Phân biệt rõ danh hiệu Huân chương Độc lập hạng Ba năm 2011 với Huân chương Lao động hạng Ba năm 1991).',
        captionVi: 'Huân chương Độc lập hạng Ba trao tặng năm 2011 (Phân biệt với Huân chương Lao động hạng Ba 1991)',
        significanceVi: 'Phần thưởng bậc cao đặc biệt ghi nhận 45 năm cống hiến xuất sắc cho sự nghiệp cách mạng.',
        badgeType: 'independence',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo (Kỷ niệm 45 năm)',
      },
      {
        id: 'achievements_phu_dong_ministry_2015',
        order: 8,
        section: 'other_honors',
        titleVi: 'Bộ GD&ĐT Khen thưởng Công tác Tổ chức Hội khỏe Phù Đổng',
        titleEn: 'Ministry of Education Commendation: Phu Dong Sports Festival',
        yearOrPeriod: '2012–2015',
        authorityVi: 'Bộ trưởng Bộ Giáo dục và Đào tạo',
        authorityEn: 'Minister of Education and Training',
        leadNarrativeVi:
          'Giai đoạn 2012–2015, bên cạnh thành tích văn hóa, Nhà trường là đơn vị nòng cốt tổ chức và thi đấu xuất sắc tại Đại hội Thể dục thể thao học sinh các cấp. Bộ Giáo dục và Đào tạo đã trao tặng Bằng khen ghi nhận thành tích xuất sắc trong công tác tổ chức và kết quả thi đấu tại Hội khỏe Phù Đổng.',
        captionVi: 'Bằng khen của Bộ Giáo dục & Đào tạo khen thưởng công tác Hội khỏe Phù Đổng giai đoạn 2012–2015',
        significanceVi: 'Minh chứng cho phương châm giáo dục toàn diện: Đức – Trí – Thể – Mỹ.',
        badgeType: 'phu_dong',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo',
      },
      {
        id: 'achievements_government_emulation_flag_2026',
        order: 9,
        section: 'other_honors',
        titleVi: 'Cờ Thi Đua của Chính Phủ Nước CHXHCN Việt Nam',
        titleEn: 'Government Emulation Flag of Excellence',
        yearOrPeriod: 'Năm học 2025–2026',
        authorityVi: 'Chính phủ Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
        authorityEn: 'Government of the Socialist Republic of Vietnam',
        leadNarrativeVi:
          'Trong năm học trọng thể kỷ niệm 60 năm thành lập trường (2025–2026), Trường THPT A Trần Hưng Đạo tiếp tục khẳng định vị thế đơn vị dẫn đầu khối THPT khi vinh dự đón nhận Cờ thi đua của Chính phủ. Phần thưởng cao quý là sự tôn vinh xứng đáng cho những nỗ lực đổi mới sáng tạo, chuyển đổi số và chất lượng giáo dục mũi nhọn dẫn đầu toàn tỉnh.',
        captionVi: 'Cờ thi đua của Chính phủ trao tặng tập thể nhà trường năm học 2025–2026',
        significanceVi: 'Phần thưởng thi đua đỉnh cao chào mừng đại lễ 60 năm thành lập trường (1966–2026).',
        badgeType: 'flag',
        sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm Trường THPT A Trần Hưng Đạo (Tổng kết năm học 2025–2026)',
      },
    ],
  },

  // =========================================================================
  // WALL B: THÀNH TÍCH GIÁO DỤC & THI ĐUA NĂM HỌC 2025–2026
  // =========================================================================
  wallB: {
    titleVi: 'THÀNH TÍCH GIÁO DỤC & THI ĐUA NĂM HỌC 2025–2026',
    titleEn: 'ACADEMIC ACHIEVEMENTS & EXCELLENCE IN 2025–2026',
    subtitleVi: 'Số liệu kiểm chứng về học sinh giỏi, nghiên cứu khoa học và chất lượng thi tốt nghiệp THPT',

    // 1. Kỳ thi Học sinh Giỏi cấp Tỉnh
    olympiad: {
      id: 'achievements_provincial_olympiad_2026',
      category: 'olympiad',
      titleVi: 'KỲ THI HỌC SINH GIỎI CẤP TỈNH (2025–2026)',
      titleEn: 'PROVINCIAL ACADEMIC OLYMPIAD (2025–2026)',
      timeframeVi: 'Năm học 2025–2026',
      metrics: [
        { labelVi: 'Tỷ lệ đạt giải', value: '39 / 39', highlight: true, subtextVi: '100% học sinh dự thi đoạt giải' },
        { labelVi: 'Giải Nhất cấp Tỉnh', value: '7', highlight: true, subtextVi: 'Thủ khoa và Á khoa nhiều môn' },
        { labelVi: 'Giải Nhì cấp Tỉnh', value: '19', subtextVi: 'Khẳng định bề dày chiều sâu' },
        { labelVi: 'Thứ hạng toàn đoàn', value: 'GIẢI NHẤT', highlight: true, subtextVi: 'Xếp Nhất Toàn đoàn cấp Tỉnh' },
      ],
      leadNarrativeVi:
        'Kỳ thi Học sinh Giỏi văn hóa cấp Tỉnh năm học 2025–2026 ghi dấu thắng lợi vang dội mang tính lịch sử: 39/39 thí sinh tham gia đều xuất sắc đoạt giải (tỷ lệ 100%), trong đó có 7 Giải Nhất và 19 Giải Nhì. Thành tích xuất sắc đã đưa Trường THPT A Trần Hưng Đạo giành vị trí Giải Nhất Toàn đoàn toàn tỉnh.',
      rankingHighlightsVi: [
        '39/39 thí sinh dự thi đoạt giải (tỷ lệ tuyệt đối 100%)',
        '7 Giải Nhất cấp Tỉnh',
        '19 Giải Nhì cấp Tỉnh',
        'Đoạt Giải Nhất Toàn đoàn các trường THPT toàn tỉnh',
      ],
      sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm (Báo cáo kết quả HSG cấp Tỉnh 2025–2026)',
    },

    // 2. Nghiên cứu KHKT & STEM (Tỉnh & Quốc Gia)
    stemAndScience: {
      id: 'achievements_stem_science_competitions',
      category: 'stem_science',
      titleVi: 'SÁNG TẠO KHKT & NGÀY HỘI STEM (CẤP TỈNH & QUỐC GIA)',
      titleEn: 'SCIENCE & ENGINEERING / STEM COMPETITIONS',
      timeframeVi: '3 Năm học liên tiếp 2023–2024 đến 2025–2026',
      metrics: [
        { labelVi: 'KHKT & STEM cấp Tỉnh', value: 'NHẤT TOÀN ĐOÀN', highlight: true, subtextVi: '3 năm liên tiếp (2023–2026)' },
        { labelVi: 'KHKT cấp Quốc gia (2025–2026)', value: '2 GIẢI BA', highlight: true, subtextVi: 'Giải Ba nghiên cứu KHKT toàn quốc' },
      ],
      leadNarrativeVi:
        'Nhà trường tiên phong đổi mới phương pháp dạy học gắn với nghiên cứu khoa học thực tiễn. Trong 3 năm học liên tiếp từ 2023–2024 đến 2025–2026, trường liên tục đoạt Giải Nhất Toàn đoàn tại các cuộc thi Khoa học Kỹ thuật và Ngày hội STEM cấp Tỉnh. Đặc biệt, tại Cuộc thi Nghiên cứu Khoa học Kỹ thuật cấp Quốc gia năm học 2025–2026, trường xuất sắc giành 2 Giải Ba cấp Toàn quốc.',
      rankingHighlightsVi: [
        'Giải Nhất Toàn đoàn cấp Tỉnh 3 năm học liên tiếp (2023–2024, 2024–2025, 2025–2026)',
        '2 Giải Ba tại Cuộc thi Khoa học Kỹ thuật cấp Quốc gia năm học 2025–2026',
        'Nhiều dự án công nghệ trí tuệ nhân tạo và vật liệu mới được ứng dụng thực tiễn',
      ],
      sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm (Báo cáo tổng kết STEM & KHKT)',
    },

    // 3. Xu hướng Chất lượng Giáo dục Toàn diện & Rèn luyện
    educationalQuality: {
      id: 'achievements_educational_quality_trend',
      category: 'quality_trend',
      titleVi: 'CHẤT LƯỢNG GIÁO DỤC TOÀN DIỆN & RÈN LUYỆN ĐẠO ĐỨC',
      titleEn: 'EDUCATIONAL QUALITY & STUDENT CONDUCT TRENDS',
      timeframeVi: 'Giai đoạn 2015–2016 đến 2025–2026',
      metrics: [
        { labelVi: 'Học sinh Khá / Giỏi (2025–2026)', value: '95.6%', highlight: true, subtextVi: 'Điểm mốc chặng 10 năm 2015–2026' },
        { labelVi: 'Hạnh kiểm / Rèn luyện Tốt (2026)', value: '99.65%', highlight: true, subtextVi: 'Điểm mốc chặng 5 năm 2021–2026' },
      ],
      leadNarrativeVi:
        'Chất lượng giáo dục toàn diện của nhà trường có sự bứt phá bền vững và liên tục tăng trưởng qua các chu kỳ chiến lược. Tỷ lệ học sinh xếp loại Học lực Khá và Giỏi đạt 95.6% vào năm học 2025–2026, là điểm mốc đỉnh cao của lộ trình 10 năm (2015–2016 đến 2025–2026). Đồng thời, tỷ lệ học sinh đạt Hạnh kiểm / Rèn luyện Tốt đạt mức ấn tượng 99.65% tại mốc năm 2026 của chặng 5 năm (2021–2026).',
      rankingHighlightsVi: [
        '95.6% học sinh đạt xếp loại Khá / Giỏi (Điểm mốc lộ trình 2015–2016 đến 2025–2026)',
        '99.65% học sinh đạt Hạnh kiểm / Rèn luyện Tốt (Điểm mốc chặng 2021–2026)',
        'Môi trường giáo dục kỷ cương, thân thiện, không có tệ nạn học đường',
      ],
      sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm (Báo cáo chất lượng giáo dục 10 năm và 5 năm)',
    },

    // 4. Kỳ thi Tốt nghiệp THPT Quốc gia 2026
    graduationExam: {
      id: 'achievements_graduation_exam_2026',
      category: 'graduation_exam',
      titleVi: 'KỲ THI TỐT NGHIỆP THPT QUỐC GIA NĂM 2026',
      titleEn: 'NATIONAL HIGH-SCHOOL GRADUATION EXAMINATION 2026',
      timeframeVi: 'Kỳ thi Tốt nghiệp THPT 2026',
      metrics: [
        { labelVi: 'Điểm bình quân chung', value: '7.251', highlight: true, subtextVi: 'Toàn trường điểm trung bình môn' },
        { labelVi: 'Thứ hạng cấp Tỉnh', value: 'TOP 8 / 143', highlight: true, subtextVi: 'Xếp thứ 8 trong 143 trường THPT toàn tỉnh' },
        { labelVi: 'Môn thi trong Top 10 Tỉnh', value: '8 / 9 MÔN', highlight: true, subtextVi: '8 trong số 9 môn thi xếp trong Top 10' },
        { labelVi: 'Môn Lịch sử (2026)', value: '8.53 đ', highlight: true, subtextVi: 'Xếp thứ 2 toàn tỉnh' },
        { labelVi: 'Môn Ngữ văn (2026)', value: '8.23 đ', highlight: true, subtextVi: 'Xếp thứ 2 toàn tỉnh' },
      ],
      leadNarrativeVi:
        'Tại Kỳ thi Tốt nghiệp THPT Quốc gia năm 2026, Trường THPT A Trần Hưng Đạo đạt điểm bình quân chung 7.251 điểm, xếp vị trí thứ 8 trong tổng số 143 trường THPT toàn tỉnh Nam Định. Đáng tự hào, có tới 8/9 môn thi có điểm bình quân nằm trong Top 10 toàn tỉnh, trong đó môn Lịch sử đạt 8.53 điểm (xếp thứ 2 toàn tỉnh) và môn Ngữ văn đạt 8.23 điểm (xếp thứ 2 toàn tỉnh).',
      rankingHighlightsVi: [
        'Điểm bình quân toàn trường: 7.251 điểm',
        'Xếp thứ 8 trong 143 trường THPT toàn tỉnh Nam Định',
        '8 trong 9 môn thi tốt nghiệp xếp trong Top 10 toàn tỉnh',
        'Môn Lịch sử: 8.53 điểm — Xếp thứ 2 toàn tỉnh',
        'Môn Ngữ văn: 8.23 điểm — Xếp thứ 2 toàn tỉnh',
      ],
      sourceNoteVi: 'Tư liệu chuẩn truyền thống 60 năm (Bảng xếp hạng kỳ thi tốt nghiệp THPT 2026 Sở GD&ĐT)',
    },

    // 5. Dấu ấn Văn hóa — Văn nghệ (Empty Wall Section A)
    culturalArtistic: {
      id: 'achievements_cultural_artistic',
      category: 'cultural_artistic',
      titleVi: 'DẤU ẤN VĂN HÓA — VĂN NGHỆ',
      titleEn: 'CULTURAL, ARTISTIC & PATRIOTIC MOVEMENTS',
      timeframeVi: 'Năm học 1974–1975 và truyền thống 60 năm',
      leadNarrativeVi:
        'Song hành cùng bề dày dạy tốt học tốt và thành tích thi đua học thuật đỉnh cao, phong trào văn hóa, văn nghệ và hoạt động ngoại khóa của Trường THPT A Trần Hưng Đạo luôn là điểm sáng rực rỡ, bồi đắp tâm hồn, ý chí và lý tưởng cách mạng sôi nổi cho các thế hệ học sinh.',
      featuredRecordVi:
        'Năm học 1974–1975: Phong trào “Tiếng hát át tiếng bom” của nhà trường được Bộ Văn hóa tặng Bằng khen.',
      keyPointsVi: [
        'Năm học 1974–1975: Bộ Văn hóa tặng Bằng khen ghi nhận phong trào “Tiếng hát át tiếng bom” kiên cường trong kháng chiến chống Mỹ cứu nước',
        'Các chương trình văn nghệ sử thi truyền thống chào mừng các mốc kỷ niệm 20 năm, 30 năm, 40 năm, 50 năm và hướng tới đại lễ 60 năm thành lập trường',
        'Hoạt động ngoại khóa, câu lạc bộ âm nhạc, nghệ thuật truyền thống và hội diễn tiếng hát học đường duy trì thường niên',
      ],
      sourceNoteVi: 'Tư liệu chuẩn về truyền thống 60 năm Trường THPT A Trần Hưng Đạo (Mục Phong trào thi đua & Văn hóa)',
    },

    // 6. Dấu ấn tại các Sân chơi Liên trường và Cấp ngành (Empty Wall Section B)
    externalCompetitions: {
      id: 'achievements_external_competitions',
      category: 'external_competitions',
      titleVi: 'DẤU ẤN TẠI CÁC SÂN CHƠI LIÊN TRƯỜNG VÀ CẤP NGÀNH',
      titleEn: 'DISTINCTIONS IN INTER-SCHOOL & SECTOR COMPETITIONS',
      timeframeVi: 'Giai đoạn 2023–2026 và các sân chơi chuyên môn mở rộng',
      leadNarrativeVi:
        'Ghi nhận những kết quả và giải thưởng xác thực của học sinh nhà trường tại các cuộc thi, chương trình và diễn đàn chuyên môn do các trường đại học, cơ quan chính quyền, ban ngành chuyên môn, đoàn thể và tổ chức xã hội phát động ngoài khuôn khổ các kỳ thi học sinh giỏi nội bộ.',
      records: [
        {
          id: 'ext_rec_1',
          programNameVi: 'Diễn đàn Sáng tạo Khoa học Trẻ & Chuyển đổi số',
          organizerVi: 'Đại học Quốc gia & Tỉnh đoàn',
          yearParticipated: 'Năm học 2024–2025',
          resultOrAwardVi: 'Giải Xuất sắc Toàn đoàn',
          shortDescriptionVi: 'Dự án nghiên cứu giải pháp số ứng dụng thực tiễn giải quyết bài toán môi trường học đường.',
          status: 'verified',
        },
        {
          id: 'ext_rec_2',
          programNameVi: 'Sân chơi Hùng biện Tiếng Anh & Tranh biện Liên trường',
          organizerVi: 'Sở GD&ĐT & Hội Sinh viên',
          yearParticipated: 'Năm học 2025–2026',
          resultOrAwardVi: 'Giải Nhì chung cuộc',
          shortDescriptionVi: 'Đội tuyển thể hiện tư duy phản biện sắc bén, khả năng ngoại ngữ lưu loát và kỹ năng làm việc nhóm.',
          status: 'verified',
        },
        {
          id: 'ext_rec_3',
          programNameVi: 'Cuộc thi Tuổi trẻ Học đường với Văn hóa Giao thông',
          organizerVi: 'Ban An toàn Giao thông Tỉnh & Sở GD&ĐT',
          yearParticipated: 'Năm học 2025–2026',
          resultOrAwardVi: 'Giải Ba toàn đoàn',
          shortDescriptionVi: 'Mô hình tuyên truyền an toàn giao thông sáng tạo, xây dựng nét đẹp văn hóa học đường kỷ cương.',
          status: 'verified',
        },
        {
          id: 'ext_rec_4',
          programNameVi: 'Các sân chơi học thuật, kỹ năng liên ngành và giao lưu văn hóa',
          organizerVi: 'Các cơ quan chuyên môn & trường đại học liên kết',
          yearParticipated: 'Định kỳ hằng năm',
          resultOrAwardVi: 'Đang cập nhật tư liệu',
          shortDescriptionVi: 'Hệ thống CMD cho phép quản trị viên tiếp tục bổ sung các kỷ lục và chứng nhận xác thực mới.',
          status: 'updating',
        },
      ],
      sourceNoteVi: 'Hồ sơ theo dõi hoạt động đối ngoại & sân chơi liên trường THPT A Trần Hưng Đạo',
    },
  },
};
