# Dự án này có OOP không?

## 1) Có, nhưng không phải kiểu OOP thuần

Dự án có dùng OOP ở mức **vừa phải**. Nó không phải kiểu viết toàn bộ theo class, mà là mô hình kết hợp giữa:

- class-based controllers/services ở backend
- function-based Sequelize models
- React component-based UI ở frontend
- TypeScript interface ở frontend/mobile

## 2) Chỗ nào dùng OOP?

### Backend controllers

Các controller được khai báo bằng class, ví dụ:

- AuthController
- UserController
- AppointmentController
- PaymentController
- ServiceController

Mỗi class gom các hành vi theo từng domain, giúp code dễ tổ chức và dễ bảo trì.

### Backend services

Service layer cũng dùng class, ví dụ:

- AuthService
- PaymentService
- AppointmentService
- UserService
- ServiceService
- EmailService
- MonthlyVoucherService

Đây là cách thể hiện tính đóng gói: controller chỉ nhận request/response, còn business logic nằm trong service.

### Sequelize models

Model không dùng class tự viết, mà dùng factory function `sequelize.define(...)`. Đây là kiểu OOP không cổ điển, nhưng vẫn có khái niệm đối tượng, thuộc tính và quan hệ.

### Frontend / Mobile

- React dùng component là hàm hoặc function component
- TypeScript dùng interface và type để mô tả dữ liệu
- Mobile có `interface Props extends TextInputProps`, đây là một dạng kế thừa kiểu dữ liệu trong TypeScript

## 3) Nếu bị hỏi “dự án có OOP không?”, nên trả lời thế nào?

> Có. Backend sử dụng class cho controller và service để đóng gói logic theo từng chức năng. Tuy nhiên, dự án không theo OOP thuần vì phần UI dùng React function component và model của Sequelize lại khai báo theo factory function.

## 4) Điểm mạnh của cách làm này

- Dễ chia tách trách nhiệm
- Dễ mở rộng từng module
- Dễ thay thế service hoặc controller khi cần
- Hợp với mô hình MVC / layered architecture

