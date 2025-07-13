## Mô Tả Dự Án

Website cho thuê nhà tại Hà Nội được xây dựng bằng Node.js, Express.js và MySQL. Hệ thống cung cấp nền tảng kết nối giữa người cho thuê và người tìm thuê nhà với giao diện thân thiện và tính năng đầy đủ.

## Tính Năng Chính

### Người Dùng

- Đăng ký/Đăng nhập tài khoản
- Quản lý thông tin cá nhân
- Đăng tin cho thuê nhà
- Tìm kiếm và lọc tin đăng
- Lưu tin yêu thích
- Bình luận và đánh giá
- Xem lịch sử tin đăng

### Quản Trị Viên

- Dashboard quản lý tổng quan
- Quản lý người dùng
- Quản lý tin đăng
- Quản lý bình luận
- Xử lý liên hệ từ khách hàng

### Giao Diện

- Responsive design (Mobile-first)
- Giao diện hiện đại, thân thiện
- Popup quảng cáo với cookie
- Animation và transition mượt mà

## Công Nghệ Sử Dụng

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Cơ sở dữ liệu
- **EJS** - Template engine
- **bcryptjs** - Mã hóa mật khẩu
- **express-session** - Quản lý session
- **express-fileupload** - Upload file

### Frontend

- **HTML5 & CSS3**
- **JavaScript (Vanilla)**
- **Responsive Design**
- **CSS Grid & Flexbox**

## Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js 14.x trở lên
- MySQL 8.0 trở lên
- NPM (đi kèm Node.js)

### Hướng Dẫn Cài Đặt

1. **Clone repository**

```bash
git clone <your-repo-url>
cd rental-website
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình cơ sở dữ liệu**

```sql
CREATE DATABASE rental_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **Import dữ liệu mẫu**

```bash
mysql -u root -p rental_website < sample_data.sql
```

5. **Cấu hình biến môi trường**

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn.

6. **Chạy ứng dụng**

```bash
npm start
```

Truy cập: http://localhost:3000

## 🔐 Tài Khoản Mẫu

### Admin

- **Username**: admin
- **Password**: admin123

### User Thường

- **Username**: user1 | **Password**: user123
- **Username**: user2 | **Password**: user123

## Dữ Liệu Mẫu

- **5 tin đăng** từ chung cư cao cấp đến phòng trọ sinh viên
- **5 user** với các quyền khác nhau
- **Bình luận và đánh giá** mẫu
- **Tin đã lưu** của các user

## 📁 Cấu Trúc Dự Án

```
rental-website/
├── 📁 config/           # Cấu hình database
├── 📁 controllers/      # Logic xử lý business
├── 📁 middleware/       # Middleware Express
├── 📁 routes/           # Định tuyến API
├── 📁 views/            # Template EJS
│   ├── 📁 admin/        # Giao diện admin
│   ├── 📁 auth/         # Đăng nhập/đăng ký
│   ├── 📁 listings/     # Quản lý tin đăng
│   ├── 📁 users/        # Giao diện user
│   └── 📁 partials/     # Component tái sử dụng
├── 📁 public/           # Static files
│   ├── 📁 css/          # Stylesheet
│   ├── 📁 images/       # Hình ảnh
│   └── 📁 uploads/      # File upload
├── 📄 app.js            # Entry point
├── 📄 package.json      # Dependencies
├── 📄 database.sql      # Tạo bảng mẫu
├── 📄 sample_data.sql   # Dữ liệu mẫu
└── 📄 .env.example      # Cấu hình mẫu

```

## Scripts NPM

```bash
npm start          # Chạy production
npm run dev        # Chạy development với nodemon
```
