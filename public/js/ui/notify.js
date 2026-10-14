import { $, esc, relTime, badge, togglePanel, nowIso } from './util.js';

const ICON = { occasion: '🎂', khatma_invitation: '📿', khatma_started: '📿', khatma_progress: '📿', khatma_complete: '🌙', family_gathering: '🤝', admin: '🛡️' };

export function initNotify(ctx) {
  const { B, uid, directory } = ctx;
  let items = [];
  const tile = $('ntb'), panel = $('nt');
  tile.onclick = () => { togglePanel('ntb', 'nt'); draw(); };

  function pushBlock() {
    if (!B.pushSupported()) return '<div class="ins">⚠️ هذا المتصفح لا يدعم التنبيهات الخارجية. على الآيفون: افتح الموقع في Safari ← مشاركة ← «إضافة إلى الشاشة الرئيسية» ثم افتحه من الأيقونة.</div>';
    if (B.pushPermission() === 'denied') return '<div class="ins">🔕 التنبيهات محجوبة لهذا الموقع في إعدادات المتصفح. فعّلها من هناك ثم عد.</div>';
    if (B.pushOn()) return '<div class="ins ok">✅ التنبيهات مفعّلة على هذا الجهاز. <button class="linkb" id="pushoff">إيقاف</button></div>';
    return '<div class="ins">🔔 فعّل التنبيهات ليصلك «بعد ٧ أيام عيد ميلاد فلان» ودعوات الختمة حتى والتطبيق مغلق.<button class="go" id="pushon" style="margin-top:8px">تفعيل التنبيهات على هذا الجهاز</button><small class="mut">قد يتأخر وصول التنبيه عدة دقائق بعد إرساله.</small></div>';
  }

  function draw() {
    const list = items.length
      ? items.map((n) => `<div class="nit${n.readAt ? '' : ' un'}" data-id="${esc(n.id)}"><i>${ICON[n.kind] || '🔔'}</i><div><b>${esc(n.title)}</b><p>${esc(n.body)}</p><small>${relTime(n.createdAt)}</small>${n.kind === 'khatma_invitation' ? '<button class="linkb" data-go="kh">افتح الختمة للرد</button>' : ''}</div></div>`).join('')
      : '<div class="ins">لا توجد إشعارات بعد.</div>';
    panel.innerHTML = `<div class="hkh"><b>🔔 الإشعارات</b><small>تنبيهات المناسبات والختمة والمواعيد العائلية</small></div>${pushBlock()}
      ${items.some((n) => !n.readAt) ? '<div class="kact"><button id="readall">تعليم الكل كمقروء</button></div>' : ''}<div id="nlist">${list}</div>`;
    if ($('pushon')) $('pushon').onclick = async () => {
      $('pushon').disabled = true;
      const r = await B.enablePush(uid).catch((e) => ({ ok: false, reason: e.message }));
      if (!r.ok) ctx.toast(r.reason === 'denied' ? 'لم تسمح بالتنبيهات.' : 'تعذّر تفعيل التنبيهات: ' + r.reason);
      draw();
    };
    if ($('pushoff')) $('pushoff').onclick = async () => { await B.disablePush(); draw(); };
    if ($('readall')) $('readall').onclick = () => B.batch(items.filter((n) => !n.readAt).map((n) => ({ op: 'update', path: 'notifications/' + n.id, data: { readAt: nowIso() } })));
    panel.querySelectorAll('.nit').forEach((el) => {
      el.onclick = (e) => {
        const n = items.find((x) => x.id === el.dataset.id);
        if (n && !n.readAt) B.update('notifications/' + n.id, { readAt: nowIso() });
        if (e.target.dataset && e.target.dataset.go === 'kh') { $('khb').click(); }
      };
    });
  }

  B.watchQuery('notifications', { where: [['to', '==', uid]] }, (rows) => {
    items = rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 80);
    badge('ntb', items.filter((n) => !n.readAt).length);
    if (panel.classList.contains('open')) draw();
  }, (e) => console.warn('notifications', e));

  /** كتابة إشعارات (مرسل = المستخدم الحالي). notes: [{to,kind,title,body,khatmaId?}] */
  ctx.notify = async (notes) => {
    const ops = notes.map((n) => ({ op: 'add', col: 'notifications', data: { to: n.to, kind: n.kind, title: n.title, body: n.body, khatmaId: n.khatmaId || null, from: uid, createdAt: nowIso(), readAt: null, pushed: false } }));
    if (ops.length) await B.batch(ops);
  };
}
