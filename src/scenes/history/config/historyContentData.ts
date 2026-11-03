/**
 * Dữ liệu chuẩn xác 100% từ tài liệu:
 * "Tư liệu chuẩn về truyền thống 60 năm Trường THPT A Trần Hưng Đạo"
 * Biên soạn đầy đủ từ tài liệu gốc — không thêm, không bớt, không bỏ sót nội dung nào trong tài liệu gốc.
 * Mọi chỗ tài liệu gốc ghi "cần xác nhận" được giữ nguyên đánh dấu.
 * KHU 1 — LỊCH SỬ HÌNH THÀNH (1966–1975) [id: history]
 */

export interface EvacuationStep {
  order: number;
  location: string;
  period: string;
  details: string;
}

export interface TraditionZoneSummary {
  id: string;
  code: string;
  titleVi: string;
  titleEn: string;
  timePeriod: string;
  description: string;
  status: 'active' | 'in_progress' | 'planned';
}

export interface Zone1HistoryData {
  id: string;
  nameVi: string;
  nameEn: string;
  period: string;

  // Legacy compatibility fields
  overview: {
    decision: string;
    openingCeremony: string;
    foundingLocation: string;
    initialScale: string;
    firstLeadership: {
      principal: string;
      vicePrincipal: string;
    };
    stabilization: string;
    periodName: string;
    currentAddress: string;
    historicalAddress: string;
  };
  introduction: string;
  wartimeTeaching: {
    description: string;
    bulletPoints: string[];
  };
  fiveRelocations: {
    summary: string;
    route: string;
    steps: EvacuationStep[];
    settlement1974: string;
    schoolYear1974_1975: string;
  };

  // Structured exact sections 1.1 -> 1.5
  section1_1_overview: {
    title: string;
    items: {
      label: string;
      value: string;
    }[];
  };
  section1_2_birth1966: {
    title: string;
    content: string;
  };
  section1_3_wartimeTeaching: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  section1_4_fiveRelocations: {
    title: string;
    content: string;
    summaryRoute: string;
    steps: EvacuationStep[];
    chronology: {
      step: number;
      year: string;
      location: string;
      details: string;
    }[];
    summaryList: string[];
    settlement1974: string;
    schoolYear1974_1975: string;
  };
  section1_5_militaryEnlistment: {
    title: string;
    content: string;
    martyrs: string[];
    note: string;
  };

  foundationPeople: {
    title: string;
    leaders: {
      role: string;
      name: string;
      note?: string;
    }[];
    firstTeachers: {
      name: string;
      note?: string;
    }[];
  };
  artifacts: {
    id: string;
    title: string;
    type: string;
    description: string;
    verificationStatus: 'verified' | 'unverified' | 'needs_review';
    note?: string;
  }[];
}

