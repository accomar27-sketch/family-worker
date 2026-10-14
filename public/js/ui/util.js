export const $ = (id) => document.getElementById(id);
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const ar = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
export const nowIso = () => new Date().toISOString();

export function relTime(iso) {
  const t = Date.parse(iso); if (!t) return '';
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'الآن';
  if (m < 60) return `منذ ${ar(m)} د`;
  const h = Math.round(m / 60);
  if (h < 24) return `منذ ${ar(h)} ساعة`;
  const d = Math.round(h / 24);
  return d === 1 ? 'أمس' : `منذ ${ar(d)} يومًا`;
}
export function untilText(iso) {
  const ms = Date.parse(iso) - Date.now();
  if (ms <= 0) return 'انتهت المهلة';
  const m = Math.ceil(ms / 60000), h = Math.floor(m / 60);
  return h ? `تبقى ${ar(h)} س و${ar(m % 60)} د` : `تبقى ${ar(m)} د`;
}
let toastT;
export function toast(msg) {
  let t = $('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
}
export function wa(text) {
  let w = null;
  try { w = window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank'); } catch (e) {}
  if (!w && navigator.share) navigator.share({ text }).catch(() => {});
}
/** يفتح/يغلق لوحة جديدة مع إغلاق بقية اللوحات. */
export function togglePanel(tileId, panelId) {
  const p = $(panelId), t = $(tileId), open = !p.classList.contains('open');
  document.querySelectorAll('.tl.open').forEach((e) => e.classList.remove('open'));
  document.querySelectorAll('.tile.on').forEach((e) => e.classList.remove('on'));
  document.querySelectorAll('.branch.open').forEach((e) => e.classList.remove('open'));
  if (open) { p.classList.add('open'); t.classList.add('on'); setTimeout(() => p.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
  return open;
}
export function badge(tileId, n) {
  const t = $(tileId); if (!t) return;
  let b = t.querySelector('.bdg');
  if (!n) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement('span'); b.className = 'bdg'; t.appendChild(b); }
  b.textContent = ar(n);
}
