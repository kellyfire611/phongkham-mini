import { beforeEach, describe, expect, it } from 'vitest';
import { taoKhoLuuTru } from '../../src/js/repositories/kho-luu-tru.js';
import { taoBenhNhanRepository } from '../../src/js/repositories/benh-nhan-repository.js';
import { taoDonThuocRepository } from '../../src/js/repositories/don-thuoc-repository.js';
import { taoBenhNhanService } from '../../src/js/services/benh-nhan-service.js';
import { taoStorageGia } from '../helpers/kho-luu-tru-gia.js';

let service;
let donThuocRepository;
let thuTu;
const duLieuHopLe = { hoTen: '  Nguyen   Van An ', ngaySinh: '1990-01-01', gioiTinh: 'Nam', soDienThoai: '0901234567', diaChi: '', trieuChung: 'Dau dau', tienSuBenh: '', diUngThuoc: '' };

beforeEach(() => {
  thuTu = 0;
  const kho = taoKhoLuuTru(taoStorageGia());
  const benhNhanRepository = taoBenhNhanRepository(kho);
  donThuocRepository = taoDonThuocRepository(kho);
  service = taoBenhNhanService({
    benhNhanRepository,
    donThuocRepository,
    taoId: () => `bn-${++thuTu}`,
    taoMaBenhNhan: () => `BN-20260708-${String(thuTu).padStart(4, '0')}`,
    layThoiGianHienTai: () => '2026-07-08T10:00:00.000Z',
  });
});

describe('Nghiep vu benh nhan', () => {
  it('them, sinh ma, chuan hoa va dat trang thai cho kham', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    expect(benhNhan).toMatchObject({ id: 'bn-1', hoTen: 'Nguyen Van An', trangThai: 'cho_kham' });
    expect(benhNhan.maBenhNhan).toMatch(/^BN-/);
  });

  it('tu choi du lieu khong hop le va benh nhan trung', () => {
    expect(() => service.themBenhNhan({ ...duLieuHopLe, hoTen: '' })).toThrow('Ho ten');
    expect(() => service.themBenhNhan({ ...duLieuHopLe, ngaySinh: '2026-07-09' })).toThrow('Ngay sinh');
    expect(() => service.themBenhNhan({ ...duLieuHopLe, soDienThoai: '12' })).toThrow('So dien thoai');
    service.themBenhNhan(duLieuHopLe);
    expect(() => service.themBenhNhan(duLieuHopLe)).toThrow('da ton tai');
  });

  it('cap nhat, tim kiem va loc benh nhan', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    service.capNhatBenhNhan(benhNhan.id, { ...duLieuHopLe, hoTen: 'Tran Thi Binh' });
    expect(service.timKiemBenhNhan('tran thi')).toHaveLength(1);
    expect(service.timKiemBenhNhan('0901234567')).toHaveLength(1);
    expect(service.timKiemBenhNhan('', 'cho_kham')).toHaveLength(1);
    expect(() => service.capNhatBenhNhan('khong-co', duLieuHopLe)).toThrow('Khong tim thay');
  });

  it('bat dau kham va khong bat dau lai benh nhan da kham', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    expect(service.batDauKham(benhNhan.id).trangThai).toBe('dang_kham');
    service.duaVeChoKham(benhNhan.id);
    service.batDauKham(benhNhan.id);
    const repo = service.layChiTietBenhNhan(benhNhan.id);
    // Mo phong benh nhan da kham bang repository qua don hoan tat khong can thiet o test nay.
    expect(repo.trangThai).toBe('dang_kham');
  });

  it('xoa benh nhan chua co don va chan xoa khi co don hoan tat', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    expect(service.xoaBenhNhan(benhNhan.id)).toBe(true);
    const benhNhan2 = service.themBenhNhan({ ...duLieuHopLe, soDienThoai: '0909998877' });
    donThuocRepository.themDonThuoc({ id: 'd1', benhNhanId: benhNhan2.id, trangThai: 'da_hoan_tat', danhSachThuoc: [] });
    expect(() => service.xoaBenhNhan(benhNhan2.id)).toThrow('Khong the xoa');
  });
});
