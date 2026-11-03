# Kế hoạch Cải Tạo Toàn Diện Không Gian 3D: Phòng Dòng Chảy 60 Năm (1966–2026)

## 1. Mục tiêu & Định hướng Thiết kế
Cải tạo không gian 3D của phân khu **Dòng Chảy 60 Năm (TimelineScene)** từ trạng thái hiện tại (cột đen thô, dải đường tối, bục trưng bày đơn điệu) thành một đại sảnh di sản nguy nga, khoáng đạt và giàu cảm xúc, kết hợp hài hòa giữa chất liệu kiến trúc kinh điển và dòng chảy thị giác tương lai:
- **Kiến trúc tổng thể**: Đại sảnh đá cẩm thạch trắng ngà (Warm Ivory Limestone & Crema Marfil), thức cột tròn thanh thoát viền vàng champagne, trần giật cấp với đèn hắt gián tiếp ấm áp.
- **Dải sàn trung tâm "Dòng sông thời gian"**: Thay thế vệt đen đơn điệu bằng dải ngọc bích / xanh ngọc lục bảo (emerald/cyan waterflow) chuyển sắc mềm mại, viền nẹp đồng thau 24K, kết hợp dòng chảy hạt tinh tú lấp lánh trôi nhẹ dọc theo trục niên biểu từ 1966 đến 2026.
- **18 Bục trưng bày cột mốc lịch sử**: Bục đá trắng ngà thanh lịch, nẹp viền đồng thau, khay đỡ nghiêng góc công thái học (~28°), mặt bảng trình bày trang nhã sắc nét, đèn rọi tiêu điểm vàng dịu.
- **Tượng đài Tri ân 60 năm (Tường Bắc)**: Tái thiết thành đài kỷ niệm kiến trúc 3D nhiều tầng với phào chỉ hoàng gia, huy hiệu trường sắc nét và vầng hào quang rực rỡ.
- **Bảo toàn dữ liệu & Registry**: Giữ nguyên toàn bộ 18 mốc thời gian, kết nối Firestore `editorial_contents` và duy trì chuẩn validation 100%.

---

## 2. Các Bước Triển Khai Chi Tiết

### Bước 1: Nâng Cấp Hệ Thống Vật Liệu & Texture Thủ Công (`TimelineMaterials.ts` & `TimelineProceduralTextures.ts`)
- **Vật liệu đá cẩm thạch trắng ngà (`materials.ivoryMarble` & `materials.columnStone`)**:
  - Tông màu Crema Marfil ấm (`#F5EFE3` đến `#EDE4D3`), độ bóng nhẹ (roughness 0.22, metalness 0.10) phản chiếu ánh sáng môi trường dịu mắt.
- **Vật liệu Dòng sông thời gian (`materials.riverFlow` & `materials.riverGlow`)**:
  - Lòng sông màu xanh ngọc lam chuyển sâu (`#0B4650` đến `#126B74` và xanh thẳm `#08283A`), độ bóng nước cao (roughness 0.12, metalness 0.35).
  - Lớp hòa trộn phát quang mờ ảo màu xanh ngọc - vàng nắng (`blending: AdditiveBlending`).
  - Texture thủ công tạo hiệu ứng vân sóng nước và các vòng sáng niên biểu tròn (ripple caustics).
- **Vật liệu kim loại Đồng thau Hoàng gia (`materials.royalBrass` & `materials.brushedGold`)**:
  - Vàng đồng 24K ấm áp (`#D4AF37` / `#E8CE85`), độ phản xạ kim loại cao (metalness 0.88, roughness 0.24).
- **Texture Bảng thông tin 18 cột mốc (`createMilestoneMarkerTexture`)**:
  - Nền parchment sáng thanh lịch viền đôi đồng thau, chữ số năm lớn mạ vàng, tiêu đề đậm chất typography viện bảo tàng, bố cục thoáng đãng và có chỉ dẫn nhấp xem tư liệu rõ ràng.

