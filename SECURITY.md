# CHÍNH SÁCH BẢO MẬT & QUY TẮC AN TOÀN (SECURITY RULES & RBAC)
## DỰ ÁN: COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966 – 2026)
### TRƯỜNG THPT A TRẦN HƯNG ĐẠO

---

### 1. Triết Lý Bảo Mật Số (Zero-Trust Security Philosophy)

Hệ thống quản trị và cơ sở dữ liệu Cosmic Heritage được xây dựng theo mô hình **Zero-Trust**:
- **Không tin cậy mã nguồn phía client**: Bất kỳ kiểm tra logic nào ở giao diện React chỉ phục vụ trải nghiệm người dùng (UX). Toàn bộ quyền đọc/ghi dữ liệu được thực thi bằng **Cloud Firestore Security Rules** trên cụm máy chủ của Google.
- **Không cấp quyền tự leo thang (No Privilege Escalation)**: Người dùng thông thường hoặc tài khoản tự đăng ký tuyệt đối không thể tự tạo bản ghi trong `/admins/{uid}` để chiếm quyền quản trị.
- **Phân tách Xác thực & Phân quyền (Auth vs RBAC)**:
  - **Firebase Authentication**: Xác thực danh tính người dùng thông qua Email và Mật khẩu.
  - **Firestore Security Rules**: Kiểm tra xem tài khoản đó có nằm trong danh mục Quản trị viên được ủy quyền (`/admins/{uid}`) hay không trước khi cho phép thực hiện bất kỳ lệnh ghi nào.

---

### 2. Chi Tiết Thực Thi Firestore Security Rules

Quy tắc bảo mật được triển khai trực tiếp vào dự án Firebase:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // 1. Quy tắc Default Deny: Mọi truy cập mặc định bị từ chối
    match /{document=**} {
      allow read, write: if false;
    }

    // 2. Hàm kiểm tra đăng nhập
    function isSignedIn() {
      return request.auth != null;
    }

    // 3. Hàm kiểm định mã ID chống chèn ký tự độc hại / tấn công từ chối dịch vụ
    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    // 4. Quản trị viên Khởi tạo từ cấu hình môi trường
    function isBootstrappedAdmin() {
      return isSignedIn() && request.auth.token.email == 'vubakhanhtrinh30102009@gmail.com';
    }

    // 5. Kiểm tra quyền Quản trị viên tuyệt đối qua Firestore
    function isAdmin() {
      return isSignedIn() && (
        isBootstrappedAdmin() ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    // 6. Bảo vệ danh mục Quản trị viên (/admins/{adminId})
    // - Chỉ Admin mới có quyền tạo, cập nhật hoặc xóa quyền admin của người khác.
    // - Người dùng thường chỉ đọc được thông tin của chính mình.
    match /admins/{adminId} {
      allow get: if isSignedIn() && (request.auth.uid == adminId || isAdmin());
      allow list: if isAdmin();
      allow create, update, delete: if isValidId(adminId) && isAdmin();
    }

    // 7. Bảo vệ các bảng nội dung di sản
    // - Khách tham quan: Chỉ ĐỌC được các bản ghi đã công khai (isPublished == true).
    // - Quản trị viên: Toàn quyền ĐỌC và GHI (Thêm, Sửa, Xóa).
    match /{collectionName}/{docId} {
      allow read: if resource.data.isPublished == true || isAdmin();
      allow write: if isValidId(docId) && isAdmin();
    }
  }
}
```

---

### 3. Tiêu Chuẩn Bảo Mật Mật Khẩu (Password Security Standards)

1. **Tuyệt đối không lưu mật khẩu trong mã nguồn**:
   - Mật khẩu ban đầu `toantinTHD` **không bao giờ** xuất hiện dưới dạng chuỗi hằng số trong code React, biến môi trường public, hay localStorage/sessionStorage.
   - Giao diện login truyền thẳng mật khẩu vào API `signInWithEmailAndPassword` của Firebase SDK mã hóa qua giao thức SSL/TLS an toàn.

2. **Không ép buộc hết hạn mật khẩu tự động ở tầng ứng dụng**:
   - Hệ thống không tạo logic tự động khóa sau 30 hay 90 ngày gây gián đoạn công tác của nhà trường.
   - Khi có nhu cầu đổi mật khẩu định kỳ, quản trị viên sử dụng tính năng **Đổi mật khẩu** tích hợp trong trang quản trị.

---

### 4. Phòng Chống Tấn Công Dữ Liệu Lịch Sử (Tamper Resistance)

- **Ngăn chặn chỉnh sửa mạo danh**: Dữ liệu lịch sử của trường (năm thành lập 1966, danh sách hiệu trưởng, huân chương) không thể bị thay đổi bởi bất kỳ người dùng công cộng nào gửi request API trực tiếp.
- **Thẩm định bắt buộc**: Hệ thống hiển thị rõ ràng nhãn cảnh báo `Chưa xác minh (⚠️)` đối với các thông tin mới nhập cho đến khi Hội đồng Thẩm định Lịch sử nhà trường phê duyệt chuyển sang `Đã xác minh (✓)`.
