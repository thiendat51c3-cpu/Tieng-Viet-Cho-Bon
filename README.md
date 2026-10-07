# 🐻 Bé Học Chữ Số

Ứng dụng web giúp bé mầm non (3–6 tuổi) học **số, chữ cái, màu sắc và hình khối** qua 12 trò chơi ngắn, có giọng đọc tiếng Việt. Không cần cài đặt, không có quảng cáo, không thu thập dữ liệu.

## Tính năng

| Khu vực | Nội dung |
|---|---|
| **Đảo Số** | Đếm quả · Bóng bay số · Toa tàu số |
| **Đảo Chữ** | Nghe chọn chữ · Chữ đầu tiên · Chuột thò đầu |
| **Đảo Màu và Hình** | Chọn màu · Tô màu · Hình khối |
| **Đảo Con Vật** | Con gì đây · To và nhỏ |
| **Đảo Trí Nhớ** | Lật thẻ |
| **Bảng học** | Các số 1–10 · Bảng chữ cái · Bảng màu sắc · Bảng các hình |

- Mỗi lượt chơi gồm 5 câu; bé nhận 1–3 ⭐ tùy số lần sai, cứ 6 sao được một sticker mới.
- **Góc phụ huynh** (có phép tính cộng để vào): xem tiến độ, giới hạn thời gian chơi mỗi ngày, chọn giọng và tốc độ đọc, chỉnh cách đọc từng chữ cái, xóa tiến độ.
- Tiến độ lưu trong `localStorage` của trình duyệt trên máy, không gửi đi đâu.
- Chạy offline sau lần mở đầu tiên (PWA), có thể "Thêm vào màn hình chính".

## Chạy thử

Mở trực tiếp `index.html`, hoặc chạy server tĩnh (cần để dùng chế độ offline/PWA):

```bash
python3 -m http.server 8000   # rồi mở http://localhost:8000
```

## Đưa lên GitHub Pages

1. Đẩy mã nguồn lên GitHub.
2. Vào **Settings → Pages**, chọn nhánh và thư mục chứa `index.html`.
3. Mở đường dẫn do GitHub cấp, trên điện thoại chọn "Thêm vào màn hình chính".

## Giọng đọc tiếng Việt

App dùng Web Speech API của trình duyệt, nên cần máy có giọng tiếng Việt:

- **Android/Samsung:** Cài đặt → Quản lý chung → Chuyển văn bản thành giọng nói → chọn bộ máy Google → tải dữ liệu Tiếng Việt. Nên mở bằng Chrome.
- **iPhone:** Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt → tải bản Nâng cao.

Sau khi tải, đóng hẳn trình duyệt rồi mở lại. Trong Góc phụ huynh có phần "Âm thanh và giọng đọc" để kiểm tra và chọn giọng.

## Cấu trúc thư mục

```
.
├── index.html            Khung trang
├── css/style.css         Giao diện
├── js/
│   ├── data.js           Dữ liệu: số, chữ cái, từ vựng, màu, hình, sticker, tranh tô màu
│   └── app.js            Logic: màn hình, trò chơi, giọng đọc, tiến độ, góc phụ huynh
├── assets/               Biểu tượng ứng dụng (SVG, PNG)
├── manifest.webmanifest  Thông tin PWA
└── sw.js                 Service worker (offline)
```

Muốn thêm nội dung (từ vựng, con vật, sticker, tranh tô màu), sửa `js/data.js`. Khi đổi tệp, tăng số phiên bản `CACHE` trong `sw.js` để thiết bị cập nhật bản mới.

## Phát triển

Mã nguồn thuần HTML/CSS/JavaScript, không cần build. Định dạng bằng Prettier theo `.prettierrc.json`:

```bash
npx prettier --write "css/*.css" "js/*.js" "*.html"
```

Ghi chú: phông Baloo 2 và Nunito được nạp từ Google Fonts khi có mạng; khi offline sẽ dùng phông hệ thống.
