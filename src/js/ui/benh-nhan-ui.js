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
    document.querySelector('#button-luu-benh-nhan').textContent = 'Lưu bệnh nhân';
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
    document.querySelector('#button-luu-benh-nhan').textContent = 'Cập nhật bệnh nhân';
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
        taoO(benhNhan.maBenhNhan, 'Mã BN'),
        taoO(benhNhan.hoTen, 'Họ tên'),
        taoO(dinhDangNgay(benhNhan.ngaySinh), 'Ngày sinh'),
        taoO(benhNhan.soDienThoai, 'Số điện thoại'),
      );
      const tdTrangThai = document.createElement('td');
      tdTrangThai.dataset.label = 'Trạng thái';
      const badge = document.createElement('span');
      badge.className = `badge badge-${benhNhan.trangThai}`;
      badge.textContent = NHAN_TRANG_THAI[benhNhan.trangThai];
      tdTrangThai.append(badge);
      const tdAction = document.createElement('td');
      tdAction.dataset.label = 'Thao tác';
      const nhom = document.createElement('div');
      nhom.className = 'action-group';
      nhom.append(taoNut('Sửa', 'sua', benhNhan.id));
      if (benhNhan.trangThai !== 'da_kham') nhom.append(taoNut(benhNhan.trangThai === 'dang_kham' ? 'Tiếp tục khám' : 'Bắt đầu khám', 'kham', benhNhan.id, 'button-primary'));
      nhom.append(taoNut('Xóa', 'xoa', benhNhan.id, 'button-danger-outline'));
      tdAction.append(nhom);
      tr.append(tdTrangThai, tdAction);
      tbody.append(tr);
    });
    document.querySelector('#tong-benh-nhan').textContent = `${danhSach.length} bệnh nhân`;
    document.querySelector('#rong-benh-nhan').classList.toggle('is-hidden', danhSach.length > 0);
  }

  function xuLyLuuBenhNhan(event) {
    event.preventDefault();
    xoaLoiForm('#loi-form-benh-nhan');
    try {
      const id = document.querySelector('#benh-nhan-id').value;
      if (id) benhNhanService.capNhatBenhNhan(id, layDuLieuForm());
      else benhNhanService.themBenhNhan(layDuLieuForm());
      hienThiThongBaoThanhCong(id ? 'Cập nhật bệnh nhân thành công.' : 'Tiếp nhận bệnh nhân thành công.');
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
      if (nut.dataset.action === 'xoa' && xacNhanThaoTac('Bạn có chắc muốn xóa bệnh nhân này?')) {
        benhNhanService.xoaBenhNhan(nut.dataset.id);
        hienThiThongBaoThanhCong('Đã xóa bệnh nhân.');
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
