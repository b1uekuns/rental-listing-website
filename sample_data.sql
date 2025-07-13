-- ===========
-- DỮ LIỆU MẪU
-- ===========

-- Tạo database (nếu chưa có)
-- Create database
CREATE DATABASE IF NOT EXISTS rental_db;
USE rental_db;

-- ===================================
-- 1. BẢNG DISTRICTS (Quận/Huyện)
-- ===================================
-- Insert districts of Hanoi
INSERT INTO districts (name, slug, type) VALUES
('Ba Đình', 'ba-dinh', 'quan'),
('Cầu Giấy', 'cau-giay', 'quan'),
('Đống Đa', 'dong-da', 'quan'),
('Hai Bà Trưng', 'hai-ba-trung', 'quan'),
('Hoàn Kiếm', 'hoan-kiem', 'quan'),
('Hoàng Mai', 'hoang-mai', 'quan'),
('Long Biên', 'long-bien', 'quan'),
('Tây Hồ', 'tay-ho', 'quan'),
('Thanh Xuân', 'thanh-xuan', 'quan'),
('Hà Đông', 'ha-dong', 'quan'),
('Nam Từ Liêm', 'nam-tu-liem', 'quan'),
('Bắc Từ Liêm', 'bac-tu-liem', 'quan'),
('Thanh Trì', 'thanh-tri', 'huyen'),
('Ba Vì', 'ba-vi', 'huyen'),
('Đan Phượng', 'dan-phuong', 'huyen'),
('Gia Lâm', 'gia-lam', 'huyen'),
('Đông Anh', 'dong-anh', 'huyen'),
('Thường Tín', 'thuong-tin', 'huyen'),
('Thanh Oai', 'thanh-oai', 'huyen'),
('Chương Mỹ', 'chuong-my', 'huyen'),
('Hoài Đức', 'hoai-duc', 'huyen'),
('Mỹ Đức', 'my-duc', 'huyen'),
('Phúc Thọ', 'phuc-tho', 'huyen'),
('Thạch Thất', 'thach-that', 'huyen'),
('Quốc Oai', 'quoc-oai', 'huyen'),
('Phú Xuyên', 'phu-xuyen', 'huyen'),
('Ứng Hòa', 'ung-hoa', 'huyen'),
('Mê Linh', 'me-linh', 'huyen'),
('Sóc Sơn', 'soc-son', 'huyen'),
('Sơn Tây', 'son-tay', 'thi_xa'); 

