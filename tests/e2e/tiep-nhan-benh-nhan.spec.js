import { test, expect } from '@playwright/test';
import { themBenhNhan, xoaDuLieu } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await xoaDuLieu(page);
});

test('thêm, tìm kiếm, sửa và lưu bệnh nhân sau khi tải lại', async ({ page }) => {
  await themBenhNhan(page);
  const danhSach = page.getByTestId('danh-sach-benh-nhan');
  await expect(danhSach).toContainText('Nguyễn Văn An');
  await expect(danhSach).toContainText('BN-');
  await expect(danhSach).toContainText('Chờ khám');

  await page.getByTestId('input-tim-benh-nhan').fill('0901234567');
  await expect(danhSach.locator('tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Sửa' }).click();
  await page.getByTestId('input-ho-ten').fill('Nguyễn Văn An Đã Sửa');
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(danhSach).toContainText('Nguyễn Văn An Đã Sửa');

  await page.reload();
  await expect(danhSach).toContainText('Nguyễn Văn An Đã Sửa');
});

test('kiểm tra các lỗi nhập liệu và bệnh nhân trùng', async ({ page }) => {
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(page.locator('#loi-form-benh-nhan')).toContainText('Họ tên');

  await page.getByTestId('input-ho-ten').fill('Bệnh Nhân Lỗi');
  await page.getByTestId('input-ngay-sinh').fill('2999-01-01');
  await page.getByTestId('input-so-dien-thoai').fill('123');
  await page.locator('#trieu-chung').fill('Mệt');
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(page.locator('#loi-form-benh-nhan')).toContainText('Ngày sinh');

  await themBenhNhan(page);
  await page.getByTestId('input-ho-ten').fill('Người Trùng');
  await page.getByTestId('input-ngay-sinh').fill('1990-01-01');
  await page.getByTestId('input-so-dien-thoai').fill('0901234567');
  await page.locator('#trieu-chung').fill('Mệt');
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(page.locator('#loi-form-benh-nhan')).toContainText('đã tồn tại');
});

test('xóa bệnh nhân chưa có đơn thuốc', async ({ page }) => {
  await themBenhNhan(page);
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByTestId('danh-sach-benh-nhan').getByRole('button', { name: 'Xóa', exact: true }).click();
  await expect(page.getByTestId('danh-sach-benh-nhan').locator('tr')).toHaveCount(0);
});
