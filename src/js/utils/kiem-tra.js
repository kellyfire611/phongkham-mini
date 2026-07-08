import { laNgayTrongTuongLai } from './ngay-thang.js';

export function laChuoiRong(giaTri) {
  return typeof giaTri !== 'string' || giaTri.trim() === '';
}

export function chuanHoaChuoi(giaTri) {
  return typeof giaTri === 'string' ? giaTri.trim().replace(/\s+/g, ' ') : '';
}

export function chuanHoaTuKhoaTimKiem(giaTri) {
  return chuanHoaChuoi(giaTri).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi');
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
  if (laChuoiRong(duLieu?.hoTen)) loi.hoTen = 'Họ tên bệnh nhân không được để trống.';
  if (laChuoiRong(duLieu?.ngaySinh)) loi.ngaySinh = 'Ngày sinh không được để trống.';
  else if (Number.isNaN(new Date(`${duLieu.ngaySinh}T00:00:00`).getTime())) loi.ngaySinh = 'Ngày sinh không hợp lệ.';
  else if (laNgayTrongTuongLai(duLieu.ngaySinh, ngayHienTai)) loi.ngaySinh = 'Ngày sinh không được lớn hơn ngày hiện tại.';
  if (!kiemTraSoDienThoai(duLieu?.soDienThoai)) loi.soDienThoai = 'Số điện thoại không hợp lệ.';
  if (laChuoiRong(duLieu?.trieuChung)) loi.trieuChung = 'Triệu chứng không được để trống.';
  return taoKetQua(loi);
}

export function kiemTraThuocTrongDon(duLieu) {
  const loi = {};
  if (laChuoiRong(duLieu?.tenThuoc)) loi.tenThuoc = 'Tên thuốc không được để trống.';
  if (!kiemTraSoDuong(duLieu?.soLuongMoiLan)) loi.soLuongMoiLan = 'Số lượng mỗi lần phải lớn hơn 0.';
  if (!kiemTraSoDuong(duLieu?.soLanMoiNgay)) loi.soLanMoiNgay = 'Số lần mỗi ngày phải lớn hơn 0.';
  if (!kiemTraSoDuong(duLieu?.soNgayDung)) loi.soNgayDung = 'Số ngày dùng phải lớn hơn 0.';
  return taoKetQua(loi);
}

export function kiemTraThongTinKham(duLieu) {
  const loi = {};
  if (laChuoiRong(duLieu?.tenBacSi)) loi.tenBacSi = 'Tên bác sĩ không được để trống.';
  if (laChuoiRong(duLieu?.chuanDoan)) loi.chuanDoan = 'Chẩn đoán không được để trống.';
  return taoKetQua(loi);
}
