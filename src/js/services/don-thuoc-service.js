import { TRANG_THAI_BENH_NHAN, TRANG_THAI_DON_THUOC } from '../constants/hang-so.js';
import { chuanHoaChuoi } from '../utils/kiem-tra.js';
import { coTheLapDonThuoc } from '../business/benh-nhan-business.js';
import {
  coTheHuyDonThuoc,
  coTheSuaDonThuoc,
  kiemTraDonThuocCoTheHoanTat,
  sapXepDonThuocMoiNhat,
  taoDonThuocMoi,
  taoThuocTrongDon,
  themThuocVaoDanhSach,
  timKiemDonThuoc as timKiemDonThuocBusiness,
  xoaThuocKhoiDanhSach,
} from '../business/don-thuoc-business.js';

export function taoDonThuocService({ donThuocRepository, benhNhanRepository, taoId, taoMaDonThuoc, layThoiGianHienTai }) {
  function layBenhNhanBatBuoc(id) {
    const benhNhan = benhNhanRepository.timBenhNhanTheoId(id);
    if (!benhNhan) throw new Error('Không tìm thấy bệnh nhân.');
    return benhNhan;
  }

  function layDonBatBuoc(id) {
    const don = donThuocRepository.timDonThuocTheoId(id);
    if (!don) throw new Error('Không tìm thấy đơn thuốc.');
    return don;
  }

  function taoDonThuocNhap(benhNhanId, thongTinKham = {}) {
    const benhNhan = layBenhNhanBatBuoc(benhNhanId);
    if (!coTheLapDonThuoc(benhNhan)) throw new Error('Bệnh nhân không ở trạng thái có thể lập đơn.');
    const donNhapCu = donThuocRepository.timDonThuocTheoBenhNhan(benhNhanId)
      .find((don) => don.trangThai === TRANG_THAI_DON_THUOC.NHAP);
    if (donNhapCu) return donNhapCu;
    const thoiGian = layThoiGianHienTai();
    const don = taoDonThuocMoi({ id: taoId(), maDonThuoc: taoMaDonThuoc(), benhNhanId, thongTinKham, thoiGian });
    const ketQua = donThuocRepository.themDonThuoc(don);
    if (benhNhan.trangThai === TRANG_THAI_BENH_NHAN.CHO_KHAM) {
      benhNhanRepository.thayDoiTrangThaiBenhNhan(benhNhanId, TRANG_THAI_BENH_NHAN.DANG_KHAM, thoiGian);
    }
    return ketQua;
  }

  function layDonThuocTheoId(id) { return layDonBatBuoc(id); }

  function layDanhSachDonThuoc() {
    return sapXepDonThuocMoiNhat(donThuocRepository.layTatCaDonThuoc().map((don) => {
      const benhNhan = benhNhanRepository.timBenhNhanTheoId(don.benhNhanId);
      return { ...don, tenBenhNhan: benhNhan?.hoTen ?? 'Bệnh nhân đã xóa', ngaySinhBenhNhan: benhNhan?.ngaySinh ?? '' };
    }));
  }

  function damBaoCoTheSua(don) {
    if (!coTheSuaDonThuoc(don)) throw new Error('Không thể sửa đơn thuốc đã hoàn tất hoặc đã hủy.');
  }

  function themThuocVaoDon(donThuocId, duLieuThuoc) {
    const don = layDonBatBuoc(donThuocId);
    damBaoCoTheSua(don);
    const thuoc = taoThuocTrongDon(duLieuThuoc, { id: taoId() });
    return donThuocRepository.capNhatDonThuoc(donThuocId, {
      danhSachThuoc: themThuocVaoDanhSach(don.danhSachThuoc, thuoc),
      ngayCapNhat: layThoiGianHienTai(),
    });
  }

  function xoaThuocKhoiDon(donThuocId, thuocId) {
    const don = layDonBatBuoc(donThuocId);
    damBaoCoTheSua(don);
    return donThuocRepository.capNhatDonThuoc(donThuocId, {
      danhSachThuoc: xoaThuocKhoiDanhSach(don.danhSachThuoc, thuocId),
      ngayCapNhat: layThoiGianHienTai(),
    });
  }

  function capNhatThongTinKham(donThuocId, thongTinKham) {
    const don = layDonBatBuoc(donThuocId);
    damBaoCoTheSua(don);
    return donThuocRepository.capNhatDonThuoc(donThuocId, {
      tenBacSi: chuanHoaChuoi(thongTinKham.tenBacSi),
      chuanDoan: chuanHoaChuoi(thongTinKham.chuanDoan),
      loiDan: chuanHoaChuoi(thongTinKham.loiDan),
      ngayCapNhat: layThoiGianHienTai(),
    });
  }

  function luuNhapDonThuoc(donThuocId, thongTinKham = null) {
    if (thongTinKham) return capNhatThongTinKham(donThuocId, thongTinKham);
    return layDonBatBuoc(donThuocId);
  }

  function hoanTatDonThuoc(donThuocId, thongTinKham = null) {
    let don = thongTinKham ? capNhatThongTinKham(donThuocId, thongTinKham) : layDonBatBuoc(donThuocId);
    damBaoCoTheSua(don);
    const kiemTra = kiemTraDonThuocCoTheHoanTat(don);
    if (!kiemTra.hopLe) throw new Error(Object.values(kiemTra.loi)[0]);
    const thoiGian = layThoiGianHienTai();
    don = donThuocRepository.capNhatDonThuoc(donThuocId, { trangThai: TRANG_THAI_DON_THUOC.DA_HOAN_TAT, ngayCapNhat: thoiGian });
    benhNhanRepository.thayDoiTrangThaiBenhNhan(don.benhNhanId, TRANG_THAI_BENH_NHAN.DA_KHAM, thoiGian);
    return don;
  }

  function huyDonThuoc(donThuocId) {
    const don = layDonBatBuoc(donThuocId);
    if (!coTheHuyDonThuoc(don)) throw new Error('Không thể hủy đơn thuốc đã hoàn tất.');
    const thoiGian = layThoiGianHienTai();
    const ketQua = donThuocRepository.capNhatDonThuoc(donThuocId, { trangThai: TRANG_THAI_DON_THUOC.DA_HUY, ngayCapNhat: thoiGian });
    const benhNhan = benhNhanRepository.timBenhNhanTheoId(don.benhNhanId);
    if (benhNhan?.trangThai === TRANG_THAI_BENH_NHAN.DANG_KHAM) {
      benhNhanRepository.thayDoiTrangThaiBenhNhan(don.benhNhanId, TRANG_THAI_BENH_NHAN.CHO_KHAM, thoiGian);
    }
    return ketQua;
  }

  function timKiemDonThuoc(tuKhoa = '', trangThai = '') {
    return timKiemDonThuocBusiness(layDanhSachDonThuoc(), tuKhoa, trangThai);
  }

  return { taoDonThuocNhap, layDonThuocTheoId, layDanhSachDonThuoc, themThuocVaoDon, xoaThuocKhoiDon, capNhatThongTinKham, luuNhapDonThuoc, hoanTatDonThuoc, huyDonThuoc, timKiemDonThuoc };
}
