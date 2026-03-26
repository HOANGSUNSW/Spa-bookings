# Tổng quan dự án Anh Thơ Spa

## 1) Dự án này là gì?

Đây là hệ thống quản lý spa đa nền tảng, gồm:

- Backend API cho nghiệp vụ và dữ liệu
- Web frontend cho khách hàng, admin và nhân viên
- Mobile app cho người dùng di động

## 2) Kiến trúc tổng thể

Dự án đi theo mô hình phân lớp khá rõ:

- Tầng giao diện: React web và Expo mobile
- Tầng API: Express.js
- Tầng nghiệp vụ: service layer
- Tầng dữ liệu: Sequelize ORM + MySQL

## 3) Các module chính

- Đăng ký, đăng nhập, xác thực email, quên mật khẩu
- Quản lý người dùng theo vai trò
- Quản lý dịch vụ, danh mục dịch vụ
- Đặt lịch hẹn, hủy lịch, hoàn thành lịch
- Thanh toán nội bộ và VNPay
- Khuyến mãi, voucher, điểm/level khách hàng
- Chăm sóc liệu trình và session trị liệu
- Thông báo, chatbot, tải ảnh hồ sơ
- Lịch làm việc nhân viên

## 4) Điểm đáng chú ý

- Có cả web và mobile dùng chung backend
- Có luồng xác thực email và đặt lại mật khẩu
- Có thanh toán qua VNPay với callback xác thực chữ ký
- Có cron job tự động gửi voucher hàng tháng cho khách VIP
- Có chatbot tích hợp Google GenAI
- Có mô hình dữ liệu khá nhiều quan hệ giữa user, service, appointment, payment, promotion, review, treatment course

## 5) Tóm tắt ngắn để đi phỏng vấn

Nếu được hỏi “Dự án làm gì?”, có thể trả lời:

> Đây là hệ thống spa đa nền tảng cho phép khách hàng xem dịch vụ, đặt lịch, thanh toán, nhận ưu đãi, theo dõi liệu trình; còn admin và nhân viên có các màn hình quản trị riêng để quản lý lịch hẹn, dịch vụ, người dùng và báo cáo.

