
# Xuất báo cáo Word

Sau khi chạy hệ thống:

Truy cập:
/admin/reports

Hoặc gọi API trực tiếp:

/api/reports/docx

Hệ thống sẽ tạo file Word chứa:

- tổng số cử tri
- tổng số đã bỏ phiếu
- tỷ lệ đi bầu
- bảng chi tiết 11 khu vực

File tải xuống:

bao-cao-bau-cu-ayunpa.docx

## Cài thêm thư viện

Trong project chạy:

npm install docx

## Tùy chỉnh mẫu báo cáo

Bạn có thể sửa file:

lib/docx-report.ts

để:
- thêm logo
- thêm tiêu đề UBND
- thêm chữ ký
