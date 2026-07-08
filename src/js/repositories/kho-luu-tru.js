import { KHOA_LUU_TRU } from '../constants/hang-so.js';

export function taoKhoLuuTru(storage = globalThis.localStorage) {
  if (!storage) throw new Error('Không tìm thấy storage để lưu dữ liệu.');

  function docGiaTri(khoa, giaTriMacDinh = null) {
    const duLieu = storage.getItem(khoa);
    if (duLieu === null) return giaTriMacDinh;
    try {
      return JSON.parse(duLieu);
    } catch (error) {
      console.warn(`Dữ liệu tại khóa ${khoa} bị lỗi JSON.`, error);
      return giaTriMacDinh;
    }
  }

  function ghiGiaTri(khoa, giaTri) {
    storage.setItem(khoa, JSON.stringify(giaTri));
    return giaTri;
  }

  function docDanhSach(khoa) {
    const giaTri = docGiaTri(khoa, []);
    return Array.isArray(giaTri) ? giaTri : [];
  }

  function ghiDanhSach(khoa, danhSach) {
    if (!Array.isArray(danhSach)) throw new Error('Dữ liệu cần ghi phải là danh sách.');
    return ghiGiaTri(khoa, danhSach);
  }

  function xoaTheoKhoa(khoa) {
    storage.removeItem(khoa);
  }

  function xoaToanBo() {
    Object.values(KHOA_LUU_TRU).forEach((khoa) => storage.removeItem(khoa));
  }

  function khoiTaoDuLieuMau({ benhNhan = [], donThuoc = [] } = {}) {
    ghiDanhSach(KHOA_LUU_TRU.BENH_NHAN, benhNhan);
    ghiDanhSach(KHOA_LUU_TRU.DON_THUOC, donThuoc);
    ghiGiaTri(KHOA_LUU_TRU.PHIEN_BAN_DU_LIEU, 1);
  }

  return { storage, docDanhSach, ghiDanhSach, docGiaTri, ghiGiaTri, xoaTheoKhoa, xoaToanBo, khoiTaoDuLieuMau };
}
