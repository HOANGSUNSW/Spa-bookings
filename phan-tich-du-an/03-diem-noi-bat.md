# Điểm đặc biệt của dự án

## 1) Một backend phục vụ nhiều nền tảng

Backend dùng chung cho:

- Web khách hàng
- Web quản trị admin
- Khu vực nhân viên
- Mobile app

Điều này giúp đồng bộ dữ liệu và giảm trùng lặp logic.

## 2) Luồng xác thực khá đầy đủ

- Đăng ký tài khoản
- Gửi email xác nhận
- Đăng nhập chỉ khi email đã verified
- Quên mật khẩu
- Đặt lại mật khẩu bằng token

## 3) Thanh toán có thật sự phức tạp hơn CRUD cơ bản

- Tạo payment record
- Sinh URL VNPay
- Xác thực callback bằng chữ ký HMAC
- Cập nhật trạng thái payment và appointment

## 4) Có automation bằng cron job

Backend tự chạy lịch định kỳ để:

- Gửi voucher hàng tháng cho khách VIP
- Không làm chậm request chính vì tác vụ gửi voucher chạy nền

## 5) Có logic nghiệp vụ theo mùa/sự kiện

- Khách sinh nhật có thể nhận notification/voucher
- Khách mới có thể được gợi ý voucher
- VIP tier được tính theo tổng chi tiêu

## 6) Có chatbot tích hợp AI

Dự án không chỉ là booking system thuần túy mà còn có chatbot, cho thấy mức độ mở rộng tốt hơn ứng dụng CRUD đơn giản.

## 7) Có quản lý liệu trình

Ngoài đặt lịch hẹn, hệ thống còn theo dõi:

- Treatment course
- Treatment session
- Therapist/staff liên quan

Điều này phù hợp với mô hình spa/làm đẹp thực tế hơn.

## 8) Có các màn hình phân quyền rõ

- Client
- Staff
- Admin

Đây là điểm hay để nói trong phỏng vấn vì nó chứng minh dự án có phân vai trò và quyền truy cập.
