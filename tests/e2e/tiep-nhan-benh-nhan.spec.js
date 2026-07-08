import { test, expect } from '@playwright/test';
import { themBenhNhan, xoaDuLieu } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await xoaDuLieu(page);
});

test('them, tim kiem, sua va luu benh nhan sau khi tai lai', async ({ page }) => {
  await themBenhNhan(page);
  const danhSach = page.getByTestId('danh-sach-benh-nhan');
  await expect(danhSach).toContainText('Nguyen Van An');
  await expect(danhSach).toContainText('BN-');
  await expect(danhSach).toContainText('Cho kham');

  await page.getByTestId('input-tim-benh-nhan').fill('0901234567');
  await expect(danhSach.locator('tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Sua' }).click();
  await page.getByTestId('input-ho-ten').fill('Nguyen Van An Da Sua');
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(danhSach).toContainText('Nguyen Van An Da Sua');

  await page.reload();
  await expect(danhSach).toContainText('Nguyen Van An Da Sua');
});

test('kiem tra cac loi nhap lieu va benh nhan trung', async ({ page }) => {
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(page.locator('#loi-form-benh-nhan')).toContainText('Ho ten');

  await page.getByTestId('input-ho-ten').fill('Benh Nhan Loi');
  await page.getByTestId('input-ngay-sinh').fill('2999-01-01');
  await page.getByTestId('input-so-dien-thoai').fill('123');
  await page.locator('#trieu-chung').fill('Met');
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(page.locator('#loi-form-benh-nhan')).toContainText('Ngay sinh');

  await themBenhNhan(page);
  await page.getByTestId('input-ho-ten').fill('Nguoi Trung');
  await page.getByTestId('input-ngay-sinh').fill('1990-01-01');
  await page.getByTestId('input-so-dien-thoai').fill('0901234567');
  await page.locator('#trieu-chung').fill('Met');
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(page.locator('#loi-form-benh-nhan')).toContainText('da ton tai');
});

test('xoa benh nhan chua co don thuoc', async ({ page }) => {
  await themBenhNhan(page);
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByTestId('danh-sach-benh-nhan').getByRole('button', { name: 'Xoa', exact: true }).click();
  await expect(page.getByTestId('danh-sach-benh-nhan').locator('tr')).toHaveCount(0);
});
