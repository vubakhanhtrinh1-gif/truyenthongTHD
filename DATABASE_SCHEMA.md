# KIẾN TRÚC CƠ SỞ DỮ LIỆU CLOUD FIRESTORE (DATABASE SCHEMA)
## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Nguyên Tắc Cốt Lõi Kiến Trúc (Architectural Principles)

```
[ HERITAGE CORE - BẢO TỒN LỊCH SỬ ]
    (Tư liệu gốc, hiện vật, nhân vật, mốc thời gian, nguồn kiểm chứng, bản quyền)
                             │
                             ▼  (Phân tách hoàn toàn)
[ COSMIC PRESENTATION LAYER - KHÔNG GIAN TRẢI NGHIỆM VŨ TRỤ ]
    (Mô hình 3D, tọa độ camera, hiệu ứng ánh sáng, quỹ đạo tương tác)
```

- **Tách biệt dữ liệu và giao diện**: Cơ sở dữ liệu Firestore chỉ lưu trữ **dữ liệu lịch sử có thực** và **nội dung di sản**. Tuyệt đối không lưu tọa độ 3D, góc camera, thông số vật liệu Three.js vào các bảng nội dung lịch sử.
- **Tính bất biến của Lịch sử**: Mọi dữ liệu đều hỗ trợ trường kiểm chứng `verificationStatus`.
- **Hỗ trợ Đa ngôn ngữ (Multilingual-Ready)**: Mọi bảng nội dung đều có trường song ngữ Tiếng Việt (`...Vi`) và Tiếng Anh (`...En`).
- **Mã phòng Cố định (Canonical Stable IDs)**:
  - `gate`: 01. Cổng Vũ Trụ Di Sản
  - `lobby`: 02. Sảnh Chào & Giới Thiệu
  - `history`: 03. Lịch Sử Hình Thành
  - `timeline`: 04. Dòng Thời Gian Orbital Timeline (1966–2026)
  - `development`: 05. Quá Trình Phát Triển & Cơ Sở Vật Chất
  - `achievements`: 06. Thành Tích & Tự Hào
  - `memory`: 07. Ký Ức & Tri Ân
  - `vr_ar`: 08. Không Gian Trải Nghiệm VR/AR
  - `ending`: 09. Điểm Tựa Tương Lai

---

### 2. Chi Tiết Danh Mục 17 Bộ Sưu Tập (Firestore Collections)

#### 2.1. `site_settings` (Cài đặt Toàn cục)
Document ID: `general`
- `projectTitle` (string): Tiêu đề chính của dự án.
- `projectSubtitle` (string): Tiêu đề phụ (Niên khóa/Thời kỳ).
- `tagline` (string): Khẩu hiệu ("60 năm – một điểm tựa, một quỹ đạo tương lai.").
- `schoolName` (string): Tên chính thức của trường.
- `defaultLanguage` (string): 'vi' | 'en'.
- `supportedLanguages` (string[]): Danh sách mã ngôn ngữ ['vi', 'en'].
- `welcomeMessageVi` / `welcomeMessageEn` (string): Lời chào mở đầu.
- `contactInformation` (string): Thông tin liên hệ ban quản trị.
- `maintenanceMode` (boolean): Chế độ bảo trì hệ thống.
- `updatedAt` (timestamp/ISO string).

#### 2.2. `admins` (Danh mục Quản trị viên & Phân quyền RBAC)
Document ID: `{uid}` (Khớp với UID của tài khoản Firebase Auth)
- `uid` (string, required): Mã định danh người dùng.
- `email` (string, required): Email của quản trị viên.
- `role` (string, required): Mặc định là `"ADMIN"`.
- `displayName` (string): Họ tên hoặc chức danh ban phụ trách.
- `isActive` (boolean): Trạng thái hoạt động (`true`/`false`).
- `createdAt` / `updatedAt` (ISO string).

#### 2.3. `rooms` (Phân khu Không gian Triển lãm)
Document ID: `{roomId}` (Dùng mã cố định: `gate`, `lobby`, `history`, `timeline`, `development`, `achievements`, `memory`, `vr_ar`, `ending`)
- `id` (string, required): Mã phòng cố định.
- `nameVi` / `nameEn` (string, required): Tên phân khu triển lãm.
- `slug` (string, required): Đường dẫn URL thân thiện.
- `descriptionVi` / `descriptionEn` (string): Giới thiệu chủ đề phân khu.
- `displayOrder` (number): Thứ tự điều hướng (1–9).
- `status` (string): `'planned'` | `'draft'` | `'in_progress'` | `'completed'`.
- `isPublished` (boolean): Trạng thái hiển thị công khai.
- `createdAt` / `updatedAt` (ISO string).

