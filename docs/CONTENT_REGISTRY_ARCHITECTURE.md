# KIẾN TRÚC HỆ THỐNG ĐĂNG KÝ NỘI DUNG & CMD ADMIN (CONTENT REGISTRY ARCHITECTURE)

## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Mục Đích & Triết Lý Kiến Trúc

Hệ thống **Machine-Readable Content Registry** giải quyết bài toán cốt lõi:
> **Nhà trường quản trị và cập nhật toàn bộ nội dung bảo tàng số 3D mà không cần can thiệp mã nguồn, không cần sự hỗ trợ của lập trình viên, và không cần biên dịch lại ứng dụng.**

Tất cả các nội dung biên tập (editorial content) phân tán trong 9 phân khu bảo tàng được tập trung hóa, phân loại theo năng lực, ánh xạ tới Cloud Firestore và đồng bộ theo thời gian thực tới giao diện công chúng.

---

### 2. Hai Lớp Năng Lực Biên Tập (Two-Layer Editorial Capabilities)

Mỗi mục nội dung được phân loại độc lập theo hai lớp năng lực:

#### Lớp 1 (Layer 1): Soạn Thảo Văn Bản (Text Editing)
- Tiêu đề, phụ đề, thời gian, niên đại, địa danh.
- Nội dung lịch sử chi tiết, diễn biến, trích dẫn.
- Danh sách liệt sĩ, danh sách lãnh đạo, ghi chú thẩm định, nguồn lưu trữ.
- Được định nghĩa chặt chẽ qua mảng trường `fields: EditorialFieldDefinition[]`.
- Trình chỉnh sửa: `Layer1TextEditor.tsx`.

#### Lớp 2 (Layer 2): Đính Kèm Tệp Đa Phương Tiện (File Attachments)
- Ảnh tư liệu độ phân giải cao, ảnh kỷ yếu, ảnh hiện vật thể khối.
- Bản scan tài liệu văn thư lịch sử (PDF).
- File thu âm lời chào của Ban Giám hiệu, podcast thuyết minh (Audio).
- Video tư liệu phục dựng (Video).
- Mô hình 3D (.glb / .gltf) của hiện vật.
- Tải trực tiếp lên Firebase Storage với URL tải về và đường dẫn lưu trữ vĩnh viễn.
- Trình quản lý tệp: `Layer2AttachmentManager.tsx`.

---

### 3. Cấu Trúc Bản Ghi Registry (Schema Contract)

Mỗi mục nội dung tuân thủ giao ước chuẩn:

```typescript
export interface ContentRegistryItem {
  // 1. Định danh ổn định & Không gian
  contentId: string;              // Duy nhất toàn hệ thống (vd: 'history.section1_1_overview')
  roomId: string;                 // Thuộc 1 trong 9 phân khu canonical
  roomNameVi: string;             // Tên phân khu hiển thị
  sceneObjectId?: string;         // Khóa liên kết vật thể 3D trong Scene (nếu có)
  displayName: string;            // Tên mục tiếng Việt
  displayNameEn?: string;          // Tên mục tiếng Anh
  category: ContentCategory;      // Phân loại nội dung

  // 2. Năng lực biên tập
  capabilities: {
    textEditing: boolean;         // Hỗ trợ sửa text qua CMD
    fileAttachments: boolean;     // Hỗ trợ đính kèm tệp qua CMD
  };

  // 3. Nguồn dữ liệu thực tế
  dataSource: {
    type: 'firestore_editorial';
    collection: string;           // 'editorial_contents'
    documentId: string;           // Khớp với contentId
  };

  // 4. Định nghĩa trường soạn thảo & Tệp cho phép
  fields: EditorialFieldDefinition[];
  allowedFileTypes?: ('image' | 'audio' | 'video' | 'pdf' | 'document' | '3d_model')[];

  // 5. Giá trị mặc định (Fallback an toàn)
  defaultTextValues: Record<string, any>;
  defaultAttachments?: FileAttachment[];

  // 6. Trạng thái & Quyền hạn
  verificationStatus: 'verified' | 'unverified' | 'needs_review';
  isPublished: boolean;
  connectedToPublicView: boolean;
  publicViewDescription: string;
  requiredPermissions: ('admin' | 'editor' | 'superadmin')[];
}
```

---

### 4. Quy Trình Vận Hành & Lưu Dữ Liệu Thời Gian Thực

```
[ CMD Admin: QUẢN LÝ NỘI DUNG ]
            │
            ▼
[ Chọn Mục Nội Dung (Tile Grid) ]
            │
            ▼
[ Modal Chỉnh Sửa Chuyên Sâu ] ──► Tải ảnh/tệp lên Firebase Storage
            │
            ▼
[ Nhấn "LƯU THAY ĐỔI" ]
            │
            ▼ Ghi trực tiếp (setDoc / merge)
[ Cloud Firestore: editorial_contents/{contentId} ]
            │
            ▼ onSnapshot Real-time Listener
[ Hook: useEditorialItem / useHistoryContent ]
            │
            ▼ Cập nhật State tức thì
[ 3D Three.js Scenes & Giao Diện Công Chúng ]
  • HistoryScene 3D (Bên 1, 2, 3, 4, Bia tưởng niệm, Hotspot 1966)
  • EntranceScene 3D (Cổng vào, Tiêu đề, Khẩu hiệu)
  • MainHallScene 3D (Sảnh chào, Thông điệp hiệu trưởng)
  • Orbital Timeline & Public Website
```

---

### 5. Danh Mục Phân Khu Canonical (9 Canonical Rooms)

1. **`entrance`** (01. Cổng Vũ Trụ Di Sản) — Điểm khởi đầu hành trình không gian số.
2. **`lobby`** (02. Sảnh Chào & Giới Thiệu) — Rotunda trung tâm kết nối các quỹ đạo.
3. **`history`** (03. Lịch Sử Hình Thành 1966–1975) — Cội nguồn thành lập dưới thời chiến tranh.
4. **`timeline`** (04. Dòng Thời Gian 1966–2026) — Biên niên sử số hóa 6 thập kỷ.
5. **`development`** (05. Quá Trình Phát Triển) — Chặng đường kiến thiết và đổi mới cơ sở vật chất.
6. **`achievements`** (06. Thành Tích & Tự Hào) — Huân huy chương, bằng khen, bảng vàng.
7. **`memory`** (07. Ký Ức & Tri Ân) — Không gian tri ân thầy cô và ký ức cựu học sinh.
8. **`vr_ar`** (08. Không Gian Trải Nghiệm VR/AR) — Mô phỏng 3D tương tác đa chiều.
9. **`ending`** (09. Điểm Tựa Tương Lai) — Khối kỷ niệm 1975 và thông điệp gửi thế hệ mai sau.

---

### 6. Lệnh Kiểm Tra Tính Toàn Vẹn Tự Động (Automated Validation)

Để kiểm tra xem toàn bộ các mục nội dung có đáp ứng 100% quy tắc dự án hay không, chạy lệnh:

```bash
npm run validate:content
```

Lệnh này kiểm tra tính duy nhất của ID, tính hợp lệ của phân khu, nguồn dữ liệu Cloud Firestore, cấu trúc trường, tệp đính kèm và phân quyền.
