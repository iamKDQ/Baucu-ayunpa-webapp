# HƯỚNG DẪN TẠO SUPABASE - CỰC CHI TIẾT

Tài liệu này giúp bạn tạo database và tài khoản đăng nhập.

---

## PHẦN A - TẠO TÀI KHOẢN SUPABASE

### Bước 1
Mở trình duyệt.

### Bước 2
Tìm trên Google:
`Supabase`

### Bước 3
Bấm vào trang chủ Supabase.

### Bước 4
Chọn đăng ký.

Bạn có thể đăng ký bằng:
- email
- GitHub
- Google

### Bước 5
Đăng nhập vào Supabase.

---

## PHẦN B - TẠO PROJECT MỚI

### Bước 1
Sau khi đăng nhập, bấm **New project**.

### Bước 2
Chọn tổ chức hoặc workspace nếu hệ thống yêu cầu.

### Bước 3
Điền tên project, ví dụ:
`ayunpa-election`

### Bước 4
Điền mật khẩu database.

**Rất quan trọng:**
- ghi lại mật khẩu này vào sổ tay hoặc file riêng
- không được quên

### Bước 5
Chọn khu vực đặt máy chủ.

### Bước 6
Bấm tạo project.

### Bước 7
Chờ vài phút.

---

## PHẦN C - LẤY THÔNG TIN KẾT NỐI

### Bước 1
Trong Supabase, vào phần:
**Project Settings**

### Bước 2
Vào mục:
**API**

### Bước 3
Copy 2 giá trị:
- Project URL
- anon public key

### Bước 4
Dán vào file tạm để lưu lại.

Ví dụ:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcxyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
```

---

## PHẦN D - KHAI BÁO BIẾN MÔI TRƯỜNG TRÊN MÁY

### Bước 1
Trong thư mục project, tạo file:
`.env.local`

### Bước 2
Dán nội dung sau:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Bước 3
Thay bằng giá trị thật của bạn.

### Bước 4
Lưu file.

---

## PHẦN E - CHẠY SQL TẠO BẢNG

### Bước 1
Trong Supabase, vào:
**SQL Editor**

### Bước 2
Bấm:
**New query**

### Bước 3
Mở file trong source code:
`supabase/01_schema.sql`

### Bước 4
Copy toàn bộ nội dung file này.

### Bước 5
Dán vào SQL Editor.

### Bước 6
Bấm **Run**.

---

### Bước 7
Làm tương tự với file:
`supabase/02_rls.sql`

---

### Bước 8
Làm tương tự với file:
`supabase/04_profile_trigger.sql`

---

### Bước 9
Nếu muốn tạo gợi ý user nhập liệu theo khu vực sau này, bạn có thể dùng thêm:
`supabase/05_create_demo_users.sql`

---

## PHẦN F - TẠO USER QUẢN TRỊ ĐẦU TIÊN

### Bước 1
Trong Supabase, vào:
**Authentication**

### Bước 2
Vào:
**Users**

### Bước 3
Bấm:
**Add user**

### Bước 4
Nhập:
- Email: `admin@ayunpa.local`
- Password: `12345678`

### Bước 5
Bấm tạo.

---

## PHẦN G - GÁN QUYỀN QUẢN TRỊ CHO USER

### Bước 1
Bấm vào user vừa tạo.

### Bước 2
Copy mã `UUID` của user.

### Bước 3
Mở file:
`supabase/03_seed_auth_guide.sql`

### Bước 4
Tìm chữ:
`REPLACE_AUTH_USER_UUID`

### Bước 5
Thay toàn bộ bằng UUID vừa copy.

### Bước 6
Copy toàn bộ nội dung file này.

### Bước 7
Quay lại Supabase > SQL Editor.

### Bước 8
Tạo query mới, dán nội dung vào, rồi bấm **Run**.

---

## PHẦN H - KIỂM TRA ĐĂNG NHẬP

### Bước 1
Quay lại máy tính.

### Bước 2
Chạy:

```bash
npm run dev
```

### Bước 3
Mở:
`http://localhost:3000/login`

### Bước 4
Đăng nhập bằng:
- email: `admin@ayunpa.local`
- password: `12345678`

Nếu vào được `/admin`, bạn đã cấu hình thành công.
