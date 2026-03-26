# Anh Thơ Spa - Spa Management System

Hệ thống quản lý Spa đa nền tảng toàn diện (Web & Mobile)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

---

## 📖 Giới thiệu (Overview)

**Anh Thơ Spa** là một giải pháp quản lý toàn diện dành cho doanh nghiệp Spa, cung cấp các nền tảng tương tác cho 3 nhóm đối tượng:

1. **Khách hàng (Web/Mobile):** Trải nghiệm đặt lịch, xem dịch vụ, quản lý hạng thành viên và thanh toán dễ dàng.
2. **Nhân viên (Web):** Tiếp nhận thông tin ca làm việc, xử lý trạng thái lịch hẹn, theo dõi các liệu trình của khách hàng.
3. **Quản trị viên (Web):** Quản lý toàn bộ hệ thống, từ danh mục dịch vụ, ca làm việc đến báo cáo doanh thu và nhân sự.

Dự án sử dụng kiến trúc phân lớp hiện đại và tổ chức theo mô hình **Monorepo**, giúp phát triển và bảo trì dễ dàng.

---

## ⚙️ Cấu trúc thư mục (Folder Structure)

Dự án được phân chia thành 3 phân hệ chính:

```text
AnhThoSpa/
├── backend/            # Chứa mã nguồn Server API
│   ├── config/         # Cấu hình kết nối DB, thanh toán (VNPay), v.v.
│   ├── controllers/    # Xử lý Request/Response (Giao tiếp với client)
│   ├── models/         # Định nghĩa các Model database (Sequelize)
│   ├── routes/         # Khai báo các endpoint API
│   ├── services/       # Chứa logic nghiệp vụ lõi (Business logic)
│   └── public/         # Tài nguyên tĩnh (ảnh upload,...)
│
├── frontend/           # Chứa mã nguồn Web (Admin, Staff, Client)
│   ├── src/
│   │   ├── admin/      # Giao diện dành cho Quản trị viên
│   │   ├── client/     # Giao diện dành cho Khách hàng
│   │   ├── staff/      # Giao diện dành cho Nhân viên
│   │   ├── components/ # Các components dùng chung (UI, Layout)
│   │   └── services/   # Gọi API giao tiếp với backend
│   └── vite.config.ts  # Cấu hình Vite
│
└── mobile/             # Chứa mã nguồn App Mobile (React Native / Expo)
    ├── app/            # Cấu hình router điều hướng của Expo
    ├── src/
    │   ├── components/ # UI components cho mobile
    │   ├── navigation/ # Khai báo luồng điều hướng màn hình
    │   ├── screens/    # Chứa giao diện các màn hình app
    │   └── services/   # Tích hợp API backend 
    └── app.json        # Cấu hình chung cho Expo
```

---

## 🔄 Luồng hoạt động các chức năng chính (Core Functional Flows)

Hệ thống Anh Thơ Spa hoạt động dựa trên các quy trình chức năng khép kín. Dưới đây là mô phỏng các luồng nghiệp vụ quan trọng nhất trong hệ thống để người mới có thể dễ dàng hình dung.

### 1. Kiến trúc xử lý Request chung (API Architecture)

Bất kỳ một thao tác nào trên web/app khi gửi về server đều đi qua luồng kiến trúc 4 lớp cơ bản:

```text
+-----------------------+
|  Client (Web/Mobile)  | <--- (Người dùng thao tác)
+-----------------------+
       |       ^
       | 1. Gửi HTTP Request (VD: POST /api/appointments)
       | 6. Trả HTTP Response (JSON Dữ liệu/Lỗi)
       v       |
+-----------------------+
|  [1] API Routes       | <--- (backend/routes/: Tiếp nhận cấu hình URL định tuyến)
+-----------------------+
       |       ^
       | 2. Forward
       | 5. Trả kết quả
       v       |
+-----------------------+
|  [2] Controllers      | <--- (backend/controllers/: Nhận Request, chuẩn hóa & Xác thực)
+-----------------------+
       |       ^
       | 3. Chuyển dữ liệu
       | 4. Nhận kết quả
       v       |
+-----------------------+
|  [3] Services         | <--- (backend/services/: NƠI CHỨA LOGIC NGHIỆP VỤ LÕI)
+-----------------------+
       |       ^
       | Gọi hàm ORM
       | Trả object (Entity)
       v       |
+-----------------------+
|  [4] Models (ORM)     | <--- (backend/models/: Tương tác với CSDL qua Sequelize)
+-----------------------+
       |       ^
       | Lệnh Query (SELECT/INSERT/UPDATE)
       | Dữ liệu (Row từ Database)
       v       |
+-----------------------+
|    MySQL Database     | <--- (Lưu trữ cố định)
+-----------------------+
```

