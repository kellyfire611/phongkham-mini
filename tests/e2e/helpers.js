import { expect } from '@playwright/test';

export async function xoaDuLieu(page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

export async function themBenhNhan(page, { hoTen = 'Nguyễn Văn An', ngaySinh = '1990-01-01', soDienThoai = '0901234567', trieuChung = 'Đau đầu' } = {}) {
  await page.getByTestId('input-ho-ten').fill(hoTen);
  await page.getByTestId('input-ngay-sinh').fill(ngaySinh);
  await page.getByTestId('input-so-dien-thoai').fill(soDienThoai);
  await page.locator('#trieu-chung').fill(trieuChung);
  await page.getByTestId('button-luu-benh-nhan').click();
  await expect(page.getByTestId('thong-bao-he-thong')).toContainText('Tiếp nhận bệnh nhân thành công');
}

export async function taoDonHoanTat(page) {
  await themBenhNhan(page);
  await page.getByRole('button', { name: 'Bắt đầu khám' }).click();
  await page.getByTestId('input-ten-bac-si').fill('Bác sĩ Hòa');
  await page.getByTestId('input-chuan-doan').fill('Cảm thông thường');
  await page.getByTestId('input-ten-thuoc').fill('Thuốc mẫu A');
  await page.locator('#so-luong-moi-lan').fill('1');
  await page.locator('#so-lan-moi-ngay').fill('2');
  await page.locator('#so-ngay-dung').fill('3');
  await page.getByTestId('button-them-thuoc').click();
  await page.getByTestId('button-hoan-tat-don').click();
  await expect(page.getByTestId('thong-bao-he-thong')).toContainText('Hoàn tất đơn thuốc thành công');
}
