# HƯỚNG DẪN TRIỂN KHAI TỪ ĐẦU ĐẾN CUỐI
## Dành cho người chưa biết gì về công nghệ thông tin

Tên hệ thống:
**Bầu cử ĐBQH và HĐND các cấp - Phường Ayun Pa**

Mục tiêu của tài liệu này:
- giúp bạn chạy hệ thống trên máy tính của mình
- tạo cơ sở dữ liệu Supabase
- tạo tài khoản quản trị đầu tiên
- chạy thử đăng nhập
- tạo tài khoản người nhập liệu
- nhập tiến độ theo khu vực bỏ phiếu
- xem báo cáo
- xuất Word, Excel
- đưa website lên Internet bằng Netlify

---

## PHẦN 1. BẠN CẦN CHUẨN BỊ NHỮNG GÌ

Bạn cần có:
- 1 máy tính có Internet
- 1 tài khoản GitHub
- 1 tài khoản Supabase
- 1 tài khoản Netlify
- 1 phần mềm mở mã nguồn là **Visual Studio Code**
- 1 phần mềm **Node.js**
- 1 phần mềm **Git**

---

## PHẦN 2. CÀI PHẦN MỀM

### 2.1 Cài Node.js
1. Mở Google.
2. Tìm: `Node.js LTS`
3. Tải bản **LTS**.
4. Cài đặt, cứ bấm **Next** cho đến khi xong.
5. Mở Terminal hoặc Command Prompt, gõ:

```bash
node -v
npm -v
```

Nếu hiện ra số phiên bản là thành công.

### 2.2 Cài Git
1. Tìm Google: `Download Git`
2. Tải về và cài.
3. Kiểm tra:

```bash
git --version
```

### 2.3 Cài Visual Studio Code
1. Tìm Google: `Download Visual Studio Code`
2. Tải về và cài.
3. Mở VS Code.

---

## PHẦN 3. GIẢI NÉN MÃ NGUỒN

1. Tải file zip của project.
2. Chuột phải vào file zip.
3. Chọn **Extract** hoặc **Giải nén**.
4. Đặt thư mục dễ nhớ, ví dụ:

```text
D:\ayunpa-webapp
```

5. Mở VS Code.
6. Chọn **File > Open Folder**
7. Chọn đúng thư mục vừa giải nén.

---

## PHẦN 4. MỞ TERMINAL TRONG VS CODE

Nếu không thấy Terminal:
- bấm **Ctrl + `**
hoặc
- vào menu **Terminal > New Terminal**

Sau khi mở, bạn sẽ thấy dấu nhắc lệnh ở dưới cùng.

---

## PHẦN 5. CHẠY THỬ TRÊN MÁY TÍNH

Trong Terminal, gõ:

```bash
npm install
npm run dev
```

Sau đó mở trình duyệt và vào:

```text
http://localhost:3000
```

Nếu thấy giao diện hiện ra là đúng.

---

## PHẦN 6. TẠO SUPABASE

### 6.1 Tạo tài khoản và project
1. Vào Supabase.
2. Đăng ký / đăng nhập.
3. Bấm **New project**
4. Đặt tên project, ví dụ `ayunpa-election`
5. Đặt mật khẩu database và lưu lại
6. Chờ tạo xong

### 6.2 Lấy thông tin kết nối
Trong giao diện Supabase mới:
1. Vào **Project Settings**
2. Vào **Data API** để lấy `Project URL`
3. Vào **API Keys** để lấy:
   - `Publishable key` dùng làm `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `Secret key` hoặc `service_role` dùng làm `SUPABASE_SERVICE_ROLE_KEY`

### 6.3 Tạo file `.env.local`
Trong thư mục gốc project, tạo file:

```text
.env.local
```

Nội dung:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Lưu lại.

---

## PHẦN 7. CHẠY SQL TẠO CƠ SỞ DỮ LIỆU

Trong Supabase:
1. Vào **SQL Editor**
2. Bấm **New**
3. Mỗi file SQL bên dưới chạy trong **một query mới riêng**

Thứ tự chạy:

### 7.1 Chạy file `supabase/01_schema.sql`
- mở file trong VS Code
- copy toàn bộ
- dán vào SQL Editor
- bấm **Run**

### 7.2 Chạy file `supabase/02_rls.sql`
Làm tương tự như trên.

### 7.3 Chạy file `supabase/04_profile_trigger.sql`
Làm tương tự như trên.

