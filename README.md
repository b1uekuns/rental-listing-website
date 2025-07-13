# 🏠 Rental Website - Website Cho Thuê Nhà Tại Hà Nội

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-8B4513?style=for-the-badge)

## 📋 Mô Tả Dự Án

Website cho thuê nhà tại Hà Nội được xây dựng bằng Node.js, Express.js và MySQL. Hệ thống cung cấp nền tảng kết nối giữa người cho thuê và người tìm thuê nhà với giao diện thân thiện và tính năng đầy đủ.

## ✨ Tính Năng Chính

### 👥 Người Dùng
- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Quản lý thông tin cá nhân
- ✅ Đăng tin cho thuê nhà
- ✅ Tìm kiếm và lọc tin đăng
- ✅ Lưu tin yêu thích
- ✅ Bình luận và đánh giá
- ✅ Xem lịch sử tin đăng

### 🛡️ Quản Trị Viên
- ✅ Dashboard quản lý tổng quan
- ✅ Quản lý người dùng
- ✅ Quản lý tin đăng
- ✅ Quản lý bình luận
- ✅ Xử lý liên hệ từ khách hàng

### 🎨 Giao Diện
- ✅ Responsive design (Mobile-first)
- ✅ Giao diện hiện đại, thân thiện
- ✅ Popup quảng cáo với cookie
- ✅ Animation và transition mượt mà

## 🛠️ Công Nghệ Sử Dụng

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

## 📦 Cài Đặt

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
- **Username**: nguyenvana | **Password**: user123
- **Username**: tranthib | **Password**: user123
- **Username**: lethanhc | **Password**: user123

## 📊 Dữ Liệu Mẫu

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
└── 📄 .env.example      # Cấu hình mẫu
```

## 🚀 Scripts NPM

```bash
npm start          # Chạy production
npm run dev        # Chạy development với nodemon
```

## 🔧 Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL service
- Xác nhận thông tin trong `.env`
- Đảm bảo database đã được tạo

### Lỗi port đã sử dụng
- Thay đổi PORT trong `.env`
- Dừng process chạy trên port 3000

### Lỗi upload file
- Kiểm tra quyền ghi `public/uploads`
- Tạo thư mục nếu chưa có

## 📸 Screenshots

### Trang Chủ
![Home Page](docs/screenshots/home.png)

### Dashboard Admin
![Admin Dashboard](docs/screenshots/admin.png)

### Chi Tiết Tin Đăng
![Listing Detail](docs/screenshots/listing.png)

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

- **Tên**: [Tên của bạn]
- **Email**: [Email của bạn]
- **GitHub**: [GitHub profile]

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [MySQL](https://www.mysql.com/) - Database
- [EJS](https://ejs.co/) - Template engine
