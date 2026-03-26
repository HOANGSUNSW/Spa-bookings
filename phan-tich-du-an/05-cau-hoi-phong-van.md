# Câu hỏi phỏng vấn có thể gặp và câu trả lời gợi ý

## 1) Dự án của bạn làm gì?

**Trả lời gợi ý:**

Đây là hệ thống quản lý spa đa nền tảng. Khách hàng có thể đăng ký, xác nhận email, xem dịch vụ, đặt lịch, thanh toán, nhận voucher và theo dõi liệu trình. Admin và nhân viên có khu vực riêng để quản lý lịch hẹn, dịch vụ, người dùng, thanh toán và báo cáo.

## 2) Bạn dùng stack gì?

**Trả lời gợi ý:**

Backend là Node.js, Express, Sequelize và MySQL. Web frontend dùng React, TypeScript và Vite. Mobile dùng Expo, React Native và React Navigation. Ngoài ra có VNPay, Nodemailer, cron job và chatbot AI.

## 3) Vì sao chọn Sequelize?

**Trả lời gợi ý:**

Vì Sequelize hỗ trợ ORM, association giữa các bảng, migration và CRUD khá thuận tiện. Với dự án có nhiều quan hệ như user, appointment, payment, promotion, treatment course thì ORM giúp giảm code SQL thủ công và dễ bảo trì hơn.

## 4) Cơ sở dữ liệu bạn dùng gì?

**Trả lời gợi ý:**

Dự án dùng MySQL.

## 5) Dự án có những role nào?

**Trả lời gợi ý:**

Có 3 role chính: Admin, Staff và Client. Mỗi role có quyền và giao diện riêng.

## 6) Luồng đăng ký và đăng nhập hoạt động thế nào?

**Trả lời gợi ý:**

Người dùng đăng ký bằng email, mật khẩu và thông tin cá nhân. Hệ thống băm mật khẩu bằng bcrypt, tạo token xác nhận email và gửi email xác minh. Khi đăng nhập, backend kiểm tra mật khẩu, trạng thái tài khoản và email đã verified chưa.

## 7) Bạn xử lý bảo mật mật khẩu ra sao?

**Trả lời gợi ý:**

Mật khẩu không lưu plain text mà được băm bằng bcrypt. Khi đăng nhập, backend so sánh mật khẩu nhập vào với hash trong database.

## 8) Bạn có làm quên mật khẩu không?

**Trả lời gợi ý:**

Có. Hệ thống tạo password reset token, lưu token và thời hạn hết hạn, sau đó người dùng dùng token đó để đặt lại mật khẩu.

## 9) Thanh toán VNPay được làm thế nào?

**Trả lời gợi ý:**

Khi người dùng chọn VNPay, backend tạo payment record và sinh URL thanh toán. Sau khi thanh toán xong, VNPay gọi callback về backend. Backend kiểm tra chữ ký số, xác thực giao dịch rồi cập nhật trạng thái payment và appointment.

## 10) Vì sao cần cron job?

**Trả lời gợi ý:**

Cron job dùng để tự động chạy tác vụ định kỳ, trong dự án này là gửi voucher hàng tháng cho khách VIP. Cách này giúp tự động hóa nghiệp vụ mà không cần thao tác thủ công.

## 11) Dự án xử lý voucher/khuyến mãi thế nào?

**Trả lời gợi ý:**

Có promotion, promotion usage và logic kiểm tra thời hạn, usage limit, min order value và max discount. Khi thanh toán có thể áp dụng mã giảm giá để tính số tiền cuối cùng.

## 12) Bạn thiết kế appointment ra sao?

**Trả lời gợi ý:**

Appointment liên kết với service, user, therapist và payment. Trạng thái lịch có thể là pending, scheduled, upcoming, completed, cancelled hoặc in-progress.

## 13) Tại sao dùng service layer thay vì viết hết trong controller?

**Trả lời gợi ý:**

Vì service layer giúp tách business logic khỏi phần xử lý HTTP. Controller chỉ nhận request và trả response, còn service xử lý nghiệp vụ, làm cho code dễ đọc và dễ test hơn.

## 14) Dự án có OOP không?

**Trả lời gợi ý:**

Có, nhưng không phải OOP thuần. Backend dùng class cho controller và service để đóng gói logic. Frontend chủ yếu dùng React function component. Sequelize model lại dùng factory function.

## 15) Điểm khác biệt lớn nhất của dự án là gì?

**Trả lời gợi ý:**

Điểm khác biệt là nó không chỉ là hệ thống đặt lịch cơ bản mà còn có thanh toán VNPay, email verification, password reset, voucher tự động, chatbot AI, quản lý liệu trình và phân quyền nhiều vai trò.

## 16) Nếu được cải tiến thêm, bạn sẽ làm gì?

**Trả lời gợi ý:**

Em sẽ bổ sung test tự động cho service layer, chuẩn hóa validation đầu vào, tách cấu hình môi trường rõ hơn, tối ưu query cho báo cáo và có thể thêm logging/monitoring tốt hơn.

## 17) Frontend và mobile dùng chung API thế nào?

**Trả lời gợi ý:**

Cả web và mobile đều gọi về cùng backend REST API. Backend cung cấp dữ liệu, còn frontend/mobile chỉ là lớp trình bày khác nhau.

## 18) Khi phỏng vấn, nên nhấn mạnh điều gì?

**Trả lời gợi ý:**

Nên nhấn mạnh ba ý: nghiệp vụ thực tế, kiến trúc rõ ràng và có tích hợp các tính năng nâng cao như xác thực email, thanh toán, cron job và chatbot.

## 19) Dự án này dùng công nghệ gì ở mobile?

**Trả lời gợi ý:**

Mobile dùng Expo và React Native, điều hướng bằng React Navigation, lưu token bằng AsyncStorage và có hỗ trợ notification.

## 20) Nếu nhà tuyển dụng hỏi bạn học được gì từ dự án?

**Trả lời gợi ý:**

Em học được cách thiết kế hệ thống full-stack có nhiều role, cách tổ chức controller-service-model, xử lý authentication, ORM, payment integration và tư duy tách biệt nghiệp vụ với giao diện.

