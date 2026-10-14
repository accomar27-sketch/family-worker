import { $, esc, ar, untilText, wa, nowIso } from './util.js';
import * as K from '../lib/khatma-logic.js';

const STATUS = { inviting: '⏳ باب المشاركة مفتوح', active: '📖 جارية', complete: '🌙 اكتملت', cancelled: '✖️ أُلغيت' };

export function initKhatma(ctx) {
  const { B, uid } = ctx;
  const P = $('kh');
  let list = [], mode = 'poll', chosen = new Set(), busy = false;
  const accounts = () => ctx.directory.map((d) => ({ userId: d.uid, name: d.memberName || d.name }));
  const nameOf = (id) => (accounts().find((a) => a.userId === id) || {}).name || '—';

  function frame() {
    P.innerHTML = `<div class="hkh"><b>📿 ختمة العائلة</b><small>توزيع الأجزاء الثلاثين على من يشارك، مع تنبيهات الإنجاز</small></div>
      <div class="khf"><div class="lbl">عنوان الختمة</div><input id="kht" class="kin" maxlength="80" placeholder="مثال: ختمة رمضان">
      <div class="lbl">ملاحظة (اختياري)</div><input id="khn" class="kin" maxlength="200">
      <div class="seg" id="khm"><button class="on" data-m="poll">🗳️ دعوة الجميع (٥ ساعات للرد)</button><button data-m="selected">👥 أختار المشاركين</button></div>
      <div id="khsel"></div>
      <button class="go" id="khgo" style="background:#65a30d">إنشاء الختمة</button><p class="mut" id="khmsg" role="status"></p></div>
      <div id="khl"></div>`;
    $('khm').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; mode = b.dataset.m; [...$('khm').children].forEach((x) => x.classList.toggle('on', x === b)); sel(); };
    $('khgo').onclick = create;
    sel(); drawList();
  }
  function sel() {
    const el = $('khsel'); if (!el) return;
    if (mode === 'poll') { el.innerHTML = '<div class="ins">ستصل دعوة لكل أفراد العائلة المعتمدين، ومن يوافق خلال ٥ ساعات تُوزَّع عليه الأجزاء عشوائيًا.</div>'; return; }
    el.innerHTML = '<div class="lbl">اختر المشاركين (حتى ٣٠)</div><div class="kchips">' + accounts().map((a) => `<button data-u="${esc(a.userId)}" class="${chosen.has(a.userId) ? 'on' : ''}">${esc(a.name)}</button>`).join('') + '</div>';
    el.querySelectorAll('[data-u]').forEach((b) => { b.onclick = () => { const u = b.dataset.u; chosen.has(u) ? chosen.delete(u) : chosen.add(u); b.classList.toggle('on'); }; });
  }
  async function create() {
    const msg = $('khmsg'); msg.textContent = '';
    try {
      const id = 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const creator = { userId: uid, name: nameOf(uid) };
      const r = K.createKhatma({ id, title: $('kht').value, note: $('khn').value, mode, selectedIds: mode === 'selected' ? [...chosen] : [], creator, accounts: accounts() });
      $('khgo').disabled = true;
      await B.set('khatmas/' + id, r.khatma);
      await ctx.notify(r.notes);
      $('kht').value = ''; $('khn').value = ''; chosen.clear(); sel();
      msg.textContent = 'تم إنشاء الختمة ✓';
    } catch (e) { msg.textContent = e.message === 'invalid_khatma' ? 'اكتب عنوان الختمة.' : e.message === 'invalid_participants' ? 'اختر مشاركًا واحدًا على الأقل.' : 'تعذّر الإنشاء، أعد المحاولة.'; }
    $('khgo').disabled = false;
  }
  async function doRespond(id, answer) {
    const out = await B.transact('khatmas/' + id, (cur) => { if (!cur) return null; const { id: _i, ...k } = cur; const r = K.respond({ id, ...k }, uid, answer); return r.error ? { error: r.error } : { data: stripId(r.khatma) }; });
    if (out && out.error) ctx.toast(out.error === 'closed' ? 'انتهت مهلة الرد.' : 'تعذّر تسجيل الرد.');
  }
  async function doComplete(id) {
    let notes = [];
    const out = await B.transact('khatmas/' + id, (cur) => { if (!cur) return null; const r = K.complete(cur, uid, accounts().map((a) => a.userId)); if (r.error) return { error: r.error }; notes = r.notes; return { data: stripId(r.khatma) }; });
    if (out && out.error) return ctx.toast('لست من المشاركين في هذه الختمة.');
    await ctx.notify(notes);
  }
  const stripId = (k) => { const { id, ...rest } = k; return { id, ...rest }; };

  async function finalizeDue() {
    if (busy) return; busy = true;
    try {
      for (const k of list) {
        if (k.status !== 'inviting' || Date.parse(k.invitationDeadline) > Date.now()) continue;
        let notes = [];
        const out = await B.transact('khatmas/' + k.id, (cur) => { if (!cur) return null; const r = K.finalizeInvitation(cur); if (!r) return null; notes = r.notes; return { data: r.khatma }; });
        if (out && out.data) await ctx.notify(notes);
      }
    } catch (e) { console.warn('finalize', e); }
    busy = false;
  }

  function shareText(k) {
    return `📿 ${k.title}\nتوزيع الأجزاء:\n` + k.participants.map((p) => `${p.name}: ${p.firstJuz === p.lastJuz ? 'الجزء ' + ar(p.firstJuz) : 'الأجزاء ' + ar(p.firstJuz) + ' – ' + ar(p.lastJuz)}${p.completedAt ? ' ✅' : ''}`).join('\n') + '\n\nتقبّل الله منّا ومنكم\n(عائلة علي وحسنية)';
  }
  function card(k) {
    const mine = k.participants.find((p) => p.userId === uid);
    const myResp = k.responses.find((r) => r.userId === uid);
    let body = '';
    if (k.status === 'inviting') {
      const mark = (r) => (r.response === 'accept' ? '✅' : r.response === 'decline' ? '❌' : '⏳');
      body += `<div class="ins">${untilText(k.invitationDeadline)} · ${k.responses.map((r) => `${mark(r)} ${esc(r.name)}`).join('، ')}</div>`;
      if (myResp && !myResp.response) body += `<div class="kact"><button data-a="accept" data-id="${esc(k.id)}">✅ نعم، أشارك</button><button data-a="decline" data-id="${esc(k.id)}">❌ لا، شكرًا</button></div>`;
      else if (myResp) body += `<p class="mut">ردّك: ${myResp.response === 'accept' ? 'سأشارك' : 'اعتذرت'}</p>`;
    }
    if (k.participants.length) {
      body += k.participants.map((p, i) => `<div class="tmr${p.userId === uid ? ' me' : ''}"><span>${esc(p.name)}</span><b>${p.firstJuz === p.lastJuz ? 'الجزء ' + ar(p.firstJuz) : 'الأجزاء ' + ar(p.firstJuz) + ' – ' + ar(p.lastJuz)}</b><em>${p.completedAt ? '✅' : '⬜'}</em><button class="linkb" data-card="${esc(k.id)}:${i}">بطاقة</button></div>`).join('');
      if (mine && !mine.completedAt && k.status === 'active') body += `<button class="go" data-done="${esc(k.id)}" style="background:#65a30d">✅ أتممت وردي</button>`;
      body += `<div class="kact"><button data-share="${esc(k.id)}">إرسال التوزيع عبر واتساب</button></div>`;
    }
    const done = k.participants.filter((p) => p.completedAt).length;
    return `<div class="kcardx"><div class="kh1"><b>${esc(k.title)}</b><span>${STATUS[k.status] || ''}</span></div><small class="mut">من ${esc(k.createdByName)}${k.note ? ' · ' + esc(k.note) : ''}${k.participants.length ? ` · أُنجز ${ar(done)} من ${ar(k.participants.length)}` : ''}</small>${body}</div>`;
  }
  function drawList() {
    const el = $('khl'); if (!el) return;
    el.innerHTML = list.length ? list.map(card).join('') : '<div class="ins">لا توجد ختمات بعد. ابدأ أول ختمة للعائلة.</div>';
    el.querySelectorAll('[data-a]').forEach((b) => { b.onclick = () => { b.disabled = true; doRespond(b.dataset.id, b.dataset.a); }; });
    el.querySelectorAll('[data-done]').forEach((b) => { b.onclick = () => { b.disabled = true; doComplete(b.dataset.done); }; });
    el.querySelectorAll('[data-share]').forEach((b) => { b.onclick = () => wa(shareText(list.find((k) => k.id === b.dataset.share))); });
    el.querySelectorAll('[data-card]').forEach((b) => {
      b.onclick = () => {
        const [id, i] = b.dataset.card.split(':'), k = list.find((x) => x.id === id), p = k.participants[+i];
        window.__kcard({ n: p.name, txt: p.firstJuz === p.lastJuz ? 'الجزء ' + ar(p.firstJuz) : 'الأجزاء ' + ar(p.firstJuz) + ' – ' + ar(p.lastJuz) }, k.title, k.note || '');
      };
    });
  }
  frame();
  B.watchQuery('khatmas', {}, (rows) => {
    list = rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    drawList(); finalizeDue();
    const waiting = list.filter((k) => k.status === 'inviting' && k.responses.some((r) => r.userId === uid && !r.response)).length;
    import('./util.js').then((u) => u.badge('khb', waiting));
  }, (e) => console.warn('khatmas', e));
  setInterval(() => { finalizeDue(); if ($('kh').classList.contains('open')) drawList(); }, 60000);
  ctx.refreshKhatmaPeople = () => { sel(); drawList(); };
}
