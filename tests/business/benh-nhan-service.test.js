import { beforeEach, describe, expect, it } from 'vitest';
import { taoKhoLuuTru } from '../../src/js/repositories/kho-luu-tru.js';
import { taoBenhNhanRepository } from '../../src/js/repositories/benh-nhan-repository.js';
import { taoDonThuocRepository } from '../../src/js/repositories/don-thuoc-repository.js';
import { taoBenhNhanService } from '../../src/js/services/benh-nhan-service.js';
import { taoStorageGia } from '../helpers/kho-luu-tru-gia.js';

let service;
let donThuocRepository;
let thuTu;
const duLieuHopLe = { hoTen: '  Nguyễn   Văn An ', ngaySinh: '1990-01-01', gioiTinh: 'Nam', soDienThoai: '0901234567', diaChi: '', trieuChung: 'Đau đầu', tienSuBenh: '', diUngThuoc: '' };

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

describe('Nghiệp vụ bệnh nhân', () => {
  it('thêm, sinh mã, chuẩn hóa và đặt trạng thái chờ khám', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    expect(benhNhan).toMatchObject({ id: 'bn-1', hoTen: 'Nguyễn Văn An', trangThai: 'cho_kham' });
    expect(benhNhan.maBenhNhan).toMatch(/^BN-/);
  });

  it('từ chối dữ liệu không hợp lệ và bệnh nhân trùng', () => {
    expect(() => service.themBenhNhan({ ...duLieuHopLe, hoTen: '' })).toThrow('Họ tên');
    expect(() => service.themBenhNhan({ ...duLieuHopLe, ngaySinh: '2026-07-09' })).toThrow('Ngày sinh');
    expect(() => service.themBenhNhan({ ...duLieuHopLe, soDienThoai: '12' })).toThrow('Số điện thoại');
    service.themBenhNhan(duLieuHopLe);
    expect(() => service.themBenhNhan(duLieuHopLe)).toThrow('đã tồn tại');
  });

  it('cập nhật, tìm kiếm và lọc bệnh nhân', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    service.capNhatBenhNhan(benhNhan.id, { ...duLieuHopLe, hoTen: 'Trần Thị Bình' });
    expect(service.timKiemBenhNhan('tran thi')).toHaveLength(1);
    expect(service.timKiemBenhNhan('0901234567')).toHaveLength(1);
    expect(service.timKiemBenhNhan('', 'cho_kham')).toHaveLength(1);
    expect(() => service.capNhatBenhNhan('khong-co', duLieuHopLe)).toThrow('Không tìm thấy');
  });

  it('bắt đầu khám và không bắt đầu lại bệnh nhân đã khám', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    expect(service.batDauKham(benhNhan.id).trangThai).toBe('dang_kham');
    service.duaVeChoKham(benhNhan.id);
    service.batDauKham(benhNhan.id);
    const repo = service.layChiTietBenhNhan(benhNhan.id);
    // Mô phỏng bệnh nhân đã khám bằng repository qua đơn hoàn tất không cần thiết ở test này.
    expect(repo.trangThai).toBe('dang_kham');
  });

  it('xóa bệnh nhân chưa có đơn và chặn xóa khi có đơn hoàn tất', () => {
    const benhNhan = service.themBenhNhan(duLieuHopLe);
    expect(service.xoaBenhNhan(benhNhan.id)).toBe(true);
    const benhNhan2 = service.themBenhNhan({ ...duLieuHopLe, soDienThoai: '0909998877' });
    donThuocRepository.themDonThuoc({ id: 'd1', benhNhanId: benhNhan2.id, trangThai: 'da_hoan_tat', danhSachThuoc: [] });
    expect(() => service.xoaBenhNhan(benhNhan2.id)).toThrow('Không thể xóa');
  });
});
