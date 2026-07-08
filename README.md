# Phong kham Mini

Ung dung web tinh phuc vu bai thuc hanh **HTML, CSS, JavaScript, LocalStorage, Vitest, Playwright va GitHub Actions**.

> Day la ung dung hoc tap. Khong su dung cho hoat dong kham chua benh thuc te va khong nhap du lieu suc khoe that.

## Chuc nang

- CRUD tiep nhan benh nhan.
- Tim kiem va loc theo trang thai.
- Chuyen benh nhan vao trang thai dang kham.
- Lap don nhap, them/xoa thuoc, tinh tong so luong.
- Hoan tat hoac huy don thuoc.
- Xem lich su, chi tiet va in don thuoc.
- Luu du lieu bang LocalStorage.
- Unit Test, Business Test va Playwright UI Test.
- CI/CD va deploy GitHub Pages.

## Cong nghe

- HTML5, CSS3, JavaScript ES Module.
- Vite.
- Vitest va V8 Coverage.
- Playwright Chromium.
- GitHub Actions va GitHub Pages.

## Cau truc thu muc

```text
src/js/business       Ham nghiep vu thuan
src/js/services       Dieu phoi quy tac nghiep vu
src/js/repositories   Doc/ghi LocalStorage
src/js/ui             Xu ly DOM
tests/unit            Unit Test
tests/business        Business Test dung storage gia
tests/e2e             Playwright UI Test
.github/workflows     CI/CD
```

## Chay tren may ca nhan

Yeu cau Node.js 22 tro len.

```bash
npm ci
npm run dev
```

Mo dia chi Vite hien thi trong Terminal.

## Kiem thu

```bash
npm run test:unit
npm run test:business
npm run test:coverage
npx playwright install chromium
npm run test:e2e
npm run test:e2e:report
```

Chay toan bo:

```bash
npm run test:all
```

## Build

```bash
npm run build
npm run preview
```

Thu muc ket qua la `dist/`. Cau hinh `base: './'` giup asset chay dung khi website nam tai duong dan repository GitHub Pages.

## Dua len GitHub

```bash
git init
git add .
git commit -m "Khoi tao Phong kham Mini"
git branch -M main
git remote add origin https://github.com/TEN-TAI-KHOAN/TEN-REPOSITORY.git
git push -u origin main
```

Sau do:

1. Mo repository tren GitHub.
2. Vao **Settings → Pages**.
3. Tai **Build and deployment → Source**, chon **GitHub Actions**.
4. Mo tab **Actions** va cho workflow chay xanh.
5. URL demo se co dang `https://TEN-TAI-KHOAN.github.io/TEN-REPOSITORY/`.

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
Deploy GitHub Pages (chi khi push main)
```

Pull Request chi chay test va build, khong deploy.

## LocalStorage

Du lieu chi nam trong trinh duyet hien tai. Du lieu khong dong bo qua may khac va se mat neu xoa du lieu trinh duyet. Nut **Xoa toan bo du lieu** chi xoa cac khoa cua ung dung.

## Quy tac nghiep vu chinh

- Khong trung so dien thoai va ngay sinh.
- Khong xoa benh nhan da co don hoan tat.
- Don hoan tat phai co bac si, chan doan va it nhat mot thuoc.
- Tong so luong = so luong moi lan × so lan moi ngay × so ngay dung.
- Don hoan tat khong the sua hoặc huy.
- Ung dung khong de xuat thuoc, chan doan hay lieu dung.

## Link bai lam

- Repository: `Dien link tai day`
- GitHub Pages: `Dien link tai day`
- Anh chup man hinh: `Bo sung tai day`
