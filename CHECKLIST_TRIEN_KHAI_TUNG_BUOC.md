# CHECKLIST TRIỂN KHAI TỪNG BƯỚC

## Giai đoạn 1 - Chuẩn bị
- [ ] Có máy tính
- [ ] Có Internet ổn định
- [ ] Đã cài Node.js
- [ ] Đã cài Git
- [ ] Đã cài VS Code
- [ ] Có tài khoản GitHub
- [ ] Có tài khoản Netlify
- [ ] Có tài khoản Supabase

## Giai đoạn 2 - Chạy local
- [ ] Đã giải nén source code
- [ ] Đã mở project bằng VS Code
- [ ] Đã chạy `npm install`
- [ ] Đã chạy `npm run dev`
- [ ] Đã mở được `http://localhost:3000`

## Giai đoạn 3 - Cấu hình Supabase
- [ ] Đã tạo project Supabase
- [ ] Đã lấy Project URL
- [ ] Đã lấy anon key
- [ ] Đã tạo `.env.local`
- [ ] Đã chạy `supabase/01_schema.sql`
- [ ] Đã chạy `supabase/02_rls.sql`
- [ ] Đã chạy `supabase/04_profile_trigger.sql`
- [ ] Đã tạo user admin
- [ ] Đã chạy `supabase/03_seed_auth_guide.sql`

## Giai đoạn 4 - Kiểm tra local
- [ ] Đăng nhập được `/login`
- [ ] Mở được `/admin`
- [ ] Mở được `/admin/areas`
- [ ] Mở được `/admin/progress`
- [ ] Mở được `/admin/reports`
- [ ] Xuất được Word
- [ ] Dashboard có cột cập nhật mới nhất

## Giai đoạn 5 - Đưa code lên GitHub
- [ ] Đã tạo repository
- [ ] Đã `git init`
- [ ] Đã `git add .`
- [ ] Đã `git commit`
- [ ] Đã `git push`

## Giai đoạn 6 - Deploy Netlify
- [ ] Đã import repo vào Netlify
- [ ] Đã khai báo `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Đã khai báo `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Đã deploy thành công
- [ ] Đã mở website thật

## Giai đoạn 7 - Kiểm tra sau triển khai
- [ ] Trang chủ hoạt động
- [ ] Dashboard có dữ liệu
- [ ] Đăng nhập thành công
- [ ] Nhập tiến độ thành công
- [ ] Báo cáo hoạt động
- [ ] Word tải xuống thành công
