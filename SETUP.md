# HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI HỆ THỐNG (SETUP GUIDE)
## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Kiến Trúc Công Nghệ Hệ Thống (Tech Stack)

- **Frontend Core**: React 19, TypeScript, Vite 8, Tailwind CSS v4.
- **Backend & Cloud Database**:
  - **Firebase Authentication**: Xác thực tài khoản quản trị viên Email/Password an toàn.
  - **Cloud Firestore**: Cơ sở dữ liệu NoSQL lưu trữ toàn bộ dữ liệu di sản (17 bộ sưu tập).
  - **Firebase Cloud Storage**: Lưu trữ an toàn các tệp đa phương tiện (ảnh phân giải cao, tư liệu scan, podcast, video).
  - **Firestore Security Rules**: Quy tắc kiểm soát truy cập và bảo vệ dữ liệu Zero-Trust cấp độ máy chủ.
- **Biểu tượng & Giao diện**: Lucide React, Motion.

---

### 2. Cấu Trúc Mã Nguồn

```
├── firebase-applet-config.json    # Cấu hình dự án Firebase từ Google Cloud
├── firebase-blueprint.json        # Định nghĩa lược đồ dữ liệu trung gian (IR)
├── firestore.rules                # Quy tắc bảo mật Firestore Rules chính thức
├── security_spec.md               # Đặc tả các kịch bản kiểm thử bảo mật
├── ADMIN_HANDOVER.md              # Tài liệu bàn giao Ban Giám hiệu & Quản trị viên
├── DATABASE_SCHEMA.md             # Đặc tả 17 bộ sưu tập Firestore
├── SECURITY.md                    # Chính sách bảo mật & RBAC
├── CONTENT_MANUAL.md              # Sổ tay nhập liệu và thẩm định lịch sử
├── SETUP.md                       # Hướng dẫn cài đặt và triển khai này
├── src/
│   ├── types/index.ts             # Strongly-typed TypeScript Models
│   ├── services/
│   │   ├── firebase.ts            # Khởi tạo Firebase SDK & kết nối
│   │   ├── authService.ts         # Logic xác thực và phân quyền RBAC
│   │   ├── storageService.ts      # Tải lên & xóa tệp Firebase Storage
│   │   └── errorHandler.ts        # Bắt lỗi chuẩn đoán Firestore Error Handler
│   ├── repositories/
│   │   ├── baseRepository.ts      # Lớp Base Repository dùng chung cho CRUD
│   │   └── index.ts               # Khởi tạo 17 repositories cụ thể
│   ├── context/
│   │   └── AuthContext.tsx        # React Context quản lý trạng thái đăng nhập
│   ├── components/
│   │   ├── auth/
│   │   │   └── AdminLogin.tsx     # Màn hình đăng nhập quản trị viên
│   │   └── admin/
│   │       ├── AdminDashboard.tsx # Khung điều khiển chính CMS
│   │       ├── AdminSidebar.tsx   # Menu điều hướng các chuyên mục di sản
│   │       ├── AdminHeader.tsx    # Thanh tiêu đề, thông tin admin & đăng xuất
│   │       ├── ContentTable.tsx   # Bảng dữ liệu tái sử dụng (lọc, tìm kiếm, thứ tự)
│   │       ├── ContentFormModal.tsx # Form nhập liệu song ngữ Việt - Anh
│   │       ├── VerificationStatusBadge.tsx # Huy hiệu trạng thái thẩm định
│   │       ├── PublishToggle.tsx  # Công tắc chuyển đổi Bản nháp / Công khai
│   │       ├── MediaUploader.tsx  # Kéo thả tải tệp lên Firebase Storage
│   │       ├── ImageGalleryManager.tsx # Quản lý thư viện ảnh tư liệu
│   │       ├── SourceSelector.tsx # Bộ chọn liên kết Nguồn tư liệu kiểm chứng
│   │       ├── LicenseSelector.tsx # Bộ chọn Bản quyền & Minh bạch AI
│   │       ├── OrderControl.tsx   # Điều khiển thứ tự hiển thị
│   │       ├── OverviewView.tsx   # Trang tổng quan thống kê di sản
│   │       ├── SiteSettingsView.tsx # Cài đặt toàn cục dự án
│   │       ├── AdminManagementView.tsx # Quản lý tài khoản & Đổi mật khẩu
│   │       └── GenericCrudSection.tsx # Khung CRUD tự động kết nối Repository
│   └── data/
│       └── initialSeedData.ts     # Dữ liệu khởi tạo 9 không gian chuẩn
```

---

### 3. Cài Đặt & Chạy Môi Trường Cục Bộ (Local Development)

#### 3.1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

#### 3.2. Chạy máy chủ phát triển (Dev Server)
```bash
npm run dev
```
Hệ thống sẽ chạy tại địa chỉ: `http://localhost:3000`.

#### 3.3. Kiểm tra lỗi kiểu dữ liệu (TypeScript Linting)
```bash
npm run lint
```

#### 3.4. Đóng gói triển khai sản phẩm (Production Build)
```bash
npm run build
```
Thư mục sản phẩm sẽ được tạo tại `/dist`.

---

### 4. Triển Khai Lên Máy Chủ Nhà Trường / Firebase Hosting

1. Cài đặt Firebase CLI (nếu chưa cài):
   ```bash
   npm install -g firebase-tools
   ```

2. Đăng nhập vào tài khoản Google của trường:
   ```bash
   firebase login
   ```

3. Triển khai Quy tắc Bảo mật Firestore:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. Triển khai Ứng dụng Web:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

### 5. Khởi Tạo Cơ Sở Dữ Liệu Lần Đầu (Initial Seeding)

1. Đăng nhập vào CMS bằng tài khoản quản trị viên.
2. Tại màn hình **Tổng quan**, nhấn nút:
   **"Khởi tạo 9 Phòng Triển lãm & Cài đặt Chuẩn"**.
3. Hệ thống sẽ tự động đồng bộ 9 phân khu triển lãm cố định (`gate`, `lobby`, `history`, `timeline`, `development`, `achievements`, `memory`, `vr_ar`, `ending`) cùng các thiết lập nhận diện mặc định mà không tạo bất kỳ thông tin lịch sử giả tưởng nào.
