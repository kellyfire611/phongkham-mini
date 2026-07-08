import { NHAN_TRANG_THAI } from '../constants/hang-so.js';
import { dinhDangNgay } from '../utils/ngay-thang.js';
import { hienThiLoiForm, hienThiThongBaoLoi, hienThiThongBaoThanhCong, xacNhanThaoTac, xoaLoiForm } from './thong-bao-ui.js';

export function khoiTaoBenhNhanUI({ benhNhanService, donThuocService, onChonKham }) {
  const form = document.querySelector('#form-benh-nhan');
  const tbody = document.querySelector('#danh-sach-benh-nhan');
  const timKiem = document.querySelector('#tim-benh-nhan');
  const locTrangThai = document.querySelector('#loc-trang-thai-benh-nhan');

  function layDuLieuForm() {
    return {
      hoTen: document.querySelector('#ho-ten').value,
      ngaySinh: document.querySelector('#ngay-sinh').value,
      gioiTinh: document.querySelector('#gioi-tinh').value,
      soDienThoai: document.querySelector('#so-dien-thoai').value,
      diaChi: document.querySelector('#dia-chi').value,
      trieuChung: document.querySelector('#trieu-chung').value,
      tienSuBenh: document.querySelector('#tien-su-benh').value,
      diUngThuoc: document.querySelector('#di-ung-thuoc').value,
    };
  }

  function lamMoiFormBenhNhan() {
    form.reset();
    document.querySelector('#benh-nhan-id').value = '';
    document.querySelector('#button-luu-benh-nhan').textContent = 'Luu benh nhan';
    xoaLoiForm('#loi-form-benh-nhan');
  }

  function dienDuLieuBenhNhanVaoForm(benhNhan) {
    document.querySelector('#benh-nhan-id').value = benhNhan.id;
    document.querySelector('#ho-ten').value = benhNhan.hoTen;
    document.querySelector('#ngay-sinh').value = benhNhan.ngaySinh;
    document.querySelector('#gioi-tinh').value = benhNhan.gioiTinh;
    document.querySelector('#so-dien-thoai').value = benhNhan.soDienThoai;
    document.querySelector('#dia-chi').value = benhNhan.diaChi;
    document.querySelector('#trieu-chung').value = benhNhan.trieuChung;
    document.querySelector('#tien-su-benh').value = benhNhan.tienSuBenh;
    document.querySelector('#di-ung-thuoc').value = benhNhan.diUngThuoc;
    document.querySelector('#button-luu-benh-nhan').textContent = 'Cap nhat benh nhan';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function taoNut(noiDung, action, id, className = 'button-secondary') {
    const nut = document.createElement('button');
    nut.type = 'button';
    nut.textContent = noiDung;
    nut.className = `button button-small ${className}`;
    nut.dataset.action = action;
    nut.dataset.id = id;
    return nut;
  }

  function taoO(noiDung, nhan) {
    const td = document.createElement('td');
    td.dataset.label = nhan;
    td.textContent = noiDung;
    return td;
  }

  function hienThiDanhSachBenhNhan() {
    const danhSach = benhNhanService.timKiemBenhNhan(timKiem.value, locTrangThai.value);
    tbody.innerHTML = '';
    danhSach.forEach((benhNhan) => {
      const tr = document.createElement('tr');
      tr.dataset.patientId = benhNhan.id;
      tr.append(
        taoO(benhNhan.maBenhNhan, 'Ma BN'),
        taoO(benhNhan.hoTen, 'Ho ten'),
        taoO(dinhDangNgay(benhNhan.ngaySinh), 'Ngay sinh'),
        taoO(benhNhan.soDienThoai, 'So dien thoai'),
      );
      const tdTrangThai = document.createElement('td');
      tdTrangThai.dataset.label = 'Trang thai';
      const badge = document.createElement('span');
      badge.className = `badge badge-${benhNhan.trangThai}`;
      badge.textContent = NHAN_TRANG_THAI[benhNhan.trangThai];
      tdTrangThai.append(badge);
      const tdAction = document.createElement('td');
      tdAction.dataset.label = 'Thao tac';
      const nhom = document.createElement('div');
      nhom.className = 'action-group';
      nhom.append(taoNut('Sua', 'sua', benhNhan.id));
      if (benhNhan.trangThai !== 'da_kham') nhom.append(taoNut(benhNhan.trangThai === 'dang_kham' ? 'Tiep tuc kham' : 'Bat dau kham', 'kham', benhNhan.id, 'button-primary'));
      nhom.append(taoNut('Xoa', 'xoa', benhNhan.id, 'button-danger-outline'));
      tdAction.append(nhom);
      tr.append(tdTrangThai, tdAction);
      tbody.append(tr);
    });
    document.querySelector('#tong-benh-nhan').textContent = `${danhSach.length} benh nhan`;
    document.querySelector('#rong-benh-nhan').classList.toggle('is-hidden', danhSach.length > 0);
  }

  function xuLyLuuBenhNhan(event) {
    event.preventDefault();
    xoaLoiForm('#loi-form-benh-nhan');
    try {
      const id = document.querySelector('#benh-nhan-id').value;
      if (id) benhNhanService.capNhatBenhNhan(id, layDuLieuForm());
      else benhNhanService.themBenhNhan(layDuLieuForm());
      hienThiThongBaoThanhCong(id ? 'Cap nhat benh nhan thanh cong.' : 'Tiep nhan benh nhan thanh cong.');
      lamMoiFormBenhNhan();
      hienThiDanhSachBenhNhan();
    } catch (error) {
      hienThiLoiForm('#loi-form-benh-nhan', [error.message]);
    }
  }

  function xuLyThaoTacDanhSach(event) {
    const nut = event.target.closest('button[data-action]');
    if (!nut) return;
    try {
      if (nut.dataset.action === 'sua') dienDuLieuBenhNhanVaoForm(benhNhanService.layChiTietBenhNhan(nut.dataset.id));
      if (nut.dataset.action === 'xoa' && xacNhanThaoTac('Ban co chac muon xoa benh nhan nay?')) {
        benhNhanService.xoaBenhNhan(nut.dataset.id);
        hienThiThongBaoThanhCong('Da xoa benh nhan.');
        hienThiDanhSachBenhNhan();
      }
      if (nut.dataset.action === 'kham') {
        benhNhanService.batDauKham(nut.dataset.id);
        const don = donThuocService.taoDonThuocNhap(nut.dataset.id, {});
        onChonKham(don.id);
        hienThiDanhSachBenhNhan();
      }
    } catch (error) {
      hienThiThongBaoLoi(error.message);
    }
  }

  form.addEventListener('submit', xuLyLuuBenhNhan);
  document.querySelector('#button-lam-moi-benh-nhan').addEventListener('click', lamMoiFormBenhNhan);
  timKiem.addEventListener('input', hienThiDanhSachBenhNhan);
  locTrangThai.addEventListener('change', hienThiDanhSachBenhNhan);
  tbody.addEventListener('click', xuLyThaoTacDanhSach);
  hienThiDanhSachBenhNhan();

  return { hienThiDanhSachBenhNhan, lamMoiFormBenhNhan };
}
