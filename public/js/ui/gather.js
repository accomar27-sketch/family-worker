import { $, esc, togglePanel, wa } from './util.js';
import { households } from '../lib/family.js';

const pad = (n) => String(n).padStart(2, '0');
function defTime() { const d = new Date(Date.now() + 864e5); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T18:00`; }
const icsEsc = (v) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\;');
const fmt = (d) => new Intl.DateTimeFormat('ar-SA', { calendar: 'gregory', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d);

export function initGather(ctx) {
  const hs = households(ctx.family);
  $('gtb').onclick = () => { togglePanel('gtb', 'gt'); };
  const P = $('gt');
  let mode = 'visit', delay = 0;
  P.innerHTML = `<div class="hkh"><b>🤝 صلة لا تنقطع</b><small>رتّب زيارة أو مكالمة جماعية، وأرسل الدعوة</small></div>
    <div class="seg" id="gmode"><button class="on" data-m="visit">🏠 زيارة</button><button data-m="call">📞 مكالمة جماعية</button></div>
    <div class="lbl">البيت الذي سنتواصل معه</div><select id="ghh" class="kin">${hs.map((h) => `<option value="${esc(h.id)}">${esc(h.name)}</option>`).join('')}</select>
    <div id="gtime"></div>
    <div class="lbl">كلمات إضافية (اختياري)</div><textarea id="gx" class="kin" rows="2" maxlength="500" placeholder="أضف كلماتك هنا"></textarea>
    <div class="ins" id="gpv"></div>
    <div class="kact"><button id="gwa">إرسال عبر واتساب</button><button id="gcal">أضف إلى التقويم</button><button id="gnt">🔔 نبّه الجميع في التطبيق</button></div>
    <p class="mut" id="gmsg" role="status"></p>`;
  function when() { return mode === 'call' ? new Date(Date.now() + delay * 60000) : new Date($('gv') ? $('gv').value : defTime()); }
  function timeUi() {
    $('gtime').innerHTML = mode === 'visit'
      ? `<div class="lbl">تاريخ ووقت الزيارة</div><input id="gv" type="datetime-local" class="kin" value="${defTime()}">`
      : `<div class="lbl">موعد المكالمة</div><div class="kact">${[[0, 'الآن'], [30, 'بعد نصف ساعة'], [60, 'بعد ساعة']].map(([v, l]) => `<button data-d="${v}" class="${v === delay ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    if ($('gv')) $('gv').oninput = upd;
    $('gtime').querySelectorAll('[data-d]').forEach((b) => { b.onclick = () => { delay = +b.dataset.d; timeUi(); upd(); }; });
  }
  const house = () => hs.find((h) => h.id === $('ghh').value);
  const action = () => (mode === 'visit' ? 'زيارة' : 'اتصال جماعي');
  function text() {
    const w = when(), x = $('gx').value.trim();
    return [`سنقوم ب${action()} لبيت ${house().name} يوم ${fmt(w)}. يسعدنا اجتماعنا، ونسأل الله أن يديم الألفة بيننا.`, x].filter(Boolean).join('\n\n');
  }
  const valid = () => { const t = when().getTime(); return Number.isFinite(t) && t >= Date.now() - 5 * 60000; };
  function upd() { $('gpv').textContent = valid() ? text() : 'اختر موعدًا صحيحًا في الوقت الحالي أو المستقبل.'; }
  $('gmode').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; mode = b.dataset.m; [...$('gmode').children].forEach((x) => x.classList.toggle('on', x === b)); timeUi(); upd(); };
  $('ghh').onchange = upd; $('gx').oninput = upd;
  timeUi(); upd();
  $('gwa').onclick = () => valid() && wa(text());
  $('gcal').onclick = () => {
    if (!valid()) return;
    const w = when(), end = new Date(w.getTime() + 36e5), st = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ali Family//AR', 'BEGIN:VEVENT', `UID:${Date.now()}@ali-family`, `DTSTAMP:${st(new Date())}`, `DTSTART:${st(w)}`, `DTEND:${st(end)}`, `SUMMARY:${icsEsc(action() + ' — ' + house().name)}`, `DESCRIPTION:${icsEsc(text())}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })); a.download = 'صلة-العائلة.ics'; a.click();
    $('gmsg').textContent = 'نُزّل ملف الموعد؛ افتحه لإضافته إلى تقويم هاتفك.';
  };
  $('gnt').onclick = async () => {
    if (!valid()) return;
    $('gnt').disabled = true;
    try {
      const ids = ctx.directory.map((d) => d.uid);
      await ctx.notify(ids.map((to) => ({ to, kind: 'family_gathering', title: mode === 'visit' ? 'موعد زيارة عائلية' : 'موعد اتصال عائلي', body: text() })));
      $('gmsg').textContent = `أُرسل التنبيه إلى ${ids.length} من حسابات العائلة المعتمدة.`;
    } catch (e) { $('gmsg').textContent = 'تعذّر إرسال التنبيه. حاول مرة أخرى.'; }
    $('gnt').disabled = false;
  };
}
