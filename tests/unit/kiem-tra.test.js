import { describe, expect, it } from 'vitest';
import { kiemTraBenhNhan, kiemTraThuocTrongDon, kiemTraThongTinKham } from '../../src/js/utils/kiem-tra.js';

const benhNhanHopLe = { hoTen: 'Nguyễn Văn A', ngaySinh: '1990-01-01', soDienThoai: '0901234567', trieuChung: 'Đau đầu' };

describe('Kiểm tra dữ liệu bệnh nhân', () => {
  it('từ chối họ tên rỗng', () => expect(kiemTraBenhNhan({ ...benhNhanHopLe, hoTen: '   ' }, new Date('2026-07-08')).loi.hoTen).toBeTruthy());
  it('từ chối ngày sinh tương lai', () => expect(kiemTraBenhNhan({ ...benhNhanHopLe, ngaySinh: '2026-07-09' }, new Date('2026-07-08')).loi.ngaySinh).toBeTruthy());
  it('từ chối số điện thoại sai', () => expect(kiemTraBenhNhan({ ...benhNhanHopLe, soDienThoai: '123' }, new Date('2026-07-08')).loi.soDienThoai).toBeTruthy());
  it('chấp nhận bệnh nhân hợp lệ', () => expect(kiemTraBenhNhan(benhNhanHopLe, new Date('2026-07-08')).hopLe).toBe(true));
});

describe('Kiểm tra thông tin khám và thuốc', () => {
  it('từ chối bác sĩ rỗng', () => expect(kiemTraThongTinKham({ tenBacSi: '', chuanDoan: 'Cam' }).loi.tenBacSi).toBeTruthy());
  it('từ chối chẩn đoán rỗng', () => expect(kiemTraThongTinKham({ tenBacSi: 'BS A', chuanDoan: '' }).loi.chuanDoan).toBeTruthy());
  it('từ chối tên thuốc rỗng', () => expect(kiemTraThuocTrongDon({ tenThuoc: '', soLuongMoiLan: 1, soLanMoiNgay: 1, soNgayDung: 1 }).loi.tenThuoc).toBeTruthy());
  it('từ chối số lượng bằng 0', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 0, soLanMoiNgay: 1, soNgayDung: 1 }).loi.soLuongMoiLan).toBeTruthy());
  it('từ chối số lần âm', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 1, soLanMoiNgay: -1, soNgayDung: 1 }).loi.soLanMoiNgay).toBeTruthy());
  it('từ chối số ngày không phải số', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 1, soLanMoiNgay: 1, soNgayDung: 'abc' }).loi.soNgayDung).toBeTruthy());
  it('chấp nhận thuốc hợp lệ', () => expect(kiemTraThuocTrongDon({ tenThuoc: 'A', soLuongMoiLan: 1, soLanMoiNgay: 2, soNgayDung: 3 }).hopLe).toBe(true));
});
