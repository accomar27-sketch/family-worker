import { getBackend } from './backend.js';
import { OWNER_EMAIL } from './config.js';
import { toLegacy } from './lib/family.js';
import { $, ar, nowIso, toast } from './ui/util.js';
import * as gate from './ui/gate.js';
import { initNotify } from './ui/notify.js';
import { initGather } from './ui/gather.js';
import { initKhatma } from './ui/khatma.js';
import { initApprovals } from './ui/approvals.js';

const SEED_DOCS = ['posterPreview', 'posterJpg', 'posterPdf', 'hikamPages'];
let B, started = false, everStarted = false, lastUid = null, stopProfile = null, installEvt = null;

window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; const b = $('inst'); if (b) b.hidden = false; });

function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.body.appendChild(s); });
}

async function importSeed(file, say = () => {}) {
  const s = JSON.parse(await file.text());
  if (!s.family || !s.family.members || !s.avatars || !s.hikam) throw new Error('الملف ليس seed.json صحيحًا');
  say('رفع بيانات العائلة…');
  await B.set('family/main', s.family);
  await B.set('assets/avatars', s.avatars);
  await B.set('assets/hikam', s.hikam);
  for (const k of SEED_DOCS) { if (s[k]) { say('رفع ' + k + '…'); await B.set('assets/' + k, s[k]); } }
  say('تم ✓');
}

async function startApp(user, prof) {
  if (started) return; started = true; everStarted = true; lastUid = user.uid;
  gate.showLoading();
  const load = () => Promise.all([B.get('family/main'), B.get('assets/avatars'), B.get('assets/hikam')]);
  // أول دخول للمالك: قد تسبق القراءةُ تأكيدَ إنشاء الحساب في الخادم، فنعيد المحاولة مرة
  const [family, avatars, hikam] = await load().catch(async (e) => { if (e && e.code === 'permission-denied') { await new Promise((r) => setTimeout(r, 1500)); return load(); } throw e; });
  if (!family) {
    started = false;
    if (prof.role === 'owner') return gate.showImport(B, async (f, say) => { await importSeed(f, say); started = false; startApp(user, prof); });
    return gate.showMessage(B, '<div class="gwarn">لم يجهّز المالك بيانات العائلة بعد. حاول لاحقًا.</div>');
  }
  window.__D = toLegacy(family, avatars, hikam);
  const cache = {};
  window.__A = { get(name) { return cache[name] || (cache[name] = B.get('assets/' + name).then((d) => { if (!d) throw new Error('missing ' + name); return d.b64 || d.pages; })); } };
  $('gate').hidden = true; $('appmain').hidden = false;
  await loadScript('js/legacy.js');
  const kids = window.__D.B.reduce((n, x) => n + x.k.length, 0);
  $('famhint').textContent = `${ar(window.__D.B.length)} فروع · ${ar(kids)} أحفاد حتى الآن`;

  const ctx = { B, uid: user.uid, family, prof, directory: [], toast, importSeed };
  const dirReady = new Promise((res) => {
    let first = true;
    B.watchQuery('directory', {}, (rows) => { ctx.directory = rows; if (first) { first = false; res(); } else if (ctx.refreshKhatmaPeople) ctx.refreshKhatmaPeople(); }, () => res());
  });
  await dirReady;

  // الشريط العلوي
  $('uname').textContent = prof.memberName || user.name || user.email;
  $('uout').onclick = () => { B.disablePush && B.disablePush(); B.signOut(); };
  $('inst').onclick = async () => { if (installEvt) { installEvt.prompt(); installEvt = null; $('inst').hidden = true; } };
  if (installEvt) $('inst').hidden = false;

  // إغلاق لوحاتنا عند فتح لوحات النسخة الأصلية
  const mine = ['ntb', 'gtb', 'apb'];
  $('grid').addEventListener('click', (e) => {
    const t = e.target.closest('.tile'); if (!t || mine.includes(t.id)) return;
    ['nt', 'gt', 'ap'].forEach((p) => $(p).classList.remove('open')); mine.forEach((m) => $(m).classList.remove('on'));
  });

  initNotify(ctx); initGather(ctx); initKhatma(ctx);
  if (prof.role === 'owner') initApprovals(ctx);
  B.update('users/' + user.uid, { lastSeen: nowIso() }).catch(() => {});

  // فتح قسم من رابط الإشعار (?go=nt)
  const go = new URLSearchParams(location.search).get('go');
  if (go && $(go + 'b')) setTimeout(() => $(go + 'b').click(), 300);
}

async function main() {
  gate.showLoading();
  B = await getBackend();
  window.__B = B;
  B.onAuth((u) => {
    // تغيّر المستخدم بعد تشغيل التطبيق: نعيد التحميل لتنظيف كل شيء
    if (everStarted && (!u || u.uid !== lastUid)) { location.reload(); return; }
    if (stopProfile) { stopProfile(); stopProfile = null; }
    started = false;
    if (!u) { gate.showLogin(B); return; }
    let creating = false;
    stopProfile = B.watchDoc('users/' + u.uid, async (prof) => {
      if (!prof) {
        if (creating) return; creating = true;
        const owner = u.email === OWNER_EMAIL && u.emailVerified;
        try {
          await B.set('users/' + u.uid, { name: u.name || (u.email || '').split('@')[0], email: u.email || '', photo: u.photo || '', status: owner ? 'approved' : 'pending', role: owner ? 'owner' : 'member', createdAt: nowIso() });
          if (owner) await B.set('directory/' + u.uid, { uid: u.uid, name: u.name || 'المالك', memberName: '' });
        } catch (e) { gate.showMessage(B, '<div class="gwarn">تعذّر إنشاء حسابك: ' + (e.code || e.message) + '</div>'); }
        return;
      }
      if (prof.status === 'approved') startApp(u, prof).catch((e) => { console.error(e); started = false; gate.showMessage(B, '<div class="gwarn">تعذّر تحميل التطبيق: ' + (e.code || e.message) + '</div>'); });
      else if (prof.status === 'rejected') gate.showRejected(B);
      else gate.showPending(B, u);
    }, (e) => gate.showMessage(B, '<div class="gwarn">تعذّرت قراءة حسابك: ' + (e.code || e.message) + '</div>'));
  });
}
main().catch((e) => { console.error(e); document.body.insertAdjacentHTML('beforeend', '<p style="padding:20px">تعذّر تحميل التطبيق. تأكد من الاتصال بالإنترنت.</p>'); });
