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
const benhNhanMau = { hoTen: 'Nguyễn Văn An', ngaySinh: '1990-01-01', gioiTinh: 'Nam', soDienThoai: '0901234567', trieuChung: 'Đau đầu' };
const thuocHopLe = { tenThuoc: 'Thuốc A', hamLuong: '500 mg', donVi: 'viên', soLuongMoiLan: 1, soLanMoiNgay: 2, soNgayDung: 3, cachDung: 'Sau ăn', thoiDiemDung: 'Sáng, tối' };

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

describe('Tạo và cập nhật đơn thuốc', () => {
  it('tạo đơn nháp và chuyển bệnh nhân sang đang khám', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, {});
    expect(don.trangThai).toBe('nhap');
    expect(benhNhanRepository.timBenhNhanTheoId(benhNhan.id).trangThai).toBe('dang_kham');
  });

  it('từ chối bệnh nhân không tồn tại', () => expect(() => donThuocService.taoDonThuocNhap('x', {})).toThrow('Không tìm thấy'));

  it('thêm thuốc và tính tổng số lượng', () => {
    const don = donThuocService.taoDonThuocNhap(taoBenhNhan().id, {});
    const daThem = donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    expect(daThem.danhSachThuoc[0].tongSoLuong).toBe(6);
    expect(() => donThuocService.themThuocVaoDon(don.id, { ...thuocHopLe, tenThuoc: '' })).toThrow('Tên thuốc');
    expect(() => donThuocService.themThuocVaoDon(don.id, { ...thuocHopLe, soNgayDung: 0 })).toThrow('Số ngày dùng');
  });

  it('xóa thuốc và cập nhật thông tin khám', () => {
    const don = donThuocService.taoDonThuocNhap(taoBenhNhan().id, {});
    const daThem = donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    const thuocId = daThem.danhSachThuoc[0].id;
    expect(donThuocService.xoaThuocKhoiDon(don.id, thuocId).danhSachThuoc).toHaveLength(0);
    expect(donThuocService.capNhatThongTinKham(don.id, { tenBacSi: 'BS B', chuanDoan: 'Cam', loiDan: 'Nghỉ ngơi' })).toMatchObject({ tenBacSi: 'BS B', chuanDoan: 'Cam' });
  });
});

describe('Hoàn tất và hủy đơn', () => {
  it('chặn hoàn tất khi thiếu dữ liệu', () => {
    const don = donThuocService.taoDonThuocNhap(taoBenhNhan().id, {});
    expect(() => donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: 'BS A', chuanDoan: 'Cam' })).toThrow('ít nhất một');
    donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    expect(() => donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: '', chuanDoan: 'Cam' })).toThrow('Tên bác sĩ');
    expect(() => donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: 'BS A', chuanDoan: '' })).toThrow('Chẩn đoán');
  });

  it('hoàn tất đơn và khóa chỉnh sửa', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, {});
    donThuocService.themThuocVaoDon(don.id, thuocHopLe);
    const daHoanTat = donThuocService.hoanTatDonThuoc(don.id, { tenBacSi: 'BS A', chuanDoan: 'Cam', loiDan: '' });
    expect(daHoanTat.trangThai).toBe('da_hoan_tat');
    expect(benhNhanRepository.timBenhNhanTheoId(benhNhan.id).trangThai).toBe('da_kham');
    expect(() => donThuocService.themThuocVaoDon(don.id, thuocHopLe)).toThrow('Không thể sửa');
    expect(() => donThuocService.huyDonThuoc(don.id)).toThrow('Không thể hủy');
  });

  it('hủy đơn nháp và đưa bệnh nhân về chờ khám', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, {});
    expect(donThuocService.huyDonThuoc(don.id).trangThai).toBe('da_huy');
    expect(benhNhanRepository.timBenhNhanTheoId(benhNhan.id).trangThai).toBe('cho_kham');
  });

  it('tìm theo mã, bệnh nhân, bác sĩ và trạng thái', () => {
    const benhNhan = taoBenhNhan();
    const don = donThuocService.taoDonThuocNhap(benhNhan.id, { tenBacSi: 'Bác sĩ Hòa' });
    expect(donThuocService.timKiemDonThuoc('DT-')).toHaveLength(1);
    expect(donThuocService.timKiemDonThuoc('nguyen van')).toHaveLength(1);
    expect(donThuocService.timKiemDonThuoc('bác sĩ hòa')).toHaveLength(1);
    expect(donThuocService.timKiemDonThuoc('', 'nhap')[0].id).toBe(don.id);
  });
});