-- ===================================
-- 2. BẢNG USERS (Người dùng)
-- ===================================
INSERT INTO users (id, username, password_hash, email, full_name, phone_number, role, avatar_url,created_at) VALUES
-- User accounts (password: user123)
(1,'user1','$2a$10$84LE4xKOanLFrbADmREnNujt77C6yz6CSSG3ipfaq/GVm.Crb9ZFm','nguyenvana@gmail.com','Nguyễn Văn A','0923221312','user','/images/default-avatar.png','2025-06-01 22:37:54');
(2,'user2','$2a$10$OEmqdepyoEiSRJG5.kTDG.Q.pOjsF.GBajqzCB1gIlVAMJCSpxqka','tranvanb@gmail.com','Trần Văn B','0923121231','user','/images/default-avatar.png','2025-06-01 22:41:12');
-- Admin account (password: admin123)
(3,'admin1','$2a$10$bWU6PluaOTxad.G5DGu9DeugspX4j53M0j2ZjpRcw9/TIVguBSyBu','levanb@gmail.com','Lê Văn B','0934232432','admin','/images/default-avatar.png','2025-06-01 22:38:57');
-- ===================================
-- 3. BẢNG LISTINGS (Tin đăng)
-- ===================================
INSERT INTO listings (id, user_id, title, description, price, area, address, district_id, property_type, images_urls, status, view_count, created_at, updated_at) VALUES
(1,1,' Cầu Giấy - Cho thuê phòng','Nhà mình có bạn trả phòng về quê nên đang trống phòng tầng 2\r\nDiện tích: 20m2\r\nCó sẵn điều hoà, nóng lạnh, máy giặt. Để xe dưới tầng 1\r\nMỗi tầng chỉ có 1 phòng nên đảm bảo yên tĩnh\r\nĐiện 4k/số\r\nNước: 20k/ khối\r\nGiá:2.xxx\r\nĐịa chỉ \r\nNhà chính chủ\r\nCảm ơn mọi người ạ',2700000.00,20.00,'số 77 Ngõ 102 Nguyễn Đình Hoàn, Cầu Giấy',2,'phong_tro','[\"/uploads/test3.jpg\", \"/uploads/test2.jpg\", \"/uploads/test1.jpg\"]','available',8,'2025-06-01 18:47:48','2025-06-01 22:52:17');
(2,1,'Tìm 1 bạn nữ có nhu cầu ở ghép cùng phòng','Địa chỉ: Phạm Huy Thông (ven hồ Ngọc Khánh), Ba Đình\r\nNhà khá rộng, tầm 70m2, gồm 2 phòng ngủ và 1 phòng khách, đầy đủ nội thất: giường, tủ, bàn, điều hoà, có máy giặt và máy sấy (dưới tầng 1). \r\nMỗi phòng ngủ rộng tầm 20m2. \r\nNhà cách hồ Ngọc Khánh 3 bước chân nên các bạn có thể ra hồ chill mỗi tối và mỗi sáng. Thích nám luônnnn! \r\nGiá cực kì hời cho 1 phòng ở một khu đắt như thế này: 1.700k/ người ở ghép. (3.400k/ phòng). 🥺🥺🥺 \r\nĐiện 4k/ số \r\nNước 100k/ 1 người\r\nMáy giặt 50k/1ng, máy sấy 50k/1ng\r\nĐể xe miễn phí. \r\nAi có nhu cầu ib mình trao đổi chi tiết nha.\r\nZalo: 0974.765.857 Yến',1700000.00,70.00,'Phạm Huy Thông (ven hồ Ngọc Khánh), Ba Đình',1,'o_ghep','[\"/uploads/oghep4.jpg\", \"/uploads/oghep3.jpg\", \"/uploads/oghep2.jpg\", \"/uploads/oghep1.jpg\"]','available',0,'2025-06-01 22:44:04','2025-06-01 22:52:34');
(3,2,'Cho thuê nhà nguyên căn 3 tầng 1 gác lửng','Cho thuê nhà nguyên căn 3 tầng 1 gác lửng, diện tích 25m2 tại địa chỉ số 103A ngõ 165 phố chợ Khâm Thiên.\r\nTầng 1 : Khách , bếp , phòng tắm\r\nGác Lửng giữa tầng 1 và 2\r\nTầng 2 : Ngủ , phòng tắm , ban công nhỏ phơi đồ\r\nTầng 3 : ngủ , phòng thờ , phơi đồ\r\nGiá cho thuê 6,5Tr , điện nước giá dân phù hợp với hộ gia đình. Nhà có sẵn quạt trần  tầng 1, 2 và 3, 2 điều hoà , nóng lạnh , giường tủ tầng 3 Inbox hoặc gọi số : 098 2965 464 chính chủ , miễn môi giới . Thích hợp với hộ gia đình nhỏ.\r\n',6500000.00,25.00,'số 103A ngõ 165 phố chợ Khâm Thiên',3,'nha_nguyen_can','[\"/uploads/nhanguyencan3.jpg\", \"/uploads/nhanguyencan2.jpg\", \"/uploads/nhanguyencan1.jpg\"]','available',2,'2025-06-01 22:47:33','2025-06-01 22:53:45');
(4,2,'Cho thuê CĂN HỘ 1N1K CAO CẤP QUẬN TÂY HỒ','Có căn studio và 1n1k\r\nĐầu ngõ 99 Xuân La, gần Ngoại giao đoàn, Lạc Long Quan, Bưởi, Võ Chí Công,Trích Sài, Thụy Khuê, gần Hồ Tây, khu dân cư đông đúc,...\r\n • Nội thất: Full tất cả đồ tiện nghi y hình, máy giặt riêng, để xe tầng 1 có bảo vệ 24/24\r\n • Cửa phòng khoá vân tay, không chung chủ, PCCC đảm bảo an ninh, thang máy tốc độ cao\r\nLH trực tiếp: 0836416444',4000000.00,40.00,'Đầu ngõ 99 Xuân La, gần Ngoại giao đoàn, Lạc Long Quân, Bưởi, Võ Chí Công,Trích Sài, Thụy Khuê, gần Hồ Tây',8,'can_ho','[\"/uploads/canho2.jpg\", \"/uploads/canho1.jpg\"]','available',1,'2025-06-01 22:50:03','2025-06-01 22:52:58');
(5,2,'Cho thuê phòng','Cho thuê phòng ngõ 119 Lê Thanh Nghị, Hai Bà Trưng\r\nPhòng tầng 2 - vskk\r\nFull nội thất, để xe tầng 1 rộng \r\n- Cách điểm xe buýt 100m, trường ĐH Kinh tế quốc dân 200m, Cách trường xây dựng 300m, Cách đại học bách khoa 350m\r\nLh: 0363326261',3600000.00,20.00,'ngõ 119 Lê Thanh Nghị, Hai Bà Trưng',4,'phong_tro','[\"/uploads/phong2.jpg\", \"/uploads/phong1.jpg\"]','available',0,'2025-06-01 22:51:56','2025-06-01 22:52:31');

