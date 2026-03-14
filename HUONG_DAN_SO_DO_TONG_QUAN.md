# HƯỚNG DẪN SƠ ĐỒ TỔNG QUAN

## Hệ thống này gồm 3 phần

### 1. Source code
Đây là bộ mã nguồn website.

Nó chứa:
- giao diện trang công khai
- trang đăng nhập
- trang quản trị
- trang nhập tiến độ
- trang báo cáo
- chức năng xuất Word

### 2. Supabase
Supabase là nơi lưu:
- tài khoản đăng nhập
- danh sách khu vực bỏ phiếu
- dữ liệu tổng số cử tri
- dữ liệu tiến độ bỏ phiếu
- phân quyền

### 3. Netlify
Netlify là nơi đưa website lên Internet.

Khi người dùng mở website, họ đang xem phần giao diện đã được deploy trên Netlify.

## Sơ đồ dễ hiểu

- Máy tính của bạn: nơi sửa source code
- GitHub: nơi lưu source code online
- Netlify: nơi chạy website
- Supabase: nơi lưu dữ liệu và tài khoản

## Cách hoạt động
1. Bạn viết hoặc sửa source code trên máy.
2. Bạn đưa source code lên GitHub.
3. Netlify lấy source code từ GitHub để build và chạy website.
4. Website kết nối tới Supabase để lấy dữ liệu và kiểm tra đăng nhập.

## Kết luận
Để hệ thống chạy được, bạn cần chuẩn bị đủ:
- source code
- Supabase
- GitHub
- Netlify
