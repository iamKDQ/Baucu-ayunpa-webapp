# HƯỚNG DẪN TRIỂN KHAI RẤT CHI TIẾT CHO NGƯỜI MỚI

Tài liệu này viết cho người chưa từng làm Netlify, Supabase, Next.js.

## MỤC TIÊU CUỐI CÙNG
Sau khi làm xong, bạn sẽ có:
- 1 webapp chạy trên Netlify
- 1 database và hệ thống đăng nhập chạy trên Supabase
- trang công khai xem dashboard
- trang đăng nhập
- trang quản trị
- trang nhập tiến độ theo giờ
- trang báo cáo đọc dữ liệu thật

---

## PHẦN 1. CẦN CHUẨN BỊ NHỮNG GÌ

### 1. Máy tính
Bạn cần:
- máy tính có Internet
- trình duyệt Chrome hoặc Edge
- quyền cài phần mềm

### 2. Tài khoản cần có
Bạn cần tạo 2 tài khoản:
- 1 tài khoản **GitHub**
- 1 tài khoản **Netlify**
- 1 tài khoản **Supabase**

Khuyên dùng:
- đăng ký bằng cùng một email để dễ nhớ

### 3. Cài phần mềm
Cài các phần mềm sau:

#### Node.js
- vào trang Node.js
- tải bản **LTS**
- cài xong mở Terminal hoặc Command Prompt gõ:

```bash
node -v
npm -v
```

Nếu hiện ra số phiên bản là được.

#### Git
- vào trang Git
- tải bản dành cho Windows hoặc macOS
- cài xong mở Terminal gõ:

```bash
git --version
```

Nếu hiện ra phiên bản là được.

#### VS Code
- cài Visual Studio Code để mở source code

---

## PHẦN 2. GIẢI NÉN BỘ NGUỒN

1. Tải file zip bộ nguồn.
2. Giải nén ra thư mục dễ nhớ, ví dụ:

```text
D:\ayunpa-webapp
```

hoặc

```text
/Users/tenban/ayunpa-webapp
```

3. Mở VS Code.
4. Chọn **File > Open Folder**.
5. Chọn thư mục vừa giải nén.

---

## PHẦN 3. CHẠY THỬ Ở MÁY TÍNH

Mở Terminal trong VS Code và chạy:

```bash
npm install
npm run dev
```

Sau đó mở trình duyệt:
```text
http://localhost:3000
```

Lúc này app có thể chạy giao diện demo.
Nếu chưa cấu hình Supabase, phần đăng nhập thật chưa hoạt động.

---

## PHẦN 4. TẠO SUPABASE PROJECT

### Bước 1. Tạo project
1. Đăng nhập Supabase.
2. Bấm **New project**.
3. Chọn organization.
4. Đặt tên project, ví dụ:

```text
ayunpa-election
```

5. Đặt password database thật dễ lưu lại.
6. Chọn region gần Việt Nam nhất nếu có.
7. Bấm tạo.

Đợi vài phút.

### Bước 2. Lấy thông tin kết nối
Sau khi project tạo xong:
1. Vào **Project Settings**
2. Vào **Data API** hoặc **API**
3. Lấy 2 giá trị:
- Project URL
- anon/public key

Ghi lại 2 thông tin này.

---

## PHẦN 5. KHAI BÁO BIẾN MÔI TRƯỜNG Ở MÁY

Trong thư mục source, tạo file:

```text
.env.local
```

Nội dung:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Thay bằng giá trị thật của bạn.

Sau đó chạy lại:

```bash
npm run dev
```

---

## PHẦN 6. TẠO DATABASE TRONG SUPABASE

### Bước 1. Mở SQL Editor
Trong Supabase:
1. vào menu **SQL Editor**
2. bấm **New query**

### Bước 2. Chạy file schema
Mở file:
```text
supabase/01_schema.sql
```

Copy toàn bộ nội dung.
Dán vào SQL Editor.
Bấm **Run**.

### Bước 3. Chạy file RLS
Mở file:
```text
supabase/02_rls.sql
```

Copy toàn bộ.
Dán vào SQL Editor.
Bấm **Run**.

### Bước 4. Chạy trigger tự tạo profile
Mở file:
```text
supabase/04_profile_trigger.sql
```

Copy toàn bộ.
Chạy trong SQL Editor.

Đến đây database đã có:
- vai trò
- khu vực bỏ phiếu
- bảng người dùng
- bảng phân quyền
- bảng báo cáo tiến độ

---

## PHẦN 7. TẠO TÀI KHOẢN QUẢN TRỊ ĐẦU TIÊN

### Cách đơn giản nhất
1. Trong Supabase vào **Authentication**
2. vào **Users**
3. bấm **Add user**
4. nhập:
   - email: `admin@ayunpa.local`
   - password: `12345678`
5. bấm tạo

### Lấy UUID của user
Bấm vào user vừa tạo và copy trường `id`.

### Gán quyền quản trị
Mở file:
```text
supabase/03_seed_auth_guide.sql
```

Tìm chỗ:
```sql
REPLACE_AUTH_USER_UUID
```

Thay bằng UUID thật vừa copy.

Sau đó chạy file này trong SQL Editor.