#### 2.4. `artifacts` (Kho Hiện vật & Kỷ vật Lịch sử - Reference CRUD Module)
Document ID: Auto-ID
- `id` (string): Mã định danh hiện vật.
- `type` (string, required): `'medal'` | `'certificate'` | `'document'` | `'photo'` | `'photo_album'` | `'object'` | `'other'`.
- `titleVi` / `titleEn` (string, required): Tên hiện vật.
- `subtitleVi` / `subtitleEn` (string): Phụ đề / chú thích ngắn.
- `year` (number): Năm niên đại hiện vật.
- `descriptionVi` / `descriptionEn` (string): Mô tả chi tiết chất liệu, xuất xứ.
- `storyVi` / `storyEn` (string): Câu chuyện lịch sử có thật gắn liền với hiện vật.
- `imageGallery` (string[]): Danh sách URL ảnh hiện vật chất lượng cao.
- `captionVi` / `captionEn` (string): Chú thích trưng bày.
- `sourceIds` (string[]): Danh sách ID liên kết sang bảng `sources`.
- `verificationStatus` (string, required): `'unverified'` | `'verified'` | `'needs_review'`.
- `displayOrder` (number): Thứ tự sắp xếp.
- `isPublished` (boolean): Trạng thái hiển thị.
- `createdBy` / `updatedBy` (string).

#### 2.5. `timeline_events` (Dòng Thời Gian Orbital Timeline 1966–2026)
Document ID: Auto-ID
- `year` (number, required): Năm diễn ra sự kiện (1966 đến 2026).
- `date` (string): Ngày tháng chính xác (nếu có căn cứ).
- `titleVi` / `titleEn` (string, required): Tiêu đề sự kiện lịch sử.
- `descriptionVi` / `descriptionEn` (string): Chi tiết diễn biến và ý nghĩa.
- `category` (string, required): `'foundation'` | `'war_period'` | `'development'` | `'achievement'` | `'milestone'` | `'anniversary'` | `'other'`.
- `imageGallery` (string[]): Hình ảnh sự kiện.
- `audioUrl` / `videoUrl` (string, optional).
- `sourceIds` (string[]): Liên kết tài liệu kiểm chứng trong `sources`.
- `verificationStatus` (string).
- `displayOrder` (number).
- `isPublished` (boolean).

#### 2.6. `history_periods` (Giai đoạn Lịch sử)
Document ID: Auto-ID
- `titleVi` / `titleEn` (string, required): Tên giai đoạn lịch sử.
- `yearStart` (number, required): Năm khởi đầu.
- `yearEnd` (number, required): Năm kết thúc.
- `subtitleVi` / `subtitleEn` (string): Chủ đề giai đoạn.
- `descriptionVi` / `descriptionEn` (string): Tổng quan.
- `storyVi` / `storyEn` (string): Bối cảnh chi tiết.
- `imageGallery` (string[]): Ảnh tư liệu thời kỳ.
- `sourceIds` (string[]).
- `verificationStatus` (string).
- `displayOrder` (number).
- `isPublished` (boolean).

#### 2.7. `development_milestones` (Dấu mốc Cơ sở vật chất & Đổi mới)
Document ID: Auto-ID
- `titleVi` / `titleEn` (string, required).
- `period` (string): Khoảng thời gian (ví dụ: "1990 - 1995").
- `yearStart` (number, required) & `yearEnd` (number, optional).
- `descriptionVi` / `descriptionEn` (string).
- `imageGallery` (string[]).
- `sourceIds` (string[]).
- `verificationStatus` (string).
- `displayOrder` (number).
- `isPublished` (boolean).

#### 2.8. `achievements` (Thành tích & Bảng vàng Khen thưởng)
Document ID: Auto-ID
- `year` (number, required): Năm đạt thành tích.
- `category` (string, required): `'school'` | `'academic'` | `'student'` | `'science'` | `'arts'` | `'sports'` | `'youth'` | `'other'`.
- `titleVi` / `titleEn` (string, required).
- `descriptionVi` / `descriptionEn` (string).
- `documentUrl` (string): Đường dẫn văn bản khen thưởng.
- `imageGallery` (string[]).
- `sourceIds` (string[]).
- `verificationStatus` (string).
- `displayOrder` (number).
- `isPublished` (boolean).

#### 2.9. `people` (Lãnh đạo, Nhà giáo & Cựu học sinh)
Document ID: Auto-ID
- `name` (string, required): Họ và tên nhân vật.
- `roleVi` / `roleEn` (string, required): Chức danh / Vai trò.
- `period` (string): Thời kỳ công tác / niên khóa.
- `shortBioVi` / `shortBioEn` (string): Tóm tắt tiểu sử.
- `bioVi` / `bioEn` (string): Tiểu sử đầy đủ.
- `imageUrl` (string): Ảnh chân dung tư liệu.
- `sourceIds` (string[]).
- `verificationStatus` (string).
- `displayOrder` (number).
- `isPublished` (boolean).

