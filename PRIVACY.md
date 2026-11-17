# Chính sách quyền riêng tư / Privacy Policy

**Phish Lens** (tiện ích Chrome Manifest V3)

Cập nhật: 2026-03-29

## Tiếng Việt

### Dữ liệu chúng tôi xử lý

- Chỉ **địa chỉ người gửi** và **tên hiển thị** khi bạn mở một email trên Gmail (`https://mail.google.com`).
- Không đọc nội dung thư, không đọc tệp đính kèm, không quét hộp thư hàng loạt.

### Dữ liệu chúng tôi KHÔNG thu thập

- Không gửi địa chỉ email, tên người gửi hay kết quả phân tích ra máy chủ bên ngoài.
- Không có analytics, không có tài khoản, không có backend.
- Không bán hoặc chia sẻ dữ liệu với bên thứ ba.

### Lưu trữ cục bộ

Trên thiết bị của bạn (qua `chrome.storage.local`):

- Bật/tắt tiện ích
- Độ nhạy cảnh báo
- Ngôn ngữ giao diện
- Danh sách domain tin cậy (whitelist)

### Quyền trình duyệt

| Quyền | Lý do |
|--------|--------|
| `storage` | Lưu cài đặt và whitelist trên máy bạn |
| Host `https://mail.google.com/*` | Chạy script phân tích khi bạn dùng Gmail |

### Liên hệ

Chỉnh sửa mã nguồn trong kho lưu trữ dự án của bạn hoặc mở issue trên repository công khai (nếu có).

---

## English

### Data we process

- Only the **sender address** and **display name** when you open an email in Gmail (`https://mail.google.com`).
- We do not read message bodies, attachments, or bulk-scan your mailbox.

### Data we do NOT collect

- No transmission of sender data or analysis results to external servers.
- No analytics, accounts, or backend.
- No sale or sharing of user data with third parties.

### Local storage

On your device (`chrome.storage.local`):

- Extension on/off
- Sensitivity level
- UI language
- Trusted domain whitelist

### Permissions

| Permission | Why |
|------------|-----|
| `storage` | Persist settings and whitelist locally |
| Host `https://mail.google.com/*` | Run analysis while you use Gmail |

### Contact

See your project repository or published issue tracker if available.