Kết quả:
- user có profile
- user được gán quyền `ward_admin`
- có thể vào khu vực quản trị

---

## PHẦN 8. ĐĂNG NHẬP THỬ

Chạy local:

```bash
npm run dev
```

Mở:
```text
http://localhost:3000/login
```

Đăng nhập bằng:
- email: `admin@ayunpa.local`
- password: `12345678`

Sau khi đăng nhập:
- vào `/admin`
- thử vào trang **Nhập tiến độ**
- nhập thử dữ liệu cho một khu vực

---

## PHẦN 9. TẠO GITHUB REPOSITORY

### Nếu bạn chưa biết GitHub
GitHub là nơi lưu source code online để Netlify lấy code tự động.

### Các bước
1. đăng nhập GitHub
2. bấm **New repository**
3. đặt tên, ví dụ:

```text
ayunpa-election-webapp
```

4. chọn **Public** hoặc **Private**
5. bấm **Create repository**

### Đưa code lên GitHub
Mở Terminal tại thư mục dự án và chạy:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TEN_TAI_KHOAN/ayunpa-election-webapp.git
git push -u origin main
```

Thay `TEN_TAI_KHOAN` bằng tài khoản GitHub của bạn.

Nếu Git yêu cầu đăng nhập, đăng nhập theo hướng dẫn GitHub Desktop hoặc token.

---

## PHẦN 10. DEPLOY LÊN NETLIFY

### Bước 1. Kết nối GitHub
1. Đăng nhập Netlify
2. bấm **Add new project**
3. chọn **Import an existing project**
4. chọn **GitHub**
5. cấp quyền cho Netlify đọc repository
6. chọn repo vừa tạo

### Bước 2. Kiểm tra cấu hình build
Project này đã có file `netlify.toml`.
Thông số chính là:
- build command: `npm run build`
- publish directory: `.next`
- Node version: `20`

Netlify hiện hỗ trợ Next.js bằng adapter OpenNext và tự động phát hiện framework Next.js. Cấu hình `next build` và thư mục `.next` là cấu hình gợi ý chuẩn cho dự án Next.js trên Netlify. citeturn935591search0turn935591search6turn935591search12

### Bước 3. Khai báo biến môi trường trên Netlify
Trong Netlify:
1. vào project
2. vào **Site configuration**
3. vào **Environment variables**
4. tạo 2 biến:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Netlify cho phép tạo environment variables bằng giao diện quản trị, CLI, API hoặc file cấu hình; để biến dùng được khi build, scope của biến cần bao gồm phần build. citeturn935591search2turn935591search5turn935591search17

### Bước 4. Deploy
Bấm **Deploy site**.

Đợi build xong.
Nếu thành công, Netlify sẽ cấp cho bạn một domain dạng:
```text
https://ten-site.netlify.app
```

---

## PHẦN 11. KIỂM TRA SAU KHI DEPLOY

Mở website trên Netlify:
1. vào trang chủ
2. kiểm tra dashboard công khai
3. vào `/login`
4. đăng nhập
5. vào `/admin`
6. vào `/admin/progress`
7. nhập thử số liệu
8. vào `/admin/reports`
9. xem dữ liệu vừa nhập

---

## PHẦN 12. NẾU BỊ LỖI THÌ XEM Ở ĐÂU

### 1. Lỗi build trên Netlify
Vào:
- Netlify project
- Deploys
- Chọn lần deploy lỗi
- Xem log đỏ cuối cùng

### 2. Lỗi đăng nhập
Kiểm tra:
- đã tạo user trong Supabase chưa
- đã gán role `ward_admin` chưa
- biến môi trường có đúng chưa

### 3. Lỗi không ghi được dữ liệu
Kiểm tra:
- đã chạy `02_rls.sql` chưa
- đã gán quyền area hay ward_admin chưa
- bảng `progress_reports` đã tồn tại chưa

### 4. Lỗi local không chạy
Xóa thư mục:
```text
node_modules
.next
```

sau đó chạy lại:

```bash
npm install
npm run dev
```

---

## PHẦN 13. QUY TRÌNH CẬP NHẬT SAU NÀY

Mỗi lần sửa code:
```bash
git add .
git commit -m "cap nhat"
git push
```

Netlify sẽ tự deploy lại từ GitHub.

---

## PHẦN 14. VIỆC NÊN LÀM NGAY SAU KHI CHẠY ĐƯỢC

1. đổi mật khẩu admin mặc định
2. tạo thêm user thật cho từng khu vực
3. gán quyền cho từng user
4. kiểm tra nhập liệu thử
5. sao lưu file SQL và thông tin tài khoản
6. cấu hình domain riêng nếu cần

---

## PHẦN 15. GỢI Ý CÁCH LÀM NHANH NHẤT CHO NGƯỜI MỚI

Làm đúng theo thứ tự sau:
1. chạy local trước
2. tạo Supabase
3. chạy SQL
4. tạo admin
5. đăng nhập local
6. đẩy GitHub
7. import vào Netlify
8. thêm biến môi trường trên Netlify
9. deploy
10. kiểm tra lại đăng nhập và nhập dữ liệu

Nếu bạn làm đúng 10 bước này thì thường sẽ chạy được.
