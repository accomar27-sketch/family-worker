// إشعارات الترحيب بمن انضمّ للتطبيق (تُشغَّل يدويًا مرة واحدة). لا تعتمد على firebase-admin ليسهل اختبارها.
// لكل شخص إشعار باسمه يصل إلى كل المعتمدين (بمن فيهم هو نفسه).

export const TITLE = 'يا هلا بالزين 🌿';

/** "حسنية|أمنا نبع الحنان حسنية:f,عبدالرحمن:m" → [{name,label,female}] ؛ m مذكر، f مؤنث */
export function parsePeople(s) {
  return String(s || '').split(/[,،\n]/).map((x) => x.trim()).filter(Boolean).map((x) => {
    const m = x.match(/^(.+):([mf])$/);
    if (!m) throw new Error(`صيغة غير صحيحة: «${x}» — المطلوب اسم:m أو اسم:f أو اسم|عبارة:f`);
    const [name, label] = m[1].split('|').map((t) => t.trim());
    return { name, label: label || name, female: m[2] === 'f' };
  });
}

export const bodyFor = (p) => `${p.label} ${p.female ? 'نوّرتِ' : 'نوّر'} تطبيق عائلتنا. ان شاء الله يكون خير علينا وننتفع منه.`;

/** directory: [{id, uid?, name, memberName}] */
export function planWelcome({ people, directory }) {
  const problems = [];
  const uidOf = (d) => d.uid || d.id;
  const targets = people.map((p) => {
    const hit = directory.filter((d) => (d.memberName || '').trim() === p.name);
    if (hit.length === 0) problems.push(`لا يوجد معتمد مربوط بالاسم «${p.name}»`);
    if (hit.length > 1) problems.push(`أكثر من حساب مربوط بالاسم «${p.name}»`);
    return { ...p, uid: hit.length === 1 ? uidOf(hit[0]) : null };
  });
  const recipients = [...new Set(directory.map(uidOf))];
  const notes = [];
  targets.forEach((t, order) => {
    if (!t.uid) return;
    for (const to of recipients) notes.push({ id: `welcome_${t.uid}_${to}`, to, title: TITLE, body: bodyFor(t), order, about: t.uid });
  });
  return { problems, targets, recipients, notes };
}

const already = (e) => e && (e.code === 6 || e.code === 'already-exists' || /ALREADY_EXISTS/.test(e.message || ''));
const pushUrl = './?go=nt';

/** db وmessaging من firebase-admin (أو بدائل الاختبار). تُرجع ملخصًا؛ لا تطبع أسماء (سجلات GitHub علنية). */
export async function runWelcome({ db, messaging, people, dryRun = true, now = new Date() }) {
  const directory = (await db.collection('directory').get()).docs.map((d) => ({ id: d.id, ...d.data() }));
  const plan = planWelcome({ people, directory });
  const devs = {};
  (await db.collection('devices').get()).docs.forEach((d) => { (devs[d.data().uid] ||= []).push(d.id); });

  const nameOf = (uid) => { const d = directory.find((x) => (x.uid || x.id) === uid); return (d && (d.memberName || d.name)) || '؟'; };
  const owner = (await db.collection('users').where('role', '==', 'owner').limit(1).get()).docs[0];
  const sum = { dryRun, ok: plan.problems.length === 0, problems: plan.problems.length, recipients: plan.recipients.length, planned: plan.notes.length, created: 0, skipped: 0, pushed: 0, pushFailed: 0, removedTokens: 0 };

  const lines = [];
  const noDevice = plan.recipients.filter((r) => !(devs[r] || []).length).map(nameOf);

  if (!plan.problems.length) {
    let existing = 0;
    if (dryRun) for (const n of plan.notes) if ((await db.doc('notifications/' + n.id).get()).exists) existing++;
    sum.existing = existing;

    if (!dryRun) {
      const base = now.getTime();
      for (let order = 0; order < plan.targets.length; order++) {
        const batch = plan.notes.filter((n) => n.order === order);
        const createdFor = [];
        await Promise.all(batch.map(async (n) => {
          try {
            // pushed:true منذ البداية حتى لا يكرر العامل الإرسال؛ create() يفشل إن وُجد الإشعار (منع التكرار)
            await db.doc('notifications/' + n.id).create({ to: n.to, kind: 'welcome', title: n.title, body: n.body, khatmaId: null, from: 'system', createdAt: new Date(base + order * 1000).toISOString(), readAt: null, pushed: true });
            sum.created++; createdFor.push(n);
          } catch (e) { if (already(e)) sum.skipped++; else throw e; }
        }));
        await Promise.all(createdFor.map(async (n) => {
          const tokens = devs[n.to] || [];
          if (!tokens.length) return;
          try {
            const res = await messaging.sendEachForMulticast({
              tokens,
              data: { title: n.title, body: n.body, url: pushUrl, tag: n.id },
              webpush: { headers: { Urgency: 'high', TTL: '86400' } },
            });
            sum.pushed += res.successCount;
            sum.pushFailed += res.failureCount || 0;
            await Promise.all(res.responses.map((r, i) => (!r.success && /not-registered|invalid-registration|invalid-argument/.test(r.error?.code || '')
              ? db.doc('devices/' + tokens[i]).delete().then(() => { sum.removedTokens++; }) : null)));
          } catch (e) { sum.pushFailed += tokens.length; }
        }));
      }
    }
  }

  // تقرير خاص بالمالك فقط (داخل التطبيق، بلا دفع) — لأن سجلات GitHub علنية فلا نكتب فيها أسماء
  lines.push(sum.ok ? 'المطابقة سليمة.' : 'توقّف التنفيذ: ' + plan.problems.join('؛ '));
  lines.push(`المستلمون: ${sum.recipients} — إشعارات مخططة: ${sum.planned}.`);
  lines.push(noDevice.length ? 'بلا جهاز مسجَّل للتنبيهات: ' + noDevice.join('، ') : 'لكل المستلمين جهاز مسجَّل.');
  if (dryRun) lines.push(`تجربة بلا إرسال. مرسَل سابقًا: ${sum.existing || 0}.`);
  else lines.push(`أُنشئ ${sum.created}، متجاوَز ${sum.skipped}، دفع ناجح ${sum.pushed}، فاشل ${sum.pushFailed}.`);
  if (owner) {
    await db.doc('notifications/welcome_report_' + now.getTime()).create({ to: owner.id, kind: 'admin', title: dryRun ? 'تقرير تجربة الترحيب' : 'تقرير إرسال الترحيب', body: lines.join('\n'), khatmaId: null, from: 'system', createdAt: now.toISOString(), readAt: null, pushed: true });
  }
  return sum;
}