### 2. Luồng Đặt lịch hẹn (Booking Flow)

Đây là tính năng cốt lõi nhất. Khách hàng xem dịch vụ, chọn khung giờ trống và đặt lịch.

```text
+--------------+          +----------------+          +-----------------+          +--------------+
| Khách Hàng   |          | Giao Diện (UI) |          | Server Backend  |          | Database     |
+--------------+          +----------------+          +-----------------+          +--------------+
       |                          |                            |                          |
       | 1. Chọn dịch vụ & giờ    |                            |                          |
       |------------------------->|                            |                          |
       |                          | 2. Gọi API Đặt lịch        |                          |
       |                          |--------------------------->|                          |
       |                          |                            | 3. Kiểm tra giờ trống    |
       |                          |                            |------------------------->|
       |                          |                            |<-------------------------|
       |                          |                            | 4. Lưu thông tin lịch    |
       |                          |                            |------------------------->|
       |                          | 5. Phản hồi thành công     |                          |
       |                          |<---------------------------|                          |
       | 6. Hiển thị thông báo    |                            |                          |
       |<-------------------------|                            |                          |
       |                          |                            |                          |
```

### 3. Luồng Thanh toán Online (VNPay Payment Flow)

Tích hợp cổng thanh toán VNPay thực tế với hệ thống tạo URL động và Callback (IPN).

```text
+--------------+       +----------------+       +-----------------+       +----------------+
| Khách Hàng   |       | Giao Diện (UI) |       | Server Backend  |       | Cổng VNPay     |
+--------------+       +----------------+       +-----------------+       +----------------+
       |                       |                         |                        |
       | 1. Bấm thanh toán     |                         |                        |
       |---------------------->|                         |                        |
       |                       | 2. Gọi API lấy URL      |                        |
       |                       |------------------------>|                        |
       |                       |                         | 3. Mã hóa sinh URL     |
       |                       |<------------------------|    có chữ ký bảo mật   |
       |                       | 4. Redirect qua VNPay   |                        |
       |                       |------------------------------------------------->|
       |                       |                         |                        | 5. Khách nhập
       |                       |                         |                        |    thẻ ngân hàng
       |                       |<-------------------------------------------------|
       |                       |                         |                        |
       |                       | 6. VNPay gọi Callback báo kết quả ngầm (IPN)     |
       |                       |                         |<-----------------------|
       |                       |                         | 7. Cập nhật trạng thái |
       | 8. Báo hoàn thành     |                         |    đơn hàng vào CSDL   |
       |<----------------------|                         |                        |
```

### 4. Luồng Tự động gửi Voucher khách VIP (Cronjob Flow)

Sử dụng thư viện Node-cron chạy tự động không cần sự can thiệp của người dùng.

```text
+-------------------+           +-------------------+           +------------------+
| Giờ hệ thống      |           | MonthlyService    |           | MySQL Database   |
| (Node-Cron Job)   |           | (Logic gửi tặng)  |           | (Lưu trữ)        |
+-------------------+           +-------------------+           +------------------+
          |                               |                              |
          | 1. Đạt 00:00 ngày mùng 1      |                              |
          |    đầu tháng -> Kích hoạt!    |                              |
          |------------------------------>|                              |
          |                               | 2. Lấy danh sách khách VIP   |
          |                               |----------------------------->|
          |                               |<-----------------------------|
          |                               |                              |
          |                               | 3. Sinh Voucher cho mỗi User |
          |                               |----------------------------->|
          |                               |                              |
          |                               | 4. Tạo thông báo (Notify)    |
          |                               |----------------------------->|
          |                               |                              |
          | 5. Trạng thái IDLE chờ        |<-----------------------------|
          |    đến tháng sau              |                              |
          |<------------------------------|                              |
```

