import { TRANG_THAI_DON_THUOC } from '../constants/hang-so.js';
import { chuanHoaChuoi, kiemTraThuocTrongDon, kiemTraThongTinKham } from '../utils/kiem-tra.js';

export function tinhTongSoLuongThuoc(soLuongMoiLan, soLanMoiNgay, soNgayDung) {
  const cacSo = [soLuongMoiLan, soLanMoiNgay, soNgayDung].map(Number);
  if (cacSo.some((so) => !Number.isFinite(so) || so <= 0)) throw new Error('Lieu dung phai la cac so lon hon 0.');
  return Number((cacSo[0] * cacSo[1] * cacSo[2]).toFixed(2));
}

export function taoThuocTrongDon(duLieu, { id }) {
  const ketQua = kiemTraThuocTrongDon(duLieu);
  if (!ketQua.hopLe) throw new Error(Object.values(ketQua.loi)[0]);
  return {
    id,
    tenThuoc: chuanHoaChuoi(duLieu.tenThuoc),
    hamLuong: chuanHoaChuoi(duLieu.hamLuong),
    donVi: chuanHoaChuoi(duLieu.donVi),
    soLuongMoiLan: Number(duLieu.soLuongMoiLan),
    soLanMoiNgay: Number(duLieu.soLanMoiNgay),
    soNgayDung: Number(duLieu.soNgayDung),
    tongSoLuong: tinhTongSoLuongThuoc(duLieu.soLuongMoiLan, duLieu.soLanMoiNgay, duLieu.soNgayDung),
    cachDung: chuanHoaChuoi(duLieu.cachDung),
    thoiDiemDung: chuanHoaChuoi(duLieu.thoiDiemDung),
  };
}

export function taoDonThuocMoi({ id, maDonThuoc, benhNhanId, thongTinKham = {}, thoiGian }) {
  return {
    id,
    maDonThuoc,
    benhNhanId,
    tenBacSi: chuanHoaChuoi(thongTinKham.tenBacSi),
    chuanDoan: chuanHoaChuoi(thongTinKham.chuanDoan),
    loiDan: chuanHoaChuoi(thongTinKham.loiDan),
    ngayKeDon: thoiGian,
    ngayCapNhat: thoiGian,
    danhSachThuoc: [],
    trangThai: TRANG_THAI_DON_THUOC.NHAP,
  };
}

export function themThuocVaoDanhSach(danhSach, thuoc) {
  return [...danhSach.map((item) => ({ ...item })), { ...thuoc }];
}

export function xoaThuocKhoiDanhSach(danhSach, thuocId) {
  return danhSach.filter((item) => item.id !== thuocId).map((item) => ({ ...item }));
}

export function kiemTraDonThuocCoTheHoanTat(donThuoc) {
  const thongTin = kiemTraThongTinKham(donThuoc);
  const loi = { ...thongTin.loi };
  if (!Array.isArray(donThuoc?.danhSachThuoc) || donThuoc.danhSachThuoc.length === 0) loi.danhSachThuoc = 'Don thuoc phai co it nhat mot loai thuoc.';
  return { hopLe: Object.keys(loi).length === 0, loi };
}

export function coTheSuaDonThuoc(donThuoc) {
  return donThuoc?.trangThai === TRANG_THAI_DON_THUOC.NHAP;
}

export function coTheHuyDonThuoc(donThuoc) {
  return donThuoc?.trangThai === TRANG_THAI_DON_THUOC.NHAP;
}

export function timKiemDonThuoc(danhSach, tuKhoa = '', trangThai = '') {
  const khoa = chuanHoaChuoi(tuKhoa).toLocaleLowerCase('vi');
  return danhSach.filter((item) => {
    const dungTrangThai = !trangThai || item.trangThai === trangThai;
    const dungTuKhoa = !khoa || [item.maDonThuoc, item.tenBenhNhan, item.tenBacSi]
      .some((giaTri) => String(giaTri ?? '').toLocaleLowerCase('vi').includes(khoa));
    return dungTrangThai && dungTuKhoa;
  });
}

export function sapXepDonThuocMoiNhat(danhSach) {
  return [...danhSach].sort((a, b) => new Date(b.ngayCapNhat ?? b.ngayKeDon) - new Date(a.ngayCapNhat ?? a.ngayKeDon));
}