Lưu ý:
- file `06_neighborhood_permissions.sql` của các bản cũ theo phân quyền tổ dân phố **không cần dùng** cho phiên bản hiện tại.

---

## PHẦN 8. TẠO TÀI KHOẢN QUẢN TRỊ ĐẦU TIÊN

### 8.1 Tạo user trong Authentication
1. Vào **Authentication**
2. Vào **Users**
3. Bấm **Add user**
4. Điền:
   - Email: `admin@ayunpa.local`
   - Password: `12345678`
5. Bấm tạo

### 8.2 Lấy UUID của user
1. Bấm vào user vừa tạo
2. Tìm dòng `User ID`
3. Copy chuỗi UUID, ví dụ:

```text
12345678-1234-1234-1234-123456789abc
```

### 8.3 Gán quyền admin
Mở file:

```text
supabase/03_seed_auth_guide.sql
```

Tìm tất cả chỗ:

```text
REPLACE_AUTH_USER_UUID
```

Thay bằng UUID thật bạn vừa copy.

Sau đó:
- copy toàn bộ file
- vào SQL Editor
- bấm **New**
- dán vào
- bấm **Run**

---

## PHẦN 9. CHẠY LẠI WEBSITE SAU KHI CÓ SUPABASE

Quay lại VS Code, trong Terminal chạy:

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

---

## PHẦN 10. CÁC CHỨC NĂNG CHÍNH CỦA HỆ THỐNG

### 10.1 Trang chủ công khai
Địa chỉ:
```text
/
```

Hiển thị:
- tổng số cử tri toàn phường
- tổng số khu vực bỏ phiếu
- số cử tri đã bỏ phiếu
- tỷ lệ toàn phường
- số khu vực đã báo cáo / chưa báo cáo
- biểu đồ thống kê màu xanh
- bảng chi tiết theo khu vực
- thời gian cập nhật mới nhất

### 10.2 Trang thống kê khu vực chưa báo cáo
Địa chỉ:
```text
/missing-reports
```

Trang này hiển thị:
- khu vực nào chưa báo cáo ở các mốc:
  - 8h
  - 10h30
  - 14h
  - 18h
  - 21h

### 10.3 Khu vực quản trị
Địa chỉ:
```text
/admin
```

Nếu chưa đăng nhập mà bấm vào, hệ thống sẽ hiện:
**Bạn cần đăng nhập để vào khu vực quản trị**

### 10.4 Người dùng
Địa chỉ:
```text
/admin/users
```

Admin có thể:
- tạo tài khoản
- gán vai trò
- gán khu vực bỏ phiếu

### 10.5 Nhập tiến độ
Địa chỉ:
```text
/admin/progress
```

Người được phân quyền theo khu vực có thể nhập:
- tổng số cử tri của khu vực
- số lượng cử tri đi bỏ phiếu hiện tại
- mốc giờ báo cáo:
  - 8h
  - 10h30
  - 14h
  - 18h
  - 21h



### 10.7 Reset dữ liệu chạy thử
Tại trang:
```text
/admin
```

Tài khoản admin có 2 lựa chọn:

- **Reset tiến độ bỏ phiếu**
  - xóa toàn bộ báo cáo tiến độ đã nhập
  - giữ nguyên tổng số cử tri của 11 khu vực

- **Reset toàn bộ dữ liệu thử nghiệm**
  - xóa toàn bộ báo cáo tiến độ
  - đưa tổng số cử tri của 11 khu vực về 0
  - dùng khi muốn làm sạch hệ thống để bắt đầu vận hành chính thức

### 10.6 Báo cáo
Địa chỉ:
```text
/admin/reports
```

Người có quyền xem báo cáo có thể:
- xem tổng hợp
- xuất Word
- xuất Excel

---

## PHẦN 11. CÁCH TẠO TÀI KHOẢN NGƯỜI NHẬP LIỆU

1. Đăng nhập tài khoản admin
2. Vào **Người dùng**
3. Nhập:
   - họ tên
   - điện thoại
   - email
   - mật khẩu
4. Chọn vai trò:
   - `Quản trị phường`
   - `Nhập liệu theo khu vực`
   - `Chỉ xem báo cáo`
5. Nếu chọn `Nhập liệu theo khu vực`, phải tick ít nhất 1 khu vực bỏ phiếu
6. Bấm **Tạo tài khoản**

Người nhập liệu khi đăng nhập chỉ thấy các khu vực mình được giao.

