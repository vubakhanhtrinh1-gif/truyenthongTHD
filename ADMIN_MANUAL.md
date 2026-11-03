# SỔ TAY QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN MANUAL)
## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Giới Thiệu Tổng Quan
Hệ thống Quản trị Nội dung (Admin CMS) được thiết kế chuyên biệt phục vụ công tác bảo tồn, biên tập và xuất bản dữ liệu di sản 60 năm thành lập Trường THPT A Trần Hưng Đạo.

Hệ thống tuân thủ nguyên tắc:
- **Lõi Di sản (Heritage Core)**: Bất biến và độc lập với các hiệu ứng hình ảnh 3D/360 tương lai.
- **Nguồn Dữ Liệu Duy Nhất (Single Source of Truth)**: Trang công chúng và Admin CMS cùng vận hành trên một cơ sở dữ liệu Cloud Firestore duy nhất.

---

### 2. Cổng Vào Quản Trị Bí Mật (CMD Entry)

Để giữ gìn không gian trang nghiêm của cổng di sản số, hệ thống không hiển thị công khai các nút "Admin" hay "Quản trị" trên menu chính của khách tham quan.

**Cách truy cập CMS:**
1. Cuộn xuống phần chân trang (Footer) của website công chúng.
2. Nhấp vào nút kín đáo: **`[ CMD ]`** (hoặc truy cập đường dẫn `/cmd`).
3. Giao diện xuất hiện:
   ```text
   QUẢN TRỊ HỆ THỐNG
   Mật khẩu quản trị
   [____________________________]
   [ Đăng nhập ]
   ```
4. Nhập mật khẩu quản trị được cấp theo biên bản bàn giao.
5. Nhấn **Đăng nhập**.

---

### 3. Quy Trình Biên Tập & Xuất Bản Dữ Liệu Di Sản

Mọi mục dữ liệu lịch sử đều tuân theo quy trình 7 bước chặt chẽ:
1. **Khởi tạo bản nháp**: Khi tạo mới, hệ thống mặc định đặt `isPublished = false` và `verificationStatus = 'unverified'` (Chưa xác minh). Khách tham quan không thể nhìn thấy bản ghi này.
2. **Nhập thông tin song ngữ**: Nhập tiêu đề và nội dung đầy đủ cả Tiếng Việt và Tiếng Anh.
3. **Tải tệp đa phương tiện**: Sử dụng công cụ kéo thả tệp lên Cloud Storage.
4. **Liên kết Nguồn tư liệu (Source Attribution)**: Bắt buộc chọn nguồn tài liệu gốc trong mục *Nguồn tư liệu đối chiếu*.
5. **Minh bạch AI (nếu có)**: Tích chọn công bố AI đối với các hình ảnh/tư liệu được hỗ trợ phục chế bởi công nghệ AI.
6. **Thẩm định lịch sử**: Sau khi đối chiếu chính xác với tài liệu lưu trữ của trường, quản trị viên chuyển trạng thái sang `Đã xác minh (✓)`.
7. **Xuất bản**: Bật công tắc `Công khai`. Bản ghi sẽ lập tức xuất hiện trên trang công chúng.

---

### 4. Quản Lý Tài Khoản Quản Trị & Đổi Mật Khẩu

- **Đổi mật khẩu định kỳ**: Vào mục **Quản trị viên & Phân quyền**, điền mật khẩu mới tại ô "Đổi mật khẩu Quản trị viên hiện tại". Mật khẩu sẽ được cập nhật trực tiếp trên Firebase Authentication.
- **Thêm cán bộ biên tập**: Nhấn nút **Thêm Quản trị viên**, nhập Email của trường và Tên hiển thị.
- **Tạm dừng quyền**: Nhấn nút trạng thái sang **Tạm khóa** khi cán bộ chuyển công tác.

---

### 5. Quản Lý Nhận Diện Trường & Biểu Trưng Chính Thức (School Branding)

- **Vị trí**: Mục **NHẬN DIỆN TRƯỜNG** trong thanh điều hướng CMD Admin.
- **Chức năng**: Cho phép quản trị viên tải lên, xem trước (trên nền tối vũ trụ, nền sáng và lưới caro kiểm tra độ trong suốt PNG), lưu và áp dụng logo chính thức của Trường THPT A Trần Hưng Đạo.
- **Đồng bộ tự động thời gian thực**: Khi logo được lưu hoặc thay đổi trong CMD, toàn bộ Sảnh chính 3D (khối huy hiệu trung tâm), Cổng chào trường, thanh thương hiệu công chúng và cửa sổ thông tin sẽ lập tức cập nhật mà không cần tải lại trang hay sửa đổi mã nguồn.
- **Định dạng hỗ trợ**: PNG (khuyến nghị cho logo nền trong suốt), JPEG/JPG, WebP (dung lượng tối đa 10 MB).
