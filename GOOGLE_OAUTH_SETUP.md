# Hướng dẫn cấu hình Google OAuth

## Bước 1: Tạo Google OAuth Client

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Chọn **Application type**: Web application
6. Điền thông tin:
   - **Name**: Anh Thơ Spa Web App
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:3001`
   - **Authorized redirect URIs**:
     - `http://localhost:3001/api/auth/google/callback`
7. Click **Create** và lưu lại:
   - **Client ID**
   - **Client Secret**

## Bước 2: Cấu hình Backend

Mở file `backend/.env` và cập nhật:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=anhthospa_session_secret_2024
```

## Bước 3: Chạy Migration

```bash
cd backend
npx sequelize-cli db:migrate
```

## Bước 4: Khởi động lại Server

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
```

## Bước 5: Test Google Login

1. Mở trình duyệt vào `http://localhost:3000`
2. Click vào nút "Đăng nhập với Google"
3. Chọn tài khoản Google của bạn
4. Cho phép quyền truy cập
5. Hệ thống sẽ tự động tạo tài khoản và đăng nhập

## Lưu ý

- Người dùng đăng nhập bằng Google sẽ tự động có role **Client**
- Không cần mật khẩu cho tài khoản Google OAuth
- Database sẽ lưu `googleId` để liên kết với tài khoản Google
- Nếu email đã tồn tại, hệ thống sẽ liên kết với tài khoản cũ

## Troubleshooting

### Lỗi "redirect_uri_mismatch"

- Kiểm tra lại **Authorized redirect URIs** trong Google Console
- Đảm bảo URL khớp chính xác với `GOOGLE_CALLBACK_URL` trong `.env`

### Lỗi "invalid_client"

- Kiểm tra lại `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`
- Đảm bảo không có khoảng trắng thừa

### Không nhận được callback

- Kiểm tra backend đang chạy trên port 3001
- Kiểm tra CORS đã được cấu hình đúng trong `server.js`
