import { describe, expect, it } from 'vitest';
import { taoMaBenhNhan, taoMaDonThuoc } from '../../src/js/utils/ma.js';

describe('Tạo mã nghiệp vụ', () => {
  it('tạo mã bệnh nhân đúng định dạng và xác định', () => {
    expect(taoMaBenhNhan(new Date('2026-07-08T10:00:00'), 0.1234)).toBe('BN-20260708-1234');
  });

  it('tạo mã đơn thuốc đúng định dạng và xác định', () => {
    expect(taoMaDonThuoc(new Date('2026-07-08T10:00:00'), 0.5678)).toBe('DT-20260708-5678');
  });

  it('mã bệnh nhân bắt đầu bằng BN', () => {
    expect(taoMaBenhNhan(new Date('2026-01-01'), 0.1)).toMatch(/^BN-/);
  });

  it('mã đơn thuốc bắt đầu bằng DT', () => {
    expect(taoMaDonThuoc(new Date('2026-01-01'), 0.1)).toMatch(/^DT-/);
  });
});
