import { TRANG_THAI_BENH_NHAN, TRANG_THAI_DON_THUOC } from '../constants/hang-so.js';
import { chuanHoaChuoi } from '../utils/kiem-tra.js';

export function chuanHoaBenhNhan(duLieu = {}) {
  return {
    ...duLieu,
    hoTen: chuanHoaChuoi(duLieu.hoTen),
    soDienThoai: chuanHoaChuoi(duLieu.soDienThoai).replace(/[\s.-]/g, ''),
    diaChi: chuanHoaChuoi(duLieu.diaChi),
    trieuChung: chuanHoaChuoi(duLieu.trieuChung),
    tienSuBenh: chuanHoaChuoi(duLieu.tienSuBenh),
    diUngThuoc: chuanHoaChuoi(duLieu.diUngThuoc),
  };
}

export function taoBenhNhanMoi(duLieu, { id, maBenhNhan, thoiGian }) {
  return {
    ...chuanHoaBenhNhan(duLieu),
    id,
    maBenhNhan,
    trangThai: TRANG_THAI_BENH_NHAN.CHO_KHAM,
    ngayTiepNhan: thoiGian,
    ngayCapNhat: thoiGian,
  };
}

export function timBenhNhanTrung(danhSach, duLieu, idLoaiTru = null) {
  const soDienThoai = String(duLieu.soDienThoai ?? '').replace(/[\s.-]/g, '');
  return danhSach.find((item) => item.id !== idLoaiTru
    && String(item.soDienThoai ?? '').replace(/[\s.-]/g, '') === soDienThoai
    && item.ngaySinh === duLieu.ngaySinh) ?? null;
}

export function locBenhNhanTheoTuKhoa(danhSach, tuKhoa = '') {
  const khoa = chuanHoaChuoi(tuKhoa).toLocaleLowerCase('vi');
  if (!khoa) return [...danhSach];
  return danhSach.filter((item) => [item.maBenhNhan, item.hoTen, item.soDienThoai]
    .some((giaTri) => String(giaTri ?? '').toLocaleLowerCase('vi').includes(khoa)));
}

export function locBenhNhanTheoTrangThai(danhSach, trangThai = '') {
  return trangThai ? danhSach.filter((item) => item.trangThai === trangThai) : [...danhSach];
}

export function sapXepBenhNhanMoiNhat(danhSach) {
  return [...danhSach].sort((a, b) => new Date(b.ngayTiepNhan) - new Date(a.ngayTiepNhan));
}

export function coTheXoaBenhNhan(benhNhanId, danhSachDonThuoc) {
  return !danhSachDonThuoc.some((don) => don.benhNhanId === benhNhanId && don.trangThai === TRANG_THAI_DON_THUOC.DA_HOAN_TAT);
}

export function coTheBatDauKham(benhNhan) {
  return benhNhan?.trangThai === TRANG_THAI_BENH_NHAN.CHO_KHAM;
}

export function coTheLapDonThuoc(benhNhan) {
  return [TRANG_THAI_BENH_NHAN.CHO_KHAM, TRANG_THAI_BENH_NHAN.DANG_KHAM].includes(benhNhan?.trangThai);
}
