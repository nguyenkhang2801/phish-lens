# Phish Lens

Chrome extension (Manifest V3, WXT) cảnh báo người gửi email giả mạo thương hiệu trên **Gmail**. Phân tích chạy cục bộ, không gửi dữ liệu ra ngoài.

## Yêu cầu

- Node 20+
- `pnpm` (hoặc dùng `./node_modules/.bin/pnpm` sau khi `npm install pnpm`)

## Lệnh

```bash
pnpm install
pnpm test
pnpm dev          # phát triển + reload
pnpm build        # .output/chrome-mv3
pnpm zip          # gói upload Chrome Web Store
```

Load unpacked: chọn thư mục `.output/chrome-mv3` trong `chrome://extensions`.

## Dev + Gmail (tránh lỗi Google chặn đăng nhập)

Google thường báo *“Trình duyệt này có thể không an toàn”* trên **cửa sổ Chrome mà `pnpm dev` tự mở** (profile tạm / cờ debug). **Đừng đăng nhập Gmail ở cửa sổ đó.**

Cách làm đúng:

1. Để `pnpm dev` chạy trong terminal (chỉ build + HMR; `runner.disabled` trong `wxt.config.ts`).
2. Mở **Chrome hàng ngày** (profile bạn vẫn dùng bình thường).
3. Vào `chrome://extensions` → **Developer mode** → **Load unpacked** → chọn  
   `c:\Users\hr\Desktop\project\phish-lens\.output\chrome-mv3-dev` (thư mục tên có `-dev` khi đang `pnpm dev`).
4. Đăng nhập **Gmail** trên tab đó: [https://mail.google.com](https://mail.google.com).
5. Sau khi sửa code: bấm **Reload** trên card extension (hoặc đợi WXT rebuild rồi reload).

**Lưu ý:** Extension chỉ hoạt động trên **Gmail web**, không phải Outlook (app hay web).

**Chế độ thử banner** chỉ có trong bản `pnpm dev` (`import.meta.env.DEV`). Bản `pnpm build` / zip store không hiện và không chạy tính năng này.

## Tài liệu

- [PRIVACY.md](./PRIVACY.md)
- [STORE.md](./STORE.md)