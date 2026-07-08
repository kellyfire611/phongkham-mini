import { test, expect } from '@playwright/test';
import { taoDonHoanTat, themBenhNhan, xoaDuLieu } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await xoaDuLieu(page);
});

test('xem chi tiết, tìm kiếm, lọc và gọi hàm in', async ({ page }) => {
  await taoDonHoanTat(page);
  const danhSach = page.getByTestId('danh-sach-don-thuoc');
  await expect(danhSach).toContainText('Nguyễn Văn An');
  await expect(danhSach).toContainText('Bác sĩ Hòa');
  await expect(danhSach).toContainText('Đã hoàn tất');
  await expect(danhSach.getByRole('button', { name: 'Hủy' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Xem' }).click();
  await expect(page.getByRole('dialog')).toContainText('Cảm thông thường');
  await expect(page.getByRole('dialog')).toContainText('Thuốc mẫu A');
  await page.getByRole('button', { name: 'Đóng', exact: true }).last().click();

  await page.locator('#tim-don-thuoc').fill('bác sĩ hòa');
  await expect(danhSach.locator('tr')).toHaveCount(1);
  await page.locator('#loc-trang-thai-don-thuoc').selectOption('da_hoan_tat');
  await expect(danhSach.locator('tr')).toHaveCount(1);

  await page.evaluate(() => { window.__daIn = false; window.print = () => { window.__daIn = true; }; });
  await danhSach.getByRole('button', { name: 'In' }).click();
  await expect.poll(() => page.evaluate(() => window.__daIn)).toBe(true);
});

test('đơn nháp có thể hủy', async ({ page }) => {
  await themBenhNhan(page);
  await page.getByRole('button', { name: 'Bắt đầu khám' }).click();
  await page.getByRole('button', { name: 'Lịch sử đơn thuốc' }).click();
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByTestId('danh-sach-don-thuoc').getByRole('button', { name: 'Hủy' }).click();
  await expect(page.getByTestId('danh-sach-don-thuoc')).toContainText('Đã hủy');
});
