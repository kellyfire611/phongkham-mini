export function taoStorageGia() {
  const duLieu = new Map();
  return {
    get length() { return duLieu.size; },
    key(index) { return [...duLieu.keys()][index] ?? null; },
    getItem(khoa) { return duLieu.has(khoa) ? duLieu.get(khoa) : null; },
    setItem(khoa, giaTri) { duLieu.set(String(khoa), String(giaTri)); },
    removeItem(khoa) { duLieu.delete(String(khoa)); },
    clear() { duLieu.clear(); },
  };
}
