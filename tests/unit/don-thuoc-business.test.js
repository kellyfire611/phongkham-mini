import { describe, expect, it } from 'vitest';
import {
  coTheSuaDonThuoc,
  kiemTraDonThuocCoTheHoanTat,
  taoThuocTrongDon,
  themThuocVaoDanhSach,
  tinhTongSoLuongThuoc,
  xoaThuocKhoiDanhSach,
} from '../../src/js/business/don-thuoc-business.js';

describe('Tinh tong so luong thuoc', () => {
  it('tinh dung tong so luong', () => expect(tinhTongSoLuongThuoc(1.5, 2, 3)).toBe(9));
  it('tu choi so luong bang 0', () => expect(() => tinhTongSoLuongThuoc(0, 2, 3)).toThrow());
  it('tu choi so lan am', () => expect(() => tinhTongSoLuongThuoc(1, -1, 3)).toThrow());
  it('tu choi so ngay bang 0', () => expect(() => tinhTongSoLuongThuoc(1, 2, 0)).toThrow());
});

describe('Quan ly danh sach thuoc', () => {
  it('khong lam thay doi object dau vao', () => {
    const dauVao = { tenThuoc: ' Thuoc A ', soLuongMoiLan: 1, soLanMoiNgay: 2, soNgayDung: 3 };
    const banSao = { ...dauVao };
    taoThuocTrongDon(dauVao, { id: 't1' });
    expect(dauVao).toEqual(banSao);
  });

  it('them va xoa thuoc bang danh sach moi', () => {
    const goc = [{ id: 't1' }];
    const daThem = themThuocVaoDanhSach(goc, { id: 't2' });
    expect(daThem).toHaveLength(2);
    expect(goc).toHaveLength(1);
    expect(xoaThuocKhoiDanhSach(daThem, 't1')).toEqual([{ id: 't2' }]);
  });
});

describe('Hoan tat don thuoc', () => {
  it('tu choi don khong co thuoc', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: 'BS A', chuanDoan: 'Cam', danhSachThuoc: [] }).hopLe).toBe(false));
  it('tu choi don thieu bac si', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: '', chuanDoan: 'Cam', danhSachThuoc: [{}] }).hopLe).toBe(false));
  it('tu choi don thieu chan doan', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: 'BS A', chuanDoan: '', danhSachThuoc: [{}] }).hopLe).toBe(false));
  it('chap nhan don hop le', () => expect(kiemTraDonThuocCoTheHoanTat({ tenBacSi: 'BS A', chuanDoan: 'Cam', danhSachThuoc: [{}] }).hopLe).toBe(true));
  it('don hoan tat va da huy khong the sua', () => {
    expect(coTheSuaDonThuoc({ trangThai: 'da_hoan_tat' })).toBe(false);
    expect(coTheSuaDonThuoc({ trangThai: 'da_huy' })).toBe(false);
  });
});