-- ===================================
-- 4. BẢNG COMMENTS (Bình luận)
-- ===================================
INSERT INTO comments (id, listing_id, user_id, content, rating, created_at) VALUES
(1,1,1,'Trọ rất tiện nghi và giá rẻ ',5,'2025-06-01 18:57:15');
(2,2,1,'Hay',5,'2025-06-01 19:00:44');
(3,4,2,'Căn hộ đẹp quá',5,'2025-06-01 22:53:08');
(4,3,2,'Nhà đẹp mà giá hơi đắt',3,'2025-06-01 22:53:56');

-- ===================================
-- 5. BẢNG SAVED_LISTINGS (Tin đã lưu)
-- ===================================
INSERT INTO saved_listings (id, user_id, listing_id, saved_at) VALUES
(1,1,1,'2025-06-01 18:56:24');
(2,1,2,'2025-06-01 22:52:19');
(3,2,3,'2025-06-01 22:53:10');
(4,2,4,'2025-06-01 22:53:19');
(5,2,5,'2025-06-01 22:54:00');

-- ===================================
-- 6. BẢNG CONTACTS (Liên hệ)
-- ===================================
INSERT INTO contacts (id, name, email, suject, message, created_at) VALUES (1,'Nguyễn Duy Hưng','duyhung@gmail.com','Thông Tin Người Dùng','Trang web nên cho thêm tính năng đổi mật khẩu','2025-06-01 19:22:29');

INSERT INTO contacts (id, name, email, suject, message, created_at) VALUES (2,'Nguyễn Văn A','nguyenvana@gmail.com','Hình ảnh ','Các hình ảnh rất đẹp mắt, 10 điểm','2025-06-01 22:40:38');
(3,'Trần Văn B','tranvanb@gmail.com','Thiết kế trang web','Trang web khá bắt mắt, nhưng vẫn còn nhiều thiếu sót','2025-06-01 22:41:47');

-- ===================================
-- THÔNG TIN TẠI KHOẢN MẪU
-- ===================================
/*
ADMIN:
- Username: admin1
- Password: admin123


USERS:
- Username: user1 | Password: user123
- Username: user2   | Password: user123  
*/
