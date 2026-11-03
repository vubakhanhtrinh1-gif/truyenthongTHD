/**
 * Canonical Historical Content Dataset for Zone 2: The Development Journey (1974–2026)
 * Trường THPT A Trần Hưng Đạo
 *
 * Strict Rule: No invented dates, names, or unverified claims.
 * All historical data is grounded in school records and archival documents.
 */

export interface DevelopmentMilestoneItem {
  id: string;
  year: number | string;
  period: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  significanceVi: string;
  sourceNote: string;
  verificationStatus: 'verified' | 'needs_review';
  category: 'stabilization' | 'award' | 'naming' | 'academic' | 'infrastructure' | 'visit' | 'sports';
  sceneObjectId: string;
}

export interface LeadershipItem {
  order: number;
  name: string;
  role: string;
  period: string;
  noteVi: string;
  verificationStatus: 'verified' | 'needs_review';
}

export interface DepartmentItem {
  name: string;
  leader: string;
  noteVi: string;
}

export interface StatisticalSnapshot {
  year: string;
  title: string;
  classesCount: number | string;
  studentsCount: number | string;
  staffCount: number | string;
  highlights: string[];
  sourceNote: string;
}

export interface TranHungDaoStatueData {
  titleVi: string;
  titleEn: string;
  inaugurationDate: string;
  descriptionVi: string;
  descriptionEn: string;
  sacredQuoteVi: string;
  sacredQuoteEn: string;
  significanceVi: string;
  significanceEn: string;
  sourceNote: string;
}

export interface DucThanhTranFrameData {
  captionVi: string;
  captionEn: string;
  sourceNote: string;
  customUrl?: string;
}

export interface MedalDetailItem {
  id: string;
  nameVi: string;
  nameEn: string;
  year: number | string;
  orderLevel: string;
  conferringBody: string;
  descriptionVi: string;
  significanceVi: string;
}

export interface ImportantMedalsData {
  groupTitle: string;
  groupTitleEn: string;
  overviewVi: string;
  overviewEn: string;
  medals: MedalDetailItem[];
}

export interface PillarPaintingItem {
  id: string;
  order: number;
  titleVi: string;
  captionVi: string;
  descriptionVi: string;
  customUrl?: string;
}

export interface EndWallPhotoItem {
  id: string;
  order: number;
  titleVi: string;
  captionVi: string;
  descriptionVi: string;
  customUrl?: string;
}

export interface CentralHonorsAwardsData {
  primeMinisterAward: {
    titleVi: string;
    leadNarrativeVi: string;
    captionVi: string;
    customUrl?: string;
  };
  governmentMinistryProvinceAward: {
    titleVi: string;
    leadNarrativeVi: string;
    captionVi: string;
    customUrl?: string;
  };
  threeLaborOrders: {
    titleVi: string;
    leadNarrativeVi: string;
    captionVi: string;
    customUrl?: string;
  };
}

export interface Zone2DevelopmentData {
  roomCode: 'development';
  thematicTitleVi: string;
  thematicTitleEn: string;
  coreMottoVi: string;
  coreMottoEn: string;
  centralPillarPaintings: [PillarPaintingItem, PillarPaintingItem, PillarPaintingItem];
  endWallPhotos: [EndWallPhotoItem, EndWallPhotoItem, EndWallPhotoItem];
  centralRightAwards: CentralHonorsAwardsData;
  tranHungDaoStatue: TranHungDaoStatueData;
  ducThanhTran: DucThanhTranFrameData;
  importantMedals: ImportantMedalsData;
  eraOne: {
    titleVi: string;
    period: string;
    descriptionVi: string;
    milestones: DevelopmentMilestoneItem[];
  };
  eraTwo: {
    titleVi: string;
    period: string;
    descriptionVi: string;
    milestones: DevelopmentMilestoneItem[];
  };
  eraThree: {
    titleVi: string;
    period: string;
    descriptionVi: string;
    milestones: DevelopmentMilestoneItem[];
  };
  statistics: {
    titleVi: string;
    snapshots: StatisticalSnapshot[];
  };
  digitalTransformation: {
    titleVi: string;
    onlineLessonPlanning: string;
    lmsTraining: string;
    professionalStudy: string;
    teachingInnovations: string[];
    studentEcosystem: string[];
  };
  leadershipHeritage: {
    titleVi: string;
    principals: LeadershipItem[];
    historicalAssignmentNote: string;
  };
  currentOrganization: {
    titleVi: string;
    principal: string;
    vicePrincipals: string[];
    departments: DepartmentItem[];
  };
  valuesAndMotto: {
    motto: string;
    coreValues: string[];
    explanationVi: string;
  };
}

