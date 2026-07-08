import { beforeEach, describe, expect, it } from 'vitest';
import { taoKhoLuuTru } from '../../src/js/repositories/kho-luu-tru.js';
import { taoBenhNhanRepository } from '../../src/js/repositories/benh-nhan-repository.js';
import { taoDonThuocRepository } from '../../src/js/repositories/don-thuoc-repository.js';
import { taoBenhNhanService } from '../../src/js/services/benh-nhan-service.js';
import { taoDonThuocService } from '../../src/js/services/don-thuoc-service.js';
import { taoStorageGia } from '../helpers/kho-luu-tru-gia.js';

let benhNhanService;
let donThuocService;
let benhNhanRepository;
let soThuTu;
const benhNhanMau = { hoTen: 'Nguyen Van An', ngaySinh: '1990-01-01', gioiTinh: 'Nam', soDienThoai: '0901234567', trieuChung: 'Dau dau' };
const thuocHopLe = { tenThuoc: 'Thuoc A', hamLuong: '500 mg', donVi: 'vien', soLuongMoiLan: 1, soLanMoiNgay: 2, soNgayDung: 3, cachDung: 'Sau an', thoiDiemDung: 'Sang, toi' };

beforeEach(() => {
  soThuTu = 0;
  const kho = taoKhoLuuTru(taoStorageGia());
  benhNhanRepository = taoBenhNhanRepository(kho);
  const donThuocRepository = taoDonThuocRepository(kho);
  const deps = { taoId: () => `id-${++soThuTu}`, layThoiGianHienTai: () => '2026-07-08T10:00:00.000Z' };
  benhNhanService = taoBenhNhanService({ ...deps, benhNhanRepository, donThuocRepository, taoMaBenhNhan: () => 'BN-20260708-0001' });
  donThuocService = taoDonThuocService({ ...deps, benhNhanRepository, donThuocRepository, taoMaDonThuoc: () => 'DT-20260708-0001' });
});

function taoBenhNhan() { return benhNhanService.themBenhNhan(benhNhanMau); }

describe('Tao va cap nhat don thuoc', () => {
  it('tao don nhap va chuyen benh nhan sang dang kham', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, {});
    expect(don.trangThai).toBe('nhap');
    expect(benhNhanRepository.timBenhNhanTheoId(benhNhan.id).trangThai).toBe('dang_kham');
  });

  it('tu choi benh nhan khong ton tai', () => expect(() => donThuocService.taoDonThuocNhap('x', {})).toThrow('Khong tim thay'));

  it('them thuoc va tinh tong so luong', () => {
    const don = donThuocService.taoDonThuocNhap(taoBenhNhan().id, {});
    const daThem = donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    expect(daThem.danhSachThuoc[0].tongSoLuong).toBe(6);
    expect(() => donThuocService.themThuocVaoDon(don.id, { ...thuocHopLe, tenThuoc: '' })).toThrow('Ten thuoc');
    expect(() => donThuocService.themThuocVaoDon(don.id, { ...thuocHopLe, soNgayDung: 0 })).toThrow('So ngay dung');
  });

  it('xoa thuoc va cap nhat thong tin kham', () => {
    const don = donThuocService.taoDonThuocNhap(taoBenhNhan().id, {});
    const daThem = donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    const thuocId = daThem.danhSachThuoc[0].id;
    expect(donThuocService.xoaThuocKhoiDon(don.id, thuocId).danhSachThuoc).toHaveLength(0);
    expect(donThuocService.capNhatThongTinKham(don.id, { tenBacSi: 'BS B', chuanDoan: 'Cam', loiDan: 'Nghi ngoi' })).toMatchObject({ tenBacSi: 'BS B', chuanDoan: 'Cam' });
  });
});

describe('Hoan tat va huy don', () => {
  it('chan hoan tat khi thieu du lieu', () => {
    const don = donThuocService.taoDonThuocNhap(taoBenhNhan().id, {});
    expect(() => donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: 'BS A', chuanDoan: 'Cam' })).toThrow('it nhat mot');
    donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    expect(() => donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: '', chuanDoan: 'Cam' })).toThrow('Ten bac si');
    expect(() => donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: 'BS A', chuanDoan: '' })).toThrow('Chan doan');
  });

  it('hoan tat don va khoa chinh sua', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, {});
    donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    const daHoanTat = donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: 'BS A', chuanDoan: 'Cam', loiDan: '' });
    expect(daHoanTat.trangThai).toBe('da_hoan_tat');
    expect(benhNhanRepository.timBenhNhanTheoId(benhNhan.id).trangThai).toBe('da_kham');
    expect(() => donThuocService.themThuocVaoDon(don.id, thuocHopLe)).toThrow('Khong the sua');
    expect(() => donThuocService.huyDonThuoc(don.id)).toThrow('Khong the huy');
  });

  it('huy don nhap va dua benh nhan ve cho kham', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, {});
    expect(donThuocService.huyDonThuoc(don.id).trangThai).toBe('da_huy');
    expect(benhNhanRepository.timBenhNhanTheoId(benhNhan.id).trangThai).toBe('cho_kham');
  });

  it('tim theo ma, benh nhan, bac si va trang thai', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, { tenBacSi: 'Bac si Hoa' });
    expect(donThuocService.timKiemDonThuoc('DT-')).toHaveLength(1);
    expect(donThuocService.timKiemDonThuoc('nguyen van')).toHaveLength(1);
    expect(donThuocService.timKiemDonThuoc('bac si hoa')).toHaveLength(1);
    expect(donThuocService.timKiemDonThuoc('', 'nhap')[0].id).toBe(don.id);
  });
});
