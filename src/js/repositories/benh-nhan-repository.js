import { KHOA_LUU_TRU } from '../constants/hang-so.js';

export function taoBenhNhanRepository(khoLuuTru) {
  const khoa = KHOA_LUU_TRU.BENH_NHAN;

  function layTatCaBenhNhan() {
    return khoLuuTru.docDanhSach(khoa).map((item) => ({ ...item }));
  }

  function timBenhNhanTheoId(id) {
    return layTatCaBenhNhan().find((item) => item.id === id) ?? null;
  }

  function themBenhNhan(benhNhan) {
    const danhSach = layTatCaBenhNhan();
    danhSach.push({ ...benhNhan });
    khoLuuTru.ghiDanhSach(khoa, danhSach);
    return { ...benhNhan };
  }

  function capNhatBenhNhan(id, duLieu) {
    const danhSach = layTatCaBenhNhan();
    const viTri = danhSach.findIndex((item) => item.id === id);
    if (viTri < 0) return null;
    danhSach[viTri] = { ...danhSach[viTri], ...duLieu, id };
    khoLuuTru.ghiDanhSach(khoa, danhSach);
    return { ...danhSach[viTri] };
  }

  function xoaBenhNhan(id) {
    const danhSach = layTatCaBenhNhan();
    const danhSachMoi = danhSach.filter((item) => item.id !== id);
    if (danhSachMoi.length === danhSach.length) return false;
    khoLuuTru.ghiDanhSach(khoa, danhSachMoi);
    return true;
  }

  function thayDoiTrangThaiBenhNhan(id, trangThai, ngayCapNhat) {
    return capNhatBenhNhan(id, { trangThai, ngayCapNhat });
  }

  return { layTatCaBenhNhan, timBenhNhanTheoId, themBenhNhan, capNhatBenhNhan, xoaBenhNhan, thayDoiTrangThaiBenhNhan };
}
