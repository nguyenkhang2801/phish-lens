# Chrome Web Store – checklist (Phish Lens)

## Mô tả ngắn (gợi ý)

**VI:** Cảnh báo khi địa chỉ người gửi trên Gmail có dấu hiệu giả mạo thương hiệu. Phân tích hoàn toàn trên máy, không gửi dữ liệu ra ngoài.

**EN:** Warns when a Gmail sender address may impersonate a brand. Analysis runs entirely on your device.

## Danh mục

- Productivity hoặc Privacy & Security

## Privacy practices (Chrome)

- **Không thu thập dữ liệu người dùng** (single purpose, local-only).
- **Privacy policy URL:** host file `PRIVACY.md` (GitHub Pages hoặc repo raw link).

## Quyền – giải thích cho reviewer

1. **storage** – Lưu bật/tắt, độ nhạy, ngôn ngữ, whitelist domain.
2. **Host permission `https://mail.google.com/*`** – Content script chỉ chạy trên Gmail để đọc địa chỉ người gửi thư đang mở.

Không dùng `<all_urls>`, không `tabs`/`scripting` trong bản phát hành (`pnpm build`).

## Ảnh chụp màn hình (1280×800)

Chụp khi đã đăng nhập Gmail:

1. Email domain giả → banner cảnh báo hiển thị.
2. Email domain chính thức → không có banner.
3. Popup cài đặt (bật/tắt, độ nhạy, whitelist).

## Đóng gói

```bash
pnpm build
pnpm zip
```

Upload file zip từ `.output/` trong Developer Dashboard.

## Phí developer

Kiểm tra phí đăng ký một lần trên trang chính thức Chrome Web Store (thường khoảng 5 USD).