const layThongBao = () => document.querySelector('#thong-bao-he-thong');

function hienThiThongBao(noiDung, loai) {
  const phanTu = layThongBao();
  phanTu.textContent = noiDung;
  phanTu.className = `notification notification-${loai}`;
  window.clearTimeout(hienThiThongBao.boDem);
  hienThiThongBao.boDem = window.setTimeout(() => phanTu.classList.add('is-hidden'), 5000);
}

export function hienThiThongBaoThanhCong(noiDung) { hienThiThongBao(noiDung, 'success'); }
export function hienThiThongBaoLoi(noiDung) { hienThiThongBao(noiDung, 'error'); }
export function hienThiThongBaoCanhBao(noiDung) { hienThiThongBao(noiDung, 'warning'); }
export function xoaThongBao() { layThongBao().classList.add('is-hidden'); }

export function hienThiLoiForm(selector, loi) {
  const phanTu = document.querySelector(selector);
  const danhSach = Array.isArray(loi) ? loi : Object.values(loi ?? {});
  phanTu.innerHTML = '';
  const ul = document.createElement('ul');
  danhSach.forEach((noiDung) => {
    const li = document.createElement('li');
    li.textContent = noiDung;
    ul.append(li);
  });
  phanTu.append(ul);
  phanTu.classList.toggle('is-hidden', danhSach.length === 0);
}

export function xoaLoiForm(selector) {
  const phanTu = document.querySelector(selector);
  phanTu.textContent = '';
  phanTu.classList.add('is-hidden');
}

export function xacNhanThaoTac(noiDung) {
  return window.confirm(noiDung);
}
