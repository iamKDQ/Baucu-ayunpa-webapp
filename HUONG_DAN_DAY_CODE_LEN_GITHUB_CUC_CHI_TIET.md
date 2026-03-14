# HƯỚNG DẪN ĐƯA SOURCE CODE LÊN GITHUB - CỰC CHI TIẾT

Tài liệu này giúp bạn đưa project lên GitHub để Netlify lấy code.

---

## PHẦN A - TẠO TÀI KHOẢN GITHUB

### Bước 1
Tìm trên Google:
`GitHub`

### Bước 2
Đăng ký tài khoản.

### Bước 3
Xác nhận email nếu hệ thống yêu cầu.

---

## PHẦN B - TẠO REPOSITORY

### Bước 1
Đăng nhập GitHub.

### Bước 2
Bấm nút:
**New repository**

### Bước 3
Đặt tên repository, ví dụ:
`ayunpa-election-webapp`

### Bước 4
Chọn:
- Public: ai có link cũng xem được source
hoặc
- Private: chỉ người được cấp quyền mới xem được source

### Bước 5
Bấm:
**Create repository**

---

## PHẦN C - ĐƯA CODE LÊN GITHUB

### Bước 1
Mở Terminal trong VS Code tại thư mục project.

### Bước 2
Gõ từng lệnh sau, theo đúng thứ tự:

```bash
git init
git add .
git commit -m "Lan dau day source code len GitHub"
git branch -M main
git remote add origin https://github.com/TEN_TAI_KHOAN_GITHUB/ayunpa-election-webapp.git
git push -u origin main
```

### Bước 3
Ở dòng có `TEN_TAI_KHOAN_GITHUB`, thay bằng tên tài khoản GitHub thật của bạn.

Ví dụ:
```bash
git remote add origin https://github.com/nguyenvana/ayunpa-election-webapp.git
```

### Bước 4
Nếu Git yêu cầu đăng nhập:
- đăng nhập bằng trình duyệt
- hoặc dùng token theo hướng dẫn của GitHub

### Bước 5
Quay lại trang GitHub và nhấn F5.

Nếu thấy source code xuất hiện nghĩa là thành công.

---

## PHẦN D - MỖI LẦN SỬA CODE SAU NÀY PHẢI LÀM GÌ

Sau khi sửa code, bạn chỉ cần:

```bash
git add .
git commit -m "Mo ta noi dung sua"
git push
```

Ví dụ:
```bash
git add .
git commit -m "Cap nhat giao dien dashboard"
git push
```

GitHub sẽ lưu phiên bản mới.
Netlify cũng sẽ tự deploy lại nếu project đã kết nối.
