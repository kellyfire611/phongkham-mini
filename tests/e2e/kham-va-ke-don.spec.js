import { test, expect } from '@playwright/test';
import { themBenhNhan, xoaDuLieu } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await xoaDuLieu(page);
  await themBenhNhan(page);
  await page.getByRole('button', { name: 'Bat dau kham' }).click();
});

test('ke hai thuoc, xoa mot thuoc, luu nhap va hoan tat', async ({ page }) => {
  await expect(page.getByTestId('khu-vuc-kham-benh')).toContainText('Nguyen Van An');
  await page.getByTestId('input-ten-bac-si').fill('Bac si Hoa');
  await page.getByTestId('input-chuan-doan').fill('Cam thong thuong');
  await page.locator('#loi-dan').fill('Uong nuoc va nghi ngoi');

  await page.getByTestId('input-ten-thuoc').fill('Thuoc mau A');
  await page.locator('#so-luong-moi-lan').fill('1');
  await page.locator('#so-lan-moi-ngay').fill('2');
  await page.locator('#so-ngay-dung').fill('3');
  await expect(page.locator('#tong-so-luong')).toHaveValue('6');
  await page.getByTestId('button-them-thuoc').click();

  await page.getByTestId('input-ten-thuoc').fill('Thuoc mau B');
  await page.getByTestId('button-them-thuoc').click();
  await expect(page.getByTestId('danh-sach-thuoc').locator('tr')).toHaveCount(2);
  await page.getByTestId('danh-sach-thuoc').getByRole('button', { name: 'Xoa' }).first().click();
  await expect(page.getByTestId('danh-sach-thuoc').locator('tr')).toHaveCount(1);

  await page.getByRole('button', { name: 'Luu nhap' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Kham va ke don' }).click();
  await expect(page.getByTestId('danh-sach-thuoc')).toContainText('Thuoc mau B');
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.getByTestId('thong-bao-he-thong')).toContainText('Hoan tat don thuoc thanh cong');
  await page.getByRole('button', { name: 'Tiep nhan benh nhan' }).click();
  await expect(page.getByTestId('danh-sach-benh-nhan')).toContainText('Da kham');
});

test('khong hoan tat khi thieu bac si, chan doan hoac thuoc', async ({ page }) => {
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.locator('#loi-form-kham')).toContainText('Ten bac si');
  await page.getByTestId('input-ten-bac-si').fill('Bac si Hoa');
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.locator('#loi-form-kham')).toContainText('Chan doan');
  await page.getByTestId('input-chuan-doan').fill('Cam');
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.locator('#loi-form-kham')).toContainText('it nhat mot');
});

test('khong them thuoc co lieu dung khong hop le', async ({ page }) => {
  await page.getByTestId('input-ten-thuoc').fill('Thuoc loi');
  await page.locator('#so-luong-moi-lan').fill('0');
  await page.getByTestId('button-them-thuoc').click();
  await expect(page.locator('#loi-form-thuoc')).toContainText('So luong moi lan');
  await page.locator('#so-luong-moi-lan').fill('1');
  await page.locator('#so-ngay-dung').fill('-1');
  await page.getByTestId('button-them-thuoc').click();
  await expect(page.locator('#loi-form-thuoc')).toContainText('So ngay dung');
});
