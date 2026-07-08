import { describe, expect, it } from 'vitest';
import { taoMaBenhNhan, taoMaDonThuoc } from '../../src/js/utils/ma.js';

describe('Tao ma nghiep vu', () => {
  it('tao ma benh nhan dung dinh dang va xac dinh', () => {
    expect(taoMaBenhNhan(new Date('2026-07-08T10:00:00'), 0.1234)).toBe('BN-20260708-1234');
  });

  it('tao ma don thuoc dung dinh dang va xac dinh', () => {
    expect(taoMaDonThuoc(new Date('2026-07-08T10:00:00'), 0.5678)).toBe('DT-20260708-5678');
  });

  it('ma benh nhan bat dau bang BN', () => {
    expect(taoMaBenhNhan(new Date('2026-01-01'), 0.1)).toMatch(/^BN-/);
  });

  it('ma don thuoc bat dau bang DT', () => {
    expect(taoMaDonThuoc(new Date('2026-01-01'), 0.1)).toMatch(/^DT-/);
  });
});
