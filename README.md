# BẢO TÀNG DI SẢN SỐ — COSMIC HERITAGE (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

> **Dự án Không gian Di sản Số hóa 3D & Quản trị Nội dung Di sản kỷ niệm 60 năm ngày thành lập trường.**

---

## QUY TẮC BẮT BUỘC TOÀN DỰ ÁN (MANDATORY PROJECT GOVERNANCE)

Dự án tuân thủ nghiêm ngặt **Quy Tắc Quản Trị Toàn Cục**:
- **`AI_PROJECT_RULES.md`**: Quy định bắt buộc về Tự động khám phá nội dung, Đăng ký Machine-Readable Content Registry và Khả năng chỉnh sửa trực tiếp qua CMD Admin (Layer 1 Văn bản & Layer 2 Tệp đính kèm).
- **`AGENTS.md`**: Hướng dẫn bắt buộc đối với tất cả AI Agents và lập trình viên tiếp quản dự án.
- **`docs/CONTENT_REGISTRY_ARCHITECTURE.md`**: Kiến trúc chi tiết của Registry và giao ước tích hợp Cloud Firestore.

Mọi nội dung bảo tàng phải được quản trị trực tiếp bởi Ban Giám hiệu nhà trường qua giao diện CMD Admin, lưu trữ bền vững vào Cloud Firestore / Firebase Storage mà **không cần biên dịch lại ứng dụng hay can thiệp vào mã nguồn**.

---

## 9 PHÂN KHU BẢO TÀNG CANONICAL

1. **`01. Cổng Vũ Trụ Di Sản` (`entrance`)** — Cổng không gian chào đón và tương tác mở đầu.
2. **`02. Sảnh Chào & Giới Thiệu` (`lobby`)** — Rotunda kết nối các quỹ đạo khám phá.
3. **`03. Lịch Sử Hình Thành (1966–1975)` (`history`)** — Phòng truyền thống 3D tái hiện mốc khởi nguồn bom đạn và 5 lần di chuyển gian khổ.
4. **`04. Dòng Thời Gian (1966–2026)` (`timeline`)** — Biên niên sử 6 thập kỷ với các mốc son lịch sử.
5. **`05. Quá Trình Phát Triển` (`development`)** — Hành trình kiến thiết cơ sở vật chất và đổi mới giáo dục.
6. **`06. Thành Tích & Tự Hào` (`achievements`)** — Bảng vàng huân huy chương và bằng khen danh giá.
7. **`07. Ký Ức & Tri Ân` (`memory`)** — Không gian tri ân người đặt nền móng và kỷ niệm thầy trò.
8. **`08. Không Gian Trải Nghiệm VR/AR` (`vr_ar`)** — Trải nghiệm tương tác số đa chiều.
9. **`09. Điểm Tựa Tương Lai` (`ending`)** — Thông điệp khép lại chặng đường đầu và khát vọng tương lai.

---

## CÀI ĐẶT & CHẠY ỨNG DỤNG

```bash
# Cài đặt gói phụ thuộc
npm install

# Kiểm tra tính toàn vẹn của Registry nội dung
npm run validate:content

# Chạy kiểm tra TypeScript linter
npm run lint

# Khởi chạy máy chủ phát triển
npm run dev
```

---

## HỆ THỐNG QUẢN TRỊ CMD ADMIN

- Để truy cập CMD Admin: Nhấn nút **[ CMD ]** ở góc dưới bên phải màn hình tham quan hoặc mở modal đăng nhập Quản trị viên.
- Quản trị viên có thể:
  - Soạn thảo văn bản và cập nhật dữ liệu lịch sử trực tiếp (**Lớp 1**).
  - Tải lên ảnh tư liệu, tài liệu PDF, bản thu âm audio (**Lớp 2**).
  - Phê duyệt và chuyển đổi trạng thái thẩm định: `Đã xác minh` / `Chưa xác minh` / `Cần kiểm tra`.
  - Bật / tắt hiển thị công chúng theo thời gian thực.
