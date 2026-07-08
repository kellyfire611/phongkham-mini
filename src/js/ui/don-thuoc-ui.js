import { NHAN_TRANG_THAI, KHOA_LUU_TRU } from '../constants/hang-so.js';
import { dinhDangNgay, dinhDangNgayGio } from '../utils/ngay-thang.js';
import { hienThiThongBaoLoi, hienThiThongBaoThanhCong, xacNhanThaoTac } from './thong-bao-ui.js';

export function khoiTaoDonThuocUI({ donThuocService, benhNhanService, khoLuuTru, onThayDoi }) {
  const tbody = document.querySelector('#danh-sach-don-thuoc');
  const timKiem = document.querySelector('#tim-don-thuoc');
  const locTrangThai = document.querySelector('#loc-trang-thai-don-thuoc');
  const modal = document.querySelector('#modal-don-thuoc');
  let donDangXemId = '';

  function taoO(noiDung, nhan) {
    const td = document.createElement('td');
    td.dataset.label = nhan;
    td.textContent = noiDung;
    return td;
  }

  function hienThiDanhSachDonThuoc() {
    const danhSach = donThuocService.timKiemDonThuoc(timKiem.value, locTrangThai.value);
    tbody.innerHTML = '';
    danhSach.forEach((don) => {
      const tr = document.createElement('tr');
      tr.dataset.prescriptionId = don.id;
      tr.append(
        taoO(don.maDonThuoc, 'Mã đơn'),
        taoO(don.tenBenhNhan, 'Bệnh nhân'),
        taoO(don.tenBacSi || '-', 'Bác sĩ'),
        taoO(dinhDangNgayGio(don.ngayKeDon), 'Ngày kê'),
        taoO(don.danhSachThuoc.length, 'Số thuốc'),
      );
      const tdTrangThai = document.createElement('td');
      tdTrangThai.dataset.label = 'Trạng thái';
      const badge = document.createElement('span');
      badge.className = `badge badge-${don.trangThai}`;
      badge.textContent = NHAN_TRANG_THAI[don.trangThai];
      tdTrangThai.append(badge);
      const tdAction = document.createElement('td');
      tdAction.dataset.label = 'Thao tác';
      const nhom = document.createElement('div');
      nhom.className = 'action-group';
      const nutXem = document.createElement('button');
      nutXem.type = 'button'; nutXem.className = 'button button-small button-secondary'; nutXem.textContent = 'Xem'; nutXem.dataset.action = 'xem'; nutXem.dataset.id = don.id;
      nhom.append(nutXem);
      const nutIn = document.createElement('button');
      nutIn.type = 'button'; nutIn.className = 'button button-small button-primary'; nutIn.textContent = 'In'; nutIn.dataset.action = 'in'; nutIn.dataset.id = don.id;
      nhom.append(nutIn);
      if (don.trangThai === 'nhap') {
        const nutHuy = document.createElement('button');
        nutHuy.type = 'button'; nutHuy.className = 'button button-small button-danger-outline'; nutHuy.textContent = 'Hủy'; nutHuy.dataset.action = 'huy'; nutHuy.dataset.id = don.id;
        nhom.append(nutHuy);
      }
      tdAction.append(nhom);
      tr.append(tdTrangThai, tdAction);
      tbody.append(tr);
    });
    document.querySelector('#tong-don-thuoc').textContent = `${danhSach.length} đơn thuốc`;
    document.querySelector('#rong-don-thuoc').classList.toggle('is-hidden', danhSach.length > 0);
  }

  function hienThiChiTietDonThuoc(id) {
    const don = donThuocService.layDonThuocTheoId(id);
    const benhNhan = benhNhanService.layChiTietBenhNhan(don.benhNhanId);
    donDangXemId = id;
    document.querySelector('#chi-tiet-ma-don').textContent = don.maDonThuoc;
    document.querySelector('#chi-tiet-ngay-ke').textContent = dinhDangNgayGio(don.ngayKeDon);
    document.querySelector('#chi-tiet-benh-nhan').textContent = `${benhNhan.maBenhNhan} - ${benhNhan.hoTen}`;
    document.querySelector('#chi-tiet-ngay-sinh').textContent = dinhDangNgay(benhNhan.ngaySinh);
    document.querySelector('#chi-tiet-bac-si').textContent = don.tenBacSi || '-';
    document.querySelector('#chi-tiet-chuan-doan').textContent = don.chuanDoan || '-';
    document.querySelector('#chi-tiet-loi-dan').textContent = don.loiDan || '-';
    const tbodyThuoc = document.querySelector('#chi-tiet-danh-sach-thuoc');
    tbodyThuoc.innerHTML = '';
    don.danhSachThuoc.forEach((thuoc, index) => {
      const tr = document.createElement('tr');
      [
        index + 1,
        `${thuoc.tenThuoc}${thuoc.hamLuong ? ` - ${thuoc.hamLuong}` : ''}`,
        `${thuoc.soLuongMoiLan} x ${thuoc.soLanMoiNgay} lần/ngày x ${thuoc.soNgayDung} ngày`,
        `${thuoc.tongSoLuong} ${thuoc.donVi || ''}`.trim(),
        [thuoc.cachDung, thuoc.thoiDiemDung].filter(Boolean).join(' - ') || '-',
      ].forEach((noiDung) => { const td = document.createElement('td'); td.textContent = noiDung; tr.append(td); });
      tbodyThuoc.append(tr);
    });
    modal.classList.remove('is-hidden');
  }

  function dongChiTietDonThuoc() {
    modal.classList.add('is-hidden');
    donDangXemId = '';
  }

  function xuLyInDonThuoc(id = donDangXemId) {
    if (!id) return;
    if (modal.classList.contains('is-hidden') || donDangXemId !== id) hienThiChiTietDonThuoc(id);
    window.print();
  }

  function xuLyThaoTac(event) {
    const nut = event.target.closest('button[data-action]');
    if (!nut) return;
    try {
      if (nut.dataset.action === 'xem') hienThiChiTietDonThuoc(nut.dataset.id);
      if (nut.dataset.action === 'in') xuLyInDonThuoc(nut.dataset.id);
      if (nut.dataset.action === 'huy' && xacNhanThaoTac('Bạn có chắc muốn hủy đơn nháp này?')) {
        donThuocService.huyDonThuoc(nut.dataset.id);
        if (khoLuuTru.docGiaTri(KHOA_LUU_TRU.DON_DANG_MO, '') === nut.dataset.id) khoLuuTru.xoaTheoKhoa(KHOA_LUU_TRU.DON_DANG_MO);
        hienThiThongBaoThanhCong('Đã hủy đơn thuốc nháp.');
        hienThiDanhSachDonThuoc();
        onThayDoi();
      }
    } catch (error) { hienThiThongBaoLoi(error.message); }
  }

  timKiem.addEventListener('input', hienThiDanhSachDonThuoc);
  locTrangThai.addEventListener('change', hienThiDanhSachDonThuoc);
  tbody.addEventListener('click', xuLyThaoTac);
  document.querySelector('#button-dong-modal').addEventListener('click', dongChiTietDonThuoc);
  document.querySelector('#button-dong-modal-duoi').addEventListener('click', dongChiTietDonThuoc);
  document.querySelector('[data-close-modal]').addEventListener('click', dongChiTietDonThuoc);
  document.querySelector('#button-in-modal').addEventListener('click', () => xuLyInDonThuoc());
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') dongChiTietDonThuoc(); });
  hienThiDanhSachDonThuoc();

  return { hienThiDanhSachDonThuoc, hienThiChiTietDonThuoc, dongChiTietDonThuoc };
}
