import { describe, expect, it } from 'vitest';
import { kiemTraBenhNhan, kiemTraThuocTrongDon, kiemTraThongTinKham } from '../../src/js/utils/kiem-tra.js';

const benhNhanHopLe = { hoTen: 'Nguyen Van A', ngaySinh: '1990-01-01', soDienThoai: '0901234567', trieuChung: 'Dau dau' };

describe('Kiem tra du lieu benh nhan', () => {
  it('tu choi ho ten rong', () => expect(kiemTraBenhNhan({ ...benhNhanHopLe, hoTen: '   ' }, new Date('2026-07-08')).loi.hoTen).toBeTruthy());
  it('tu choi ngay sinh tuong lai', () => expect(kiemTraBenhNhan({ ...benhNhanHopLe, ngaySinh: '2026-07-09' }, new Date('2026-07-08')).loi.ngaySinh).toBeTruthy());
  it('tu choi so dien thoai sai', () => expect(kiemTraBenhNhan({ ...benhNhanHopLe, soDienThoai: '123' }, new Date('2026-07-08')).loi.soDienThoai).toBeTruthy());
  it('chap nhan benh nhan hop le', () => expect(kiemTraBenhNhan(benhNhanHopLe, new Date('2026-07-08')).hopLe).toBe(true));
});

describe('Kiem tra thong tin kham va thuoc', () => {
  it('tu choi bac si rong', () => expect(kiemTraThongTinKham({ tenBacSi: '', chuanDoan: 'Cam' }).loi.tenBacSi).toBeTruthy());
  it('tu choi chan doan rong', () => expect(kiemTraThongTinKham({ tenBacSi: 'BS A', chuanDoan: '' }).loi.chuanDoan).toBeTruthy());
  it('tu choi ten thuoc rong', () => expect(kiemTraThuocTrongDon({ tenThuoc: '', soLuongMoiLan: 1, soLanMoiNgay: 1, soNgayDung: 1 }).loi.tenThuoc).toBeTruthy());
  it('tu choi so luong bang 0', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 0, soLanMoiNgay: 1, soNgayDung: 1 }).loi.soLuongMoiLan).toBeTruthy());
  it('tu choi so lan am', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 1, soLanMoiNgay: -1, soNgayDung: 1 }).loi.soLanMoiNgay).toBeTruthy());
  it('tu choi so ngay khong phai so', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 1, soLanMoiNgay: 1, soNgayDung: 'abc' }).loi.soNgayDung).toBeTruthy());
  it('chap nhan thuoc hop le', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 1, soLanMoiNgay: 2, soNgayDung: 3 }).hopLe).toBe(true));
});
