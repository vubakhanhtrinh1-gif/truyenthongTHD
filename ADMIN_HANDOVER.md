# TÀI LIỆU BÀN GIAO QUẢN TRỊ VIÊN (ADMIN HANDOVER)
## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Mục Đích & Phạm Vi Tài Liệu
Tài liệu này cung cấp hướng dẫn toàn diện dành cho Ban Giám hiệu, Thầy/Cô phụ trách công tác truyền thống và Quản trị viên phụ trách kỹ thuật của Trường THPT A Trần Hưng Đạo để tiếp nhận, vận hành và quản lý độc lập Hệ thống Quản trị Nội dung (Admin CMS) & Cơ sở Dữ liệu Di sản Số của nhà trường.

Hệ thống được thiết kế theo tiêu chuẩn công nghiệp:
- **Tách bạch tầng dữ liệu**: Lõi Di sản (**Heritage Core**) lưu giữ các dữ liệu lịch sử xác thực, hoàn toàn độc lập với tầng đồ họa 3D/360 tương lai.
- **Không phụ thuộc vào AI Studio**: Nhà trường có thể trực tiếp quản trị, thêm sửa xóa dữ liệu và phân quyền thông qua giao diện Web CMS hoặc Firebase Console chính thức của Google Cloud.

---

### 2. Thông Tin Cấu Hình & Tài Khoản Ban Đầu

#### 2.1. Cấu hình Firebase Project
- **Firebase Project ID**: `gen-lang-client-0730324164`
- **Firestore Database ID**: `ai-studio-cosmicheritagedu-441d4ad3-0ea2-4403-b5cc-6f884da26804`
- **Storage Bucket**: `gen-lang-client-0730324164.firebasestorage.app`
- **Địa chỉ truy cập CMS**: `/admin` (hoặc Cổng đăng nhập `/admin/login`)

#### 2.2. Tài khoản Quản trị viên Khởi tạo (Initial Administrator)
- **Email quản trị viên trường (Placeholder)**:
  ```env
  ADMIN_EMAIL = "REPLACE_WITH_OFFICIAL_ADMIN_EMAIL"
  ```
  *(Ví dụ khuyến nghị: `c3tranhungdao@namdinh.edu.vn` hoặc email cán bộ phụ trách CNTT của trường)*
- **Mật khẩu khởi tạo được cấp**:
  ```text
  [MẬT_KHẨU_KHỞI_TẠO_ĐƯỢC_CẤP_THEO_BIÊN_BẢN_BÀN_GIAO]
  ```
- **Thời hạn mật khẩu**: **Không có thời hạn hết hạn ở tầng ứng dụng** (No application-level expiration).
- **Nguyên tắc bảo mật**: Mật khẩu **không bao giờ** được lưu cứng trong mã nguồn frontend, JavaScript bundle hay Firestore documents. Việc xác thực do hạ tầng bảo mật Google Firebase Authentication trực tiếp xử lý.

---

### 3. Quy Trình Kích Hoạt & Đổi Mật Khẩu Cho Nhà Trường

1. **Đăng nhập lần đầu**:
   - Truy cập trang công chúng và nhấp vào nút kín đáo `[ CMD ]` ở chân trang (hoặc truy cập `/cmd`).
   - Nhập mật khẩu quản trị ban đầu được cấp theo biên bản bàn giao.
   - Nhấn **Đăng nhập**.

2. **Chủ động đổi mật khẩu mới**:
   - Sau khi vào hệ thống, điều hướng đến mục **Quản trị viên & Phân quyền** (hoặc biểu tượng Chìa khóa ở góc phải trên).
   - Tại thẻ **"Đổi mật khẩu Quản trị viên hiện tại"**, nhập mật khẩu mới bảo mật của trường (tối thiểu 6 ký tự).
   - Nhấn **Cập nhật mật khẩu**. Mật khẩu sẽ được cập nhật tức thì trên máy chủ Google Authentication.

3. **Thêm cán bộ quản trị viên mới**:
   - Trong mục **Quản trị viên & Phân quyền**, nhấn nút **Thêm Quản trị viên**.
   - Điền Email trường của cán bộ mới, Tên hiển thị (ví dụ: *Thầy Nguyễn Văn A - Tổ Lịch sử*), và mật khẩu ban đầu.
   - Nhấn **Xác nhận tạo Quản trị viên**. Tài khoản mới sẽ được tự động cấp quyền `ROLE: ADMIN` trong cơ sở dữ liệu Firestore.

4. **Khóa quyền khi cán bộ chuyển công tác**:
   - Tại danh sách Quản trị viên, nhấn nút chuyển đổi trạng thái từ **"Đang hoạt động"** sang **"Tạm khóa"**. Tài khoản đó sẽ bị thu hồi toàn bộ quyền ghi ngay lập tức trên máy chủ.

---

### 4. Bàn Giao Quyền Sở Hữu Dự Án Google Cloud / Firebase (Project Ownership Transfer)

Khi dự án chính thức chuyển giao toàn quyền sở hữu cho nhà trường:
1. Đại diện kỹ thuật đăng nhập vào [Firebase Console](https://console.firebase.google.com/).
2. Chọn dự án: `gen-lang-client-0730324164`.
3. Nhấp vào biểu tượng **Bánh răng (Project Settings)** -> tab **Users and permissions** (Người dùng và quyền).
4. Nhấn **Add member** (Thêm thành viên).
5. Nhập địa chỉ Google/Gmail chính thức của Trường THPT A Trần Hưng Đạo.
6. Gán vai trò (Role): **Owner (Chủ sở hữu)**.
7. Sau khi đại diện nhà trường chấp nhận lời mời, chuyển vai trò Owner và gỡ bỏ các tài khoản nhà phát triển tạm thời nếu cần.

---

### 5. Hướng Dẫn Vận Hành Không Cần Lập Trình Viên

Mọi hoạt động quản lý di sản được thực hiện 100% qua giao diện đồ họa Web CMS:
- **Hiện vật lịch sử**: Thêm mới huân huy chương, bằng khen, kỷ vật với đầy đủ ảnh, năm, câu chuyện và đính kèm nguồn gốc.
- **Dòng thời gian (1966–2026)**: Cập nhật các sự kiện lịch sử 60 năm theo từng năm và phân loại.
- **Thẩm định tư liệu**: Bắt buộc chỉ chuyển trạng thái từ `Chưa xác minh` sang `Đã xác minh` khi có căn cứ nguồn chuẩn (sách kỷ yếu, tư liệu lưu trữ của tỉnh/nhà trường, ảnh lưu trữ).
- **Minh bạch AI**: Tích chọn công bố AI cho các hình ảnh/tư liệu phục chế để đảm bảo tính khách quan và uy tín của nhà trường.
