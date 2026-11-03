# BIÊN BẢN BÀN GIAO KỸ THUẬT & QUẢN TRỊ (HANDOVER MANUAL)
## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Thông Tin Dự Án Google Cloud & Firebase

- **Dự án**: `gen-lang-client-0730324164`
- **Firestore Database ID**: `ai-studio-cosmicheritagedu-441d4ad3-0ea2-4403-b5cc-6f884da26804`
- **Storage Bucket**: `gen-lang-client-0730324164.firebasestorage.app`
- **Phương thức xác thực**: Firebase Authentication (Email/Password).
- **Mã phân khu triển lãm cố định (Canonical Stable IDs)**:
  `gate`, `lobby`, `history`, `timeline`, `development`, `achievements`, `memory`, `vr_ar`, `ending`.

---

### 2. Thiết Lập & Kích Hoạt Tài Khoản Quản Trị Ban Đầu

- **Tài khoản quản trị viên trường (Placeholder)**:
  `ADMIN_EMAIL = "REPLACE_WITH_OFFICIAL_ADMIN_EMAIL"`
- **Mật khẩu khởi tạo**: Được bàn giao qua kênh niêm phong nội bộ riêng cho Ban Giám hiệu nhà trường.
- **Chính sách mật khẩu**:
  - Không có thời hạn hết hạn ở tầng ứng dụng (No application-level expiration).
  - Không bắt buộc xoay vòng mật khẩu tự động.
  - Không lưu mật khẩu trong mã nguồn frontend hoặc cơ sở dữ liệu Firestore.

---

### 3. Quy Trình Chuyển Giao Quyền Sở Hữu (Ownership Transfer)

1. Đại diện kỹ thuật nhà trường cung cấp tài khoản Google/Gmail chính thức của trường.
2. Truy cập [Google Cloud Console](https://console.cloud.google.com/) hoặc [Firebase Console](https://console.firebase.google.com/).
3. Tại dự án `gen-lang-client-0730324164`, chọn **Project Settings** -> **Users and permissions**.
4. Nhấn **Add member**, nhập email trường, gán quyền **Owner (Chủ sở hữu)**.
5. Sau khi trường chấp nhận, toàn bộ quyền quản trị hạ tầng, cơ sở dữ liệu và lưu trữ thuộc về nhà trường.

---

### 4. Quy Trình Thêm Quản Trị Viên & Đổi Mật Khẩu

- **Đổi mật khẩu**: Quản trị viên sau khi đăng nhập qua cổng `CMD`, vào mục **Quản trị viên & Phân quyền** -> nhập mật khẩu mới và xác nhận.
- **Thêm quản trị viên mới**: Nhập email cán bộ trường vào mục tạo mới. Hệ thống sẽ cấp quyền `ADMIN` trong bảng bảo mật `/admins/{uid}`.
- **Thu hồi quyền**: Quản trị viên chính có thể chuyển trạng thái sang `Tạm khóa` bất kỳ lúc nào để vô hiệu hóa quyền ghi của tài khoản đó.

---

### 5. Kiến Trúc Bảo Mật Zero-Trust

- **Khách tham quan công chúng**: Chỉ được phép ĐỌC các bản ghi có `isPublished == true`.
- **Tất cả các thao tác Ghi (Tạo mới, Cập nhật, Xóa, Tải ảnh, Đổi thứ tự, Thẩm định)**: Bị từ chối ở tầng máy chủ Firestore và Storage nếu người dùng không có bản ghi hợp lệ trong `/admins/{uid}`.
- Không thể tự leo thang đặc quyền thông qua việc sửa đổi mã nguồn trình duyệt.