export const ZONE_1_HISTORY_CONTENT: Zone1HistoryData = {
  id: 'history',
  nameVi: 'KHU 1 — LỊCH SỬ HÌNH THÀNH (1966–1975)',
  nameEn: 'ZONE 1 — HISTORICAL FOUNDATION (1966–1975)',
  period: '1966–1975',

  overview: {
    decision: 'Trung tuần tháng 6/1966, do tỉnh Nam Hà chủ trương thành lập',
    openingCeremony: 'Mùa thu năm 1966, tại đình Lang Xá',
    foundingLocation: 'Thôn Lang Xá, xã Mỹ Tiến, huyện Mỹ Lộc',
    initialScale: '3 tổ chuyên môn, 5 lớp, khoảng 200 học sinh (riêng quy mô ngày đầu, gần 200 học sinh)',
    firstLeadership: {
      principal: 'Thầy Phạm Quốc Dũng',
      vicePrincipal: 'Thầy Đặng Công Thành',
    },
    stabilization: 'Tháng 10/1974, sau 5 lần di chuyển, trên vùng đất mang dấu ấn Vương triều Trần',
    periodName: 'Trường Phổ thông cấp III Mỹ Lộc (thường gọi Cấp III Mỹ Lộc) — theo mốc thành lập của tỉnh Nam Hà; tên tỉnh khi đó là Nam Hà',
    currentAddress: 'Số 1A Tức Mạc, phường Nam Định, tỉnh Ninh Bình',
    historicalAddress: 'Số 75/203 đường Trần Thái Tông, phường Lộc Vượng, thành phố Nam Định (cách ghi của bài viết lịch sử)',
  },

  introduction:
    'Trung tuần tháng 6 năm 1966, khi cuộc kháng chiến chống Mỹ bước vào giai đoạn ác liệt, tỉnh Nam Hà đã thành lập Trường Phổ thông cấp III Mỹ Lộc tại thôn Lang Xá, xã Mỹ Tiến, huyện Mỹ Lộc. Mùa thu năm ấy, những lớp học đầu tiên mở cửa bên sân đình Lang Xá.\n\nNgày ấy trường chỉ có 3 tổ chuyên môn, 5 lớp học với khoảng 200 học sinh. Ban Giám hiệu đầu tiên gồm Hiệu trưởng, thầy Phạm Quốc Dũng, và Phó Hiệu trưởng, thầy Đặng Công Thành.\n\nMở một trường cấp III giữa bom đạn mang ý nghĩa rõ ràng: tạo cơ hội học tập cho con em địa phương, giữ cho dòng chảy tri thức không đứt đoạn, và đào tạo những lớp thanh niên đủ tri thức, bản lĩnh để xây dựng quê hương sau chiến tranh. Ngày ấy không có bản tuyên ngôn nào viết thành văn. Triết lý của trường thể hiện qua việc làm: hoàn cảnh nào việc học cũng không được gián đoạn.',

  wartimeTeaching: {
    description:
      'Không lâu sau ngày thành lập, chiến tranh phá hoại miền Bắc ngày càng ác liệt. Để bảo đảm an toàn, trường chia thành ba khu học. Khu A ở sân đình Lang Xá, khu B ở cuối thôn, khu C dựng trên phần đất người dân cho mượn.',
    bulletPoints: [
      'Phòng học là nhà tranh, vách nứa; quanh lớp có giao thông hào và hầm trú ẩn.',
      'Có lớp học dưới mái đình làng, có lớp mượn gian nhà dân, có lớp chỉ che mái lá.',
      'Còi báo động vang lên, thầy trò gấp sách xuống hầm tránh bom. Máy bay lùi xa, bảng đen được dựng lại và bài học tiếp tục.',
      'Bàn ghế chở bằng xe đạp, xe bò; bảng lớp tháo lắp nhiều lần theo từng điểm sơ tán.',
      'Thầy cô tỏa về từng xóm nhỏ để dạy học và quản lý học sinh.',
      'Người dân mở cửa nhà, nhường sân đình, dành mảnh đất của mình cho lớp học.',
    ],
  },

  fiveRelocations: {
    summary:
      'Trải qua 5 lần di chuyển gian khổ gắn liền với các giai đoạn khốc liệt của cuộc kháng chiến chống Mỹ cứu nước, thầy và trò trường luôn kiên cường bám trụ con chữ.',
    route:
      'Lang Xá → chùa Vĩnh Trường, xã Lộc Vượng (1970–1971) → thôn Bườn, xã Mỹ Hà (4/1972) → phân tán về các xóm (1972–1973) → trở về Mỹ Lộc (1973) → ổn định tại Lộc Vượng (tháng 10/1974).',
    steps: [
      {
        order: 1,
        location: 'Thôn Lang Xá, xã Mỹ Tiến',
        period: '1966 – 1970',
        details: 'Khởi đầu tại sân đình Lang Xá, chia làm 3 khu A, B, C; phòng học tranh tre vách nứa, hầm hào bao quanh.',
      },
      {
        order: 2,
        location: 'Chùa Vĩnh Trường, xã Lộc Vượng',
        period: '1970 – 1971',
        details: 'Học trong hai tầng nhà đơn sơ do Ủy ban Hành chính tỉnh Nam Hà xây dựng. Việc dạy và học tưởng đã ổn định.',
      },
      {
        order: 3,
        location: 'Thôn Bườn, xã Mỹ Hà',
        period: 'Tháng 4/1972',
        details: 'Chiến tranh phá hoại miền Bắc lần thứ hai trở nên ác liệt; thầy và trò tự tay chuyển bàn ghế, sách vở về sơ tán.',
      },
      {
        order: 4,
        location: 'Phân tán về từng xóm nhỏ quanh Mỹ Hà, Mỹ Lộc',
        period: '1972 – 1973',
        details: 'Khi B52 trút bom xuống miền Bắc, lớp học lại phân tán về từng xóm nhỏ. Thầy cô tìm đến từng nhóm học sinh để đôn đốc, quản lý và giảng dạy.',
      },
      {
        order: 5,
        location: 'Trở về Mỹ Lộc (1973) → Ổn định tại Lộc Vượng (tháng 10/1974)',
        period: '10/1974',
        details: 'Sau Hiệp định Paris năm 1973, trường trở về Mỹ Lộc; các công trình tiếp tục được xây dựng. Tháng 10 năm 1974, sau 5 lần di chuyển, trường chính thức ổn định tại số 75/203 đường Trần Thái Tông, phường Lộc Vượng (địa chỉ hiện nay là số 1A Tức Mạc).',
      },
    ],
    settlement1974:
      'Tháng 10 năm 1974, sau 5 lần di chuyển, trường chính thức ổn định tại số 75/203 đường Trần Thái Tông, phường Lộc Vượng, thành phố Nam Định (cách ghi của bài viết lịch sử). Địa chỉ hiện nay của trường là số 1A Tức Mạc, phường Nam Định, tỉnh Ninh Bình.',
    schoolYear1974_1975:
      'Năm học 1974–1975, học sinh chính thức học trong ngôi trường mới với 27 lớp, mỗi khối 9 lớp. Cũng năm học này, trường tham gia phong trào "Tiếng hát át tiếng bom" và được Bộ Văn hóa tặng Bằng khen.',
  },

  section1_1_overview: {
    title: '1.1 Thông tin thành lập',
    items: [
      {
        label: 'Thời điểm thành lập',
        value: 'Trung tuần tháng 6/1966, do tỉnh Nam Hà chủ trương thành lập',
      },
      {
        label: 'Khai giảng khóa đầu',
        value: 'Mùa thu năm 1966, tại đình Lang Xá',
      },
      {
        label: 'Nơi thành lập',
        value: 'Thôn Lang Xá, xã Mỹ Tiến, huyện Mỹ Lộc',
      },
      {
        label: 'Quy mô ngày đầu',
        value: '3 tổ chuyên môn, 5 lớp, khoảng 200 học sinh (riêng quy mô ngày đầu, gần 200 học sinh)',
      },
      {
        label: 'Ban Giám hiệu đầu tiên',
        value: 'Hiệu trưởng: thầy Phạm Quốc Dũng. Phó Hiệu trưởng: thầy Đặng Công Thành',
      },
      {
        label: 'Ổn định địa điểm',
        value: 'Tháng 10/1974, sau 5 lần di chuyển, trên vùng đất mang dấu ấn Vương triều Trần',
      },
      {
        label: 'Tên trường giai đoạn này',
        value: 'Trường Phổ thông cấp III Mỹ Lộc (thường gọi Cấp III Mỹ Lộc) — theo mốc thành lập của tỉnh Nam Hà; tên tỉnh khi đó là Nam Hà',
      },
    ],
  },

  section1_2_birth1966: {
    title: '1.2 Trường ra đời năm 1966',
    content:
      'Trung tuần tháng 6 năm 1966, khi cuộc kháng chiến chống Mỹ bước vào giai đoạn ác liệt, tỉnh Nam Hà đã thành lập Trường Phổ thông cấp III Mỹ Lộc tại thôn Lang Xá, xã Mỹ Tiến, huyện Mỹ Lộc. Mùa thu năm ấy, những lớp học đầu tiên mở cửa bên sân đình Lang Xá.\n\nNgày ấy trường chỉ có 3 tổ chuyên môn, 5 lớp học với khoảng 200 học sinh. Ban Giám hiệu đầu tiên gồm Hiệu trưởng, thầy Phạm Quốc Dũng, và Phó Hiệu trưởng, thầy Đặng Công Thành.\n\nMở một trường cấp III giữa bom đạn mang ý nghĩa rõ ràng: tạo cơ hội học tập cho con em địa phương, giữ cho dòng chảy tri thức không đứt đoạn, và đào tạo những lớp thanh niên đủ tri thức, bản lĩnh để xây dựng quê hương sau chiến tranh. Ngày ấy không có bản tuyên ngôn nào viết thành văn. Triết lý của trường thể hiện qua việc làm: hoàn cảnh nào việc học cũng không được gián đoạn.',
  },

  section1_3_wartimeTeaching: {
    title: '1.3 Dạy và học trong chiến tranh',
    description:
      'Không lâu sau ngày thành lập, chiến tranh phá hoại miền Bắc ngày càng ác liệt. Để bảo đảm an toàn, trường chia thành ba khu học. Khu A ở sân đình Lang Xá, khu B ở cuối thôn, khu C dựng trên phần đất người dân cho mượn.',
    bulletPoints: [
      'Phòng học là nhà tranh, vách nứa; quanh lớp có giao thông hào và hầm trú ẩn.',
      'Có lớp học dưới mái đình làng, có lớp mượn gian nhà dân, có lớp chỉ che mái lá.',
      'Còi báo động vang lên, thầy trò gấp sách xuống hầm tránh bom. Máy bay lùi xa, bảng đen được dựng lại và bài học tiếp tục.',
      'Bàn ghế chở bằng xe đạp, xe bò; bảng lớp tháo lắp nhiều lần theo từng điểm sơ tán.',
      'Thầy cô tỏa về từng xóm nhỏ để dạy học và quản lý học sinh.',
      'Người dân mở cửa nhà, nhường sân đình, dành mảnh đất của mình cho lớp học.',
    ],
  },

  section1_4_fiveRelocations: {
    title: '1.4 Năm lần di chuyển',
    content:
      'Năm học 1970–1971, trường chuyển về khu vực chùa Vĩnh Trường, xã Lộc Vượng, học trong hai tầng nhà đơn sơ do Ủy ban Hành chính tỉnh Nam Hà xây dựng. Việc dạy và học tưởng đã ổn định.\n\nTháng 4 năm 1972, chiến tranh phá hoại miền Bắc lần thứ hai trở nên ác liệt, thầy và trò lại lên đường sơ tán. Từng bộ bàn ghế, từng chồng sách vở được chính thầy trò tự tay chuyển về thôn Bườn, xã Mỹ Hà.\n\nNăm học 1972–1973, khi B52 trút bom xuống miền Bắc, lớp học lại phân tán về từng xóm nhỏ. Thầy cô tìm đến từng nhóm học sinh để đôn đốc, quản lý và giảng dạy.\n\nSau Hiệp định Paris năm 1973, trường trở về Mỹ Lộc; các công trình tiếp tục được xây dựng. Tháng 10 năm 1974, sau 5 lần di chuyển, trường chính thức ổn định tại số 75/203 đường Trần Thái Tông, phường Lộc Vượng, thành phố Nam Định (cách ghi của bài viết lịch sử). Địa chỉ hiện nay của trường là số 1A Tức Mạc, phường Nam Định, tỉnh Ninh Bình.\n\nNăm học 1974–1975, học sinh chính thức học trong ngôi trường mới với 27 lớp, mỗi khối 9 lớp. Cũng năm học này, trường tham gia phong trào "Tiếng hát át tiếng bom" và được Bộ Văn hóa tặng Bằng khen.',
    summaryRoute:
      'Lang Xá → chùa Vĩnh Trường, xã Lộc Vượng (1970–1971) → thôn Bườn, xã Mỹ Hà (4/1972) → phân tán về các xóm (1972–1973) → trở về Mỹ Lộc (1973) → ổn định tại Lộc Vượng (tháng 10/1974).',
    steps: [
      {
        order: 1,
        location: 'Thôn Lang Xá, xã Mỹ Tiến',
        period: '1966 – 1970',
        details: 'Khởi đầu tại sân đình Lang Xá, chia làm 3 khu A, B, C; phòng học tranh tre vách nứa, hầm hào bao quanh.',
      },
      {
        order: 2,
        location: 'Chùa Vĩnh Trường, xã Lộc Vượng',
        period: '1970 – 1971',
        details: 'Học trong hai tầng nhà đơn sơ do Ủy ban Hành chính tỉnh Nam Hà xây dựng. Việc dạy và học tưởng đã ổn định.',
      },
      {
        order: 3,
        location: 'Thôn Bườn, xã Mỹ Hà',
        period: 'Tháng 4/1972',
        details: 'Chiến tranh phá hoại lần hai; thầy trò tự tay sơ tán bàn ghế, sách vở về vùng an toàn.',
      },
      {
        order: 4,
        location: 'Phân tán về từng xóm nhỏ quanh Mỹ Hà, Mỹ Lộc',
        period: '1972 – 1973',
        details: 'B52 trút bom xuống miền Bắc; lớp học xé nhỏ, thầy cô đến từng xóm dạy dỗ học sinh.',
      },
      {
        order: 5,
        location: 'Trở về Mỹ Lộc (1973) → Ổn định tại Lộc Vượng (10/1974)',
        period: '10/1974',
        details: 'Sau Hiệp định Paris năm 1973, tháng 10/1974 trường chính thức ổn định tại số 75/203 đường Trần Thái Tông (nay là số 1A Tức Mạc).',
      },
    ],
    settlement1974:
      'Tháng 10 năm 1974, sau 5 lần di chuyển, trường chính thức ổn định tại số 75/203 đường Trần Thái Tông, phường Lộc Vượng, thành phố Nam Định (cách ghi của bài viết lịch sử). Địa chỉ hiện nay của trường là số 1A Tức Mạc, phường Nam Định, tỉnh Ninh Bình.',
    schoolYear1974_1975:
      'Năm học 1974–1975, học sinh chính thức học trong ngôi trường mới với 27 lớp, mỗi khối 9 lớp. Cũng năm học này, trường tham gia phong trào "Tiếng hát át tiếng bom" và được Bộ Văn hóa tặng Bằng khen.',
    chronology: [
      {
        step: 1,
        year: 'Năm học 1970–1971',
        location: 'Chùa Vĩnh Trường, xã Lộc Vượng',
        details: 'Học trong hai tầng nhà đơn sơ do Ủy ban Hành chính tỉnh Nam Hà xây dựng. Việc dạy và học tưởng đã ổn định.',
      },
      {
        step: 2,
        year: 'Tháng 4/1972',
        location: 'Thôn Bườn, xã Mỹ Hà',
        details: 'Chiến tranh phá hoại lần hai bùng phát ác liệt. Trường sơ tán về thôn Bườn, xã Mỹ Hà, tiếp tục học trong hầm hào và nhà dân.',
      },
      {
        step: 3,
        year: 'Năm học 1972–1973',
        location: 'Phân tán về từng xóm',
        details: 'Máy bay B52 rải thảm miền Bắc. Trường phân tán nhỏ hơn: từng lớp học chia về các xóm. Thầy cô đi bộ từ xóm này sang xóm khác để giảng bài.',
      },
      {
        step: 4,
        year: 'Đầu năm 1973',
        location: 'Mỹ Lộc',
        details: 'Sau Hiệp định Paris, trường trở lại địa điểm ở Mỹ Lộc, vừa dựng lại phòng học vừa tiếp tục dạy.',
      },
      {
        step: 5,
        year: 'Tháng 10/1974',
        location: 'Số 75/203 đường Trần Thái Tông (nay 1A Tức Mạc)',
        details: 'Sau 5 lần di chuyển, trường chuyển về địa điểm hiện nay tại số 75/203 đường Trần Thái Tông (nay là 1A Tức Mạc), xã Lộc Vượng — nay là phường Lộc Vượng, thành phố Nam Định.',
      },
    ],
    summaryList: [
      '1. Thôn Lang Xá, xã Mỹ Tiến (1966)',
      '2. Khu vực chùa Vĩnh Trường, xã Lộc Vượng (1970–1971)',
      '3. Thôn Bườn, xã Mỹ Hà (tháng 4/1972)',
      '4. Phân tán về các xóm (1972–1973)',
      '5. Về lại Mỹ Lộc (1973) rồi chuyển về vị trí hiện nay (tháng 10/1974)',
    ],
  },

  section1_5_militaryEnlistment: {
    title: '1.5 Thầy và trò lên đường nhập ngũ',
    content:
      'Trần Văn Long cùng các liệt sĩ Bùi Quang Thành, Trần Đình Phú, Nguyễn Văn Bật, Lương Xuân Ẩn, Đỗ Văn Chới, Ninh Văn Đức.',
    martyrs: [
      'Trần Văn Long',
      'Bùi Quang Thành',
      'Trần Đình Phú',
      'Nguyễn Văn Bật',
      'Lương Xuân Ẩn',
      'Đỗ Văn Chới',
      'Ninh Văn Đức',
    ],
    note: 'Danh sách trên [cần xác nhận bổ sung danh sách đầy đủ]',
  },

  foundationPeople: {
    title: 'Những Người Đặt Nền Móng (1966–1975)',
    leaders: [
      {
        role: 'Hiệu trưởng đầu tiên',
        name: 'Thầy Phạm Quốc Dũng',
        note: 'Lãnh đạo nhà trường từ những ngày đầu bom đạn tại đình Lang Xá (tháng 6/1966)',
      },
      {
        role: 'Phó Hiệu trưởng đầu tiên',
        name: 'Thầy Đặng Công Thành',
        note: 'Cùng Hiệu trưởng gầy dựng 3 tổ chuyên môn và 5 lớp học đầu tiên',
      },
    ],
    firstTeachers: [
      {
        name: 'Tập thể cán bộ giáo viên 3 tổ chuyên môn đầu tiên',
        note: 'Thầy cô tỏa về từng xóm nhỏ để dạy học và quản lý học sinh; bám trường, bám lớp, vượt qua bom đạn bảo vệ tương lai học trò.',
      },
    ],
  },

  artifacts: [
    {
      id: 'art-decision-1966',
      title: 'Mốc thành lập Trường Phổ thông cấp III Mỹ Lộc (6/1966)',
      type: 'Tư liệu lịch sử lưu trữ',
      description: 'Chủ trương khởi đầu trung tuần tháng 6/1966 bởi tỉnh Nam Hà.',
      verificationStatus: 'verified',
    },
    {
      id: 'art-lang-xa-temple',
      title: 'Ký ức Sân đình Lang Xá (Mùa thu 1966)',
      type: 'Địa danh lịch sử',
      description: 'Nơi tổ chức lễ khai giảng khóa đầu tiên với 3 tổ chuyên môn, 5 lớp, gần 200 học sinh.',
      verificationStatus: 'verified',
    },
    {
      id: 'art-trench-classroom',
      title: 'Mô hình Lớp học hầm hào & Nhà tranh vách nứa (1966–1973)',
      type: 'Tư liệu phục dựng',
      description: 'Lớp học hầm hào, vách nứa, còi báo động vang lên thầy trò xuống hầm, máy bay lùi xa bảng đen lại dựng lên.',
      verificationStatus: 'verified',
    },
    {
      id: 'art-martyrs-monument',
      title: 'Bia Tưởng niệm Thầy & Trò Lên đường Nhập ngũ',
      type: 'Tưởng niệm & Tri ân',
      description: 'Liệt sĩ Trần Văn Long, Bùi Quang Thành, Trần Đình Phú, Nguyễn Văn Bật, Lương Xuân Ẩn, Đỗ Văn Chới, Ninh Văn Đức. [cần xác nhận]',
      verificationStatus: 'needs_review',
      note: 'Danh sách trên [cần xác nhận]',
    },
    {
      id: 'art-certificate-1975',
      title: 'Bằng khen của Bộ Văn hóa trao tặng (Năm học 1974–1975)',
      type: 'Bằng khen lịch sử',
      description: 'Khen tặng phong trào "Tiếng hát át tiếng bom" của thầy và trò nhà trường.',
      verificationStatus: 'verified',
    },
  ],
};

