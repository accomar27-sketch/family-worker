import { $, esc, badge, togglePanel, nowIso, relTime } from './util.js';
import { allNames } from '../lib/family.js';

export function initApprovals(ctx) {
  const { B, family } = ctx;
  const names = allNames(family);
  $('apb').hidden = false;
  $('apb').onclick = () => togglePanel('apb', 'ap');
  const P = $('ap');
  let users = [];

  function opts(sel) { return '<option value="">— اختر اسم العضو —</option>' + names.map((n) => `<option${n === sel ? ' selected' : ''}>${esc(n)}</option>`).join(''); }

  async function approve(u, memberName) {
    const name = memberName || u.name || u.email;
    await B.batch([
      { op: 'update', path: 'users/' + u.id, data: { status: 'approved', memberName: memberName || '' } },
      { op: 'set', path: 'directory/' + u.id, data: { uid: u.id, name, memberName: memberName || '' } },
    ]);
  }
  async function revoke(u, status) {
    await B.update('users/' + u.id, { status });
    await B.del('directory/' + u.id).catch(() => {});
  }
  function row(u) {
    const who = `<b>${esc(u.name || '—')}</b><small dir="ltr">${esc(u.email || '')}</small>`;
    if (u.status === 'pending') return `<div class="apr" data-id="${esc(u.id)}"><div>${who}<small>طلب ${relTime(u.createdAt)}</small></div><select class="kin">${opts('')}</select><div class="kact"><button data-ok>✅ اعتماد</button><button data-no>✖️ رفض</button></div></div>`;
    if (u.status === 'approved') return `<div class="apr" data-id="${esc(u.id)}"><div>${who}<small>معتمد${u.role === 'owner' ? ' · المالك' : ''} — ${esc(u.memberName || 'بلا ربط باسم')}</small></div>${u.role === 'owner' ? '' : `<select class="kin">${opts(u.memberName)}</select><div class="kact"><button data-save>حفظ الربط</button><button data-no>إلغاء الاعتماد</button></div>`}</div>`;
    return `<div class="apr" data-id="${esc(u.id)}"><div>${who}<small>مرفوض</small></div><div class="kact"><button data-ok2>إعادة النظر</button></div></div>`;
  }
  function draw() {
    const by = (s) => users.filter((u) => u.status === s).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    P.innerHTML = `<div class="hkh"><b>🛡️ اعتماد الأعضاء</b><small>اربط كل حساب باسمه في العائلة ثم اعتمده</small></div>
      <div class="lbl">بانتظار الموافقة (${by('pending').length})</div>${by('pending').map(row).join('') || '<div class="ins">لا طلبات جديدة.</div>'}
      <div class="lbl">المعتمدون</div>${by('approved').map(row).join('')}
      ${by('rejected').length ? '<div class="lbl">المرفوضون</div>' + by('rejected').map(row).join('') : ''}
      <div class="lbl">أدوات المالك</div><div class="ins">تحديث بيانات العائلة من ملف seed.json:<input type="file" id="reseed" accept=".json" class="kin" style="margin-top:6px"><small class="mut" id="reseedmsg"></small></div>`;
    P.querySelectorAll('.apr').forEach((el) => {
      const u = users.find((x) => x.id === el.dataset.id), sel = el.querySelector('select');
      const bind = (a, f) => { const b = el.querySelector(a); if (b) b.onclick = async () => { b.disabled = true; try { await f(); } catch (e) { ctx.toast('تعذّر التنفيذ: ' + (e.code || e.message)); } }; };
      bind('[data-ok]', () => { if (!sel.value) { ctx.toast('اختر اسم العضو من القائمة أولًا.'); el.querySelector('[data-ok]').disabled = false; return; } return approve(u, sel.value); });
      bind('[data-ok2]', () => B.update('users/' + u.id, { status: 'pending' }));
      bind('[data-save]', () => approve(u, sel.value));
      bind('[data-no]', () => revoke(u, u.status === 'pending' ? 'rejected' : 'pending'));
    });
    if ($('reseed')) $('reseed').onchange = async (e) => { const f = e.target.files[0]; if (f) { try { await ctx.importSeed(f, (m) => { $('reseedmsg').textContent = m; }); $('reseedmsg').textContent = 'تم التحديث ✓ — أعد تحميل الصفحة.'; } catch (er) { $('reseedmsg').textContent = 'تعذّر: ' + (er.code || er.message); } } };
  }
  B.watchQuery('users', {}, (rows) => {
    users = rows; badge('apb', rows.filter((u) => u.status === 'pending').length);
    if (P.classList.contains('open') && !P.contains(document.activeElement)) draw();
    else if (!P.innerHTML) draw();
  }, (e) => console.warn('users', e));
  $('apb').addEventListener('click', () => setTimeout(draw, 0));
}
