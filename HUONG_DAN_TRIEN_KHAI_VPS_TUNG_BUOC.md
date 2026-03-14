# HƯỚNG DẪN TRIỂN KHAI BẰNG VPS - TỪNG BƯỚC

Tài liệu này dành cho trường hợp bạn muốn dùng VPS thay vì Netlify.

VPS khó hơn Netlify.
Nếu bạn mới bắt đầu, hãy ưu tiên Netlify trước.

---

## PHẦN A - BẠN CẦN GÌ

Bạn cần:
- 1 VPS Linux
- 1 domain nếu muốn dùng tên miền riêng
- quyền SSH vào VPS
- biết hoặc nhờ người cài Nginx

---

## PHẦN B - CÀI CÁC PHẦN CƠ BẢN TRÊN VPS

Trên VPS, cần cài:
- Node.js
- Git
- PM2
- Nginx

Ví dụ lệnh cơ bản:

```bash
sudo apt update
sudo apt install -y git nginx
```

Sau đó cài Node.js theo hướng dẫn NodeSource hoặc bản LTS.

Cài PM2:
```bash
npm install -g pm2
```

---

## PHẦN C - ĐƯA SOURCE CODE LÊN VPS

Có 2 cách:
1. git clone từ GitHub
2. upload file zip rồi giải nén

Cách dễ hơn:
```bash
git clone https://github.com/TEN_TAI_KHOAN_GITHUB/ayunpa-election-webapp.git
cd ayunpa-election-webapp
npm install
npm run build
```

---

## PHẦN D - TẠO FILE .env.local TRÊN VPS

Tạo file:
`.env.local`

Điền:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## PHẦN E - CHẠY APP BẰNG PM2

```bash
pm2 start npm --name ayunpa-webapp -- start
pm2 save
```

Nếu app cần chạy cổng cụ thể, cấu hình theo project và Nginx reverse proxy.

---

## PHẦN F - CẤU HÌNH NGINX

Bạn cần tạo reverse proxy từ domain đến cổng app Node.js.

Nếu bạn chưa từng làm việc này, hãy nhờ người có kinh nghiệm Linux hỗ trợ.

---

## PHẦN G - KHI NÀO NÊN DÙNG VPS

Nên dùng VPS khi:
- bạn muốn toàn quyền kiểm soát hệ thống
- muốn tự quản lý Nginx, domain, SSL, backup
- muốn thêm backend riêng mạnh hơn
- có người kỹ thuật hỗ trợ vận hành

Nếu không có người kỹ thuật, Netlify thuận tiện hơn nhiều.
