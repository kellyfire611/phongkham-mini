import { describe, expect, it } from 'vitest';
import {
  coTheSuaDonThuoc,
  kiemTraDonThuocCoTheHoanTat,
  taoThuocTrongDon,
  themThuocVaoDanhSach,
  tinhTongSoLuongThuoc,
  xoaThuocKhoiDanhSach,
} from '../../src/js/business/don-thuoc-business.js';

describe('Tính tổng số lượng thuốc', () => {
  it('tính đúng tổng số lượng', () => expect(tinhTongSoLuongThuoc(1.5, 2, 3)).toBe(9));
  it('từ chối số lượng bằng 0', () => expect(() => tinhTongSoLuongThuoc(0, 2, 3)).toThrow());
  it('từ chối số lần âm', () => expect(() => tinhTongSoLuongThuoc(1, -1, 3)).toThrow());
  it('từ chối số ngày bằng 0', () => expect(() => tinhTongSoLuongThuoc(1, 2, 0)).toThrow());
});

describe('Quản lý danh sách thuốc', () => {
  it('không làm thay đổi object đầu vào', () => {
    const dauVao = { tenThuoc: ' Thuốc A ', soLuongMoiLan: 1, soLanMoiNgay: 2, soNgayDung: 3 };
    const banSao = { ...dauVao };
    taoThuocTrongDon(dauVao, { id: 't1' });
    expect(dauVao).toEqual(banSao);
  });

  it('thêm và xóa thuốc bằng danh sách mới', () => {
    const goc = [{ id: 't1' }];
    const daThem = themThuocVaoDanhSach(goc, { id: 't2' });
    expect(daThem).toHaveLength(2);
    expect(goc).toHaveLength(1);
    expect(xoaThuocKhoiDanhSach(daThem, 't1')).toEqual([{ id: 't2' }]);
  });
});

describe('Hoàn tất đơn thuốc', () => {
  it('từ chối đơn không có thuốc', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: 'BS A', chuanDoan: 'Cam', danhSachThuoc: [] }).hopLe).toBe(false));
  it('từ chối đơn thiếu bác sĩ', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: '', chuanDoan: 'Cam', danhSachThuoc: [{}] }).hopLe).toBe(false));
  it('từ chối đơn thiếu chẩn đoán', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: 'BS A', chuanDoan: '', danhSachThuoc: [{}] }).hopLe).toBe(false));
  it('chấp nhận đơn hợp lệ', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: 'BS A', chuanDoan: 'Cam', danhSachThuoc: [{}] }).hopLe).toBe(true));
  it('đơn hoàn tất và đã hủy không thể sửa', () => {
    expect(coTheSuaDonThuoc({ trangThai: 'da_hoan_tat' })).toBe(false);
    expect(coTheSuaDonThuoc({ trangThai: 'da_huy' })).toBe(false);
  });
});
