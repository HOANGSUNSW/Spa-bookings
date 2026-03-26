# Cơ sở dữ liệu và kiến trúc dữ liệu

## 1) Dùng cơ sở dữ liệu gì?

Dự án dùng **MySQL**.

Dấu hiệu nhận biết:

- Sequelize được cấu hình với `dialect: 'mysql'`
- Có package `mysql2`
- Có nhiều migration tạo bảng và thêm cột

## 2) ORM / cách truy cập dữ liệu

Dự án dùng **Sequelize ORM** để:

- Định nghĩa model
- Tạo quan hệ giữa các bảng
- Chạy migration
- Query dữ liệu có include/association

## 3) Các bảng/chủ thể chính

Các entity nổi bật gồm:

- users
- services
- service_categories
- appointments
- payments
- promotions
- promotion_usage
- wallets
- reviews
- notifications
- staff_shifts
- staff_availability
- treatment_courses
- treatment_sessions

## 4) Quan hệ dữ liệu đáng chú ý

- Một user có thể có nhiều appointment
- Một service thuộc một service category
- Một appointment gắn với service, user, therapist, payment, review
- Một user có thể có wallet
- Promotion có thể được dùng nhiều lần thông qua promotion_usage
- Treatment course có nhiều treatment sessions

## 5) Điểm đáng chú ý trong thiết kế dữ liệu

- ID thường là chuỗi thay vì số tự tăng
- Có trạng thái người dùng: Active, Inactive, Locked, Pending
- Có trạng thái lịch hẹn: pending, scheduled, upcoming, completed, cancelled, in-progress
- Có logic email verification và password reset token
- Có hỗ trợ trạng thái thanh toán và callback từ VNPay

## 6) Kết luận ngắn

Kiến trúc dữ liệu khá giống hệ thống nghiệp vụ thực tế: nhiều bảng trung tâm, quan hệ chặt chẽ, có migration rõ ràng và có xử lý các luồng kinh doanh như thanh toán, voucher, liệu trình và thông báo.
