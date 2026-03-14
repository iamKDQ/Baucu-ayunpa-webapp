# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY THỬ TRÊN MÁY TÍNH - CỰC CHI TIẾT

Tài liệu này dành cho người chưa từng làm việc với source code.

---

## PHẦN A - CHUẨN BỊ MÁY TÍNH

### 1. Bạn cần gì
Bạn cần:
- máy tính có Internet
- quyền cài phần mềm
- trình duyệt Chrome hoặc Edge
- tài khoản email để đăng ký dịch vụ

### 2. Cần cài 3 phần mềm
Bạn cần cài:
- Node.js
- Git
- Visual Studio Code

---

## PHẦN B - CÀI NODE.JS

### Bước 1
Mở trình duyệt.

### Bước 2
Tìm trên Google:
`Node.js LTS download`

### Bước 3
Tải bản **LTS**.

### Bước 4
Bấm file tải về để cài.

### Bước 5
Cứ bấm **Next** cho đến khi xong.

### Bước 6
Kiểm tra đã cài thành công chưa:

#### Trên Windows
- bấm nút Start
- gõ `cmd`
- mở **Command Prompt**

#### Trên macOS
- mở **Terminal**

Sau đó gõ:

```bash
node -v
npm -v
```

Nếu hiện ra số phiên bản, nghĩa là cài thành công.

---

## PHẦN C - CÀI GIT

### Bước 1
Tìm trên Google:
`Download Git`

### Bước 2
Tải bản phù hợp với máy của bạn.

### Bước 3
Cài đặt bằng cách bấm Next liên tục.

### Bước 4
Kiểm tra:

```bash
git --version
```

Nếu hiện số phiên bản là được.

---

## PHẦN D - CÀI VISUAL STUDIO CODE

### Bước 1
Tìm trên Google:
`Download Visual Studio Code`

### Bước 2
Tải và cài.

### Bước 3
Mở VS Code.

---

## PHẦN E - GIẢI NÉN SOURCE CODE

### Bước 1
Tải file zip của project.

### Bước 2
Chuột phải vào file zip.

### Bước 3
Chọn:
- **Extract Here**
hoặc
- **Extract to...**

### Bước 4
Đặt tên thư mục dễ nhớ, ví dụ:
`D:\ayunpa-webapp`
hoặc
`Desktop\ayunpa-webapp`

### Bước 5
Mở VS Code.

### Bước 6
Chọn:
**File > Open Folder**

### Bước 7
Chọn thư mục vừa giải nén.

---

## PHẦN F - CHẠY APP TRÊN MÁY

### Bước 1
Trong VS Code, mở menu:
**Terminal > New Terminal**

### Bước 2
Gõ lệnh:

```bash
npm install
```

Ý nghĩa:
- máy tính sẽ tải toàn bộ thư viện cần thiết cho project
- lần đầu có thể mất vài phút

### Bước 3
Sau khi xong, gõ:

```bash
npm run dev
```

### Bước 4
Mở trình duyệt.

### Bước 5
Mở địa chỉ:

```text
http://localhost:3000
```

Nếu thấy giao diện website hiện ra, nghĩa là app chạy được.

---

## PHẦN G - NẾU BỊ LỖI

### Lỗi 1: `node is not recognized`
Nguyên nhân:
- chưa cài Node.js
- hoặc cài xong chưa khởi động lại máy

Cách xử lý:
- cài lại Node.js
- khởi động lại máy
- chạy lại lệnh

### Lỗi 2: `npm install` rất lâu
Nguyên nhân:
- Internet chậm

Cách xử lý:
- chờ thêm
- đổi mạng tốt hơn

### Lỗi 3: không mở được localhost:3000
Kiểm tra:
- terminal có đang chạy `npm run dev` không
- có dòng thông báo `ready` không

### Lỗi 4: giao diện mở được nhưng đăng nhập chưa hoạt động
Điều này là bình thường nếu bạn chưa cấu hình Supabase.

Bạn phải làm tiếp tài liệu:
`HUONG_DAN_TAO_SUPABASE_CUC_CHI_TIET.md`
