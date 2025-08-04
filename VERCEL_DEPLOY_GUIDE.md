# HƯỚNG DẪN DEPLOY LÊN VERCEL - KHẮC PHỤC LỖI 404

## Các file quan trọng đã tạo:

### 1. `/api/index.js` - Entry point cho Vercel

### 2. `/vercel.json` - Cấu hình Vercel

### 3. Đã sửa `/app.js` - Export app cho serverless

## BƯỚC DEPLOY:

### Bước 1: Commit tất cả các thay đổi

```bash
git add .
git commit -m "Add Vercel configuration files"
git push origin main
```

### Bước 2: Deploy lại trên Vercel

- Vào Vercel Dashboard
- Tìm project "rental-listing-website"
- Click "Redeploy" hoặc push code mới sẽ auto-deploy

### Bước 3: Cấu hình Environment Variables

Trong Vercel Dashboard > Settings > Environment Variables, thêm:

```
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-here
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=rental_db
```

### Bước 4: Test endpoints

- `/api/test` - Test cơ bản (đã hoạt động)
- `/` - Trang chủ
- `/api/health` - Health check

## Nếu vẫn lỗi 404:

### Option 1: Deploy manual từ CLI

```bash
npm i -g vercel
vercel --prod
```

### Option 2: Xóa project và tạo lại

1. Xóa project trên Vercel Dashboard
2. Import lại từ GitHub
3. Cấu hình lại Environment Variables

## LƯU Ý QUAN TRỌNG:

- Database cần phải là cloud database (không dùng localhost)
- File uploads sẽ không hoạt động trên Vercel (cần Cloudinary)
- Sessions dùng memory store (mất khi restart)
