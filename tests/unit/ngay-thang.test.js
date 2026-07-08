import { describe, expect, it } from 'vitest';
import { dinhDangNgay, laNgayTrongTuongLai, tinhTuoi } from '../../src/js/utils/ngay-thang.js';

describe('Xử lý ngày tháng', () => {
  it('nhận biết ngày trong tương lai', () => {
    expect(laNgayTrongTuongLai('2026-07-09', new Date('2026-07-08T12:00:00'))).toBe(true);
  });

  it('ngày hiện tại không phải ngày tương lai', () => {
    expect(laNgayTrongTuongLai('2026-07-08', new Date('2026-07-08T12:00:00'))).toBe(false);
  });

  it('tính tuổi trước sinh nhật', () => {
    expect(tinhTuoi('2000-10-20', new Date('2026-07-08'))).toBe(25);
  });

  it('tính tuổi sau sinh nhật', () => {
    expect(tinhTuoi('2000-01-20', new Date('2026-07-08'))).toBe(26);
  });

  it('trả null với ngày không hợp lệ', () => {
    expect(tinhTuoi('khong-hop-le', new Date('2026-07-08'))).toBeNull();
  });

  it('định dạng ngày theo vi-VN', () => {
    expect(dinhDangNgay('2026-07-08')).toBe('8/7/2026');
  });
});
