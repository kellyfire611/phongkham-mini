import { TRANG_THAI_BENH_NHAN } from '../constants/hang-so.js';
import { kiemTraBenhNhan } from '../utils/kiem-tra.js';
import {
  chuanHoaBenhNhan,
  coTheBatDauKham,
  coTheXoaBenhNhan,
  locBenhNhanTheoTrangThai,
  locBenhNhanTheoTuKhoa,
  sapXepBenhNhanMoiNhat,
  taoBenhNhanMoi,
  timBenhNhanTrung,
} from '../business/benh-nhan-business.js';

export function taoBenhNhanService({ benhNhanRepository, donThuocRepository, taoId, taoMaBenhNhan, layThoiGianHienTai }) {
  function layDanhSachBenhNhan() {
    return sapXepBenhNhanMoiNhat(benhNhanRepository.layTatCaBenhNhan());
  }

  function layChiTietBenhNhan(id) {
    const benhNhan = benhNhanRepository.timBenhNhanTheoId(id);
    if (!benhNhan) throw new Error('Khong tim thay benh nhan.');
    return benhNhan;
  }

  function themBenhNhan(duLieu) {
    const thoiGian = layThoiGianHienTai();
    const duLieuChuan = chuanHoaBenhNhan(duLieu);
    const kiemTra = kiemTraBenhNhan(duLieuChuan, thoiGian);
    if (!kiemTra.hopLe) throw new Error(Object.values(kiemTra.loi)[0]);
    if (timBenhNhanTrung(benhNhanRepository.layTatCaBenhNhan(), duLieuChuan)) throw new Error('Benh nhan da ton tai.');
    return benhNhanRepository.themBenhNhan(taoBenhNhanMoi(duLieuChuan, {
      id: taoId(),
      maBenhNhan: taoMaBenhNhan(),
      thoiGian,
    }));
  }

  function capNhatBenhNhan(id, duLieu) {
    layChiTietBenhNhan(id);
    const thoiGian = layThoiGianHienTai();
    const duLieuChuan = chuanHoaBenhNhan(duLieu);
    const kiemTra = kiemTraBenhNhan(duLieuChuan, thoiGian);
    if (!kiemTra.hopLe) throw new Error(Object.values(kiemTra.loi)[0]);
    if (timBenhNhanTrung(benhNhanRepository.layTatCaBenhNhan(), duLieuChuan, id)) throw new Error('Benh nhan da ton tai.');
    return benhNhanRepository.capNhatBenhNhan(id, { ...duLieuChuan, ngayCapNhat: thoiGian });
  }

  function xoaBenhNhan(id) {
    layChiTietBenhNhan(id);
    if (!coTheXoaBenhNhan(id, donThuocRepository.layTatCaDonThuoc())) throw new Error('Khong the xoa benh nhan da co don thuoc hoan tat.');
    benhNhanRepository.xoaBenhNhan(id);
    return true;
  }

  function timKiemBenhNhan(tuKhoa = '', trangThai = '') {
    return sapXepBenhNhanMoiNhat(locBenhNhanTheoTrangThai(locBenhNhanTheoTuKhoa(benhNhanRepository.layTatCaBenhNhan(), tuKhoa), trangThai));
  }

  function batDauKham(id) {
    const benhNhan = layChiTietBenhNhan(id);
    if (benhNhan.trangThai === TRANG_THAI_BENH_NHAN.DANG_KHAM) return benhNhan;
    if (!coTheBatDauKham(benhNhan)) throw new Error('Benh nhan khong con o trang thai cho kham.');
    return benhNhanRepository.thayDoiTrangThaiBenhNhan(id, TRANG_THAI_BENH_NHAN.DANG_KHAM, layThoiGianHienTai());
  }

  function duaVeChoKham(id) {
    layChiTietBenhNhan(id);
    return benhNhanRepository.thayDoiTrangThaiBenhNhan(id, TRANG_THAI_BENH_NHAN.CHO_KHAM, layThoiGianHienTai());
  }

  function taoDuLieuBenhNhanMau() {
    const mau = [
      { hoTen: 'Nguyen Van An', ngaySinh: '1988-05-12', gioiTinh: 'Nam', soDienThoai: '0901112233', diaChi: 'Ninh Kieu, Can Tho', trieuChung: 'Dau dau, met moi', tienSuBenh: 'Khong', diUngThuoc: 'Chua ghi nhan' },
      { hoTen: 'Tran Thi Binh', ngaySinh: '1994-10-03', gioiTinh: 'Nu', soDienThoai: '0912223344', diaChi: 'Cai Rang, Can Tho', trieuChung: 'Ho va dau hong', tienSuBenh: 'Viem mui di ung', diUngThuoc: 'Chua ghi nhan' },
    ];
    return mau.map((item) => themBenhNhan(item));
  }

  return { layDanhSachBenhNhan, layChiTietBenhNhan, themBenhNhan, capNhatBenhNhan, xoaBenhNhan, timKiemBenhNhan, batDauKham, duaVeChoKham, taoDuLieuBenhNhanMau };
}
