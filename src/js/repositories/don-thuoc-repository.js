import { KHOA_LUU_TRU } from '../constants/hang-so.js';

export function taoDonThuocRepository(khoLuuTru) {
  const khoa = KHOA_LUU_TRU.DON_THUOC;

  function layTatCaDonThuoc() {
    return khoLuuTru.docDanhSach(khoa).map((item) => ({ ...item, danhSachThuoc: (item.danhSachThuoc ?? []).map((thuoc) => ({ ...thuoc })) }));
  }

  function timDonThuocTheoId(id) {
    return layTatCaDonThuoc().find((item) => item.id === id) ?? null;
  }

  function timDonThuocTheoBenhNhan(benhNhanId) {
    return layTatCaDonThuoc().filter((item) => item.benhNhanId === benhNhanId);
  }

  function themDonThuoc(donThuoc) {
    const danhSach = layTatCaDonThuoc();
    danhSach.push({ ...donThuoc, danhSachThuoc: donThuoc.danhSachThuoc.map((thuoc) => ({ ...thuoc })) });
    khoLuuTru.ghiDanhSach(khoa, danhSach);
    return timDonThuocTheoId(donThuoc.id);
  }

  function capNhatDonThuoc(id, duLieu) {
    const danhSach = layTatCaDonThuoc();
    const viTri = danhSach.findIndex((item) => item.id === id);
    if (viTri < 0) return null;
    danhSach[viTri] = {
      ...danhSach[viTri],
      ...duLieu,
      id,
      danhSachThuoc: (duLieu.danhSachThuoc ?? danhSach[viTri].danhSachThuoc ?? []).map((thuoc) => ({ ...thuoc })),
    };
    khoLuuTru.ghiDanhSach(khoa, danhSach);
    return timDonThuocTheoId(id);
  }

  function xoaDonThuoc(id) {
    const danhSach = layTatCaDonThuoc();
    const danhSachMoi = danhSach.filter((item) => item.id !== id);
    if (danhSachMoi.length === danhSach.length) return false;
    khoLuuTru.ghiDanhSach(khoa, danhSachMoi);
    return true;
  }

  return { layTatCaDonThuoc, timDonThuocTheoId, timDonThuocTheoBenhNhan, themDonThuoc, capNhatDonThuoc, xoaDonThuoc };
}
