/**
 * Canonical Historical Content Dataset for the Gratitude & Memories Room:
 * "PHÒNG TRI ÂN & KÝ ỨC"
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 *
 * Grounded in school archives and teacher-student memoirs.
 * Exactly four architectural walls:
 * - Wall 1 (Left): "NHỮNG NGƯỜI LÁI ĐÒ" (Teachers and educators)
 * - Wall 2 (Right): "NHỮNG KHOẢNH KHẮC KHÔNG QUÊN" (Teacher-student memories)
 * - Wall 3 (Front): "TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ" (Main Gratitude Essay & Dedication Shrine)
 * - Wall 4 (Entrance): "DẤU ẤN CỦA LÒNG BIẾT ƠN" (Room title, intro & motto)
 */

export interface TeacherItem {
  id: string;
  order: number;
  title: string;
  teacherName?: string;
  role?: string;
  period?: string;
  bio?: string;
  customUrl?: string;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface MomentItem {
  id: string;
  order: number;
  title: string;
  caption: string;
  schoolYear?: string;
  category?: string;
  story?: string;
  customUrl?: string;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface GratitudeEssayData {
  title: string;
  subtitle: string;
  paragraphs: string[];
  closing: string;
  signoff: string;
}

export interface EntranceIntroData {
  roomTitleVi: string;
  roomTitleEn: string;
  headingVi: string;
  introParagraph: string;
  mottoVi: string;
}

export interface MemoryRoomData {
  roomCode: 'memory';
  roomNameVi: string;
  roomNameEn: string;
  schoolNameVi: string;
  schoolNameEn: string;
  entranceIntro: EntranceIntroData;
  gratitudeEssay: GratitudeEssayData;
  wall1Title: string;
  wall1Subtitle: string;
  teachers: TeacherItem[];
  wall2Title: string;
  wall2Subtitle: string;
  moments: MomentItem[];
}

export const INITIAL_GRATITUDE_ESSAY: GratitudeEssayData = {
  title: 'TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ',
  subtitle: 'Trường THPT A Trần Hưng Đạo — 60 Năm Nghĩa Tình Thầy Trò (1966–2026)',
  paragraphs: [
    'Có những người lặng thầm cống hiến cả cuộc đời mình cho sự nghiệp trồng người; có những bài học không chỉ mở ra tri thức mà còn vun đắp nhân cách, ước mơ và tương lai cho bao thế hệ học sinh. Đó chính là những người thầy, người cô kính yêu của chúng ta.',
    'Trên hành trình xây dựng và phát triển của Trường THPT A Trần Hưng Đạo, các thế hệ thầy cô đã luôn tận tụy với nghề, hết lòng vì học sinh, vượt qua những khó khăn để giữ gìn và vun đắp truyền thống nhà trường. Mỗi bài giảng, mỗi lời động viên, mỗi sự tận tâm đều góp phần tạo nên những giá trị bền vững, theo học trò trên suốt chặng đường trưởng thành.',
    'Năm tháng có thể trôi qua, những thế hệ học sinh rồi sẽ rời mái trường để đến với những chân trời mới, nhưng tình thầy trò và những ký ức dưới mái trường thân yêu sẽ mãi là hành trang quý giá. Dẫu thời gian đổi thay, công lao và tình yêu thương của thầy cô vẫn luôn được các thế hệ học sinh trân trọng, ghi nhớ.',
    'Phòng Tri ân là nơi lưu giữ những hình ảnh, kỷ niệm và tình cảm chân thành ấy; là lời biết ơn gửi đến các thế hệ nhà giáo đã và đang đồng hành cùng nhà trường.',
    'Xin kính chúc các thầy cô luôn mạnh khỏe, hạnh phúc và giữ mãi ngọn lửa nhiệt huyết với sự nghiệp trồng người.',
  ],
  closing: 'Trân trọng và biết ơn!',
  signoff: 'Tập thể các thế hệ học sinh Trường THPT A Trần Hưng Đạo',
};

export const INITIAL_ENTRANCE_INTRO: EntranceIntroData = {
  roomTitleVi: 'PHÒNG TRI ÂN & KÝ ỨC',
  roomTitleEn: 'GRATITUDE & MEMORIES ROOM',
  headingVi: 'DẤU ẤN CỦA LÒNG BIẾT ƠN',
  introParagraph:
    'Không gian trang trọng lưu giữ hình bóng những người lái đò thầm lặng, khắc ghi tình cảm tri ân sâu sắc của bao thế hệ học trò và gìn giữ những ký ức thanh xuân tươi đẹp nhất dưới mái trường THPT A Trần Hưng Đạo.',
  mottoVi: 'Tôn sư trọng đạo — Uống nước nhớ nguồn.',
};

export const INITIAL_TEACHERS: TeacherItem[] = [
  {
    id: 'memory_teacher_1',
    order: 1,
    title: 'Ban Giám Hiệu Tiền Bối Thời Kỳ Sơ Tán',
    teacherName: 'Thầy Hiệu trưởng Trần Khắc Mẫn & Ban Giám Hiệu Khóa Đầu',
    role: 'Hiệu trưởng đầu tiên (1966–1972)',
    period: '1966–1972',
    bio: 'Những người khai mở mái trường cấp III Mỹ Lộc bên sân đình Lang Xá, cùng cán bộ giáo viên dựng lớp khoét hào duy trì việc dạy và học trong mưa bom bão đạn.',
    positionX: -9.8,
    positionY: 2.3,
    positionZ: 6.0,
  },
  {
    id: 'memory_teacher_2',
    order: 2,
    title: 'Thầy Cô Giáo Thời Kỳ Ổn Định Tại Lộc Vượng',
    teacherName: 'Tập thể Hội đồng Sư phạm Nhà trường (1974–1985)',
    role: 'Cán bộ giáo viên thời kỳ hòa bình tái thiết',
    period: '1974–1985',
    bio: 'Đặt nền móng xây dựng trường lớp kiên cố tại số 1A đường Tức Mạc, phường Lộc Vượng; đưa phong trào thi đua dạy tốt học tốt đi vào nền nếp.',
    positionX: -9.8,
    positionY: 2.3,
    positionZ: 2.4,
  },
  {
    id: 'memory_teacher_3',
    order: 3,
    title: 'Các Thế Hệ Nhà Giáo Ưu Tú & Cốt Cán Bộ Môn',
    teacherName: 'Các Nhà giáo Ưu tú & Tổ trưởng Chuyên môn Tiêu biểu',
    role: 'Cán bộ cốt cán các tổ Tự nhiên & Xã hội',
    period: '1985–2000',
    bio: 'Những người thầy, người cô tận tụy bồi dưỡng đội tuyển học sinh giỏi các môn Toán, Lý, Hóa, Văn, Sử, Địa, mang về nhiều giải thưởng cao cấp tỉnh và quốc gia.',
    positionX: -9.8,
    positionY: 2.3,
    positionZ: -1.2,
  },
  {
    id: 'memory_teacher_4',
    order: 4,
    title: 'Tập Thể Sư Phạm Thời Kỳ Đón Nhận Huân Chương',
    teacherName: 'Hội đồng Sư phạm Giai đoạn 2000–2011',
    role: 'Tập thể cán bộ giáo viên tiêu biểu',
    period: '2000–2011',
    bio: 'Giai đoạn vẻ vang trường đón nhận Huân chương Lao động hạng Nhất và Huân chương Độc lập hạng Ba, khẳng định vị thế trường THPT trọng điểm chất lượng cao.',
    positionX: -9.8,
    positionY: 2.3,
    positionZ: -4.8,
  },
  {
    id: 'memory_teacher_5',
    order: 5,
    title: 'Đội Ngũ Giáo Viên Tiên Phong Đổi Mới Giáo Dục',
    teacherName: 'Đội ngũ Thạc sĩ, Giáo viên Dạy giỏi Giai đoạn 2012–2024',
    role: 'Giáo viên nòng cốt đổi mới phương pháp',
    period: '2012–2024',
    bio: 'Tiên phong ứng dụng công nghệ thông tin, nghiên cứu khoa học kỹ thuật, bồi dưỡng học sinh thi đại học đạt kết quả cao trong tốp đầu toàn quốc.',
    positionX: -9.8,
    positionY: 2.3,
    positionZ: -8.4,
  },
  {
    id: 'memory_teacher_6',
    order: 6,
    title: 'Hội Đồng Sư Phạm Hướng Tới Kỷ Niệm 60 Năm',
    teacherName: 'Ban Giám Hiệu & Hội đồng Sư phạm Năm học 2025–2026',
    role: 'Tập thể cán bộ giáo viên đương nhiệm',
    period: '2025–2026',
    bio: '89 cán bộ giáo viên, nhân viên (100% đạt chuẩn, 31 Thạc sĩ) kế thừa và phát huy truyền thống vẻ vang 60 năm, vững bước bước vào kỷ nguyên giáo dục thông minh.',
    positionX: -9.8,
    positionY: 2.3,
    positionZ: -12.0,
  },
];

export const INITIAL_MOMENTS: MomentItem[] = [
  {
    id: 'memory_moment_1',
    order: 1,
    title: 'Những Lớp Học Dưới Hầm Hào Thời Chiến',
    caption: 'Lớp học nửa chìm nửa nổi và chiếc mũ rơm che chở ước mơ học trò.',
    schoolYear: 'Khóa 1966–1972',
    category: 'Ký ức thời chiến',
    story: 'Kỷ niệm khó phai về những ngày thầy và trò cùng đào hào đắp lũy quanh sân đình Lang Xá. Đang giờ học, nghe tiếng còi báo động, thầy trò cùng nhau xuống hầm trú ẩn, ngớt tiếng bom lại tiếp tục bài giảng bên ánh đèn dầu.',
    positionX: 9.8,
    positionY: 2.3,
    positionZ: 6.0,
  },
  {
    id: 'memory_moment_2',
    order: 2,
    title: 'Tiếng Hát Át Tiếng Bom & Bằng Khen Bộ Văn Hóa',
    caption: 'Đoàn văn nghệ xung kích thầy trò biểu diễn trong những năm kháng chiến.',
    schoolYear: 'Năm học 1974–1975',
    category: 'Phong trào thi đua',
    story: 'Thầy và trò tích cực tham gia phong trào "Tiếng hát át tiếng bom", đem lời ca tiếng hát cổ vũ tinh thần học tập và chi viện cho tiền tuyến, vinh dự được Bộ Văn hóa tặng Bằng khen toàn quốc.',
    positionX: 9.8,
    positionY: 2.3,
    positionZ: 2.4,
  },
  {
    id: 'memory_moment_3',
    order: 3,
    title: 'Giờ Học Thí Nghiệm & Thí Điểm Phân Ban Toàn Quốc',
    caption: 'Học sinh chăm chú bên kính hiển vi và thiết bị thực hành phòng Lab.',
    schoolYear: 'Năm học 1993–1994',
    category: 'Chuyên môn học tập',
    story: 'Dấu ấn trường là 1 trong 7 trường THPT toàn quốc được Bộ GD&ĐT chọn thực hiện chương trình thí điểm phân ban, mở ra phương pháp dạy học thực nghiệm và định hướng nghề nghiệp sớm cho học sinh.',
    positionX: 9.8,
    positionY: 2.3,
    positionZ: -1.2,
  },
  {
    id: 'memory_moment_4',
    order: 4,
    title: 'Đại Lễ Khánh Thành Tượng Đài Đức Thánh Trần',
    caption: 'Các thế hệ thầy cô và học sinh bên tượng đài Hưng Đạo Đại vương uy nghiêm.',
    schoolYear: '28/08/2006',
    category: 'Sự kiện trọng đại',
    story: 'Ngày 28/08/2006, nhân kỷ niệm 40 năm thành lập trường, tượng đồng Đức Thánh Trần được khánh thành tại vị trí trung tâm sân trường, trở thành nơi hội tụ tinh thần và lòng tự hào của bao thế hệ học sinh.',
    positionX: 9.8,
    positionY: 2.3,
    positionZ: -4.8,
  },
  {
    id: 'memory_moment_5',
    order: 5,
    title: 'Hội Khóa & Ngày Trở Về Tri Ân Thầy Cô',
    caption: 'Cựu học sinh các khóa về thăm trường, cài hoa tri ân các thầy cô giáo cũ.',
    schoolYear: 'Các khóa cựu học sinh',
    category: 'Tri ân thầy trò',
    story: 'Những cuộc hội ngộ ấm áp đầy xúc động của các thế hệ học trò sau 10, 20, 30 năm ra trường. Dù công tác ở khắp mọi miền đất nước hay ở nước ngoài, học trò luôn hướng về trường xưa với lòng biết ơn sâu nặng.',
    positionX: 9.8,
    positionY: 2.3,
    positionZ: -8.4,
  },
  {
    id: 'memory_moment_6',
    order: 6,
    title: 'Lễ Khai Giảng & Hoạt Động Trải Nghiệm Sáng Tạo',
    caption: 'Sắc áo cờ đỏ sao vàng và nụ cười rạng rỡ của học sinh trong ngày hội trường.',
    schoolYear: 'Năm học 2025–2026',
    category: 'Hoạt động trường lớp',
    story: 'Không khí trang nghiêm của lễ chào cờ đầu tuần và những hoạt động ngoại khóa, câu lạc bộ STEM, thể thao, văn nghệ sôi nổi, tạo nên môi trường học tập hạnh phúc và truyền cảm hứng.',
    positionX: 9.8,
    positionY: 2.3,
    positionZ: -12.0,
  },
];

export const MEMORY_ROOM_CONTENT: MemoryRoomData = {
  roomCode: 'memory',
  roomNameVi: 'PHÒNG TRI ÂN & KÝ ỨC',
  roomNameEn: 'GRATITUDE & MEMORIES ROOM',
  schoolNameVi: 'TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
  schoolNameEn: 'TRAN HUNG DAO A HIGH SCHOOL',
  entranceIntro: INITIAL_ENTRANCE_INTRO,
  gratitudeEssay: INITIAL_GRATITUDE_ESSAY,
  wall1Title: 'NHỮNG NGƯỜI LÁI ĐÒ',
  wall1Subtitle: 'Tôn vinh các thế hệ cán bộ giáo viên, người thầy khai sáng và tận tụy qua 60 năm',
  teachers: INITIAL_TEACHERS,
  wall2Title: 'NHỮNG KHOẢNH KHẮC KHÔNG QUÊN',
  wall2Subtitle: 'Ký ức thầy trò, hình ảnh lớp học và những kỷ niệm sâu sắc dưới mái trường thân yêu',
  moments: INITIAL_MOMENTS,
};
