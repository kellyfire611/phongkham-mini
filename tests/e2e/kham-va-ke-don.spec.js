import { test, expect } from '@playwright/test';
import { themBenhNhan, xoaDuLieu } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await xoaDuLieu(page);
  await themBenhNhan(page);
  await page.getByRole('button', { name: 'Bắt đầu khám' }).click();
});

test('kê hai thuốc, xóa một thuốc, lưu nháp và hoàn tất', async ({ page }) => {
  await expect(page.getByTestId('khu-vuc-kham-benh')).toContainText('Nguyễn Văn An');
  await page.getByTestId('input-ten-bac-si').fill('Bác sĩ Hòa');
  await page.getByTestId('input-chuan-doan').fill('Cảm thông thường');
  await page.locator('#loi-dan').fill('Uong nuoc va nghi ngoi');

  await page.getByTestId('input-ten-thuoc').fill('Thuốc mẫu A');
  await page.locator('#so-luong-moi-lan').fill('1');
  await page.locator('#so-lan-moi-ngay').fill('2');
  await page.locator('#so-ngay-dung').fill('3');
  await expect(page.locator('#tong-so-luong')).toHaveValue('6');
  await page.getByTestId('button-them-thuoc').click();

  await page.getByTestId('input-ten-thuoc').fill('Thuốc mẫu B');
  await page.getByTestId('button-them-thuoc').click();
  await expect(page.getByTestId('danh-sach-thuoc').locator('tr')).toHaveCount(2);
  await page.getByTestId('danh-sach-thuoc').getByRole('button', { name: 'Xóa' }).first().click();
  await expect(page.getByTestId('danh-sach-thuoc').locator('tr')).toHaveCount(1);

  await page.getByRole('button', { name: 'Lưu nháp' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Khám và kê đơn' }).click();
  await expect(page.getByTestId('danh-sach-thuoc')).toContainText('Thuốc mẫu B');
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.getByTestId('thong-bao-he-thong')).toContainText('Hoàn tất đơn thuốc thành công');
  await page.getByRole('button', { name: 'Tiếp nhận bệnh nhân' }).click();
  await expect(page.getByTestId('danh-sach-benh-nhan')).toContainText('Đã khám');
});

test('không hoàn tất khi thiếu bác sĩ, chẩn đoán hoặc thuốc', async ({ page }) => {
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.locator('#loi-form-kham')).toContainText('Tên bác sĩ');
  await page.getByTestId('input-ten-bac-si').fill('Bác sĩ Hòa');
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.locator('#loi-form-kham')).toContainText('Chẩn đoán');
  await page.getByTestId('input-chuan-doan').fill('Cam');
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.locator('#loi-form-kham')).toContainText('ít nhất một');
});

test('không thêm thuốc có liều dùng không hợp lệ', async ({ page }) => {
  await page.getByTestId('input-ten-thuoc').fill('Thuốc lỗi');
  await page.locator('#so-luong-moi-lan').fill('0');
  await page.getByTestId('button-them-thuoc').click();
  await expect(page.locator('#loi-form-thuoc')).toContainText('Số lượng mỗi lần');
  await page.locator('#so-luong-moi-lan').fill('1');
  await page.locator('#so-ngay-dung').fill('-1');
  await page.getByTestId('button-them-thuoc').click();
  await expect(page.locator('#loi-form-thuoc')).toContainText('Số ngày dùng');
});
