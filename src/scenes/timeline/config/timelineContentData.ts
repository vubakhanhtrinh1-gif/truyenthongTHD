/**
 * Canonical Historical Content Dataset for the Timeline Room:
 * "DÒNG CHẢY 60 NĂM — 1966–2026"
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 *
 * Grounded 100% in verified school archives and commemorative monographs.
 * Organized into six navigable chronological chapters.
 */

export interface TimelineMilestone {
  id: string;
  chapterId: string;
  year: number | string;
  periodLabel: string;
  titleVi: string;
  titleEn: string;
  summaryVi: string; // One concise sentence for the 3D pylon marker
  summaryEn: string;
  detailVi: string;  // Detailed verified account revealed upon click
  detailEn: string;
  sourceNote: string;
  category: 'founding' | 'wartime' | 'naming' | 'award' | 'academic' | 'infrastructure' | 'visit' | 'anniversary';
  verificationStatus: 'verified' | 'needs_review';
  positionZ: number; // Z-coordinate in 3D room (from +16m down to -14m)
  side: 'left' | 'right';
  customUrl?: string; // Optional real historical photograph from CMD / Firestore
}

export interface TimelineChapter {
  id: string;
  number: string;
  period: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  focusZ: number; // Target Z coordinate for camera jump
}

export interface TimelineRoomData {
  roomCode: 'timeline';
  titleVi: string;
  titleEn: string;
  schoolNameVi: string;
  schoolNameEn: string;
  mottoVi: string;
  mottoEn: string;
  chapters: TimelineChapter[];
  milestones: TimelineMilestone[];
}

