# Phòng khám Mini

Ứng dụng web tĩnh phục vụ bài thực hành **HTML, CSS, JavaScript, LocalStorage, Vitest, Playwright và GitHub Actions**.

> Đây là ứng dụng học tập. Không sử dụng cho hoạt động khám chữa bệnh thực tế và không nhập dữ liệu sức khỏe thật.

## Chức năng

- CRUD tiếp nhận bệnh nhân.
- Tìm kiếm và lọc theo trạng thái.
- Chuyển bệnh nhân vào trạng thái đang khám.
- Lập đơn nháp, thêm/xóa thuốc, tính tổng số lượng.
- Hoàn tất hoặc hủy đơn thuốc.
- Xem lịch sử, chi tiết và in đơn thuốc.
- Lưu dữ liệu bằng LocalStorage.
- Unit Test, Business Test và Playwright UI Test.
- CI/CD và deploy GitHub Pages.

## Công nghệ

- HTML5, CSS3, JavaScript ES Module.
- Vite.
- Vitest và V8 Coverage.
- Playwright Chromium.
- GitHub Actions và GitHub Pages.

## Cấu trúc thư mục

```text
src/js/business       Hàm nghiệp vụ thuần
src/js/services       Điều phối quy tắc nghiệp vụ
src/js/repositories   Đọc/ghi LocalStorage
src/js/ui             Xử lý DOM
tests/unit            Unit Test
tests/business        Business Test dùng storage giả
tests/e2e             Playwright UI Test
.github/workflows     CI/CD
```

## Chạy trên máy cá nhân

Yêu cầu Node.js 22 trở lên.

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite hiển thị trong Terminal.

## Kiểm thử

```bash
npm run test:unit
npm run test:business
npm run test:coverage
npx playwright install chromium
npm run test:e2e
npm run test:e2e:report
```

Chạy toàn bộ:

```bash
npm run test:all
```

## Build

```bash
npm run build
npm run preview
```

Thư mục kết quả là `dist/`. Cấu hình `base: './'` giúp asset chạy đúng khi website nằm tại đường dẫn repository GitHub Pages.

## Đưa lên GitHub

```bash
git init
git add .
git commit -m "Khởi tạo Phòng khám Mini"
git branch -M main
git remote add origin https://github.com/TEN-TAI-KHOAN/TEN-REPOSITORY.git
git push -u origin main
```

Sau đó:

1. Mở repository trên GitHub.
2. Vào **Settings → Pages**.
3. Tại **Build and deployment → Source**, chọn **GitHub Actions**.
4. Mở tab **Actions** và chờ workflow chạy xanh.
5. URL demo sẽ có dạng `https://TEN-TAI-KHOAN.github.io/TEN-REPOSITORY/`.

## Pipeline

```text
Unit Test
   ↓
Business Test + Coverage
   ↓
Playwright UI Test
   ↓
Build Vite
   ↓
Upload Pages Artifact
   ↓
Deploy GitHub Pages (chỉ khi push main)
```

Pull Request chỉ chạy test và build, không deploy.

## LocalStorage

Dữ liệu chỉ nằm trong trình duyệt hiện tại. Dữ liệu không đồng bộ qua máy khác và sẽ mất nếu xóa dữ liệu trình duyệt. Nút **Xóa toàn bộ dữ liệu** chỉ xóa các khóa của ứng dụng.

## Quy tắc nghiệp vụ chính

- Không trùng số điện thoại và ngày sinh.
- Không xóa bệnh nhân đã có đơn hoàn tất.
- Đơn hoàn tất phải có bác sĩ, chẩn đoán và ít nhất một thuốc.
- Tổng số lượng = số lượng mỗi lần × số lần mỗi ngày × số ngày dùng.
- Đơn hoàn tất không thể sửa hoặc hủy.
- Ứng dụng không đề xuất thuốc, chẩn đoán hay liều dùng.

## Link bài làm

- Repository: `Điền link tại đây`
- GitHub Pages: `Điền link tại đây`
- Ảnh chụp màn hình: `Bổ sung tại đây`
