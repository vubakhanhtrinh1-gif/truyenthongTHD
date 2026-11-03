/**
 * Development Room (Zone 2) Dedicated Administration & Real-Time Sync Service
 * Manages:
 * 1. Central Framed Image of Đức Thánh Trần
 * 2. Three School History Periods (1974–2026)
 * 3. Important Medals (with independent photo uploads per record)
 * 4. School Leadership (Current team & historical principals)
 *
 * Persisted in Cloud Firestore (editorial_contents) & Firebase Storage with offline local fallback.
 */

import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../../../services/firebase';
import {
  DucThanhTranConfig,
  ImportantMedalItem,
  LeadershipProfile,
  HistoryEraItem,
  Khu2CompleteData,
} from '../../../types/development';
import { ZONE_2_DEVELOPMENT_CONTENT } from '../config/developmentContentData';

// Firestore collection & document keys
const DOC_DUC_THANH_TRAN = 'development.duc_thanh_tran';
const DOC_MEDALS = 'development.important_medals';
const DOC_LEADERSHIP = 'development.leadership_heritage';
const DOC_HISTORY = 'development.school_history';

const CACHE_KEY_PREFIX = 'cosmic_khu2_';

// Default authentic historical dataset
export const DEFAULT_KHU2_DATA: Khu2CompleteData = {
  ducThanhTran: {
    captionVi: 'Ảnh tư liệu Hưng Đạo Đại Vương Trần Quốc Tuấn (1228 – 1300)',
    captionEn: 'Archival Portrait of Supreme Commander Tran Hung Dao',
    sourceNote: 'Tư liệu lưu trữ truyền thống Trường THPT A Trần Hưng Đạo',
    statueSpecs: {
      material: 'Tượng đồng nguyên khối',
      height: '1,28 m',
      weight: '212 kg',
      foundry: 'Làng nghề đúc đồng truyền thống Tống Xá, Ý Yên',
      sculptor: 'Họa sĩ Vương Duy Biên',
      inaugurationDate: '28/08/2006',
      occasion: 'Kỷ niệm 40 năm thành lập trường (1966 – 2006)',
    },
    updatedAt: new Date().toISOString(),
  },
  historyEras: {
    era1: {
      id: 'era1',
      code: 'ERA 1',
      titleVi: 'Thời Kỳ 1: Ổn Định Cơ Sở & Khẳng Định Vị Thế',
      titleEn: 'Era One: Consolidating Identity',
      periodLabel: '1974 – 1997',
      headingVi: 'ỔN ĐỊNH VÀ KHẲNG ĐỊNH VỊ THẾ',
      summaryVi: 'Sau 5 lần di chuyển trường lớp thời chiến, tháng 10/1974 trường chính thức định cư tại đất mới Lộc Vượng, từng bước xây dựng cơ sở kiên cố, đổi tên mang tên Anh hùng dân tộc Trần Hưng Đạo và khẳng định chất lượng giáo dục vững vàng.',
      descriptionVi: 'Giai đoạn đánh dấu sự chuyển mình từ trường lớp sơ tán sang cơ sở tập trung kiên cố. Năm 1982, trường chính thức mang tên Trường PTTH Trần Hưng Đạo. Năm 1992, Đại tướng Võ Nguyên Giáp về thăm trường, mở ra giai đoạn đổi mới giáo dục toàn diện.',
      milestones: [
        {
          year: 1974,
          titleVi: 'Ổn định tại Lộc Vượng sau 5 lần di chuyển',
          descriptionVi: 'Tháng 10/1974, trường chính thức định cư tại vùng đất mang dấu ấn Vương triều Trần sau những năm tháng sơ tán gian khổ.',
          significanceVi: 'Chấm dứt hoàn toàn thời kỳ sơ tán bom đạn.',
        },
        {
          year: 1982,
          titleVi: 'Đổi tên thành Trường PTTH Trần Hưng Đạo',
          descriptionVi: 'Chính thức mang tên vị Anh hùng dân tộc lỗi lạc, khởi xướng phong trào "Rèn đức – Luyện tài".',
          significanceVi: 'Xác lập định danh vinh quang và phương châm giáo dục xuyên suốt.',
        },
        {
          year: 1991,
          titleVi: 'Đón nhận Huân chương Lao động hạng Ba',
          descriptionVi: 'Nhân dịp kỷ niệm 25 năm thành lập trường (1966–1991), Chủ tịch Hội đồng Nhà nước tặng thưởng Huân chương Lao động hạng Ba.',
          significanceVi: 'Mốc son ghi nhận 25 năm cống hiến xuất sắc.',
        },
        {
          year: 1992,
          titleVi: 'Đại tướng Võ Nguyên Giáp về thăm trường',
          descriptionVi: 'Ngày 28/4/1992, Đại tướng Võ Nguyên Giáp về thăm, căn dặn thầy trò tiếp tục phát huy hào khí Đông A.',
          significanceVi: 'Nguồn động viên tinh thần vô giá cho các thế hệ nhà trường.',
        },
      ],
    },
    era2: {
      id: 'era2',
      code: 'ERA 2',
      titleVi: 'Thời Kỳ 2: Bứt Phá & Trưởng Thành',
      titleEn: 'Era Two: Breakthrough and Growth',
      periodLabel: '1997 – 2016',
      headingVi: 'BỨT PHÁ VÀ TRƯỞNG THÀNH',
      summaryVi: 'Thời kỳ trường mở rộng quy mô mạnh mẽ, vươn lên đỉnh cao chất lượng giáo dục toàn diện, khánh thành tượng đài Anh hùng dân tộc, lọt Top 37 trường THPT hàng đầu toàn quốc, đón nhận Huân chương Lao động hạng Nhất và Huân chương Độc lập hạng Ba.',
      descriptionVi: 'Hai thập kỷ bứt phá ngoạn mục với sự đầu tư đồng bộ về cơ sở vật chất: xây dựng dãy nhà cao tầng, phòng thực hành, hội trường đa năng. Năm 2009 được công nhận Trường Chuẩn Quốc gia.',
      milestones: [
        {
          year: 1996,
          titleVi: 'Đón nhận Huân chương Lao động hạng Nhì',
          descriptionVi: 'Chủ tịch nước trao tặng tại lễ kỷ niệm 30 năm ngày thành lập trường.',
        },
        {
          year: 2000,
          titleVi: 'Đón nhận Huân chương Lao động hạng Nhất',
          descriptionVi: 'Hoàn thành trọn bộ Huân chương Lao động hạng Ba, Nhì, Nhất.',
        },
        {
          year: 2006,
          titleVi: 'Khánh thành tượng đồng Đức Thánh Trần & Kỷ niệm 40 năm',
          descriptionVi: 'Tượng đồng cao 1,28m, nặng 212kg đúc tại Tống Xá theo mẫu của họa sĩ Vương Duy Biên được khánh thành trang trọng ngày 28/8/2006.',
        },
        {
          year: 2009,
          titleVi: 'Đạt chuẩn Quốc gia & Lọt Top 37 toàn quốc',
          descriptionVi: 'Chính thức đón bằng công nhận Trường Chuẩn Quốc gia giai đoạn 2001–2010.',
        },
        {
          year: 2011,
          titleVi: 'Đón nhận Huân chương Độc lập hạng Ba (Kỷ niệm 45 năm)',
          descriptionVi: 'Phần thưởng cao quý nhất của Đảng và Nhà nước trao tặng ghi nhận 45 năm cống hiến rạng rỡ.',
        },
        {
          year: 2016,
          titleVi: 'Đại lễ Kỷ niệm 50 năm thành lập trường (1966–2016)',
          descriptionVi: 'Nửa thế kỷ vẻ vang hội tụ hàng vạn cựu giáo chức và học sinh các thời kỳ.',
        },
      ],
    },
    era3: {
      id: 'era3',
      code: 'ERA 3',
      titleVi: 'Thời Kỳ 3: Kiến Tạo Tương Lai & Đổi Mới Số',
      titleEn: 'Era Three: Creating the Future',
      periodLabel: '2016 – 2026',
      headingVi: 'HIỆN ĐẠI HÓA VÀ HƯỚNG TỚI TƯƠNG LAI',
      summaryVi: 'Thời kỳ đổi mới căn bản và toàn diện giáo dục, tiên phong chuyển đổi số trong quản lý và dạy học, khánh thành khối nhà học 4 tầng hiện đại 33 phòng chức năng, đón nhận Cờ thi đua của Chính phủ và hướng tới Đại lễ 60 năm Dấu ấn Kim Cương.',
      descriptionVi: 'Cơ sở vật chất được hiện đại hóa với hệ thống màn hình tương tác, phòng thí nghiệm thông minh, thư viện số hóa và quản trị trường học bằng nền tảng công nghệ cao.',
      milestones: [
        {
          year: 2021,
          titleVi: 'Kỷ niệm 55 năm & Đổi tên trường thành THPT A Trần Hưng Đạo',
          descriptionVi: 'Khẳng định vị thế trường hàng đầu của tỉnh theo quyết định số 460/QĐ-UBND.',
        },
        {
          year: '2022–2024',
          titleVi: 'Chuyển đổi số toàn diện & Cờ thi đua Chính phủ',
          descriptionVi: '100% giáo án số hóa, ứng dụng LMS và quản lý dữ liệu số tập trung.',
        },
        {
          year: '2024–2025',
          titleVi: 'Xây dựng nhà học 4 tầng kiên cố hóa 33 phòng chức năng',
          descriptionVi: 'Công trình kiến trúc hiện đại đáp ứng tiêu chuẩn kiểm định chất lượng mức độ cao nhất.',
        },
        {
          year: 2026,
          titleVi: 'Đại lễ Kỷ niệm 60 năm ngày thành lập trường (1966–2026)',
          descriptionVi: '60 năm Dấu ấn Kim Cương — Một điểm tựa lịch sử, một quỹ đạo tương lai.',
        },
      ],
    },
  },
  medals: [
    {
      id: 'medal_lao_dong_3',
      titleVi: 'Huân chương Lao động hạng Ba',
      titleEn: 'Third-Class Labor Order',
      year: 1991,
      descriptionVi: 'Chủ tịch Hội đồng Nhà nước trao tặng nhân dịp kỷ niệm 25 năm ngày thành lập trường (1966–1991) vì thành tích xuất sắc trong sự nghiệp giáo dục và bảo vệ Tổ quốc.',
      significanceVi: 'Mốc son huân chương đầu tiên khẳng định vị thế nhà trường sau thời kỳ củng cố và ổn định tại cơ sở mới.',
      source: 'Quyết định tặng thưởng Huân chương của Hội đồng Nhà nước (1991)',
      displayOrder: 1,
      isPublished: true,
      verificationStatus: 'verified',
    },
    {
      id: 'medal_lao_dong_2',
      titleVi: 'Huân chương Lao động hạng Nhì',
      titleEn: 'Second-Class Labor Order',
      year: 1996,
      descriptionVi: 'Chủ tịch nước trao tặng đánh dấu 30 năm xây dựng và trưởng thành (1966–1996). Cơ sở vật chất lúc này được mở rộng kiên cố với dãy nhà D, hội trường và phòng chức năng.',
      significanceVi: 'Khẳng định bước chuyển mình vượt bậc về quy mô và chất lượng giáo dục toàn diện.',
      source: 'Quyết định tặng thưởng Huân chương của Chủ tịch nước (1996)',
      displayOrder: 2,
      isPublished: true,
      verificationStatus: 'verified',
    },
    {
      id: 'medal_lao_dong_1',
      titleVi: 'Huân chương Lao động hạng Nhất',
      titleEn: 'First-Class Labor Order',
      year: 2000,
      descriptionVi: 'Chủ tịch nước trao tặng năm 2000, hoàn thành trọn bộ Huân chương Lao động (Hạng Ba, Nhì, Nhất) của Nhà nước.',
      significanceVi: 'Bước đệm vững chắc đưa trường vươn lên nhóm các trường THPT trọng điểm hàng đầu toàn quốc.',
      source: 'Quyết định tặng thưởng Huân chương Lao động hạng Nhất (2000)',
      displayOrder: 3,
      isPublished: true,
      verificationStatus: 'verified',
    },
    {
      id: 'medal_doc_lap_3',
      titleVi: 'Huân chương Độc lập hạng Ba',
      titleEn: 'Third-Class Independence Order',
      year: 2011,
      descriptionVi: 'Chủ tịch nước trao tặng tại Đại lễ kỷ niệm 45 năm thành lập trường (1966–2011). Phần thưởng cao quý ghi nhận sự cống hiến đặc biệt xuất sắc cho sự nghiệp giáo dục nước nhà.',
      significanceVi: 'Huân chương cao quý bậc nhất của Đảng và Nhà nước trao tặng cho nhà trường.',
      source: 'Quyết định tặng thưởng Huân chương Độc lập của Chủ tịch nước (2011)',
      displayOrder: 4,
      isPublished: true,
      verificationStatus: 'verified',
    },
    {
      id: 'medal_co_chinh_phu',
      titleVi: 'Cờ Thi đua của Chính phủ & Bằng khen của Bộ GD&ĐT',
      titleEn: 'Government Emulation Flag',
      year: '2021–2025',
      descriptionVi: 'Chính phủ và Bộ Giáo dục & Đào tạo trao tặng đơn vị dẫn đầu phong trào thi đua "Đổi mới, sáng tạo trong quản trị, dạy và học" khối THPT toàn tỉnh.',
      significanceVi: 'Ghi nhận những bước đột phá trong chuyển đổi số và nâng cao chất lượng giáo dục thời kỳ mới.',
      source: 'Hồ sơ thi đua khen thưởng ngành Giáo dục & Đào tạo',
      displayOrder: 5,
      isPublished: true,
      verificationStatus: 'verified',
    },
  ],
  leadership: {
    current: [
      {
        id: 'lead_cur_1',
        order: 1,
        name: 'Thầy Nguyễn Duy Phương',
        role: 'Bí thư Đảng ủy — Hiệu trưởng',
        period: '2017 – Hiện nay',
        noteVi: 'Lãnh đạo toàn diện nhà trường đổi mới quản trị số, khánh thành khối nhà 4 tầng và hướng tới Đại lễ 60 năm rạng rỡ.',
        biographyVi: 'Thạc sĩ Quản lý Giáo dục, lãnh đạo nhà trường đạt chuẩn kiểm định chất lượng mức độ 3 và chuẩn Quốc gia mức độ 2.',
        isCurrentLeadership: true,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_cur_2',
        order: 2,
        name: 'Thầy Hoàng Việt Hà',
        role: 'Phó Hiệu trưởng',
        period: 'Hiện nay',
        noteVi: 'Phụ trách chuyên môn, công tác bồi dưỡng học sinh giỏi và ứng dụng công nghệ thông tin trong dạy học.',
        biographyVi: 'Phụ trách chỉ đạo chuyên môn các tổ Tự nhiên và hoạt động khoa học kỹ thuật cấp tỉnh.',
        isCurrentLeadership: true,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_cur_3',
        order: 3,
        name: 'Cô Trần Thị Thúy Mùi',
        role: 'Phó Hiệu trưởng',
        period: 'Hiện nay',
        noteVi: 'Phụ trách công tác giáo dục đạo đức, nề nếp kỷ cương học sinh và các hoạt động văn hóa, trải nghiệm sáng tạo.',
        biographyVi: 'Phụ trách công tác phong trào Đoàn Thanh niên, các tổ Xã hội và giáo dục kỹ năng sống cho học sinh.',
        isCurrentLeadership: true,
        verificationStatus: 'verified',
      },
    ],
    historical: [
      {
        id: 'lead_hist_1',
        order: 1,
        name: 'Thầy Phạm Quốc Dũng',
        role: 'Hiệu trưởng đầu tiên',
        period: '1966 – [thời kỳ khởi dựng]',
        noteVi: 'Người đặt nền móng lãnh đạo nhà trường từ những ngày đầu sơ tán tại đình Lang Xá (tháng 6/1966).',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_2',
        order: 2,
        name: 'Thầy Trịnh Ngọc Quán',
        role: 'Hiệu trưởng',
        period: '[thời kỳ tiếp nối]',
        noteVi: 'Cùng tập thể sư phạm chèo lái trường qua những năm tháng kháng chiến chống Mỹ ác liệt.',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_3',
        order: 3,
        name: 'Thầy Trần Sỹ Huấn',
        role: 'Hiệu trưởng',
        period: '[thời kỳ kháng chiến]',
        noteVi: 'Lãnh đạo nhà trường duy trì dòng chảy tri thức trong những lần di chuyển trường lớp.',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_4',
        order: 4,
        name: 'Thầy Ngô Minh Tâm',
        role: 'Hiệu trưởng',
        period: 'Đến năm 1985',
        noteVi: 'Gắn liền với giai đoạn trường ổn định cơ sở tại Lộc Vượng; chuyển công tác năm 1985.',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_5',
        order: 5,
        name: 'Thầy Cao Hạnh',
        role: 'Hiệu trưởng',
        period: 'Từ năm học 1986–1987',
        noteVi: 'Lãnh đạo trường trong giai đoạn đầu đổi mới, củng cố kỷ cương nề nếp và chất lượng chuyên môn.',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_6',
        order: 6,
        name: 'Thầy Nguyễn Thế Tùng',
        role: 'Hiệu trưởng',
        period: '[thời kỳ phát triển]',
        noteVi: 'Tiếp tục đẩy mạnh phong trào thi đua dạy tốt học tốt và xây dựng cảnh quan trường lớp.',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_7',
        order: 7,
        name: 'Thầy Trần Đăng',
        role: 'Hiệu trưởng',
        period: 'Từ năm 2000',
        noteVi: 'Lãnh đạo trường đón nhận Huân chương Lao động hạng Nhất (2000) và Trường chuẩn Quốc gia (2009).',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_8',
        order: 8,
        name: 'Cô Trần Thị Mai',
        role: 'Hiệu trưởng',
        period: '[nữ Hiệu trưởng đầu tiên]',
        noteVi: 'Nữ Hiệu trưởng đầu tiên của trường, đưa phong trào giáo dục toàn diện và Hội khỏe Phù Đổng vươn cao.',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
      {
        id: 'lead_hist_9',
        order: 9,
        name: 'Thầy Nguyễn Duy Phương',
        role: 'Hiệu trưởng hiện nay',
        period: '2017 – Hiện nay',
        noteVi: 'Lãnh đạo trường đổi mới quản trị số, khánh thành nhà 4 tầng và hướng tới Đại lễ 60 năm rạng rỡ.',
        isCurrentLeadership: false,
        verificationStatus: 'verified',
      },
    ],
  },
};

/**
 * Local Storage helpers for immediate offline availability
 */
export function getCachedKhu2Data(): Khu2CompleteData {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}data`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return DEFAULT_KHU2_DATA;
}

export function saveCachedKhu2Data(data: Khu2CompleteData) {
  try {
    localStorage.setItem(`${CACHE_KEY_PREFIX}data`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Upload an image asset to Firebase Storage with base64 data URL fallback
 */
export async function uploadKhu2MediaAsset(
  file: File,
  folder: string = 'development'
): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}_${cleanName}`;

  try {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/png',
    });

    return await new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        null,
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  } catch (err) {
    console.warn('Storage upload fallback to base64 Data URL:', err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Save Duc Thanh Tran Image configuration
 */
export async function saveDucThanhTranConfig(config: Partial<DucThanhTranConfig>): Promise<void> {
  const current = getCachedKhu2Data();
  const updated: DucThanhTranConfig = {
    ...current.ducThanhTran,
    ...config,
    updatedAt: new Date().toISOString(),
  };

  current.ducThanhTran = updated;
  saveCachedKhu2Data(current);

  try {
    const docRef = doc(db, 'editorial_contents', DOC_DUC_THANH_TRAN);
    await setDoc(
      docRef,
      {
        contentId: DOC_DUC_THANH_TRAN,
        roomId: 'development',
        textValues: {
          captionVi: updated.captionVi,
          sourceNote: updated.sourceNote,
          updatedAt: updated.updatedAt,
        },
        customFields: {
          imageUrl: updated.imageUrl || '',
          storagePath: updated.storagePath || '',
          statueSpecs: updated.statueSpecs,
        },
        isPublished: true,
        updatedAt: updated.updatedAt,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore write warning for Duc Thanh Tran config:', err);
  }
}

/**
 * Save Important Medals list
 */
export async function saveImportantMedals(medals: ImportantMedalItem[]): Promise<void> {
  const current = getCachedKhu2Data();
  current.medals = medals;
  saveCachedKhu2Data(current);

  try {
    const docRef = doc(db, 'editorial_contents', DOC_MEDALS);
    await setDoc(
      docRef,
      {
        contentId: DOC_MEDALS,
        roomId: 'development',
        customFields: {
          medals,
        },
        isPublished: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore write warning for medals:', err);
  }
}

/**
 * Save Leadership Profiles
 */
export async function saveLeadershipData(leadership: Khu2CompleteData['leadership']): Promise<void> {
  const current = getCachedKhu2Data();
  current.leadership = leadership;
  saveCachedKhu2Data(current);

  try {
    const docRef = doc(db, 'editorial_contents', DOC_LEADERSHIP);
    await setDoc(
      docRef,
      {
        contentId: DOC_LEADERSHIP,
        roomId: 'development',
        customFields: {
          current: leadership.current,
          historical: leadership.historical,
        },
        isPublished: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore write warning for leadership:', err);
  }
}

/**
 * Save History Eras
 */
export async function saveHistoryEras(eras: Khu2CompleteData['historyEras']): Promise<void> {
  const current = getCachedKhu2Data();
  current.historyEras = eras;
  saveCachedKhu2Data(current);

  try {
    const docRef = doc(db, 'editorial_contents', DOC_HISTORY);
    await setDoc(
      docRef,
      {
        contentId: DOC_HISTORY,
        roomId: 'development',
        customFields: {
          eras,
        },
        isPublished: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore write warning for history eras:', err);
  }
}

/**
 * React Hook for Real-Time Sync in Khu 2 (3D Room and Public View)
 */
export function useKhu2Content() {
  const [data, setData] = useState<Khu2CompleteData>(getCachedKhu2Data());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial cached data
    setData(getCachedKhu2Data());

    // 2. Subscribe to Firestore for real-time updates
    const unsubDucThanhTran = onSnapshot(
      doc(db, 'editorial_contents', DOC_DUC_THANH_TRAN),
      (snap) => {
        if (snap.exists()) {
          const docData = snap.data();
          setData((prev) => {
            const next = {
              ...prev,
              ducThanhTran: {
                ...prev.ducThanhTran,
                imageUrl: docData.customFields?.imageUrl || docData.imageUrl || prev.ducThanhTran.imageUrl,
                captionVi: docData.textValues?.captionVi || docData.captionVi || prev.ducThanhTran.captionVi,
                sourceNote: docData.textValues?.sourceNote || docData.sourceNote || prev.ducThanhTran.sourceNote,
                updatedAt: docData.updatedAt || prev.ducThanhTran.updatedAt,
              },
            };
            saveCachedKhu2Data(next);
            return next;
          });
        }
      },
      (err) => console.warn('Snapshot error on Duc Thanh Tran:', err)
    );

    const unsubMedals = onSnapshot(
      doc(db, 'editorial_contents', DOC_MEDALS),
      (snap) => {
        if (snap.exists()) {
          const docData = snap.data();
          if (docData.customFields?.medals) {
            setData((prev) => {
              const next = { ...prev, medals: docData.customFields.medals };
              saveCachedKhu2Data(next);
              return next;
            });
          }
        }
      },
      (err) => console.warn('Snapshot error on Medals:', err)
    );

    const unsubLeadership = onSnapshot(
      doc(db, 'editorial_contents', DOC_LEADERSHIP),
      (snap) => {
        if (snap.exists()) {
          const docData = snap.data();
          if (docData.customFields) {
            setData((prev) => {
              const next = {
                ...prev,
                leadership: {
                  current: docData.customFields.current || prev.leadership.current,
                  historical: docData.customFields.historical || prev.leadership.historical,
                },
              };
              saveCachedKhu2Data(next);
              return next;
            });
          }
        }
      },
      (err) => console.warn('Snapshot error on Leadership:', err)
    );

    const unsubHistory = onSnapshot(
      doc(db, 'editorial_contents', DOC_HISTORY),
      (snap) => {
        if (snap.exists()) {
          const docData = snap.data();
          if (docData.customFields?.eras) {
            setData((prev) => {
              const next = { ...prev, historyEras: docData.customFields.eras };
              saveCachedKhu2Data(next);
              return next;
            });
          }
        }
      },
      (err) => console.warn('Snapshot error on History Eras:', err)
    );

    setLoading(false);

    return () => {
      unsubDucThanhTran();
      unsubMedals();
      unsubLeadership();
      unsubHistory();
    };
  }, []);

  return { data, loading };
}