---

## PHẦN 12. CÁCH NHẬP TIẾN ĐỘ THỰC TẾ

1. Đăng nhập bằng tài khoản được giao quyền
2. Vào `Nhập tiến độ`
3. Chọn khu vực được phân quyền
4. Chọn ngày báo cáo
5. Chọn mốc giờ
6. Nhập:
   - tổng số cử tri khu vực
   - số cử tri đã bỏ phiếu hiện tại
7. Bấm **Lưu báo cáo**

Sau khi lưu:
- dashboard công khai sẽ cập nhật tổng hợp
- trang báo cáo sẽ cập nhật
- trang khu vực chưa báo cáo sẽ giảm số lượng thiếu ở mốc đó

---

## PHẦN 13. XUẤT BÁO CÁO

### Word
Vào:
```text
/admin/reports
```
Bấm:
```text
Xuất Word (.docx)
```

### Excel
Vào:
```text
/admin/reports
```
Bấm:
```text
Xuất Excel (.xlsx)
```

---

## PHẦN 14. ĐƯA CODE LÊN GITHUB

### 14.1 Tạo repository
1. Đăng nhập GitHub
2. Bấm **New repository**
3. Đặt tên, ví dụ:
```text
ayunpa-election-webapp
```

### 14.2 Đẩy code lên
Trong Terminal của VS Code, chạy:

```bash
git init
git add .
git commit -m "Khoi tao he thong bau cu Ayun Pa"
git branch -M main
git remote add origin https://github.com/TEN_TAI_KHOAN/ayunpa-election-webapp.git
git push -u origin main
```

Thay `TEN_TAI_KHOAN` bằng tên thật của bạn trên GitHub.

---

## PHẦN 15. TRIỂN KHAI LÊN NETLIFY

### 15.1 Kết nối GitHub
1. Đăng nhập Netlify
2. Bấm **Add new project**
3. Chọn **Import an existing project**
4. Chọn GitHub
5. Chọn repo vừa tạo

### 15.2 Cấu hình môi trường trên Netlify
Vào:
- **Site configuration**
- **Environment variables**

Tạo 3 biến:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 15.3 Deploy
Bấm Deploy.

Sau khi xong, bạn sẽ có đường link dạng:
```text
https://ten-site.netlify.app
```

---

## PHẦN 16. NẾU TẮT MÁY RỒI MỞ LẠI

Bạn chỉ cần:
1. Mở VS Code
2. Mở lại thư mục project
3. Mở Terminal
4. Chạy:

```bash
npm run dev
```

5. Mở:
```text
http://localhost:3000
```

---

## PHẦN 17. NHỮNG FILE QUAN TRỌNG

- `.env.local`
- `supabase/01_schema.sql`
- `supabase/02_rls.sql`
- `supabase/03_seed_auth_guide.sql`
- `supabase/04_profile_trigger.sql`
- `app/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/progress/page.tsx`
- `app/admin/reports/page.tsx`
- `app/missing-reports/page.tsx`
- `components/Footer.tsx`

---

## PHẦN 18. CÁC LỖI HAY GẶP

### Lỗi không thấy terminal
- bấm `Ctrl + \``

### Lỗi không tìm thấy `zod`
Chạy:
```bash
npm install zod
```

### Lỗi người dùng / nhập tiến độ
Nguyên nhân thường là bạn đang trộn file cũ và file mới.
Cách xử lý:
- dùng nguyên bộ source trong gói này
- không copy lẫn giữa các bản cũ theo tổ dân phố và bản mới theo khu vực bỏ phiếu

### Lỗi UUID
Bạn phải dùng `User ID` thật trong Supabase Authentication, không dùng tên project.

---

## PHẦN 19. CHÂN TRANG
Bản hiện tại đã có chân trang:

**Bản quyền thuộc Ủy ban bầu cử phường Ayun Pa**

---

## PHẦN 20. KHUYẾN NGHỊ CÁCH LÀM AN TOÀN NHẤT

Làm đúng theo thứ tự này:
1. Giải nén source
2. `npm install`
3. chạy local
4. tạo Supabase
5. chạy SQL
6. tạo admin
7. đăng nhập local
8. tạo tài khoản nhập liệu
9. test nhập tiến độ
10. test báo cáo
11. đưa lên GitHub
12. deploy Netlify

Nếu bạn làm đúng đủ 12 bước này thì hệ thống thường sẽ chạy được.
