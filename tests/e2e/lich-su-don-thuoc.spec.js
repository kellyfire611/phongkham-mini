import { test, expect } from '@playwright/test';
import { taoDonHoanTat, themBenhNhan, xoaDuLieu } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await xoaDuLieu(page);
});

test('xem chi tiet, tim kiem, loc va goi ham in', async ({ page }) => {
  await taoDonHoanTat(page);
  const danhSach = page.getByTestId('danh-sach-don-thuoc');
  await expect(danhSach).toContainText('Nguyen Van An');
  await expect(danhSach).toContainText('Bac si Hoa');
  await expect(danhSach).toContainText('Da hoan tat');
  await expect(danhSach.getByRole('button', { name: 'Huy' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Xem' }).click();
  await expect(page.getByRole('dialog')).toContainText('Cam thong thuong');
  await expect(page.getByRole('dialog')).toContainText('Thuoc mau A');
  await page.getByRole('button', { name: 'Dong', exact: true }).last().click();

  await page.locator('#tim-don-thuoc').fill('bac si hoa');
  await expect(danhSach.locator('tr')).toHaveCount(1);
  await page.locator('#loc-trang-thai-don-thuoc').selectOption('da_hoan_tat');
  await expect(danhSach.locator('tr')).toHaveCount(1);

  await page.evaluate(() => { window.__daIn = false; window.print = () => { window.__daIn = true; }; });
  await danhSach.getByRole('button', { name: 'In' }).click();
  await expect.poll(() => page.evaluate(() => window.__daIn)).toBe(true);
});

test('don nhap co the huy', async ({ page }) => {
  await themBenhNhan(page);
  await page.getByRole('button', { name: 'Bat dau kham' }).click();
  await page.getByRole('button', { name: 'Lich su don thuoc' }).click();
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByTestId('danh-sach-don-thuoc').getByRole('button', { name: 'Huy' }).click();
  await expect(page.getByTestId('danh-sach-don-thuoc')).toContainText('Da huy');
});
