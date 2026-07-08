function dinhDangPhanNgauNhien(giaTri) {
  if (typeof giaTri === 'number') {
    return Math.floor(Math.abs(giaTri) * 10_000).toString().padStart(4, '0').slice(0, 4);
  }
  return String(giaTri ?? '0000').replace(/\D/g, '').padEnd(4, '0').slice(0, 4);
}

function dinhDangNgayMa(thoiGian) {
  const ngay = new Date(thoiGian);
  if (Number.isNaN(ngay.getTime())) throw new Error('Thoi gian tao ma khong hop le.');
  const nam = ngay.getFullYear();
  const thang = String(ngay.getMonth() + 1).padStart(2, '0');
  const ngayTrongThang = String(ngay.getDate()).padStart(2, '0');
  return `${nam}${thang}${ngayTrongThang}`;
}

export function taoId(thoiGian = Date.now(), phanNgauNhien = Math.random()) {
  return `${Number(thoiGian).toString(36)}-${dinhDangPhanNgauNhien(phanNgauNhien)}`;
}

export function taoMaBenhNhan(thoiGian = new Date(), phanNgauNhien = Math.random()) {
  return `BN-${dinhDangNgayMa(thoiGian)}-${dinhDangPhanNgauNhien(phanNgauNhien)}`;
}

export function taoMaDonThuoc(thoiGian = new Date(), phanNgauNhien = Math.random()) {
  return `DT-${dinhDangNgayMa(thoiGian)}-${dinhDangPhanNgauNhien(phanNgauNhien)}`;
}