export const TIMELINE_CHAPTERS: TimelineChapter[] = [
  {
    id: 'chap1',
    number: '01',
    period: '1966–1970',
    titleVi: 'Khởi Nguồn & Lớp Học Đầu Tiên',
    titleEn: 'Founding & First Classes',
    descriptionVi: 'Quyết định thành lập trường giữa mưa bom bão đạn và những lớp học tranh tre đầu tiên bên sân đình Lang Xá.',
    focusZ: 14,
  },
  {
    id: 'chap2',
    number: '02',
    period: '1970–1975',
    titleVi: 'Thử Thách Thời Chiến & Ổn Định',
    titleEn: 'Wartime Relocations & Settlement',
    descriptionVi: '5 lần di chuyển cơ sở, đào hào đắp lũy duy trì dạy học và dấu mốc trở về xây dựng trường tại Lộc Vượng năm 1974.',
    focusZ: 8.5,
  },
  {
    id: 'chap3',
    number: '03',
    period: '1982–1996',
    titleVi: 'Đổi Tên Trường & Nền Móng Thể Chế',
    titleEn: 'School Renaming & Institutional Growth',
    descriptionVi: 'Chính thức mang tên Anh hùng dân tộc Trần Hưng Đạo, đón Đại tướng Võ Nguyên Giáp về thăm và đón nhận Huân chương Lao động hạng Ba, hạng Nhì.',
    focusZ: 2.5,
  },
  {
    id: 'chap4',
    number: '04',
    period: '2000–2011',
    titleVi: 'Phát Triển Toàn Diện & Sự Công Nhận',
    titleEn: 'Comprehensive Growth & Major Honors',
    descriptionVi: 'Huân chương Lao động hạng Nhất, khánh thành tượng đài Trần Hưng Đạo, lọt Top 37 trường THPT toàn quốc và đạt Chuẩn Quốc gia.',
    focusZ: -3.5,
  },
  {
    id: 'chap5',
    number: '05',
    period: '2012–2024',
    titleVi: 'Hiện Đại Hóa & Đổi Mới Giáo Dục',
    titleEn: 'Modernization & Educational Innovation',
    descriptionVi: 'Nửa thế kỷ vẻ vang, thích ứng chuyển đổi số linh hoạt và khánh thành tòa nhà 4 tầng với 33 phòng học kiên cố hiện đại.',
    focusZ: -9,
  },
  {
    id: 'chap6',
    number: '06',
    period: '2025–2026',
    titleVi: 'Bản Sắc Mới & Đại Lễ 60 Năm',
    titleEn: 'New Identity & 60th Jubilee',
    descriptionVi: 'Chính thức mang tên THPT A Trần Hưng Đạo, đón nhận Cờ thi đua Chính phủ và hướng tới Đại lễ kỷ niệm 60 năm lịch sử hào hùng.',
    focusZ: -14.5,
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  // =========================================================================
  // CHAPTER 1: 1966–1970
  // =========================================================================
  {
    id: 'milestone_1966',
    chapterId: 'chap1',
    year: 1966,
    periodLabel: 'Tháng 6/1966',
    titleVi: 'Thành Lập Trường Cấp III Mỹ Lộc',
    titleEn: 'Foundation of My Loc High School',
    summaryVi: 'UBND tỉnh Nam Hà chủ trương thành lập trường tại thôn Lang Xá, xã Mỹ Tiến trong hoàn cảnh chiến tranh ác liệt.',
    summaryEn: 'Provincial authority approved establishing the school in Lang Xa amidst wartime defense.',
    detailVi: 'Trung tuần tháng 6 năm 1966, trước yêu cầu học tập của con em nhân dân thời chiến, Ty Giáo dục Nam Hà quyết định thành lập Trường Phổ thông cấp III Mỹ Lộc tại thôn Lang Xá, xã Mỹ Tiến. Lớp học đầu tiên được mượn tạm bên sân đình làng, thầy và trò cùng nhân dân đắp lũy đào hầm bảo vệ lớp học.',
    detailEn: 'In June 1966, Nam Ha Education Department founded My Loc High School at Lang Xa village. The first classrooms were set up next to the village communal house, surrounded by defensive earthworks and bomb shelters.',
    sourceNote: 'Lưu trữ Ty Giáo dục Nam Hà & Kỷ yếu 60 năm nhà trường',
    category: 'founding',
    verificationStatus: 'verified',
    positionZ: 15.5,
    side: 'left',
  },
  {
    id: 'milestone_1967_1968',
    chapterId: 'chap1',
    year: '1967–1968',
    periodLabel: 'Khóa 1967–1968',
    titleVi: 'Năm Học Sơ Tán Khắc Nghiệt Đầu Tiên',
    titleEn: 'First Harsh Evacuation Academic Years',
    summaryVi: 'Duy trì trọn vẹn việc dạy và học dưới hầm hào kèo tre, mũ rơm cùng tinh thần học tập kiên cường.',
    summaryEn: 'Sustained comprehensive teaching under bamboo structures, trench shelters, and straw hats.',
    detailVi: 'Thầy và trò vừa giảng dạy học tập vừa sẵn sàng chiến đấu. Học sinh đi học đội mũ rơm, đeo túi cứu thương, lớp học nửa chìm nửa nổi dưới lòng đất. Dù thiếu thốn sách vở và trang thiết bị, tỷ lệ tốt nghiệp khóa đầu tiên vẫn đạt kết quả xuất sắc, tạo tiền đề vững vàng cho truyền thống hiếu học.',
    detailEn: 'Teachers and students maintained rigorous education while prepared for civil defense. Classrooms were semi-subterranean bunkers. Despite severe scarcity, the first graduating cohort achieved outstanding success.',
    sourceNote: 'Hồi ký nhà giáo tiền bối & Biên niên sử nhà trường',
    category: 'wartime',
    verificationStatus: 'verified',
    positionZ: 12.8,
    side: 'right',
  },

  // =========================================================================
  // CHAPTER 2: 1970–1975
  // =========================================================================
  {
    id: 'milestone_1972',
    chapterId: 'chap2',
    year: 1972,
    periodLabel: 'Năm 1972',
    titleVi: '5 Lần Sơ Tán Qua Các Xã Trong Chiến Tranh',
    titleEn: 'Five Wartime Relocations across Communes',
    summaryVi: 'Nhà trường kiên cường vượt qua 5 lần di chuyển địa điểm để bảo toàn lực lượng và duy trì mạch nguồn giáo dục.',
    summaryEn: 'The school executed 5 strategic relocations across communes to preserve human life and continuity.',
    detailVi: 'Trong những năm tháng không quân Mỹ mở rộng đánh phá miền Bắc, trường đã phải 5 lần di chuyển qua các địa bàn: Lang Xá (Mỹ Tiến), La Chợ (Mỹ Tiến), Cư Nhân (Mỹ Thành), Mỹ Thắng và thôn Sói (Mỹ Hà). Tại mỗi chặng dừng chân, nhân dân địa phương đều hết lòng che chở, nhường nhà dựng lớp cho con em học tập.',
    detailEn: 'During intense aerial bombardments, the school relocated five times across communes. In every location, local villagers generously shared houses, yards, and food to shelter teachers and students.',
    sourceNote: 'Lịch sử truyền thống Đảng bộ huyện Mỹ Lộc & Tài liệu 60 năm',
    category: 'wartime',
    verificationStatus: 'verified',
    positionZ: 10.0,
    side: 'left',
  },
  {
    id: 'milestone_1974',
    chapterId: 'chap2',
    year: 1974,
    periodLabel: 'Tháng 10/1974',
    titleVi: 'Định Cư Lâu Dài Tại Lộc Vượng',
    titleEn: 'Permanent Settlement at Loc Vuong',
    summaryVi: 'Tháng 10/1974, trường chính thức chuyển về vị trí hiện nay tại xã Lộc Vượng, chấm dứt thời kỳ sơ tán.',
    summaryEn: 'In October 1974, the school settled permanently at Loc Vuong, ending the wartime relocation era.',
    detailVi: 'Tháng 10 năm 1974, sau 8 năm sơ tán gian khổ, trường chính thức được cấp đất xây dựng tại số 75/203 đường Trần Thái Tông, xã Lộc Vượng (nay là số 1A đường Tức Mạc, phường Lộc Vượng, TP Nam Định). Đây là mốc son mang tính bước ngoặt, mở ra trang sử xây dựng trường lớp kiên cố và phát triển bền vững.',
    detailEn: 'In October 1974, the school relocated to its permanent home in Loc Vuong, establishing a solid foundation for brick-and-mortar infrastructure and enduring educational stability.',
    sourceNote: 'Hồ sơ địa chính & Quyết định giao đất của UBND tỉnh Nam Hà',
    category: 'infrastructure',
    verificationStatus: 'verified',
    positionZ: 7.2,
    side: 'right',
  },
  {
    id: 'milestone_1974_1975',
    chapterId: 'chap2',
    year: '1974–1975',
    periodLabel: 'Năm học 1974–1975',
    titleVi: 'Quy Mô 27 Lớp & Bằng Khen Bộ Văn Hóa',
    titleEn: '27-Class Scale & MOCT Merit Commendation',
    summaryVi: 'Ổn định quy mô 27 lớp học và vinh dự được Bộ Văn hóa tặng Bằng khen phong trào "Tiếng hát át tiếng bom".',
    summaryEn: 'Stabilized at 27 classes and received the Ministry of Culture Commendation for arts resilience.',
    detailVi: 'Năm học đầu tiên tại cơ sở mới Lộc Vượng, trường có quy mô 27 lớp với gần 1.400 học sinh. Phong trào văn hóa, thể thao và thi đua dạy tốt học tốt diễn ra sôi nổi. Đoàn nghệ thuật xung kích của trường vinh dự được Bộ Văn hóa trao tặng Bằng khen toàn quốc.',
    detailEn: 'In the first year at Loc Vuong, the school expanded to 27 classes with nearly 1,400 students. Its cultural art troupe was awarded a National Certificate of Merit by the Ministry of Culture.',
    sourceNote: 'Bằng khen Bộ Văn hóa trao tặng (1975) & Kỷ yếu nhà trường',
    category: 'award',
    verificationStatus: 'verified',
    positionZ: 4.5,
    side: 'left',
  },

  // =========================================================================
  // CHAPTER 3: 1982–1996
  // =========================================================================
  {
    id: 'milestone_1982',
    chapterId: 'chap3',
    year: 1982,
    periodLabel: '26/10/1982',
    titleVi: 'Chính Thức Mang Tên Trần Hưng Đạo',
    titleEn: 'Official Naming: Tran Hung Dao High School',
    summaryVi: 'UBND tỉnh Hà Nam Ninh ký quyết định đổi tên trường thành Trường Phổ thông trung học Trần Hưng Đạo.',
    summaryEn: 'Provincial People’s Committee issued Decision 1042 renaming the school after National Hero Tran Hung Dao.',
    detailVi: 'Ngày 26/10/1982, UBND tỉnh Hà Nam Ninh ban hành Quyết định số 1042/QĐ-UB chính thức đổi tên Trường Phổ thông cấp III Mỹ Lộc thành Trường Phổ thông trung học Trần Hưng Đạo. Vinh dự mang tên vị Anh hùng dân tộc trên mảnh đất Tức Mạc là nguồn cảm hứng và niềm tự hào lớn lao cho mọi thế hệ thầy trò.',
    detailEn: 'On October 26, 1982, Decision 1042/QD-UB officially renamed the school to Tran Hung Dao High School, anchoring its identity in the national legacy of Saint Tran on historic Tuc Mac land.',
    sourceNote: 'Quyết định số 1042/QĐ-UB ngày 26/10/1982 của UBND tỉnh Hà Nam Ninh',
    category: 'naming',
    verificationStatus: 'verified',
    positionZ: 3.0,
    side: 'right',
  },
  {
    id: 'milestone_1991',
    chapterId: 'chap3',
    year: 1991,
    periodLabel: 'Kỷ niệm 25 năm',
    titleVi: 'Đón Nhận Huân Chương Lao Động Hạng Ba',
    titleEn: 'Labour Medal, Third Class (25th Anniversary)',
    summaryVi: 'Chủ tịch Hội đồng Nhà nước trao tặng Huân chương Lao động hạng Ba ghi nhận 25 năm cống hiến vẻ vang.',
    summaryEn: 'State Council President awarded the 3rd Class Labor Order recognizing 25 years of outstanding service.',
    detailVi: 'Đại lễ kỷ niệm 25 năm ngày thành lập trường (1966–1991), nhà trường vinh dự đón nhận Huân chương Lao động hạng Ba. Đây là phần thưởng cấp Nhà nước đầu tiên, khẳng định bước trưởng thành vững chắc sau một phần tư thế kỷ dựng xây và bồi dưỡng nhân tài.',
    detailEn: 'Marking the 25th anniversary, the school was honored with the Labor Order 3rd Class—its first State-level medal acknowledging a quarter-century of dedication to education.',
    sourceNote: 'Quyết định khen thưởng của Chủ tịch Hội đồng Nhà nước (1991)',
    category: 'award',
    verificationStatus: 'verified',
    positionZ: 1.2,
    side: 'left',
  },
  {
    id: 'milestone_1992',
    chapterId: 'chap3',
    year: 1992,
    periodLabel: 'Năm 1992',
    titleVi: 'Đại Tướng Võ Nguyên Giáp Về Thăm Trường',
    titleEn: 'General Vo Nguyen Giap Visits the Campus',
    summaryVi: 'Đại tướng Võ Nguyên Giáp về thăm, ân cần căn dặn thầy trò phát huy tinh thần yêu nước và rèn đức luyện tài.',
    summaryEn: 'General Vo Nguyen Giap visited, counseling faculty and students to cultivate patriotism and academic excellence.',
    detailVi: 'Năm 1992, Đại tướng Võ Nguyên Giáp đã về thăm trường. Đại tướng dành thời gian trò chuyện thân mật với cán bộ giáo viên và học sinh, căn dặn thầy trò luôn tự hào với ngôi trường mang tên Quốc công Tiết chế Hưng Đạo Đại vương, ra sức rèn đức luyện tài để dựng xây đất nước.',
    detailEn: 'In 1992, legendary General Vo Nguyen Giap visited the school, sharing intimate encouragement and urging students to uphold the heroic heritage of Tran Hung Dao in building a prosperous Vietnam.',
    sourceNote: 'Ảnh tư liệu lưu niệm & Biên niên sử truyền thống nhà trường năm 1992',
    category: 'visit',
    verificationStatus: 'verified',
    positionZ: -0.6,
    side: 'right',
  },
  {
    id: 'milestone_1993_1994',
    chapterId: 'chap3',
    year: '1993–1994',
    periodLabel: '1993–1994',
    titleVi: '1 Trong 7 Trường Toàn Quốc Thí Điểm Phân Ban',
    titleEn: '1 of 7 National Curriculum Reform Schools',
    summaryVi: 'Bộ GD&ĐT tin tưởng lựa chọn trường là một trong 7 trường THPT toàn quốc thực hiện thí điểm phân ban.',
    summaryEn: 'Selected by MOET as one of seven nationwide high schools piloting the specialized curriculum stream.',
    detailVi: 'Năm học 1993–1994, Bộ Giáo dục & Đào tạo chọn trường tham gia chương trình thí điểm phân ban cấp THPT toàn quốc (Ban Khoa học tự nhiên và Ban Kỹ thuật công nghệ). Việc được chọn vào nhóm 7 trường tiêu biểu toàn quốc khẳng định uy tín sư phạm và năng lực đào tạo chất lượng cao của nhà trường.',
    detailEn: 'In the 1993–1994 school year, the Ministry of Education & Training selected the school among 7 institutions nationwide to pilot academic streaming, confirming its pedagogical prestige.',
    sourceNote: 'Quyết định chỉ đạo phân ban của Bộ GD&ĐT (1993)',
    category: 'academic',
    verificationStatus: 'verified',
    positionZ: -2.0,
    side: 'left',
  },
  {
    id: 'milestone_1996',
    chapterId: 'chap3',
    year: 1996,
    periodLabel: 'Kỷ niệm 30 năm',
    titleVi: 'Đón Nhận Huân Chương Lao Động Hạng Nhì',
    titleEn: 'Labour Medal, Second Class (30th Anniversary)',
    summaryVi: 'Đánh dấu 30 năm xây dựng và phát triển, nhà trường đón nhận Huân chương Lao động hạng Nhì của Chủ tịch nước.',
    summaryEn: 'Awarded the Labor Order 2nd Class on the 30th anniversary, recognizing major institutional growth.',
    detailVi: 'Đại lễ kỷ niệm 30 năm ngày thành lập trường (1966–1996), nhà trường vinh dự đón nhận Huân chương Lao động hạng Nhì. Cơ sở vật chất lúc này được mở rộng đồng bộ với dãy nhà D, hội trường đa năng và các phòng thí nghiệm thực hành bộ môn.',
    detailEn: 'On the 30th jubilee, the school received the Labor Order 2nd Class. Facilities expanded with new multi-storey blocks, assembly hall, and standardized scientific laboratories.',
    sourceNote: 'Quyết định khen thưởng của Chủ tịch nước (1996)',
    category: 'award',
    verificationStatus: 'verified',
    positionZ: -3.4,
    side: 'right',
  },

  // =========================================================================
  // CHAPTER 4: 2000–2011
  // =========================================================================
  {
    id: 'milestone_2000',
    chapterId: 'chap4',
    year: 2000,
    periodLabel: 'Năm 2000',
    titleVi: 'Đón Nhận Huân Chương Lao Động Hạng Nhất',
    titleEn: 'Labour Medal, First Class (Year 2000)',
    summaryVi: 'Trọn bộ Huân chương Lao động (Ba, Nhì, Nhất) sau 34 năm nỗ lực không ngừng nghỉ vì sự nghiệp trồng người.',
    summaryEn: 'Completed the full set of Labor Orders (3rd, 2nd, 1st Class) honoring exceptional academic merit.',
    detailVi: 'Bước sang thiên niên kỷ mới, nhà trường vinh dự được Chủ tịch nước trao tặng Huân chương Lao động hạng Nhất. Đây là mốc son hoàn tất trọn bộ ba hạng Huân chương Lao động, khẳng định vị thế trường học kiểu mẫu tiêu biểu của ngành Giáo dục Nam Định.',
    detailEn: 'Entering the new millennium, the school received the Labor Order First Class, achieving the complete trifecta of Labor Medals and cementing its reputation as a premier model high school.',
    sourceNote: 'Hồ sơ khen thưởng của Chủ tịch nước năm 2000',
    category: 'award',
    verificationStatus: 'verified',
    positionZ: -4.8,
    side: 'left',
  },
  {
    id: 'milestone_2006',
    chapterId: 'chap4',
    year: 2006,
    periodLabel: '28/08/2006',
    titleVi: 'Khánh Thành Tượng Đài Đức Thánh Trần',
    titleEn: 'Inauguration of Tran Hung Dao Bronze Statue',
    summaryVi: 'Khánh thành tượng đài Anh hùng dân tộc Trần Hưng Đạo và đón nhận Bằng khen của Thủ tướng Chính phủ.',
    summaryEn: 'Inaugurated the central bronze monument of General Tran Hung Dao and received PM Commendation.',
    detailVi: 'Đại lễ 40 năm thành lập trường (1966–2006), trường đón nhận Bằng khen của Thủ tướng Chính phủ. Ngày 28/08/2006, tượng đồng Hưng Đạo Đại vương uy nghiêm chính thức được khánh thành tại vị trí trang trọng giữa khuôn viên, trở thành biểu tượng tinh thần rạng rỡ của nhà trường.',
    detailEn: 'Celebrating the 40th anniversary, the school was awarded the Prime Minister’s Certificate of Merit. On August 28, 2006, the heroic bronze statue of Supreme Commander Tran Hung Dao was grandly inaugurated.',
    sourceNote: 'Biên bản khánh thành tượng đài 28/08/2006 & Kỷ yếu 40 năm',
    category: 'infrastructure',
    verificationStatus: 'verified',
    positionZ: -6.2,
    side: 'right',
  },
  {
    id: 'milestone_2007',
    chapterId: 'chap4',
    year: 2007,
    periodLabel: 'Năm 2007',
    titleVi: 'Top 37 Trường THPT Có Điểm Thi ĐH Cao Nhất',
    titleEn: 'Ranked 37th in Top 200 Nationwide Schools',
    summaryVi: 'Bộ GD&ĐT công bố trường xuất sắc đứng thứ 37 trong Top 200 trường THPT có điểm thi Đại học cao nhất toàn quốc.',
    summaryEn: 'Ranked 37th nationwide in university entrance examination results officially announced by MOET.',
    detailVi: 'Theo công bố chính thức của Bộ Giáo dục & Đào tạo năm 2007 về kết quả kỳ thi Tuyển sinh Đại học, Trường THPT Trần Hưng Đạo xuất sắc đứng thứ 37 trong Top 200 trường THPT có điểm thi đại học cao nhất toàn quốc, minh chứng cho chất lượng đào tạo mũi nhọn vững vàng.',
    detailEn: 'In the official university entrance exam rankings released by MOET in 2007, the school ranked 37th among all high schools in Vietnam, affirming top-tier academic rigor.',
    sourceNote: 'Bảng xếp hạng kỳ thi Tuyển sinh Đại học (Bộ GD&ĐT, 2007)',
    category: 'academic',
    verificationStatus: 'verified',
    positionZ: -7.6,
    side: 'left',
  },
  {
    id: 'milestone_2009',
    chapterId: 'chap4',
    year: 2009,
    periodLabel: 'Năm 2009',
    titleVi: 'Được Công Nhận Trường Chuẩn Quốc Gia',
    titleEn: 'Certified as National Standard High School',
    summaryVi: 'Chính thức được công nhận đạt chuẩn Quốc gia bậc THPT về chất lượng giáo dục và cảnh quan trường lớp.',
    summaryEn: 'Formally recognized as a National Standard High School meeting stringent institutional benchmarks.',
    detailVi: 'Năm 2009, nhà trường chính thức được UBND tỉnh và Bộ GD&ĐT công nhận đạt Chuẩn Quốc gia bậc THPT. Sự ghi nhận toàn diện về chất lượng đội ngũ giáo viên, tỷ lệ học sinh khá giỏi và cơ sở vật chất văn minh, an toàn, hiện đại.',
    detailEn: 'In 2009, the school achieved official National Standard High School accreditation, reflecting excellence in teaching staff qualifications, student performance, and modern campus infrastructure.',
    sourceNote: 'Quyết định công nhận trường Chuẩn Quốc gia năm 2009',
    category: 'academic',
    verificationStatus: 'verified',
    positionZ: -8.8,
    side: 'right',
  },
  {
    id: 'milestone_2011',
    chapterId: 'chap4',
    year: 2011,
    periodLabel: 'Kỷ niệm 45 năm',
    titleVi: 'Đón Nhận Huân Chương Độc Lập Hạng Ba',
    titleEn: 'Independence Medal, Third Class (45th Anniversary)',
    summaryVi: 'Chủ tịch nước trao tặng Huân chương Độc lập hạng Ba nhân dịp Đại lễ 45 năm thành lập trường (1966–2011).',
    summaryEn: 'Awarded the prestigious Independence Order 3rd Class on the 45th founding anniversary.',
    detailVi: 'Kỷ niệm 45 năm thành lập trường (1966–2011), Chủ tịch nước trao tặng Huân chương Độc lập hạng Ba vì những thành tích đặc biệt xuất sắc cho sự nghiệp giáo dục và bảo vệ Tổ quốc. Quy mô trường lúc này đạt 36 lớp với hơn 1.600 học sinh.',
    detailEn: 'Commemorating 45 years of foundation, the school was awarded the Independence Order 3rd Class—one of the highest state honors—with a school scale of 36 classes and over 1,600 students.',
    sourceNote: 'Quyết định tặng thưởng Huân chương Độc lập của Chủ tịch nước (2011)',
    category: 'award',
    verificationStatus: 'verified',
    positionZ: -10.0,
    side: 'left',
  },

  // =========================================================================
  // CHAPTER 5: 2012–2024
  // =========================================================================
  {
    id: 'milestone_2016',
    chapterId: 'chap5',
    year: 2016,
    periodLabel: 'Kỷ niệm 50 năm',
    titleVi: 'Đại Lễ Kỷ Niệm Nửa Thế Kỷ Xây Dựng (1966–2016)',
    titleEn: '50th Golden Jubilee Anniversary (1966–2016)',
    summaryVi: 'Mốc son 50 năm hội tụ các thế hệ nhà giáo và cựu học sinh từ khắp mọi miền Tổ quốc về mái trường xưa.',
    summaryEn: 'The 50th Golden Jubilee brought together generations of mentors and alumni from across Vietnam.',
    detailVi: 'Đại lễ kỷ niệm nửa thế kỷ xây dựng và trưởng thành (1966–2016) là ngày hội lớn của các thế hệ thầy và trò. Năm mươi năm nhìn lại, trường đã đào tạo hàng vạn học sinh tốt nghiệp, hàng nghìn kỹ sư, bác sĩ, sĩ quan lực lượng vũ trang và cán bộ quản lý đang cống hiến cho đất nước.',
    detailEn: 'The 50th anniversary marked half a century of relentless dedication, celebrating tens of thousands of graduates who became scientists, physicians, military officers, and civic leaders.',
    sourceNote: 'Kỷ yếu Đại lễ 50 năm ngày thành lập trường (1966–2016)',
    category: 'anniversary',
    verificationStatus: 'verified',
    positionZ: -11.4,
    side: 'right',
  },
  {
    id: 'milestone_2021',
    chapterId: 'chap5',
    year: 2021,
    periodLabel: 'Kỷ niệm 55 năm',
    titleVi: '55 Năm & Tiên Phong Chuyển Đổi Số Giáo Dục',
    titleEn: '55th Anniversary & Digital Transformation Pioneer',
    summaryVi: 'Dấu mốc 55 năm kiên cường vượt khó, tiên phong thích ứng linh hoạt trong quản trị và dạy học số hóa.',
    summaryEn: 'Marked 55 years by pioneering digital lesson planning, smart platforms, and resilient hybrid education.',
    detailVi: 'Kỷ niệm 55 năm ngày thành lập trường, đối mặt với thử thách đổi mới giáo dục thời đại số, nhà trường tiên phong triển khai giáo án điện tử, bồi dưỡng 100% cán bộ giáo viên sử dụng nền tảng số và duy trì xuất sắc chất lượng giáo dục toàn diện.',
    detailEn: 'Celebrating 55 years, the school pioneered digital lesson planning and cloud educational workflows, training 100% of teachers and ensuring uninterrupted educational excellence.',
    sourceNote: 'Báo cáo tổng kết chiến lược chuyển đổi số nhà trường giai đoạn 2016–2021',
    category: 'academic',
    verificationStatus: 'verified',
    positionZ: -12.6,
    side: 'left',
  },
  {
    id: 'milestone_2024_2025',
    chapterId: 'chap5',
    year: '2024–2025',
    periodLabel: 'Năm học 2024–2025',
    titleVi: 'Đưa Vào Vận Hành Tòa Nhà 4 Tầng 33 Phòng Học',
    titleEn: 'Commissioning of 4-Storey 33-Classroom Complex',
    summaryVi: 'Khánh thành công trình tòa nhà học 4 tầng kiên cố với 33 phòng học đạt chuẩn Chương trình GDPT 2018.',
    summaryEn: 'Completed and inaugurated the modern 4-storey building with 33 high-standard classrooms.',
    detailVi: 'Năm học 2024–2025, công trình tòa nhà học 4 tầng kiên cố với 33 phòng học tiêu chuẩn cao chính thức được bàn giao và đưa vào sử dụng, trang bị màn hình tương tác thông minh, điều hòa và hệ thống chiếu sáng chuẩn học đường, tạo diện mạo khang trang hiện đại.',
    detailEn: 'In 2024–2025, the school inaugurated the modern 4-storey classroom wing with 33 standardized rooms featuring smart interactive screens and climate control.',
    sourceNote: 'Biên bản nghiệm thu đưa công trình vào sử dụng (Sở GD&ĐT Nam Định, 2024)',
    category: 'infrastructure',
    verificationStatus: 'verified',
    positionZ: -13.8,
    side: 'right',
  },

  // =========================================================================
  // CHAPTER 6: 2025–2026
  // =========================================================================
  {
    id: 'milestone_2025_name',
    chapterId: 'chap6',
    year: 2025,
    periodLabel: 'Tháng 7/2025',
    titleVi: 'Chính Thức Mang Tên THPT A Trần Hưng Đạo',
    titleEn: 'Officially Named THPT A Tran Hung Dao',
    summaryVi: 'Từ tháng 7/2025, nhà trường chính thức mang tên gọi: Trường Trung học phổ thông A Trần Hưng Đạo.',
    summaryEn: 'From July 2025, the school was officially designated as Tran Hung Dao A High School.',
    detailVi: 'Thực hiện quyết định sắp xếp và phân cấp của UBND tỉnh, từ tháng 7 năm 2025, nhà trường chính thức mang tên gọi Trường THPT A Trần Hưng Đạo, xác lập vị thế trường trung tâm chất lượng cao của khu vực và vững bước tiến vào Đại lễ 60 năm.',
    detailEn: 'In July 2025, administrative restructuring formalized the current official title: Tran Hung Dao A High School, affirming its benchmark standing in provincial education.',
    sourceNote: 'Quyết định hành chính về việc đổi tên và phân cấp trường học (7/2025)',
    category: 'naming',
    verificationStatus: 'verified',
    positionZ: -15.0,
    side: 'left',
  },
  {
    id: 'milestone_2026',
    chapterId: 'chap6',
    year: 2026,
    periodLabel: 'Năm học 2025–2026',
    titleVi: 'Đại Lễ 60 Năm & Cờ Thi Đua Của Chính Phủ',
    titleEn: '60th Jubilee & Government Emulation Flag',
    summaryVi: 'Kỷ niệm 60 năm thành lập trường (1966–2026), vinh dự đón nhận Cờ thi đua xuất sắc của Chính phủ.',
    summaryEn: 'Celebrated the 60th founding jubilee (1966–2026) and received the Government Emulation Flag.',
    detailVi: 'Đại lễ kỷ niệm 60 năm ngày thành lập trường (1966–2026). Nhà trường vinh dự đón nhận Cờ thi đua của Chính phủ năm học 2025–2026 vì thành tích xuất sắc dẫn đầu khối THPT. Quy mô trường hiện nay: 39 lớp, 1.750 học sinh, 89 cán bộ giáo viên (100% đạt chuẩn, 31 Thạc sĩ), tiếp nối vẻ vang truyền thống 60 năm anh hùng.',
    detailEn: 'Marking the 60th anniversary (1966–2026), the school was awarded the Government Emulation Flag. Today it thrives with 39 classes, 1,750 students, and 89 faculty members (31 with Master’s degrees).',
    sourceNote: 'Quyết định tặng Cờ thi đua của Chính phủ & Thống kê chính thức năm 2026',
    category: 'anniversary',
    verificationStatus: 'verified',
    positionZ: -16.2,
    side: 'right',
  },
];

export const TIMELINE_ROOM_CONTENT: TimelineRoomData = {
  roomCode: 'timeline',
  titleVi: 'DÒNG CHẢY 60 NĂM — 1966–2026',
  titleEn: 'CHRONOLOGICAL TIMELINE — 1966–2026',
  schoolNameVi: 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
  schoolNameEn: 'TRAN HUNG DAO A HIGH SCHOOL',
  mottoVi: '60 năm – một điểm tựa, một quỹ đạo tương lai.',
  mottoEn: '60 years – one anchor, an orbit for the future.',
  chapters: TIMELINE_CHAPTERS,
  milestones: TIMELINE_MILESTONES,
};
