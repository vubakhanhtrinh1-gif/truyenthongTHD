# SỔ TAY QUẢN TRỊ NỘI DUNG DI SẢN (CONTENT MANUAL)
## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Nguyên Tắc Biên Tập & Thẩm Định Lịch Sử

> **QUY TẮC BẤT DI BẤT DỊCH:**
> 1. Tuyệt đối không tự sáng tác hoặc đưa các số liệu, tên nhân vật, giải thưởng hay mốc năm giả tưởng vào cơ sở dữ liệu.
> 2. Mọi thông tin đưa lên hệ thống phải dựa trên hồ sơ, kỷ yếu, tư liệu hoặc nguồn tin cậy của nhà trường.
> 3. Nếu chưa có số liệu chính xác, để trống hoặc sử dụng ghi chú:
>    `PLACEHOLDER — REPLACE WITH VERIFIED SCHOOL DATA`.
> 4. Tất cả nội dung mới khởi tạo mặc định mang trạng thái `Chưa xác minh (⚠️)`.

---

### 2. Quy Trình 5 Bước Nhập Liệu Một Hiện Vật Lịch Sử

**Bước 1: Đăng ký Nguồn tư liệu đối chiếu (bắt buộc trước)**
- Vào mục **Nguồn tư liệu** trên thanh điều hướng bên trái.
- Nhấn **Thêm Nguồn tư liệu**.
- Nhập thông tin:
  - **Mã tra cứu**: ví dụ `TL-THD-1970-01`
  - **Tên tài liệu**: ví dụ *Tư liệu khen thưởng năm 1970 của tỉnh*
  - **Cơ quan ban hành**: *Tỉnh Nam Hà / Trường THPT A Trần Hưng Đạo*
- Nhấn **Lưu bản ghi**.

**Bước 2: Tải ảnh hiện vật lên Firebase Storage**
- Vào mục **Hiện vật lịch sử**.
- Nhấn **Thêm Hiện vật mới**.
- Tại phần **Hình ảnh hiện vật (Thư viện ảnh)**, nhấn **+ Tải ảnh lên Storage**.
- Kéo thả hoặc chọn file ảnh chất lượng cao (ảnh chụp hiện vật thật từ phòng truyền thống). Hệ thống sẽ tự động tải lên Firebase Storage và gán URL vào danh sách ảnh.

**Bước 3: Nhập thông tin song ngữ (Việt – Anh)**
- Tab **Tiếng Việt (VI)**: Nhập tên hiện vật, phụ đề, năm xác lập, mô tả chất liệu/kích thước và câu chuyện lịch sử có thật gắn liền.
- Tab **English (EN)**: Nhập phần dịch tương ứng sang Tiếng Anh để phục vụ khách quốc tế và cựu học sinh tại nước ngoài.

**Bước 4: Gán Nguồn đối chiếu & Bản quyền**
- Tại mục **Nguồn tư liệu đối chiếu**, tích chọn nguồn tương ứng đã tạo ở Bước 1.
- Nếu hiện vật có tư liệu phục chế bằng AI (ví dụ: ảnh màu phục dựng từ ảnh đen trắng cũ), tích chọn hồ sơ bản quyền và ghi rõ tên công cụ trong mục **Bản quyền & AI**.

**Bước 5: Thẩm định & Xuất bản**
- Kiểm tra lại tính chính xác cùng Tổ Lịch sử hoặc Ban Giám hiệu.
- Nếu đã thẩm định chuẩn: Chuyển mục **Thẩm định tư liệu** thành `✓ Đã xác minh`.
- Tích chọn **Công khai cho khách tham quan** nếu muốn hiển thị cho người xem.
- Nhấn **Lưu bản ghi**.

---

### 3. Hướng Dẫn Quản Lý Dòng Thời Gian 1966–2026 (Orbital Timeline)

1. Vào mục **Timeline 1966–2026**.
2. Nhấn **Thêm Mốc sự kiện**.
3. Điền các trường chính:
   - **Năm sự kiện**: Số nguyên từ 1966 đến 2026 (ví dụ: `1966`).
   - **Ngày tháng chính xác**: Nếu có tài liệu gốc (ví dụ: `Tháng 9/1966` hoặc `15/10/1966`).
   - **Phân loại**: Chọn đúng tính chất (Thành lập, Kháng chiến sơ tán, Phát triển đổi mới, Thành tựu...).
   - **Tiêu đề & Nội dung song ngữ**.
4. Sử dụng công cụ **Thứ tự (OrderControl)**: Nhấn các nút mũi tên Lên/Xuống trên bảng dữ liệu để tinh chỉnh thứ tự xuất hiện của các sự kiện trong cùng một năm.

---

### 4. Hướng Dẫn Quản Lý 9 Khu Vực Triển Lãm (Canonical Rooms)

Hệ thống đã thiết lập sẵn 9 mã định danh phòng bất biến:
1. `gate`: Cổng Vũ Trụ Di Sản
2. `lobby`: Sảnh Chào & Giới Thiệu
3. `history`: Lịch Sử Hình Thành
4. `timeline`: Dòng Thời Gian Orbital Timeline
5. `development`: Quá Trình Phát Triển
6. `achievements`: Thành Tích & Tự Hào
7. `memory`: Ký Ức & Tri Ân
8. `vr_ar`: Không Gian Trải Nghiệm Số VR/AR
9. `ending`: Điểm Tựa Tương Lai

**Lưu ý kỹ thuật quan trọng:**
- **Không bao giờ sửa trường "Mã phòng vĩnh viễn (id)"** của 9 phòng này vì các mô-đun 3D không gian vũ trụ trong tương lai sẽ kết nối trực tiếp vào các ID này.
- Thầy/Cô có thể tự do cập nhật tiêu đề Tiếng Việt, Tiếng Anh, phần mô tả giới thiệu và trạng thái chuẩn bị (`Đang số hóa`, `Hoàn thiện nội dung`, v.v.).

---

### 5. Tiêu Chuẩn Minh Bạch Công Bố AI (AI Disclosure Standards)

Dự án đề cao tính chân thực lịch sử:
- **Ảnh tư liệu gốc**: Không cần đánh dấu AI, giữ nguyên bản scan tư liệu.
- **Ảnh được AI tăng độ nét (Upscale) hoặc phục dựng màu**: Phải tạo bản ghi trong mục **Bản quyền & AI**, tích chọn `Tài sản do AI tạo lập`, ghi rõ công cụ (ví dụ: *Gemini AI Phục Chế Ảnh*) và nội dung công bố:
  > *"Hình ảnh phục chế màu dựa trên bức ảnh gốc đen trắng chụp năm 1972 lưu trữ tại Phòng Truyền thống Trường THPT A Trần Hưng Đạo."*
- Giúp người xem phân biệt rạch ròi giữa di vật thật và sản phẩm số hóa hỗ trợ.
