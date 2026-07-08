import { KHOA_LUU_TRU } from '../constants/hang-so.js';
import { tinhTongSoLuongThuoc } from '../business/don-thuoc-business.js';
import { dinhDangNgay } from '../utils/ngay-thang.js';
import { hienThiLoiForm, hienThiThongBaoLoi, hienThiThongBaoThanhCong, xacNhanThaoTac, xoaLoiForm } from './thong-bao-ui.js';

export function khoiTaoKhamBenhUI({ benhNhanService, donThuocService, khoLuuTru, onHoanTat, onHuy }) {
  let donDangMoId = khoLuuTru.docGiaTri(KHOA_LUU_TRU.DON_DANG_MO, '');
  const formThuoc = document.querySelector('#form-thuoc');
  const tbody = document.querySelector('#danh-sach-thuoc');

  function layThongTinKham() {
    return {
      tenBacSi: document.querySelector('#ten-bac-si').value,
      chuanDoan: document.querySelector('#chuan-doan').value,
      loiDan: document.querySelector('#loi-dan').value,
    };
  }

  function layDuLieuThuoc() {
    return {
      tenThuoc: document.querySelector('#ten-thuoc').value,
      hamLuong: document.querySelector('#ham-luong').value,
      donVi: document.querySelector('#don-vi').value,
      soLuongMoiLan: document.querySelector('#so-luong-moi-lan').value,
      soLanMoiNgay: document.querySelector('#so-lan-moi-ngay').value,
      soNgayDung: document.querySelector('#so-ngay-dung').value,
      cachDung: document.querySelector('#cach-dung').value,
      thoiDiemDung: document.querySelector('#thoi-diem-dung').value,
    };
  }

  function tinhVaHienThiTong() {
    try {
      const duLieu = layDuLieuThuoc();
      document.querySelector('#tong-so-luong').value = tinhTongSoLuongThuoc(duLieu.soLuongMoiLan, duLieu.soLanMoiNgay, duLieu.soNgayDung);
    } catch {
      document.querySelector('#tong-so-luong').value = '';
    }
  }

  function lamMoiFormThuoc() {
    formThuoc.reset();
    document.querySelector('#so-luong-moi-lan').value = 1;
    document.querySelector('#so-lan-moi-ngay').value = 1;
    document.querySelector('#so-ngay-dung').value = 1;
    tinhVaHienThiTong();
    xoaLoiForm('#loi-form-thuoc');
  }

  function hienThiDanhSachThuoc(don) {
    tbody.innerHTML = '';
    don.danhSachThuoc.forEach((thuoc, index) => {
      const tr = document.createElement('tr');
      const duLieu = [
        [index + 1, 'STT'],
        [thuoc.tenThuoc, 'Tên thuốc'],
        [thuoc.hamLuong || '-', 'Hàm lượng'],
        [`${thuoc.soLuongMoiLan} x ${thuoc.soLanMoiNgay} lần/ngày`, 'Liều dùng'],
        [thuoc.soNgayDung, 'Số ngày'],
        [`${thuoc.tongSoLuong} ${thuoc.donVi || ''}`.trim(), 'Tổng SL'],
        [[thuoc.cachDung, thuoc.thoiDiemDung].filter(Boolean).join(' - ') || '-', 'Cách dùng'],
      ];
      duLieu.forEach(([noiDung, nhan]) => {
        const td = document.createElement('td');
        td.dataset.label = nhan;
        td.textContent = noiDung;
        tr.append(td);
      });
      const td = document.createElement('td');
      td.dataset.label = 'Thao tác';
      const nut = document.createElement('button');
      nut.type = 'button';
      nut.className = 'button button-small button-danger-outline';
      nut.textContent = 'Xóa';
      nut.dataset.action = 'xoa-thuoc';
      nut.dataset.id = thuoc.id;
      td.append(nut);
      tr.append(td);
      tbody.append(tr);
    });
    document.querySelector('#rong-thuoc').classList.toggle('is-hidden', don.danhSachThuoc.length > 0);
  }

  function hienThiDonDangMo() {
    if (!donDangMoId) {
      document.querySelector('#chua-chon-benh-nhan').classList.remove('is-hidden');
      document.querySelector('#noi-dung-kham-benh').classList.add('is-hidden');
      return;
    }
    try {
      const don = donThuocService.layDonThuocTheoId(donDangMoId);
      if (don.trangThai !== 'nhap') throw new Error('Đơn thuốc không còn ở trạng thái nháp.');
      const benhNhan = benhNhanService.layChiTietBenhNhan(don.benhNhanId);
      document.querySelector('#chua-chon-benh-nhan').classList.add('is-hidden');
      document.querySelector('#noi-dung-kham-benh').classList.remove('is-hidden');
      document.querySelector('#kham-ho-ten').textContent = benhNhan.hoTen;
      document.querySelector('#kham-ma-benh-nhan').textContent = benhNhan.maBenhNhan;
      document.querySelector('#kham-ngay-sinh').textContent = dinhDangNgay(benhNhan.ngaySinh);
      document.querySelector('#kham-so-dien-thoai').textContent = benhNhan.soDienThoai;
      document.querySelector('#kham-trieu-chung').textContent = benhNhan.trieuChung || '-';
      document.querySelector('#kham-tien-su-benh').textContent = benhNhan.tienSuBenh || '-';
      document.querySelector('#kham-di-ung-thuoc').textContent = benhNhan.diUngThuoc || '-';
      document.querySelector('#ten-bac-si').value = don.tenBacSi;
      document.querySelector('#chuan-doan').value = don.chuanDoan;
      document.querySelector('#loi-dan').value = don.loiDan;
      document.querySelector('#ma-don-dang-kham').textContent = don.maDonThuoc;
      hienThiDanhSachThuoc(don);
    } catch (error) {
      donDangMoId = '';
      khoLuuTru.xoaTheoKhoa(KHOA_LUU_TRU.DON_DANG_MO);
      hienThiThongBaoLoi(error.message);
      hienThiDonDangMo();
    }
  }

  function chonBenhNhanDeKham(donId) {
    donDangMoId = donId;
    khoLuuTru.ghiGiaTri(KHOA_LUU_TRU.DON_DANG_MO, donId);
    hienThiDonDangMo();
  }

  function xuLyThemThuoc(event) {
    event.preventDefault();
    xoaLoiForm('#loi-form-thuoc');
    try {
      if (!donDangMoId) throw new Error('Chưa chọn bệnh nhân để kê đơn.');
      const don = donThuocService.themThuocVaoDon(donDangMoId, layDuLieuThuoc());
      hienThiDanhSachThuoc(don);
      lamMoiFormThuoc();
      hienThiThongBaoThanhCong('Đã thêm thuốc vào đơn.');
    } catch (error) {
      hienThiLoiForm('#loi-form-thuoc', [error.message]);
    }
  }

  function xuLyXoaThuoc(event) {
    const nut = event.target.closest('button[data-action="xoa-thuoc"]');
    if (!nut) return;
    try {
      const don = donThuocService.xoaThuocKhoiDon(donDangMoId, nut.dataset.id);
      hienThiDanhSachThuoc(don);
      hienThiThongBaoThanhCong('Đã xóa thuốc khỏi đơn.');
    } catch (error) { hienThiThongBaoLoi(error.message); }
  }

  function xuLyLuuNhapDonThuoc() {
    xoaLoiForm('#loi-form-kham');
    try {
      donThuocService.luuNhapDonThuoc(donDangMoId, layThongTinKham());
      hienThiThongBaoThanhCong('Đã lưu đơn thuốc nháp.');
    } catch (error) { hienThiLoiForm('#loi-form-kham', [error.message]); }
  }

  function xuLyHoanTatDonThuoc() {
    xoaLoiForm('#loi-form-kham');
    try {
      donThuocService.hoanTatDonThuoc(donDangMoId, layThongTinKham());
      donDangMoId = '';
      khoLuuTru.xoaTheoKhoa(KHOA_LUU_TRU.DON_DANG_MO);
      hienThiDonDangMo();
      hienThiThongBaoThanhCong('Hoàn tất đơn thuốc thành công.');
      onHoanTat();
    } catch (error) { hienThiLoiForm('#loi-form-kham', [error.message]); }
  }

  function xuLyHuyKham() {
    if (!donDangMoId || !xacNhanThaoTac('Bạn có chắc muốn hủy đơn thuốc đang nháp?')) return;
    try {
      donThuocService.huyDonThuoc(donDangMoId);
      donDangMoId = '';
      khoLuuTru.xoaTheoKhoa(KHOA_LUU_TRU.DON_DANG_MO);
      hienThiDonDangMo();
      hienThiThongBaoThanhCong('Đã hủy đơn nháp và đưa bệnh nhân về chờ khám.');
      onHuy();
    } catch (error) { hienThiThongBaoLoi(error.message); }
  }

  formThuoc.addEventListener('submit', xuLyThemThuoc);
  tbody.addEventListener('click', xuLyXoaThuoc);
  ['#so-luong-moi-lan', '#so-lan-moi-ngay', '#so-ngay-dung'].forEach((selector) => document.querySelector(selector).addEventListener('input', tinhVaHienThiTong));
  document.querySelector('#button-luu-nhap').addEventListener('click', xuLyLuuNhapDonThuoc);
  document.querySelector('#button-hoan-tat-don').addEventListener('click', xuLyHoanTatDonThuoc);
  document.querySelector('#button-huy-kham').addEventListener('click', xuLyHuyKham);
  tinhVaHienThiTong();
  hienThiDonDangMo();

  return { chonBenhNhanDeKham, hienThiDonDangMo };
}