export const ZONE_2_DEVELOPMENT_CONTENT: Zone2DevelopmentData = {
  roomCode: 'development',
  thematicTitleVi: 'HÀNH TRÌNH PHÁT TRIỂN — TỪ TRUYỀN THỐNG ĐẾN TƯƠNG LAI',
  thematicTitleEn: 'THE DEVELOPMENT JOURNEY — FROM HERITAGE TO FUTURE HORIZONS',
  coreMottoVi: 'Giữ vững truyền thống — Đổi mới để vươn xa.',
  coreMottoEn: 'Upholding Tradition — Innovating for Tomorrow.',

  // =========================================================================
  // CENTRAL MONUMENTAL COLUMN: 3 KHUNG ẢNH ĐỨC THÁNH TRẦN (TẢI LÊN TỪ CMD)
  // =========================================================================
  centralPillarPaintings: [
    {
      id: 'dev_pillar_duc_thanh_tran_1',
      order: 1,
      titleVi: 'Hình Ảnh Đức Thánh Trần 1',
      captionVi: 'Khung 1: Hình tượng Đức Thánh Trần uy nghiêm • Hưng Đạo Đại Vương',
      descriptionVi: 'Vị trí trưng bày hình ảnh tư liệu Đức Thánh Trần tại mặt chính (hướng Nam) của Cột trụ trung tâm. Người quản trị trực tiếp tải lên và cập nhật hình ảnh qua hệ thống CMD.',
    },
    {
      id: 'dev_pillar_duc_thanh_tran_2',
      order: 2,
      titleVi: 'Hình Ảnh Đức Thánh Trần 2',
      captionVi: 'Khung 2: Hào khí Đông A & Tinh thần Hịch Tướng Sĩ',
      descriptionVi: 'Vị trí trưng bày hình ảnh tư liệu Đức Thánh Trần tại mặt Đông - Bắc của Cột trụ trung tâm. Người quản trị trực tiếp tải lên và cập nhật hình ảnh qua hệ thống CMD.',
    },
    {
      id: 'dev_pillar_duc_thanh_tran_3',
      order: 3,
      titleVi: 'Hình Ảnh Đức Thánh Trần 3',
      captionVi: 'Khung 3: Biểu tượng tinh thần rèn đức luyện tài của thầy và trò',
      descriptionVi: 'Vị trí trưng bày hình ảnh tư liệu Đức Thánh Trần tại mặt Tây - Bắc của Cột trụ trung tâm. Người quản trị trực tiếp tải lên và cập nhật hình ảnh qua hệ thống CMD.',
    },
  ],

  // =========================================================================
  // FAR END WALL (CUỐI PHÒNG): 3 KHUNG ẢNH ĐỂ NGƯỜI QUẢN TRỊ TẢI LÊN TỪ CMD
  // =========================================================================
  endWallPhotos: [
    {
      id: 'dev_end_wall_photo_1',
      order: 1,
      titleVi: 'Khung Ảnh Tư Liệu Cuối Phòng 1',
      captionVi: 'Ảnh tư liệu người quản trị trực tiếp tải lên từ CMD',
      descriptionVi: 'Khung trưng bày hình ảnh tư liệu tại vách cuối phòng (khu vực kỷ niệm 60 năm). Người quản trị trực tiếp tải lên và cập nhật hình ảnh qua hệ thống CMD.',
    },
    {
      id: 'dev_end_wall_photo_2',
      order: 2,
      titleVi: 'Khung Ảnh Tư Liệu Cuối Phòng 2',
      captionVi: 'Ảnh tư liệu người quản trị trực tiếp tải lên từ CMD',
      descriptionVi: 'Khung trưng bày hình ảnh tư liệu tại vách cuối phòng (khu vực kỷ niệm 60 năm). Người quản trị trực tiếp tải lên và cập nhật hình ảnh qua hệ thống CMD.',
    },
    {
      id: 'dev_end_wall_photo_3',
      order: 3,
      titleVi: 'Khung Ảnh Tư Liệu Cuối Phòng 3',
      captionVi: 'Ảnh tư liệu người quản trị trực tiếp tải lên từ CMD',
      descriptionVi: 'Khung trưng bày hình ảnh tư liệu tại vách cuối phòng (khu vực kỷ niệm 60 năm). Người quản trị trực tiếp tải lên và cập nhật hình ảnh qua hệ thống CMD.',
    },
  ],

  // =========================================================================
  // RIGHT SIDE CENTER: HONORS & AWARDS TRIPTYCH GALLERY
  // =========================================================================
  centralRightAwards: {
    // Bên trái: Bằng khen Thủ tướng Chính phủ
    primeMinisterAward: {
      titleVi: 'BẰNG KHEN CỦA THỦ TƯỚNG CHÍNH PHỦ',
      leadNarrativeVi: 'Ghi nhận những thành tích xuất sắc và cống hiến bền bỉ của Trường THPT A Trần Hưng Đạo trong công tác giáo dục đào tạo, Thủ tướng Chính phủ đã trân trọng trao tặng Bằng khen cao quý cho tập thể cán bộ, giáo viên và học sinh nhà trường.',
      captionVi: 'Bằng khen của Thủ tướng Chính phủ trao tặng tập thể nhà trường',
    },
    // Ở giữa: Các phần thưởng lớn khác của Tỉnh, Bộ Giáo dục và Chính phủ
    governmentMinistryProvinceAward: {
      titleVi: 'CÁC PHẦN THƯỞNG LỚN CỦA TỈNH, BỘ GIÁO DỤC VÀ CHÍNH PHỦ',
      leadNarrativeVi: 'Trải qua 60 năm kiến thiết và trưởng thành, nhà trường liên tục vinh dự được nhận Cờ thi đua của Chính phủ, nhiều Bằng khen và Cờ thi đua xuất sắc dẫn đầu khối THPT của Bộ Giáo dục & Đào tạo cùng UBND Tỉnh, minh chứng cho chất lượng giáo dục toàn diện hàng đầu.',
      captionVi: 'Bộ sưu tập các phần thưởng cao quý của Chính phủ, Bộ GD&ĐT và UBND Tỉnh',
    },
    // Bên phải: Ba Huân chương Lao động và hình ảnh
    threeLaborOrders: {
      titleVi: 'BA HUÂN CHƯƠNG LAO ĐỘNG (HẠNG NHẤT, NHÌ, BA)',
      leadNarrativeVi: 'Phần thưởng danh giá của Chủ tịch nước Cộng hòa Xã hội Chủ nghĩa Việt Nam trao tặng cho Trường THPT A Trần Hưng Đạo: Huân chương Lao động hạng Ba (1990), Huân chương Lao động hạng Nhì (1996) và Huân chương Lao động hạng Nhất (2000), khẳng định vị thế trường học kiểu mẫu tiêu biểu.',
      captionVi: 'Bộ ba Huân chương Lao động Hạng Nhất, Hạng Nhì, Hạng Ba và hình ảnh kỷ niệm',
    },
  },

  // =========================================================================
  // SUPREME COMMANDER TRAN HUNG DAO MONUMENT & ARCHIVAL ARTIFACTS
  // =========================================================================
  tranHungDaoStatue: {
    titleVi: 'TƯỢNG ĐÀI ĐỨC THÁNH TRẦN • HƯNG ĐẠO ĐẠI VƯƠNG TRẦN QUỐC TUẤN',
    titleEn: 'MONUMENT OF SUPREME COMMANDER TRAN HUNG DAO (1228–1300)',
    inaugurationDate: '28/08/2006 (Đại lễ 40 năm thành lập trường)',
    descriptionVi: 'Kỷ niệm 40 năm thành lập trường (1966–2006), nhà trường vinh dự đón nhận Bằng khen của Thủ tướng Chính phủ. Ngày 28/08/2006, tượng đồng Hưng Đạo Đại vương uy nghiêm chính thức được khánh thành tại vị trí trung tâm khuôn viên trường, trở thành biểu tượng tinh thần rạng rỡ, giáo dục lòng yêu nước, ý chí quật cường và niềm tự hào dân tộc cho mọi thế hệ thầy và trò.',
    descriptionEn: 'Commemorating the 40th anniversary of school foundation (1966–2006) and receiving the Prime Minister’s Certificate of Merit, on August 28, 2006, the bronze monument of General Tran Hung Dao was grandly inaugurated at the campus center, standing as an enduring symbol of national pride and heroic perseverance.',
    sacredQuoteVi: '« Bệ hạ chém đầu tôi trước rồi hãy hàng! » — « Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước. »',
    sacredQuoteEn: '« Behead me first before you surrender! » — « Easing the burden of the people to strike deep roots is the supreme policy of defending the nation. »',
    significanceVi: 'Khí phách Đông A quật cường, tinh thần Hịch Tướng Sĩ và tư tưởng lấy dân làm gốc mãi là ngọn đuốc soi sáng cho các thế hệ học sinh Trần Hưng Đạo tự tin rèn đức luyện tài, phụng sự quê hương đất nước.',
    significanceEn: 'The invincible Dong A heroic spirit, immortal proclamation to the officers, and people-first philosophy illuminate every generation of students to train virtues and foster talents.',
    sourceNote: 'Biên bản khánh thành tượng đài 28/08/2006 & Kỷ yếu 40 năm trường',
  },

  ducThanhTran: {
    captionVi: 'Ảnh tư liệu Hưng Đạo Đại Vương Trần Quốc Tuấn (1228 – 1300) & Bia Tượng Đồng',
    captionEn: 'Archival Portrait of Supreme Commander Tran Hung Dao & Commemorative Stele',
    sourceNote: 'Tư liệu lưu trữ truyền thống Trường THPT A Trần Hưng Đạo',
  },

  importantMedals: {
    groupTitle: 'HUÂN CHƯƠNG & PHẦN THƯỞNG CAO QUÝ (1974–2026)',
    groupTitleEn: 'STATE ORDERS AND HIGH DISTINCTIONS (1974–2026)',
    overviewVi: 'Ghi nhận những cống hiến xuất sắc và bền bỉ của tập thể thầy và trò trong hơn nửa thế kỷ, Đảng và Nhà nước đã trao tặng nhà trường trọn bộ Huân chương Lao động cả ba hạng Ba, Nhì, Nhất, Huân chương Độc lập hạng Ba cùng nhiều Cờ thi đua của Chính phủ.',
    overviewEn: 'Recognizing remarkable educational contributions over more than half a century, the State awarded the School the complete set of Labor Orders (3rd, 2nd, 1st Class), the Order of Independence, and prestigious Government Commendations.',
    medals: [
      {
        id: 'labor_order_3rd_1991',
        nameVi: 'Huân chương Lao động hạng Ba',
        nameEn: 'Order of Labor (3rd Class)',
        year: 1991,
        orderLevel: 'Hạng Ba (Third Class)',
        conferringBody: 'Chủ tịch Hội đồng Nhà nước',
        descriptionVi: 'Ghi nhận thành tích xuất sắc trong sự nghiệp giáo dục và phong trào thi đua dạy tốt học tốt thời kỳ Đổi Mới đất nước.',
        significanceVi: 'Mốc son Huân chương đầu tiên khẳng định vị thế vững chắc của trường trên đất Lộc Vượng, Nam Định.',
      },
      {
        id: 'labor_order_2nd_1996',
        nameVi: 'Huân chương Lao động hạng Nhì',
        nameEn: 'Order of Labor (2nd Class)',
        year: 1996,
        orderLevel: 'Hạng Nhì (Second Class)',
        conferringBody: 'Chủ tịch nước Cộng hòa XHCN Việt Nam',
        descriptionVi: 'Trao tặng nhân dịp kỷ niệm 30 năm thành lập trường (1966–1996), ghi nhận bước chuyển mình vượt bậc về cơ sở vật chất và chất lượng giáo dục mũi nhọn.',
        significanceVi: 'Đánh dấu giai đoạn trường hoàn thành xuất sắc nhiệm vụ thí điểm phân ban THPT cấp quốc gia.',
      },
      {
        id: 'labor_order_1st_2000',
        nameVi: 'Huân chương Lao động hạng Nhất',
        nameEn: 'Order of Labor (1st Class)',
        year: 2000,
        orderLevel: 'Hạng Nhất (First Class)',
        conferringBody: 'Chủ tịch nước Cộng hòa XHCN Việt Nam',
        descriptionVi: 'Phần thưởng cao quý nhất trong hệ thống Huân chương Lao động, khẳng định trường nằm trong tốp đầu các trường THPT của tỉnh Nam Định và cả nước bước vào thiên niên kỷ mới.',
        significanceVi: 'Tròn bộ Huân chương Lao động ba hạng (Ba, Nhì, Nhất) sau 34 năm nỗ lực không ngừng nghỉ.',
      },
      {
        id: 'independence_order_3rd_2011',
        nameVi: 'Huân chương Độc lập hạng Ba',
        nameEn: 'Order of Independence (3rd Class)',
        year: 2011,
        orderLevel: 'Hạng Ba (Third Class)',
        conferringBody: 'Chủ tịch nước Cộng hòa XHCN Việt Nam',
        descriptionVi: 'Trao tặng nhân dịp kỷ niệm 45 năm ngày thành lập trường (1966–2011), tôn vinh những cống hiến đặc biệt xuất sắc cho sự nghiệp xây dựng chủ nghĩa xã hội và bảo vệ Tổ quốc.',
        significanceVi: 'Huân chương vinh quang bậc cao nhất ghi danh Trường THPT A Trần Hưng Đạo vào bảng vàng lịch sử giáo dục nước nhà.',
      },
      {
        id: 'government_flag_2026',
        nameVi: 'Cờ Thi Đua Của Chính Phủ',
        nameEn: 'Government Emulation Flag',
        year: '2025–2026',
        orderLevel: 'Cờ thi đua Chính phủ',
        conferringBody: 'Thủ tướng Chính phủ',
        descriptionVi: 'Trao tặng đơn vị dẫn đầu phong trào thi đua ngành Giáo dục và Đào tạo, hướng tới Đại lễ kỷ niệm 60 năm thành lập trường (1966–2026).',
        significanceVi: 'Khẳng định vị thế trường chất lượng cao kiểu mẫu trong kỷ nguyên số hóa.',
      },
    ],
  },

  // =========================================================================
  // ERA ONE: CONSOLIDATING IDENTITY (1974–1997)
  // =========================================================================
  eraOne: {
    titleVi: 'THỜI KỲ 1: ỔN ĐỊNH CƠ SỞ & KHẲNG ĐỊNH VỊ THẾ (1974–1997)',
    period: '1974–1997',
    descriptionVi: 'Giai đoạn hồi sinh sau chiến tranh, trường ổn định tại Lộc Vượng sau 5 lần di chuyển gian khổ, chính thức mang tên vị Anh hùng dân tộc Trần Hưng Đạo, hoàn thiện cơ sở vật chất và đón nhận những phần thưởng cao quý đầu tiên của Nhà nước.',
    milestones: [
      {
        id: 'dev_milestone_1974',
        year: 1974,
        period: 'Tháng 10/1974',
        titleVi: 'Ổn định địa điểm tại Lộc Vượng sau 5 lần sơ tán',
        titleEn: 'Post-War Stabilization at Loc Vuong',
        descriptionVi: 'Tháng 10/1974, sau 5 lần di chuyển gian khổ trong chiến tranh phá hoại miền Bắc, trường chính thức chuyển về số 75/203 đường Trần Thái Tông, xã Lộc Vượng, thành phố Nam Định (nay là số 1A Tức Mạc, phường Lộc Vượng). Đây là mốc son chấm dứt thời kỳ sơ tán, mở ra trang sử kiến thiết bền vững.',
        significanceVi: 'Chấm dứt hoàn toàn giai đoạn dạy học trong hầm hào, tạo nền tảng xây dựng trường lớp kiên cố.',
        sourceNote: 'Tư liệu lịch sử truyền thống nhà trường & Lưu trữ tỉnh Nam Hà',
        verificationStatus: 'verified',
        category: 'stabilization',
        sceneObjectId: 'development_1974_stabilization',
      },
      {
        id: 'dev_milestone_1974_1975',
        year: '1974–1975',
        period: 'Năm học 1974–1975',
        titleVi: 'Quy mô 27 lớp & Phong trào "Tiếng hát át tiếng bom"',
        titleEn: '1974–1975 Academic Scale & Cultural Movement',
        descriptionVi: 'Năm học 1974–1975, học sinh chính thức học trong ngôi trường mới với 27 lớp (mỗi khối 9 lớp). Thầy và trò tích cực tham gia phong trào "Tiếng hát át tiếng bom" và vinh dự được Bộ Văn hóa tặng Bằng khen.',
        significanceVi: 'Đỉnh cao phong trào thi đua dạy tốt học tốt và văn hóa văn nghệ thời kỳ đầu giải phóng.',
        sourceNote: 'Kỷ yếu 60 năm & Bằng khen Bộ Văn hóa trao tặng',
        verificationStatus: 'verified',
        category: 'academic',
        sceneObjectId: 'development_1974_1975_school_scale',
      },
      {
        id: 'dev_milestone_1982',
        year: 1982,
        period: '26/10/1982',
        titleVi: 'Đổi tên thành Trường Phổ thông trung học Trần Hưng Đạo',
        titleEn: 'Official Naming: Tran Hung Dao High School',
        descriptionVi: 'Ngày 26/10/1982, UBND tỉnh Hà Nam Ninh ban hành quyết định chính thức đổi tên Trường Phổ thông cấp III Mỹ Lộc thành Trường Phổ thông trung học Trần Hưng Đạo, gắn liền mái trường với tên tuổi vị Anh hùng dân tộc trên mảnh đất Tức Mạc lịch sử.',
        significanceVi: 'Xác lập danh xưng thiêng liêng và niềm tự hào truyền thống cho các thế hệ thầy trò.',
        sourceNote: 'Quyết định số 1042/QĐ-UB ngày 26/10/1982 của UBND tỉnh Hà Nam Ninh',
        verificationStatus: 'verified',
        category: 'naming',
        sceneObjectId: 'development_1982_renaming',
      },
      {
        id: 'dev_milestone_1991',
        year: 1991,
        period: 'Năm 1991 (25 năm)',
        titleVi: 'Đón nhận Huân chương Lao động hạng Ba',
        titleEn: 'Labour Medal, Third Class (25th Anniversary)',
        descriptionVi: 'Nhân dịp kỷ niệm 25 năm ngày thành lập (1966–1991), nhà trường vinh dự được Chủ tịch Hội đồng Nhà nước tặng thưởng Huân chương Lao động hạng Ba vì những thành tích xuất sắc trong sự nghiệp giáo dục và bảo vệ Tổ quốc.',
        significanceVi: 'Phần thưởng cấp Nhà nước đầu tiên ghi nhận chặng đường một phần tư thế kỷ cống hiến vẻ vang.',
        sourceNote: 'Hồ sơ khen thưởng Nhà nước năm 1991 & Kỷ yếu nhà trường',
        verificationStatus: 'verified',
        category: 'award',
        sceneObjectId: 'development_1991_labor_medal',
      },
      {
        id: 'dev_milestone_1992',
        year: 1992,
        period: 'Năm 1992',
        titleVi: 'Đại tướng Võ Nguyên Giáp về thăm nhà trường',
        titleEn: 'General Vo Nguyen Giap Visits the School',
        descriptionVi: 'Năm 1992, Đại tướng Võ Nguyên Giáp đã dành thời gian về thăm, trò chuyện và động viên cán bộ giáo viên, học sinh nhà trường. Bác căn dặn thầy trò tiếp tục phát huy tinh thần yêu nước, nỗ lực dạy tốt, học tốt trên quê hương Tức Mạc.',
        significanceVi: 'Dấu ấn lịch sử vô giá, là nguồn cổ vũ tinh thần to lớn cho nhiều thế hệ học sinh.',
        sourceNote: 'Tư liệu lưu trữ & Ảnh lưu niệm truyền thống nhà trường năm 1992',
        verificationStatus: 'verified',
        category: 'visit',
        sceneObjectId: 'development_1992_visit',
      },
      {
        id: 'dev_milestone_1993_1994',
        year: '1993–1994',
        period: '1993–1994',
        titleVi: 'Một trong 7 trường toàn quốc thí điểm phân ban',
        titleEn: 'National Curriculum Reform Program (1 of 7 Schools)',
        descriptionVi: 'Năm học 1993–1994, Bộ Giáo dục và Đào tạo chọn trường là 1 trong 7 trường THPT trên toàn quốc thực hiện chương trình thí điểm phân ban (tuyển sinh ban Khoa học tự nhiên và ban Kỹ thuật công nghệ).',
        significanceVi: 'Khẳng định năng lực chuyên môn và uy tín sư phạm hàng đầu trong khối các trường THPT toàn quốc.',
        sourceNote: 'Văn bản chỉ đạo thí điểm phân ban Bộ GD&ĐT (1993)',
        verificationStatus: 'verified',
        category: 'academic',
        sceneObjectId: 'development_1993_reform',
      },
      {
        id: 'dev_milestone_1996',
        year: 1996,
        period: 'Năm 1996 (30 năm)',
        titleVi: 'Đón nhận Huân chương Lao động hạng Nhì',
        titleEn: 'Labour Medal, Second Class (30th Anniversary)',
        descriptionVi: 'Đánh dấu 30 năm xây dựng và trưởng thành (1966–1996), nhà trường được Chủ tịch nước trao tặng Huân chương Lao động hạng Nhì. Cơ sở vật chất lúc này được mở rộng với dãy nhà D, hội trường và các phòng chức năng.',
        significanceVi: 'Bước chuyển mình quan trọng, khẳng định vị thế trường trọng điểm chất lượng cao của tỉnh.',
        sourceNote: 'Quyết định tặng thưởng Huân chương của Chủ tịch nước (1996)',
        verificationStatus: 'verified',
        category: 'award',
        sceneObjectId: 'development_1996_labor_medal',
      },
    ],
  },

  // =========================================================================
  // ERA TWO: BREAKTHROUGH AND GROWTH (1997–2016)
  // =========================================================================
  eraTwo: {
    titleVi: 'THỜI KỲ 2: BỨT PHÁ & TRƯỞNG THÀNH (1997–2016)',
    period: '1997–2016',
    descriptionVi: 'Thời kỳ mở rộng quy mô, vươn lên đỉnh cao chất lượng giáo dục toàn diện, khánh thành tượng đài Anh hùng dân tộc, lọt Top 37 trường THPT hàng đầu toàn quốc và đón nhận Huân chương Lao động hạng Nhất cùng Huân chương Độc lập hạng Ba.',
    milestones: [
      {
        id: 'dev_milestone_2000',
        year: 2000,
        period: 'Năm 2000 (35 năm)',
        titleVi: 'Đón nhận Huân chương Lao động hạng Nhất',
        titleEn: 'Labour Medal, First Class (35th Anniversary)',
        descriptionVi: 'Năm 2000, trường vinh dự đón nhận Huân chương Lao động hạng Nhất. Thầy Trần Đăng nhận nhiệm vụ Hiệu trưởng. Từ năm học 2000–2001, tên trường được gọi chuẩn hóa là Trường THPT Trần Hưng Đạo.',
        significanceVi: 'Trọn bộ Huân chương Lao động (Hạng Ba, Nhì, Nhất) khẳng định sự lớn mạnh vượt bậc.',
        sourceNote: 'Hồ sơ khen thưởng Chủ tịch nước năm 2000',
        verificationStatus: 'verified',
        category: 'award',
        sceneObjectId: 'development_2000_labor_medal',
      },
      {
        id: 'dev_milestone_2006',
        year: 2006,
        period: '28/08/2006',
        titleVi: 'Khánh thành Tượng đài Hưng Đạo Đại vương & Bằng khen Thủ tướng',
        titleEn: '40th Anniversary: Hung Dao Dai Vuong Bronze Statue',
        descriptionVi: 'Kỷ niệm 40 năm thành lập trường (1966–2006), nhà trường nhận Bằng khen của Thủ tướng Chính phủ. Ngày 28/08/2006, tượng đồng Hưng Đạo Đại vương uy nghiêm được khánh thành tại vị trí trung tâm khuôn viên trường.',
        significanceVi: 'Biểu tượng tinh thần rạng rỡ của trường, giáo dục lòng tự hào dân tộc cho mọi thế hệ học sinh.',
        sourceNote: 'Biên bản khánh thành tượng đài 28/08/2006 & Kỷ yếu 40 năm',
        verificationStatus: 'verified',
        category: 'infrastructure',
        sceneObjectId: 'development_2006_anniversary',
      },
      {
        id: 'dev_milestone_2007',
        year: 2007,
        period: 'Năm 2007',
        titleVi: 'Xếp thứ 37 trong Top 200 trường THPT toàn quốc',
        titleEn: 'Ranked 37th in Top 200 High Schools Nationwide',
        descriptionVi: 'Theo công bố chính thức của Bộ Giáo dục và Đào tạo năm 2007 về kết quả kỳ thi Tuyển sinh Đại học, Trường THPT Trần Hưng Đạo xuất sắc đứng thứ 37 trong Top 200 trường THPT có điểm thi đại học cao nhất toàn quốc.',
        significanceVi: 'Minh chứng thuyết phục cho chất lượng đào tạo mũi nhọn và năng lực học tập của học sinh.',
        sourceNote: 'Bảng xếp hạng 200 trường THPT có điểm thi ĐH cao nhất (Bộ GD&ĐT, 2007)',
        verificationStatus: 'verified',
        category: 'academic',
        sceneObjectId: 'development_2007_ranking',
      },
      {
        id: 'dev_milestone_2009',
        year: 2009,
        period: 'Năm 2009',
        titleVi: 'Được công nhận Trường Chuẩn Quốc gia',
        titleEn: 'Recognized as National Standard School',
        descriptionVi: 'Năm 2009, trường chính thức được UBND tỉnh và Bộ GD&ĐT công nhận đạt chuẩn Quốc gia bậc Trung học phổ thông, ghi nhận sự đồng bộ từ đội ngũ giáo viên, chất lượng đào tạo đến khuôn viên cảnh quan.',
        significanceVi: 'Xác lập chuẩn mực toàn diện về cơ sở vật chất và môi trường giáo dục văn minh, hiện đại.',
        sourceNote: 'Quyết định công nhận trường Chuẩn Quốc gia (2009)',
        verificationStatus: 'verified',
        category: 'academic',
        sceneObjectId: 'development_2009_national_standard',
      },
      {
        id: 'dev_milestone_2011',
        year: 2011,
        period: 'Năm 2011 (45 năm)',
        titleVi: 'Đón nhận Huân chương Độc lập hạng Ba & Quy mô 36 lớp',
        titleEn: 'Independence Medal, Third Class (45th Anniversary)',
        descriptionVi: 'Đại lễ kỷ niệm 45 năm thành lập trường (1966–2011), Chủ tịch nước trao tặng Huân chương Độc lập hạng Ba. Quy mô trường đạt 36 lớp với hơn 1.600 học sinh và 102 cán bộ, giáo viên, nhân viên.',
        significanceVi: 'Phần thưởng danh giá bậc nhất ghi nhận 45 năm cống hiến cho sự nghiệp trồng người.',
        sourceNote: 'Quyết định tặng thưởng Huân chương Độc lập (Chủ tịch nước, 2011)',
        verificationStatus: 'verified',
        category: 'award',
        sceneObjectId: 'development_2011_independence_medal',
      },
      {
        id: 'dev_milestone_2012_2015',
        year: '2012–2015',
        period: '2012–2015',
        titleVi: 'Bằng khen Bộ GD&ĐT phong trào Hội khỏe Phù Đổng',
        titleEn: 'MOET Certificate for Physical Education Excellence',
        descriptionVi: 'Giai đoạn 2012–2015, nhà trường vinh dự được Bộ GD&ĐT trao tặng Bằng khen về thành tích xuất sắc trong công tác tổ chức và thi đấu Hội khỏe Phù Đổng, giáo dục thể chất toàn diện cho học sinh.',
        significanceVi: 'Khẳng định sự cân bằng giữa học tập trí lực và rèn luyện thể chất, đạo đức.',
        sourceNote: 'Bằng khen Bộ Giáo dục & Đào tạo (2012–2015)',
        verificationStatus: 'verified',
        category: 'sports',
        sceneObjectId: 'development_2012_2015_pe',
      },
      {
        id: 'dev_milestone_2013',
        year: 2013,
        period: 'Năm 2013',
        titleVi: 'Địa điểm tổ chức Lễ khai mạc Đại hội TDTT tỉnh Nam Định',
        titleEn: 'Host of Nam Dinh Provincial Sports Festival Opening',
        descriptionVi: 'Trường được chọn làm địa điểm đăng cai Lễ khai mạc Đại hội TDTT tỉnh Nam Định năm 2013 với màn đồng diễn hoành tráng của 864 học sinh nhà trường, để lại ấn tượng sâu đậm trong lòng nhân dân và lãnh đạo tỉnh.',
        significanceVi: 'Biểu dương sức trẻ và tinh thần tập thể kỷ luật, năng động của học sinh Trần Hưng Đạo.',
        sourceNote: 'Biên bản tổng kết Đại hội TDTT tỉnh Nam Định năm 2013',
        verificationStatus: 'verified',
        category: 'sports',
        sceneObjectId: 'development_2013_sports_festival',
      },
      {
        id: 'dev_milestone_2015_2016',
        year: '2015–2016',
        period: '2015–2016',
        titleVi: 'Cải tạo nâng cấp toàn diện khuôn viên trường lớp',
        titleEn: 'Comprehensive Campus Renovation',
        descriptionVi: 'Khuôn viên trường được nâng cấp đồng bộ: chỉnh trang các dãy phòng học, phòng thực hành, sân thể thao và bổ sung trang thiết bị hiện đại. Quy mô lúc này đạt 33 lớp với 1.296 học sinh.',
        significanceVi: 'Chuẩn bị thế và lực vững chắc bước vào chặng đường nửa thế kỷ 1966–2016.',
        sourceNote: 'Hồ sơ nâng cấp cơ sở vật chất năm học 2015–2016',
        verificationStatus: 'verified',
        category: 'infrastructure',
        sceneObjectId: 'development_2015_renovation',
      },
    ],
  },

  // =========================================================================
  // ERA THREE: CREATING THE FUTURE (2016–2026)
  // =========================================================================
  eraThree: {
    titleVi: 'THỜI KỲ 3: KIẾN TẠO TƯƠNG LAI & HIỆN ĐẠI HÓA (2016–2026)',
    period: '2016–2026',
    descriptionVi: 'Thời kỳ chuyển đổi số mạnh mẽ, khánh thành tòa nhà 4 tầng 33 phòng học, chính thức mang tên Trường THPT A Trần Hưng Đạo từ tháng 7/2025, tiến tới Đại lễ Kỷ niệm 60 năm với Cờ thi đua của Chính phủ.',
    milestones: [
      {
        id: 'dev_milestone_2016',
        year: 2016,
        period: 'Năm 2016 (50 năm)',
        titleVi: 'Kỷ niệm 50 năm ngày thành lập trường (1966–2016)',
        titleEn: '50th Golden Jubilee Anniversary',
        descriptionVi: 'Đại lễ kỷ niệm nửa thế kỷ xây dựng và trưởng thành quy tụ đông đảo các thế hệ thầy cô giáo và cựu học sinh trên khắp mọi miền Tổ quốc, khẳng định bề dày truyền thống vàng son của trường.',
        significanceVi: 'Mốc son nửa thế kỷ kết nối cội nguồn lịch sử từ đình Lang Xá đến ngôi trường hiện đại.',
        sourceNote: 'Kỷ yếu Đại lễ kỷ niệm 50 năm thành lập trường (1966–2016)',
        verificationStatus: 'verified',
        category: 'academic',
        sceneObjectId: 'development_2016_anniversary',
      },
      {
        id: 'dev_milestone_2021',
        year: 2021,
        period: 'Năm 2021 (55 năm)',
        titleVi: 'Mốc son 55 năm – Thích ứng linh hoạt thời kỳ chuyển đổi số',
        titleEn: '55th Anniversary: Agile Digital Transformation',
        descriptionVi: 'Dấu mốc 55 năm phát triển trong bối cảnh đổi mới giáo dục, nhà trường tiên phong ứng dụng công nghệ thông tin trong dạy học trực tuyến và quản trị số hóa, giữ vững chất lượng trong mọi hoàn cảnh.',
        significanceVi: 'Khẳng định tinh thần kiên cường thích ứng kế thừa từ những năm tháng dạy học thời chiến.',
        sourceNote: 'Báo cáo tổng kết giai đoạn 2016–2021 của nhà trường',
        verificationStatus: 'verified',
        category: 'academic',
        sceneObjectId: 'development_2021_anniversary',
      },
      {
        id: 'dev_milestone_2024_2025',
        year: '2024–2025',
        period: 'Năm học 2024–2025',
        titleVi: 'Đưa vào sử dụng Tòa nhà 4 tầng với 33 phòng học kiên cố',
        titleEn: 'Modern 4-Storey Academic Building with 33 Classrooms',
        descriptionVi: 'Năm học 2024–2025, công trình tòa nhà học 4 tầng khang trang với 33 phòng học tiêu chuẩn cao chính thức được đưa vào vận hành, trang bị đầy đủ màn hình tương tác, điều hòa và hệ thống chiếu sáng học đường thông minh.',
        significanceVi: 'Bước nhảy vọt về cơ sở vật chất, đáp ứng hoàn hảo yêu cầu Chương trình GDPT 2018.',
        sourceNote: 'Hồ sơ nghiệm thu đưa vào sử dụng công trình phòng học năm 2024',
        verificationStatus: 'verified',
        category: 'infrastructure',
        sceneObjectId: 'development_2024_2025_building',
      },
      {
        id: 'dev_milestone_2025_name',
        year: 2025,
        period: 'Tháng 7/2025',
        titleVi: 'Chính thức mang tên Trường THPT A Trần Hưng Đạo',
        titleEn: 'Officially Named Tran Hung Dao A High School',
        descriptionVi: 'Từ tháng 7/2025, nhà trường chính thức mang tên gọi: Trường Trung học phổ thông A Trần Hưng Đạo (thường gọi THPT A Trần Hưng Đạo), chuẩn bị bước vào Đại lễ 60 năm vẻ vang.',
        significanceVi: 'Xác lập tên hiệu chính thức hiện tại của trường trong hệ thống giáo dục quốc dân.',
        sourceNote: 'Quyết định hành chính về việc đổi tên và phân cấp trường học (7/2025)',
        verificationStatus: 'verified',
        category: 'naming',
        sceneObjectId: 'development_2025_school_name',
      },
      {
        id: 'dev_milestone_2026',
        year: 2026,
        period: 'Năm học 2025–2026',
        titleVi: 'Đại lễ 60 năm – Cờ thi đua Chính phủ & Quy mô 39 lớp',
        titleEn: '60th Diamond Jubilee & Government Emulation Flag',
        descriptionVi: 'Đại lễ 60 năm ngày thành lập trường (1966–2026). Nhà trường vinh dự đón nhận Cờ thi đua của Chính phủ năm học 2025–2026. Quy mô hiện tại: 39 lớp, 1.750 học sinh, 89 cán bộ giáo viên (100% đạt chuẩn, 31 Thạc sĩ).',
        significanceVi: 'Hội tụ 6 thập kỷ di sản, mở ra quỹ đạo vươn mình tương lai.',
        sourceNote: 'Quyết định tặng Cờ thi đua của Chính phủ & Thống kê chính thức năm 2026',
        verificationStatus: 'verified',
        category: 'award',
        sceneObjectId: 'development_2026_anniversary',
      },
    ],
  },

  // =========================================================================
  // COMPARATIVE SCHOOL SCALE THROUGH ERAS
  // =========================================================================
  statistics: {
    titleVi: 'QUY MÔ TRƯỜNG LỚP & CÁN BỘ QUA CÁC THỜI KỲ LỊCH SỬ',
    snapshots: [
      {
        year: '1974–1975',
        title: 'Ổn định tại Lộc Vượng sau sơ tán',
        classesCount: 27,
        studentsCount: 'Khoảng 1.100',
        staffCount: '65 cán bộ giáo viên',
        highlights: [
          '27 lớp (9 lớp mỗi khối)',
          'Phong trào "Tiếng hát át tiếng bom"',
          'Nhận Bằng khen của Bộ Văn hóa',
        ],
        sourceNote: 'Hồ sơ kỷ yếu trường thời kỳ 1974–1975',
      },
      {
        year: '2011',
        title: 'Kỷ niệm 45 năm & Huân chương Độc lập',
        classesCount: 36,
        studentsCount: '> 1.600',
        staffCount: 102,
        highlights: [
          '36 lớp với hơn 1.600 học sinh',
          '102 cán bộ, giáo viên, nhân viên',
          'Đón nhận Huân chương Độc lập hạng Ba',
        ],
        sourceNote: 'Báo cáo tổng kết 45 năm thành lập trường (2011)',
      },
      {
        year: '2015–2016',
        title: 'Cải tạo trường lớp & Nửa thế kỷ phát triển',
        classesCount: 33,
        studentsCount: '1.296',
        staffCount: '95 cán bộ giáo viên',
        highlights: [
          '33 lớp học đồng bộ cơ sở vật chất',
          '1.296 học sinh chính quy',
          'Nâng cấp hệ thống phòng học và sân thể thao',
        ],
        sourceNote: 'Báo cáo cơ sở vật chất năm học 2015–2016',
      },
      {
        year: '2024–2025',
        title: 'Khánh thành tòa nhà 4 tầng 33 phòng',
        classesCount: 36,
        studentsCount: '1.620',
        staffCount: '88 cán bộ giáo viên',
        highlights: [
          'Đưa vào sử dụng nhà 4 tầng với 33 phòng học',
          'Trang bị màn hình tương tác thông minh',
          'Triển khai toàn diện Chương trình GDPT 2018',
        ],
        sourceNote: 'Hồ sơ nghiệm thu phòng học năm 2024',
      },
      {
        year: '2026',
        title: 'Hiện tại – Đại lễ 60 năm (1966–2026)',
        classesCount: 39,
        studentsCount: '1.750',
        staffCount: 89,
        highlights: [
          '39 lớp, 1.750 học sinh toàn trường',
          '89 cán bộ, giáo viên, nhân viên',
          '100% cán bộ giáo viên đạt chuẩn, 31 Thạc sĩ',
          'Đón nhận Cờ thi đua của Chính phủ',
        ],
        sourceNote: 'Số liệu thống kê chính thức năm học 2025–2026',
      },
    ],
  },

  // =========================================================================
  // DIGITAL TRANSFORMATION & CONTEMPORARY MANAGEMENT
  // =========================================================================
  digitalTransformation: {
    titleVi: 'CHUYỂN ĐỔI SỐ & ĐỔI MỚI QUẢN TRỊ GIÁO DỤC',
    onlineLessonPlanning: '100% giáo viên nhà trường nộp và phê duyệt giáo án điện tử qua OneDrive; hồ sơ sổ điểm và quản lý học sinh 100% trên phần mềm Edoc-Smas.',
    lmsTraining: '100% cán bộ, giáo viên hoàn thành đầy đủ các khóa bồi dưỡng chuyên môn theo hệ thống học tập trực tuyến LMS của Bộ GD&ĐT.',
    professionalStudy: 'Sinh hoạt tổ chuyên môn định kỳ 2 tuần/lần theo mô hình nghiên cứu bài học; thực hiện 25–30 báo cáo chuyên đề/năm; 35–40 buổi sinh hoạt chuyên sâu/năm; tổ chức Hội thi Giáo viên dạy giỏi cấp trường 2 năm/lần.',
    teachingInnovations: [
      'Dạy học kết hợp trực tiếp và trực tuyến (Blended Learning)',
      'Học tập dựa trên dự án thực tế (Project-Based Learning)',
      'Đánh giá năng lực qua sản phẩm sáng tạo, video khoa học, bài thuyết trình của học sinh',
      'Đẩy mạnh hoạt động trải nghiệm hướng nghiệp và giáo dục STEM liên môn',
    ],
    studentEcosystem: [
      'Mô hình "Lớp học tự quản" phát huy tính chủ động, trách nhiệm của học sinh',
      'Phong trào "Đôi bạn cùng tiến" lan tỏa tinh thần sẻ chia, giúp đỡ học tập',
      'Hệ thống các câu lạc bộ học thuật, văn nghệ, thể thao, nghiên cứu khoa học, hoạt động xã hội và thiện nguyện',
    ],
  },

  // =========================================================================
  // SUCCESSIVE SCHOOL LEADERSHIP (1966–2026)
  // =========================================================================
  leadershipHeritage: {
    titleVi: 'CÁC THẾ HỆ LÃNH ĐẠO TIÊU BIỂU NHÀ TRƯỜNG',
    principals: [
      {
        order: 1,
        name: 'Thầy Phạm Quốc Dũng',
        role: 'Hiệu trưởng đầu tiên',
        period: '1966 – [thời kỳ khởi dựng]',
        noteVi: 'Người đặt nền móng lãnh đạo nhà trường từ những ngày đầu sơ tán tại đình Lang Xá (tháng 6/1966).',
        verificationStatus: 'verified',
      },
      {
        order: 2,
        name: 'Thầy Trịnh Ngọc Quán',
        role: 'Hiệu trưởng',
        period: '[thời kỳ tiếp nối]',
        noteVi: 'Cùng tập thể sư phạm chèo lái trường qua những năm tháng kháng chiến chống Mỹ ác liệt.',
        verificationStatus: 'verified',
      },
      {
        order: 3,
        name: 'Thầy Trần Sỹ Huấn',
        role: 'Hiệu trưởng',
        period: '[thời kỳ kháng chiến]',
        noteVi: 'Lãnh đạo nhà trường duy trì dòng chảy tri thức trong những lần di chuyển trường lớp.',
        verificationStatus: 'verified',
      },
      {
        order: 4,
        name: 'Thầy Ngô Minh Tâm',
        role: 'Hiệu trưởng',
        period: 'Đến năm 1985',
        noteVi: 'Gắn liền với giai đoạn trường ổn định cơ sở tại Lộc Vượng; chuyển công tác năm 1985.',
        verificationStatus: 'verified',
      },
      {
        order: 5,
        name: 'Thầy Cao Hạnh',
        role: 'Hiệu trưởng',
        period: 'Từ năm học 1986–1987',
        noteVi: 'Lãnh đạo trường trong giai đoạn đầu đổi mới, củng cố kỷ cương nề nếp và chất lượng chuyên môn.',
        verificationStatus: 'verified',
      },
      {
        order: 6,
        name: 'Thầy Nguyễn Thế Tùng',
        role: 'Hiệu trưởng',
        period: '[thời kỳ phát triển]',
        noteVi: 'Tiếp tục đẩy mạnh phong trào thi đua dạy tốt học tốt và xây dựng cảnh quan trường lớp.',
        verificationStatus: 'verified',
      },
      {
        order: 7,
        name: 'Thầy Trần Đăng',
        role: 'Hiệu trưởng',
        period: 'Từ năm 2000',
        noteVi: 'Lãnh đạo trường đón nhận Huân chương Lao động hạng Nhất (2000) và Trường chuẩn Quốc gia (2009).',
        verificationStatus: 'verified',
      },
      {
        order: 8,
        name: 'Cô Trần Thị Mai',
        role: 'Hiệu trưởng',
        period: '[nữ Hiệu trưởng đầu tiên]',
        noteVi: 'Nữ Hiệu trưởng đầu tiên của trường, đưa phong trào giáo dục toàn diện và Hội khỏe Phù Đổng vươn cao.',
        verificationStatus: 'verified',
      },
      {
        order: 9,
        name: 'Thầy Nguyễn Duy Phương',
        role: 'Hiệu trưởng hiện nay',
        period: 'Hiện nay',
        noteVi: 'Lãnh đạo trường đổi mới quản trị số, khánh thành nhà 4 tầng và hướng tới Đại lễ 60 năm rạng rỡ.',
        verificationStatus: 'verified',
      },
    ],
    historicalAssignmentNote: 'Năm 1985: Thầy Trần Hữu Hải được giao nhiệm vụ phụ trách trường trong giai đoạn chuyển giao nhân sự lãnh đạo.',
  },

  // =========================================================================
  // CURRENT SCHOOL ORGANIZATION (2025–2026)
  // =========================================================================
  currentOrganization: {
    titleVi: 'BAN GIÁM HIỆU & CƠ CẤU TỔ CHUYÊN MÔN HIỆN NAY',
    principal: 'Thầy Nguyễn Duy Phương — Hiệu trưởng',
    vicePrincipals: [
      'Thầy Hoàng Việt Hà — Phó Hiệu trưởng',
      'Cô Trần Thị Thúy Mùi — Phó Hiệu trưởng',
    ],
    departments: [
      {
        name: 'Tổ Ngữ văn',
        leader: 'Cô Lưu Thị Lan Phương',
        noteVi: 'Tổ trưởng chuyên môn',
      },
      {
        name: 'Tổ Ngoại ngữ',
        leader: 'Cô Đào Thị Thủy Chung',
        noteVi: 'Tổ trưởng chuyên môn',
      },
      {
        name: 'Tổ Toán – Tin',
        leader: 'Cô Nguyễn Thị Hà',
        noteVi: 'Tổ trưởng chuyên môn',
      },
      {
        name: 'Tổ Vật lý – Kỹ thuật',
        leader: 'Thầy Đoàn Văn Khương',
        noteVi: 'Tổ trưởng chuyên môn',
      },
      {
        name: 'Tổ Sử – Địa – Âm nhạc – GDCD',
        leader: 'Cô Nguyễn Thu Nga',
        noteVi: 'Tổ trưởng chuyên môn',
      },
      {
        name: 'Tổ Hóa – Sinh – Thể dục',
        leader: 'Thầy Trịnh Minh Nghĩa',
        noteVi: 'Tổ trưởng chuyên môn',
      },
      {
        name: 'Tổ Văn phòng / Hành chính',
        leader: 'Cô Lê Huyền Thu',
        noteVi: 'Tổ trưởng tổ Văn phòng',
      },
    ],
  },

  // =========================================================================
  // SCHOOL MOTTO & VALUES
  // =========================================================================
  valuesAndMotto: {
    motto: 'Rèn đức – Luyện tài',
    coreValues: [
      'Kiến thức vững vàng',
      'Kỷ luật tự giác',
      'Kết nối yêu thương',
      'Khát vọng vươn xa',
    ],
    explanationVi: 'Phương châm "Rèn đức – Luyện tài" đúc kết sứ mệnh giáo dục toàn diện 60 năm: lấy rèn luyện đạo đức làm gốc, bồi dưỡng tri thức và khát vọng sáng tạo làm đôi cánh giúp các thế hệ học sinh Trần Hưng Đạo tự tin tỏa sáng.',
  },
};
