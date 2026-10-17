// عامل الخلفية: يعمل كل ١٠ دقائق عبر GitHub Actions.
// ١) تنبيهات المناسبات  ٢) إنهاء دعوات الختمة المنتهية  ٣) إشعار المالك بالطلبات الجديدة  ٤) إرسال الدفع.
import admin from 'firebase-admin';
import * as K from '../public/js/lib/khatma-logic.js';
import * as C from '../public/js/lib/counters.js';
import * as O from '../public/js/lib/occasions.js';
import { planReminders } from './plan.mjs';

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
if (!sa.project_id) { console.error('FIREBASE_SERVICE_ACCOUNT غير مضبوط'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const TZ = 'Asia/Riyadh';
const now = new Date();
const iso = () => new Date().toISOString();

async function writeNotes(notes) {
  for (let i = 0; i < notes.length; i += 400) {
    const b = db.batch();
    notes.slice(i, i + 400).forEach((n) => b.set(db.collection('notifications').doc(), { to: n.to, kind: n.kind, title: n.title, body: n.body, khatmaId: n.khatmaId || null, from: 'system', createdAt: iso(), readAt: null, pushed: false }));
    await b.commit();
  }
}

async function directory() { return (await db.collection('directory').get()).docs.map((d) => ({ id: d.id, ...d.data() })); }

async function occasions() {
  const fam = await db.doc('family/main').get(); if (!fam.exists) return 0;
  const dir = await directory(); if (!dir.length) return 0;
  const today = O.todayIn(TZ, now), hour = O.hourIn(TZ, now);
  const dueKeys = O.dueReminders(O.extractOccasions(fam.data()), today).map((r) => r.logKey);
  const sent = new Set();
  for (const k of dueKeys) if ((await db.doc('reminderLog/' + k.replace(/\//g, '_')).get()).exists) sent.add(k);
  const plan = planReminders({ family: fam.data(), directory: dir, today, hour, sent });
  for (const p of plan) {
    await writeNotes(p.notes);
    await db.doc('reminderLog/' + p.logKey.replace(/\//g, '_')).set({ at: iso(), count: p.notes.length });
  }
  return plan.length;
}

async function khatmas() {
  let n = 0;
  const snap = await db.collection('khatmas').where('status', '==', 'inviting').get();
  for (const d of snap.docs) {
    let notes = [];
    const done = await db.runTransaction(async (t) => {
      const cur = (await t.get(d.ref)).data();
      if (!cur) return false;
      let r = K.finalizeInvitation(cur);
      if (!r) r = K.reminders(cur);
      if (!r) return false;
      t.set(d.ref, r.khatma); notes = r.notes; return true;
    });
    if (done) { await writeNotes(notes); n++; }
  }
  return n;
}

async function counters() {
  let n = 0;
  const snap = await db.collection('counters').get();
  if (snap.empty) return 0;
  const ids = (await directory()).map((d) => d.uid || d.id);
  for (const d of snap.docs) {
    const c = d.data(); if (c.closedAt || c.notified100) continue;
    const parts = (await db.collection('counterParts').where('counterId', '==', d.id).get()).docs.map((x) => x.data());
    const r = C.thresholdNotes(c, C.totalOf(parts));
    if (!Object.keys(r.patch).length) continue;
    await d.ref.update(r.patch);
    await writeNotes(r.notes.flatMap((nn) => ids.map((to) => ({ ...nn, to }))));
    n++;
  }
  return n;
}

async function ownerPending() {
  const owner = (await db.collection('users').where('role', '==', 'owner').limit(1).get()).docs[0];
  if (!owner) return 0;
  const snap = await db.collection('users').where('status', '==', 'pending').get();
  let n = 0;
  for (const d of snap.docs) {
    if (d.data().ownerNotified) continue;
    await writeNotes([{ to: owner.id, kind: 'admin', title: 'طلب انضمام جديد', body: `${d.data().name || d.data().email} يطلب الدخول. افتح «اعتماد الأعضاء» لربطه باسمه.` }]);
    await d.ref.update({ ownerNotified: true }); n++;
  }
  return n;
}

async function push() {
  const snap = await db.collection('notifications').where('pushed', '==', false).limit(300).get();
  if (snap.empty) return 0;
  const devs = {};
  (await db.collection('devices').get()).docs.forEach((d) => { (devs[d.data().uid] ||= []).push(d.id); });
  let sent = 0;
  for (const d of snap.docs) {
    const n = d.data(), tokens = devs[n.to] || [];
    if (tokens.length) {
      const res = await admin.messaging().sendEachForMulticast({
        tokens,
        data: { title: String(n.title), body: String(n.body).slice(0, 400), url: './?go=' + (n.kind === 'admin' ? 'ap' : n.kind.startsWith('khatma') ? 'kh' : n.kind === 'dhikr' ? 'zk' : 'nt'), tag: d.id },
        webpush: { headers: { Urgency: 'high', TTL: '86400' } },
      });
      await Promise.all(res.responses.map((r, i) => (!r.success && /not-registered|invalid-registration|invalid-argument/.test(r.error?.code || '') ? db.doc('devices/' + tokens[i]).delete() : null)));
      sent += res.successCount;
    }
    await d.ref.update({ pushed: true });
  }
  return sent;
}

// حذف الإشعارات القديمة: المقروءة بعد 30 يومًا، وأي إشعار (حتى غير المقروء) بعد 90 يومًا
async function cleanup() {
  const DAY = 864e5, c30 = new Date(Date.now() - 30 * DAY).toISOString(), c90 = new Date(Date.now() - 90 * DAY).toISOString();
  let n = 0;
  for (const [field, cut] of [['readAt', c30], ['createdAt', c90]]) {
    for (;;) {
      const snap = await db.collection('notifications').where(field, '<', cut).limit(400).get();
      if (snap.empty) break;
      const b = db.batch(); snap.docs.forEach((d) => b.delete(d.ref)); await b.commit(); n += snap.size;
      if (snap.size < 400) break;
    }
  }
  return n;
}

const steps = { occasions, khatmas, counters, ownerPending, push, cleanup };
for (const [name, fn] of Object.entries(steps)) {
  try { console.log(name, await fn()); } catch (e) { console.error(name, 'failed:', e.message); process.exitCode = 1; }
}
