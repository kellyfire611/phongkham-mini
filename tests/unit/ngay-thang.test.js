import { describe, expect, it } from 'vitest';
import { dinhDangNgay, laNgayTrongTuongLai, tinhTuoi } from '../../src/js/utils/ngay-thang.js';

describe('Xu ly ngay thang', () => {
  it('nhan biet ngay trong tuong lai', () => {
    expect(laNgayTrongTuongLai('2026-07-09', new Date('2026-07-08T12:00:00'))).toBe(true);
  });

  it('ngay hien tai khong phai ngay tuong lai', () => {
    expect(laNgayTrongTuongLai('2026-07-08', new Date('2026-07-08T12:00:00'))).toBe(false);
  });

  it('tinh tuoi truoc sinh nhat', () => {
    expect(tinhTuoi('2000-10-20', new Date('2026-07-08'))).toBe(25);
  });

  it('tinh tuoi sau sinh nhat', () => {
    expect(tinhTuoi('2000-01-20', new Date('2026-07-08'))).toBe(26);
  });

  it('tra null voi ngay khong hop le', () => {
    expect(tinhTuoi('khong-hop-le', new Date('2026-07-08'))).toBeNull();
  });

  it('dinh dang ngay theo vi-VN', () => {
    expect(dinhDangNgay('2026-07-08')).toBe('8/7/2026');
  });
});