#### 2.10. `memories` (Ký ức & Tri ân)
Document ID: Auto-ID
- `titleVi` / `titleEn` (string, required).
- `author` (string, required): Họ tên người chia sẻ.
- `generation` (string): Thế hệ / khóa học.
- `year` (number): Năm ghi lại hồi ức.
- `contentVi` / `contentEn` (string, required).
- `imageGallery` (string[]).
- `audioUrl` / `videoUrl` (string).
- `sourceIds` (string[]).
- `verificationStatus` (string).
- `isPublished` (boolean).

#### 2.11. `news_events` (Tin tức & Hoạt động Kỷ niệm 60 Năm)
Document ID: Auto-ID
- `titleVi` / `titleEn` (string, required).
- `publishedDate` (string, required): YYYY-MM-DD.
- `category` (string): Chuyên mục bài viết.
- `summaryVi` / `summaryEn` (string).
- `contentVi` / `contentEn` (string).
- `coverImage` (string).
- `imageGallery` (string[]).
- `isPublished` (boolean).

#### 2.12. `hotspots` (Nội dung Điểm tương tác Khám phá)
Document ID: Auto-ID
- `roomId` (string, required): Mã phòng cố định liên kết (gate, lobby, history, v.v.).
- `titleVi` / `titleEn` (string, required): Tiêu đề điểm tương tác.
- `descriptionVi` / `descriptionEn` (string): Nội dung hiển thị khi nhấp vào hotspot.
- `audioUrl` (string): Giọng đọc thuyết minh tương tác.
- `mediaAssetIds` (string[]).
- `sourceIds` (string[]).
- `verificationStatus` (string).
- `isPublished` (boolean).

#### 2.13. `sources` (Nguồn Tư Liệu Đối Chiếu - Authoritative Citations)
Document ID: Auto-ID
- `referenceCode` (string, required): Mã tra cứu duy nhất (ví dụ: `TL-THD-1966-01`).
- `title` (string, required): Tên tài liệu / nguồn lưu trữ.
- `type` (string, required): `'school_document'` | `'official_document'` | `'photo'` | `'interview'` | `'book'` | `'website'` | `'archive'` | `'other'`.
- `organization` (string): Đơn vị ban hành / lưu trữ.
- `author` (string): Tác giả / người ghi chép.
- `date` (string): Thời gian ban hành / thu thập.
- `url` (string, optional): Liên kết xem trực tuyến.
- `description` (string): Tóm lược giá trị lịch sử của tài liệu.
- `verificationStatus` (string).

#### 2.14. `licenses` (Bản quyền & Công bố Minh bạch AI)
Document ID: Auto-ID
- `assetName` (string, required): Tên tài sản (file ảnh, audio, mô hình).
- `assetType` (string, required): Loại tài sản số.
- `creator` (string, required): Chủ sở hữu bản quyền.
- `licenseType` (string, required): Loại giấy phép (CC BY-NC, Bản quyền trường, v.v.).
- `licenseUrl` (string).
- `sourceUrl` (string).
- `aiGenerated` (boolean, required): Đánh dấu tài sản có sự tham gia của AI.
- `aiTool` (string): Tên công cụ (Gemini, Midjourney, v.v.).
- `aiDisclosure` (string): Tuyên bố công bố AI minh bạch theo tiêu chuẩn đạo đức số.
- `notes` (string): Ghi chú thẩm định.

#### 2.15. `media_assets` (Quản lý File trên Firebase Storage)
Document ID: Auto-ID
- `fileName` (string, required): Tên tệp gốc.
- `storagePath` (string, required): Đường dẫn lưu trữ trong Cloud Storage.
- `downloadUrl` (string, required): URL truy cập công khai an toàn.
- `type` (string, required): `'image'` | `'panorama'` | `'audio'` | `'video'` | `'pdf'` | `'document'` | `'3d_model'`.
- `mimeType` (string).
- `size` (number): Dung lượng tính bằng bytes.
- `altTextVi` / `altTextEn` (string).
- `sourceIds` (string[]).
- `licenseIds` (string[]).
- `aiGenerated` (boolean).

#### 2.16. `digital_resources` (Kho Tài nguyên số & Podcast)
Document ID: Auto-ID
- `type` (string, required): `'video'` | `'podcast'` | `'document'` | `'online_archive'` | `'external_reference'` | `'source_material'`.
- `titleVi` / `titleEn` (string, required).
- `url` (string, required).
- `thumbnailUrl` (string).
- `descriptionVi` / `descriptionEn` (string).
- `year` (number).
- `sourceIds` (string[]).
- `licenseIds` (string[]).
- `isPublished` (boolean).

#### 2.17. `credits` (Tri Ân Ban Chỉ Đạo & Đóng Góp)
Document ID: Auto-ID
- `name` (string, required): Họ và tên hoặc Đơn vị tham gia.
- `role` (string, required): Vai trò (Chỉ đạo nội dung, Cố vấn lịch sử, Kỹ thuật...).
- `organization` (string): Đơn vị trực thuộc.
- `description` (string): Chi tiết đóng góp.
- `displayOrder` (number).
- `isPublished` (boolean).