### Bước 2: Tái Cấu Trúc Kiến Trúc Không Gian 3D (`TimelineArchitecture.ts`)
1. **Hệ thống thức cột và trần nhà**:
   - Loại bỏ các cột hộp đen vuông thô cứng (`charcoalFrame`).
   - Xây dựng hàng cột tròn thanh thoát (Fluted Colonnade, bán kính r=0.32m) bằng đá trắng ngà, chân đế phân tầng và đầu cột đúc chỉ vàng champagne.
   - Bố trí đèn tường (sconces) tỏa ánh sáng vàng dịu 0xFFF1D8 dọc theo hai hàng cột.
   - Dầm trần kiến trúc viền chỉ vàng kết hợp trần giật cấp (coffered ceiling).
2. **Dải trung tâm "Dòng sông thời gian 60 năm"**:
   - Khổ rộng 3.4m, chạy dài dọc sảnh từ Nam sang Bắc.
   - Hai bên bờ sông được ốp nẹp đồng thau kép sáng bóng kèm rãnh đèn LED ngầm màu vàng ấm.
   - Bổ sung cụm **240 hạt tinh tú dòng chảy (River Particle Flow)** trôi nhẹ nhàng dọc theo dải ngọc bích từ 1966 đến 2026.
3. **18 Bục trưng bày cột mốc (Milestone Pylons)**:
   - Thiết kế dáng bục bảo tàng cao cấp: Chân đế trụ tròn giật cấp bằng đá ngà viền vàng, thân cột thon gọn, giá đỡ khay nghiêng chuẩn góc nhìn du khách.
   - Khay viền đồng thau bo góc tinh tế, mặt bảng phẳng hiển thị thông tin rõ ràng không bị khuất bóng.
   - Đèn rọi tiêu điểm gắn tinh tế trên đỉnh mỗi bục làm nổi bật thông điệp lịch sử.
4. **Tượng đài Kết tinh 60 năm (North Wall Finale)**:
   - Đài tưởng niệm 3D giật cấp uy nghiêm với vòm cuốn, trụ bổ tường và phù điêu số 60 năm mạ vàng rực rỡ, kèm đèn rọi hào quang.
5. **Cổng trở về Sảnh chính (South Portal)**:
   - Cổng vòm đá ngà sang trọng đồng bộ với Đại sảnh, biển hiệu chỉ dẫn rõ ràng.

### Bước 3: Hoàn Thiện Vòng Lặp Hoạt Họa & Tương Tác (`TimelineScene.tsx`)
- Tích hợp hoạt họa dòng chảy thời gian trong hàm `animate()`:
  - Dòng hạt tinh tú (`riverParticles`) chuyển động mềm mại dọc trục Z tạo cảm giác sống động như dòng thời gian đang trôi.
  - Ánh sáng đèn nẹp và mặt sông nhấp nháy chuyển sắc nhẹ nhàng.
  - Đảm bảo camera di chuyển mượt mà khi người dùng nhấn chuyển chương niên biểu hoặc tương tác với từng mốc lịch sử.
- Giữ vững toàn bộ tính năng: click mở modal chi tiết, âm thanh ambient không gian, điều khiển bàn phím/chuột/cảm ứng.

### Bước 4: Kiểm Thử & Xác Nhận Toàn Diện
- Chạy lệnh kiểm tra `npm run validate:content` đảm bảo đạt **100% REGISTRY VALIDATION PASSED**.
- Chạy `npm run lint` và `compile_applet` xác nhận không có lỗi biên dịch TypeScript.

---

## 3. Danh Sách Tệp Can Thiệp
- `src/scenes/timeline/textures/TimelineProceduralTextures.ts` (Nâng cấp texture sàn ngọc, vân đá cẩm thạch ngà, bục cột mốc và tượng đài)
- `src/scenes/timeline/materials/TimelineMaterials.ts` (Cập nhật bộ vật liệu đá ngà, sông ngọc lục bảo, đồng thau vàng)
- `src/scenes/timeline/components/TimelineArchitecture.ts` (Tái thiết lập hình học thức cột, dải sông thời gian, 18 bục đá trắng và tượng đài)
- `src/scenes/timeline/TimelineScene.tsx` (Bổ sung hoạt họa hạt tinh tú dòng chảy, tinh chỉnh ánh sáng và camera)
