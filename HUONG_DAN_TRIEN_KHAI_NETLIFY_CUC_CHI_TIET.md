# HƯỚNG DẪN TRIỂN KHAI LÊN NETLIFY - CỰC CHI TIẾT

Tài liệu này hướng dẫn thật chậm, thật rõ, từng bước một.

---

## PHẦN A - TẠO TÀI KHOẢN NETLIFY

### Bước 1
Tìm trên Google:
`Netlify`

### Bước 2
Đăng ký tài khoản.

Bạn có thể dùng:
- GitHub
- Google
- email

Khuyên dùng đăng nhập bằng GitHub để dễ kết nối repository.

---

## PHẦN B - KẾT NỐI GITHUB VỚI NETLIFY

### Bước 1
Đăng nhập Netlify.

### Bước 2
Bấm:
**Add new project**

### Bước 3
Chọn:
**Import an existing project**

### Bước 4
Chọn:
**GitHub**

### Bước 5
Cho phép Netlify truy cập GitHub nếu hệ thống hỏi.

### Bước 6
Chọn đúng repository của bạn:
`ayunpa-election-webapp`

---

## PHẦN C - KIỂM TRA CẤU HÌNH BUILD

Project này đã có sẵn file:
`netlify.toml`

Bạn chỉ cần kiểm tra lại cho đúng:

- Build command: `npm run build`
- Publish directory: `.next`

Nếu Netlify hiện sẵn các giá trị này thì giữ nguyên.

---

## PHẦN D - KHAI BÁO BIẾN MÔI TRƯỜNG TRÊN NETLIFY

### Bước 1
Trong Netlify, mở project của bạn.

### Bước 2
Vào:
**Site configuration**

### Bước 3
Vào:
**Environment variables**

### Bước 4
Bấm thêm biến mới.

### Bước 5
Tạo biến thứ nhất:
- Tên: `NEXT_PUBLIC_SUPABASE_URL`
- Giá trị: dán Project URL từ Supabase

### Bước 6
Tạo biến thứ hai:
- Tên: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Giá trị: dán anon public key từ Supabase

### Bước 7
Lưu lại.

---

## PHẦN E - DEPLOY WEBSITE

### Bước 1
Bấm nút Deploy.

### Bước 2
Chờ Netlify build xong.

### Bước 3
Nếu deploy thành công, bạn sẽ thấy một đường link dạng:
`https://ten-du-an.netlify.app`

### Bước 4
Bấm vào link đó để mở website.

---

## PHẦN F - KIỂM TRA WEBSITE SAU KHI DEPLOY

### Bước 1
Mở trang chủ.

Kiểm tra:
- có header màu cam không
- có bảng dashboard không
- có cột thời gian cập nhật mới nhất không

### Bước 2
Mở:
`/login`

### Bước 3
Đăng nhập bằng tài khoản admin đã tạo ở Supabase.

### Bước 4
Vào:
`/admin`

### Bước 5
Kiểm tra từng màn hình:
- `/admin`
- `/admin/areas`
- `/admin/progress`
- `/admin/reports`

### Bước 6
Thử nhập một báo cáo tiến độ.

### Bước 7
Quay lại dashboard công khai xem dữ liệu đã đổi chưa.

### Bước 8
Thử xuất Word ở trang báo cáo.

---

## PHẦN G - NẾU DEPLOY BỊ LỖI

### Lỗi 1 - Build failed
Cách xem:
- vào project trên Netlify
- vào tab Deploys
- bấm lần deploy bị lỗi
- xem dòng chữ màu đỏ ở cuối log

### Lỗi 2 - Website mở được nhưng đăng nhập lỗi
Kiểm tra:
- đã tạo user trong Supabase chưa
- đã chạy `03_seed_auth_guide.sql` chưa
- biến môi trường trên Netlify có đúng không

### Lỗi 3 - Website mở được nhưng không lưu dữ liệu
Kiểm tra:
- đã chạy `01_schema.sql` chưa
- đã chạy `02_rls.sql` chưa
- đã chạy `04_profile_trigger.sql` chưa

### Lỗi 4 - Sau khi sửa code, Netlify không cập nhật
Kiểm tra:
- đã `git push` lên GitHub chưa
- Netlify có đang kết nối đúng repo không

---

## PHẦN H - MỖI LẦN CẬP NHẬT SAU NÀY

Khi bạn sửa code trên máy:
1. chạy thử local
2. nếu ổn, dùng lệnh:

```bash
git add .
git commit -m "Cap nhat moi"
git push
```

Sau đó:
- GitHub nhận source mới
- Netlify tự deploy lại

---

## PHẦN I - SAU KHI HOÀN THÀNH

Bạn nên làm ngay:
1. đổi mật khẩu admin mặc định
2. tạo thêm user nhập liệu cho từng khu vực
3. sao lưu thông tin tài khoản
4. sao lưu thông tin Supabase URL và key
5. ghi lại đường link website Netlify
