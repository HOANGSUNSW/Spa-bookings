# Stack công nghệ của dự án

## 1) Ngôn ngữ sử dụng

Ngôn ngữ chính của dự án là:

- JavaScript: backend Node.js, nhiều file service/controller/model
- TypeScript: frontend React và mobile Expo
- SQL: các file migration và script tạo database
- JSON: app config, package config
- TOML: cấu hình Nixpacks
- Markdown: tài liệu dự án

## 2) Backend stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL qua mysql2
- bcrypt / bcryptjs để mã hóa mật khẩu
- JSON Web Token cho xác thực
- multer để upload file
- nodemailer cho email
- node-cron cho tác vụ định kỳ
- vnpay cho tích hợp thanh toán
- axios, node-fetch, qs, uuid
- Google GenAI cho chatbot

## 3) Frontend web stack

- React 19
- TypeScript
- Vite
- React Router DOM
- Recharts cho biểu đồ
- HashRouter cho routing phía client

## 4) Mobile stack

- Expo
- React Native
- TypeScript
- React Navigation
- AsyncStorage
- Expo Notifications
- Các thư viện UI và tiện ích cho mobile

## 5) Công cụ triển khai

- Nixpacks
- Railway config
- Procfile

## 6) Kết luận ngắn

Dự án là một monorepo kiểu ứng dụng full-stack với backend Node.js/Express, frontend React/Vite và mobile Expo/React Native.