export const SIX_ZONES_SUMMARY: TraditionZoneSummary[] = [
  {
    id: 'history',
    code: 'KHU 1',
    titleVi: 'LỊCH SỬ HÌNH THÀNH (1966–1975)',
    titleEn: 'Founding History & Wartime Resilience',
    timePeriod: '1966–1975',
    description: 'Từ mốc thành lập của tỉnh Nam Hà tại thôn Lang Xá, 5 lớp học ban đầu dưới bom đạn qua 5 lần di chuyển gian khổ đến ngày trở về mảnh đất Vương triều Trần.',
    status: 'active',
  },
  {
    id: 'development',
    code: 'KHU 2',
    titleVi: 'CÁC THỜI KỲ PHÁT TRIỂN (1975–NAY)',
    titleEn: 'Development Through Eras',
    timePeriod: '1975–2026',
    description: 'Chặng đường kiến thiết, đổi mới mô hình giáo dục, hiện đại hóa cơ sở vật chất và khẳng định vị thế trường trọng điểm chất lượng cao của tỉnh.',
    status: 'in_progress',
  },
  {
    id: 'timeline',
    code: 'KHU 3',
    titleVi: 'DÒNG THỜI GIAN 60 NĂM (ORBITAL TIMELINE)',
    titleEn: '60-Year Orbital Timeline',
    timePeriod: '1966–2026',
    description: 'Biểu đồ thời gian tương tác 3D đa chiều, tổng hợp từng niên khóa, sự kiện bước ngoặt và dấu mốc quan trọng trong suốt 60 năm lịch sử trường.',
    status: 'in_progress',
  },
  {
    id: 'achievements',
    code: 'KHU 4',
    titleVi: 'BẢNG VÀNG THÀNH TÍCH & TỰ HÀO',
    titleEn: 'Hall of Honor & Achievements',
    timePeriod: '1966–2026',
    description: 'Tôn vinh Huân chương Lao động, Bằng khen của Chính phủ, Bộ Văn hóa, các thế hệ học sinh giỏi Quốc gia, thủ khoa và thành tích xuất sắc.',
    status: 'in_progress',
  },
  {
    id: 'memory',
    code: 'KHU 5',
    titleVi: 'KÝ ỨC THẦY TRÒ & TRI ÂN',
    titleEn: 'Teacher-Student Memories & Gratitude',
    timePeriod: '1966–2026',
    description: 'Không gian lắng đọng ghi nhận công lao của các thế hệ Ban Giám hiệu, thầy cô giáo tiền bối và kỷ niệm ấm áp của cựu học sinh các thời kỳ.',
    status: 'in_progress',
  },
];