---

## 🚀 Hướng dẫn cài đặt & Chạy dự án (Installation & Setup)

### Yêu cầu hệ thống

* **Node.js**: v18.x hoặc cao hơn
* **MySQL**: v8.x
* Expo CLI (Cho mobile)

### Bước 1: Clone dự án

```bash
git clone <repository_url>
cd SourceCode_B49_AnhThoSpa
```

### Bước 2: Thiết lập cơ sở dữ liệu và Backend

1. Cài đặt các thư viện:

```bash
cd backend
npm install
```

1. Tạo CSDL MySQL trống:
Lên MySQL tạo 1 Database mới, ví dụ tên `anhthospa_db` (chuẩn collation là `utf8mb4_unicode_ci`).

2. Cấu hình biến môi trường (`.env`):
Tạo 1 file `.env` ở thư mục `/backend` với các thông số bắt buộc sau:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
# Thay đổi password cho phù hợp với MySQL của bạn
DB_PASSWORD=your_mysql_password
DB_NAME=anhthospa_db
DB_PORT=3306

# Secret key dành cho bảo mật (JWT)
JWT_SECRET=mot_chuoi_bi_mat_bat_ky_cua_ban
JWT_EXPIRES_IN=7d

# Email Service (Gửi mail xác thực mật khẩu, thông báo)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# VNPay Payment Gateway (Cấu hình thanh toán)
VNP_TMN_CODE=your_vnp_tmn_code
VNP_HASH_SECRET=your_vnp_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
VNP_RETURN_URL=http://localhost:3000/payment/callback
# VNP_RETURN_URL là đường dẫn trên frontend của bạn khi thanh toán xong
```

1. Chạy Backend:

```bash
npm run dev
```

*(Nếu cài đặt đúng, server sẽ báo kết nối CSDL thành công và tự động tạo/đồng bộ các bảng).*

### Bước 3: Cài đặt và chạy Frontend (Web)

1. Mở một terminal mới, chuyển vào thư mục `/frontend`:

```bash
cd frontend
npm install
```

1. Cấu hình biến môi trường (nếu có):
Copy file `.env.example` thành `.env` (thường chứa `VITE_API_URL=http://localhost:3001/api`).

2. Chạy môi trường dev phân hệ Web:

```bash
npm run dev
```

*(Truy cập `http://localhost:3000` hoặc port được Vite gợi ý để xem Web).*

### Bước 4: Cài đặt và chạy Mobile (Expo)

1. Mở một terminal mới, chuyển vào thư mục `/mobile`:

```bash
cd mobile
npm install
```

1. Chạy môi trường dev phân hệ Mobile:

```bash
npm start
# hoặc
npx expo start
```

*(Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại iOS/Android hoặc nhấn `a` để mở trên máy ảo Android).*

---

## Tính năng chính (Key Features)

* **Hệ thống đặt lịch thông minh:** Kiểm tra ca trống, chọn kỹ thuật viên, theo dõi trạng thái.
* **Tích phân quyền linh hoạt:** Giao diện riêng biệt và độc lập dành cho Khách, Staff và Admin.
* **Tích điểm thăng hạng (Loyalty):** Tích điểm sau dịch vụ và tự động gửi Voucher hằng tháng cho khách VIP theo lịch (Cron jobs).
* **Thanh toán trực tuyến:** Tích hợp VNPay an toàn, nhanh chóng.
* **Chatbot AI & Thông báo nhanh:** Tích hợp AI hỗ trợ CSKH và thông báo (Notification) theo thời gian thực.
* **Quản lý liệu trình (Treatment Course):** Quản lý khách hàng đi lại nhiều buổi với tiến độ chi tiết.

## 📚 Tài liệu bổ sung

Tất cả các tài liệu mô tả chi tiết nghiệp vụ kiến trúc đều nằm trong thư mục: [phan-tich-du-an/](phan-tich-du-an/)

* [Tổng quan](phan-tich-du-an/00-tong-quan.md)
* [Stack công nghệ](phan-tich-du-an/01-stack-cong-nghe.md)
* [Kiến trúc & CSDL](phan-tich-du-an/02-csdl-va-kien-truc.md)

---
*Developed with ❤️ by Anh Thơ Spa Team*
