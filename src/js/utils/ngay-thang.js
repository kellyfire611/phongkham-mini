export function layNgayHienTai(thoiGian = new Date()) {
  return chuyenNgaySangISO(thoiGian);
}

export function chuyenNgaySangISO(giaTri) {
  const ngay = giaTri instanceof Date ? giaTri : new Date(giaTri);
  if (Number.isNaN(ngay.getTime())) return '';
  const nam = ngay.getFullYear();
  const thang = String(ngay.getMonth() + 1).padStart(2, '0');
  const ngayTrongThang = String(ngay.getDate()).padStart(2, '0');
  return `${nam}-${thang}-${ngayTrongThang}`;
}

export function dinhDangNgay(giaTri) {
  if (!giaTri) return '-';
  const ngay = new Date(`${giaTri}`.length === 10 ? `${giaTri}T00:00:00` : giaTri);
  if (Number.isNaN(ngay.getTime())) return '-';
  return new Intl.DateTimeFormat('vi-VN').format(ngay);
}

export function dinhDangNgayGio(giaTri) {
  const ngay = new Date(giaTri);
  if (Number.isNaN(ngay.getTime())) return '-';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(ngay);
}

export function laNgayTrongTuongLai(giaTri, ngaySoSanh = new Date()) {
  const ngay = new Date(`${giaTri}T00:00:00`);
  const hienTai = new Date(ngaySoSanh);
  if (Number.isNaN(ngay.getTime()) || Number.isNaN(hienTai.getTime())) return false;
  hienTai.setHours(0, 0, 0, 0);
  return ngay.getTime() > hienTai.getTime();
}

export function tinhTuoi(ngaySinh, ngayThamChieu = new Date()) {
  const sinh = new Date(`${ngaySinh}T00:00:00`);
  const thamChieu = new Date(ngayThamChieu);
  if (Number.isNaN(sinh.getTime()) || Number.isNaN(thamChieu.getTime()) || sinh > thamChieu) return null;
  let tuoi = thamChieu.getFullYear() - sinh.getFullYear();
  const chuaDenSinhNhat = thamChieu.getMonth() < sinh.getMonth()
    || (thamChieu.getMonth() === sinh.getMonth() && thamChieu.getDate() < sinh.getDate());
  if (chuaDenSinhNhat) tuoi -= 1;
  return tuoi;
}
