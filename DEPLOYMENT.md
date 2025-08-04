# Hướng dẫn Deploy lên Vercel

## Các bước deploy:

### 1. Chuẩn bị Database Cloud

- Dự án cần database MySQL cloud (PlanetScale, Railway, hoặc AWS RDS)
- Tạo database và import file `database.sql` và `sample_data.sql`

### 2. Cấu hình Environment Variables trên Vercel

Vào Vercel Dashboard > Project Settings > Environment Variables và thêm:

```
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret
DB_HOST=your-cloud-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=rental_db
UPLOAD_PATH=public/uploads
MAX_FILE_SIZE=5242880
```

### 3. Deploy Commands

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel

# Hoặc deploy từ GitHub
```

### 4. Test endpoints sau deploy:

- `/api/health` - Test API
- `/` - Trang chủ

## Lưu ý:

- File uploads có thể không hoạt động trên Vercel (serverless)
- Cần dùng cloud storage như Cloudinary cho uploads
- Sessions có thể cần Redis thay vì file-based
