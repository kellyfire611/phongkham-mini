import { laNgayTrongTuongLai } from './ngay-thang.js';

export function laChuoiRong(giaTri) {
  return typeof giaTri !== 'string' || giaTri.trim() === '';
}

export function chuanHoaChuoi(giaTri) {
  return typeof giaTri === 'string' ? giaTri.trim().replace(/\s+/g, ' ') : '';
}

export function kiemTraSoDienThoai(soDienThoai) {
  const giaTri = String(soDienThoai ?? '').replace(/[\s.-]/g, '');
  return /^(0|\+84)\d{9}$/.test(giaTri);
}

export function kiemTraSoDuong(giaTri) {
  const so = Number(giaTri);
  return Number.isFinite(so) && so > 0;
}

function taoKetQua(loi) {
  return { hopLe: Object.keys(loi).length === 0, loi };
}

export function kiemTraBenhNhan(duLieu, ngayHienTai = new Date()) {
  const loi = {};
  if (laChuoiRong(duLieu?.hoTen)) loi.hoTen = 'Ho ten benh nhan khong duoc de trong.';
  if (laChuoiRong(duLieu?.ngaySinh)) loi.ngaySinh = 'Ngay sinh khong duoc de trong.';
  else if (Number.isNaN(new Date(`${duLieu.ngaySinh}T00:00:00`).getTime())) loi.ngaySinh = 'Ngay sinh khong hop le.';
  else if (laNgayTrongTuongLai(duLieu.ngaySinh, ngayHienTai)) loi.ngaySinh = 'Ngay sinh khong duoc lon hon ngay hien tai.';
  if (!kiemTraSoDienThoai(duLieu?.soDienThoai)) loi.soDienThoai = 'So dien thoai khong hop le.';
  if (laChuoiRong(duLieu?.trieuChung)) loi.trieuChung = 'Trieu chung khong duoc de trong.';
  return taoKetQua(loi);
}

export function kiemTraThuocTrongDon(duLieu) {
  const loi = {};
  if (laChuoiRong(duLieu?.tenThuoc)) loi.tenThuoc = 'Ten thuoc khong duoc de trong.';
  if (!kiemTraSoDuong(duLieu?.soLuongMoiLan)) loi.soLuongMoiLan = 'So luong moi lan phai lon hon 0.';
  if (!kiemTraSoDuong(duLieu?.soLanMoiNgay)) loi.soLanMoiNgay = 'So lan moi ngay phai lon hon 0.';
  if (!kiemTraSoDuong(duLieu?.soNgayDung)) loi.soNgayDung = 'So ngay dung phai lon hon 0.';
  return taoKetQua(loi);
}

export function kiemTraThongTinKham(duLieu) {
  const loi = {};
  if (laChuoiRong(duLieu?.tenBacSi)) loi.tenBacSi = 'Ten bac si khong duoc de trong.';
  if (laChuoiRong(duLieu?.chuanDoan)) loi.chuanDoan = 'Chan doan khong duoc de trong.';
  return taoKetQua(loi);
}
