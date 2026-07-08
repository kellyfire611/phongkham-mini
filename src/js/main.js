import { taoId, taoMaBenhNhan, taoMaDonThuoc } from './utils/ma.js';
import { taoKhoLuuTru } from './repositories/kho-luu-tru.js';
import { taoBenhNhanRepository } from './repositories/benh-nhan-repository.js';
import { taoDonThuocRepository } from './repositories/don-thuoc-repository.js';
import { taoBenhNhanService } from './services/benh-nhan-service.js';
import { taoDonThuocService } from './services/don-thuoc-service.js';
import { khoiTaoBenhNhanUI } from './ui/benh-nhan-ui.js';
import { khoiTaoKhamBenhUI } from './ui/kham-benh-ui.js';
import { khoiTaoDonThuocUI } from './ui/don-thuoc-ui.js';
import { hienThiThongBaoLoi, hienThiThongBaoThanhCong, xacNhanThaoTac } from './ui/thong-bao-ui.js';

const khoLuuTru = taoKhoLuuTru(window.localStorage);
const benhNhanRepository = taoBenhNhanRepository(khoLuuTru);
const donThuocRepository = taoDonThuocRepository(khoLuuTru);
const layThoiGianHienTai = () => new Date().toISOString();
const benhNhanService = taoBenhNhanService({
  benhNhanRepository,
  donThuocRepository,
  taoId: () => taoId(),
  taoMaBenhNhan: () => taoMaBenhNhan(),
  layThoiGianHienTai,
});
const donThuocService = taoDonThuocService({
  donThuocRepository,
  benhNhanRepository,
  taoId: () => taoId(),
  taoMaDonThuoc: () => taoMaDonThuoc(),
  layThoiGianHienTai,
});

function moKhuVuc(tenKhuVuc) {
  document.querySelectorAll('[data-section-panel]').forEach((phanTu) => phanTu.classList.toggle('is-hidden', phanTu.dataset.sectionPanel !== tenKhuVuc));
  document.querySelectorAll('[data-section]').forEach((nut) => nut.classList.toggle('is-active', nut.dataset.section === tenKhuVuc));
}

let benhNhanUI;
let khamBenhUI;
let donThuocUI;

benhNhanUI = khoiTaoBenhNhanUI({
  benhNhanService,
  donThuocService,
  onChonKham: (donId) => {
    khamBenhUI.chonBenhNhanDeKham(donId);
    donThuocUI.hienThiDanhSachDonThuoc();
    moKhuVuc('kham-benh');
  },
});

khamBenhUI = khoiTaoKhamBenhUI({
  benhNhanService,
  donThuocService,
  khoLuuTru,
  onHoanTat: () => {
    benhNhanUI.hienThiDanhSachBenhNhan();
    donThuocUI.hienThiDanhSachDonThuoc();
    moKhuVuc('lich-su');
  },
  onHuy: () => {
    benhNhanUI.hienThiDanhSachBenhNhan();
    donThuocUI.hienThiDanhSachDonThuoc();
    moKhuVuc('tiep-nhan');
  },
});

donThuocUI = khoiTaoDonThuocUI({
  donThuocService,
  benhNhanService,
  khoLuuTru,
  onThayDoi: () => {
    benhNhanUI.hienThiDanhSachBenhNhan();
    khamBenhUI.hienThiDonDangMo();
  },
});

document.querySelectorAll('[data-section]').forEach((nut) => nut.addEventListener('click', () => {
  moKhuVuc(nut.dataset.section);
  if (nut.dataset.section === 'tiep-nhan') benhNhanUI.hienThiDanhSachBenhNhan();
  if (nut.dataset.section === 'kham-benh') khamBenhUI.hienThiDonDangMo();
  if (nut.dataset.section === 'lich-su') donThuocUI.hienThiDanhSachDonThuoc();
}));

document.querySelector('#button-du-lieu-mau').addEventListener('click', () => {
  try {
    benhNhanService.taoDuLieuBenhNhanMau();
    benhNhanUI.hienThiDanhSachBenhNhan();
    hienThiThongBaoThanhCong('Đã tạo dữ liệu bệnh nhân mẫu.');
  } catch (error) { hienThiThongBaoLoi(error.message); }
});

document.querySelector('#button-xoa-du-lieu').addEventListener('click', () => {
  if (!xacNhanThaoTac('Xóa toàn bộ bệnh nhân và đơn thuốc trong trình duyệt?')) return;
  khoLuuTru.xoaToanBo();
  benhNhanUI.lamMoiFormBenhNhan();
  benhNhanUI.hienThiDanhSachBenhNhan();
  khamBenhUI.hienThiDonDangMo();
  donThuocUI.hienThiDanhSachDonThuoc();
  moKhuVuc('tiep-nhan');
  hienThiThongBaoThanhCong('Đã xóa toàn bộ dữ liệu ứng dụng.');
});

window.addEventListener('error', (event) => hienThiThongBaoLoi(event.error?.message ?? 'Ứng dụng gặp lỗi không xác định.'));
moKhuVuc('tiep-nhan');
