// منطق الختمة — دوال نقية تُستخدم في المتصفح وفي العامل (منقولة من نسخة ريبليت).
// كل دالة تُرجع { khatma, notes } حيث notes رسائل [{to, kind, title, body}] تُحفظ كإشعارات.

export const INVITE_MS = 12 * 60 * 60 * 1000;

export function shuffle(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function assignParticipants(accounts, randomize, rnd = Math.random) {
  const ordered = randomize ? shuffle(accounts, rnd) : [...accounts];
  const base = Math.floor(30 / ordered.length);
  const extra = 30 % ordered.length;
  let next = 1;
  return ordered.map((a, i) => {
    const count = base + (i < extra ? 1 : 0);
    const p = { userId: a.userId, name: a.name, firstJuz: next, lastJuz: next + count - 1, completedAt: null };
    next += count;
    return p;
  });
}

const juzNum = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
export function juzText(p) {
  return p.firstJuz === p.lastJuz ? `${p.firstJuz}` : `${p.firstJuz}–${p.lastJuz}`;
}

function startedNote(k, p) {
  return {
    to: p.userId, kind: 'khatma_started', khatmaId: k.id,
    title: 'بدأت ختمة العائلة',
    body: `بدأت ختمة «${k.title}». وردك الأجزاء ${juzText(p)}. تقبّل الله منكم.`,
  };
}

/** accounts: [{userId,name}] المعتمدون. creator: {userId,name}.
 *  poll: يُدعى الجميع. selected: يُدعى المختارون فقط. في الحالتين يوافق المنشئ تلقائيًا إن كان بينهم. */
export function createKhatma({ id, title, note, mode, selectedIds = [], creator, accounts, now = Date.now(), rnd = Math.random }) {
  const t = String(title || '').trim();
  if (!t) throw new Error('invalid_khatma');
  const iso = new Date(now).toISOString();
  let invited;
  if (mode === 'poll') invited = accounts;
  else {
    invited = accounts.filter((a) => selectedIds.includes(a.userId));
    if (invited.length < 1 || invited.length > 30 || invited.length !== selectedIds.length) throw new Error('invalid_participants');
  }
  const responses = invited.map((a) => ({
    userId: a.userId, name: a.name,
    response: a.userId === creator.userId ? 'accept' : null,
    respondedAt: a.userId === creator.userId ? iso : null,
  }));
  const pending = responses.some((r) => r.response === null);
  const k = {
    id, title: t, note: (note || '').trim() || null, status: pending ? 'inviting' : 'active', participationMode: mode,
    invitationDeadline: new Date(now + (pending ? INVITE_MS : 0)).toISOString(), responses, participants: [],
    createdBy: creator.userId, createdByName: creator.name, createdAt: iso, completedAt: null,
  };
  let notes = [];
  if (pending) {
    notes = responses.filter((r) => r.userId !== creator.userId).map((r) => ({
      to: r.userId, kind: 'khatma_invitation', khatmaId: id,
      title: 'دعوة للمشاركة في ختمة',
      body: `هل ترغب بالمشاركة في ختمة «${t}»؟ اختر نعم أو لا خلال ١٢ ساعة.`,
    }));
  } else {
    k.participants = assignParticipants(responses.filter((r) => r.response === 'accept'), true, rnd);
    notes = k.participants.map((p) => startedNote(k, p));
  }
  return { khatma: k, notes };
}

export const allAnswered = (k) => k.responses.every((r) => r.response);

/** الرد أو تغيير الرد قبل انتهاء المهلة. إن أجاب الجميع تبدأ الختمة فورًا. */
export function respond(k, userId, answer, now = Date.now(), rnd = Math.random) {
  if (k.status !== 'inviting' || !k.invitationDeadline || Date.parse(k.invitationDeadline) <= now) return { error: 'closed' };
  const i = k.responses.findIndex((r) => r.userId === userId);
  if (i < 0) return { error: 'not_invited' };
  if (k.responses[i].response === answer) return { khatma: k, notes: [] };
  const responses = k.responses.map((r, j) => (j === i ? { ...r, response: answer, respondedAt: new Date(now).toISOString() } : r));
  const next = { ...k, responses };
  if (allAnswered(next)) return finalizeInvitation(next, now, rnd, true);
  return { khatma: next, notes: [] };
}

const countOf = (k, v) => k.responses.filter((r) => (v === 'none' ? !r.response : r.response === v)).length;
function summaryNote(k, text) {
  return { to: k.createdBy, kind: 'khatma_summary', khatmaId: k.id, title: `نتيجة دعوة «${k.title}»`, body: text };
}

/** تُنهي الدعوة (بانتهاء المهلة أو برد الجميع force). تُرجع null إن لم يحن وقتها.
 *  - لا موافقين: تُلغى. - المنشئ وحده: تنتظر قراره. - غير ذلك: توزيع الأجزاء وبدء الختمة. */
export function finalizeInvitation(k, now = Date.now(), rnd = Math.random, force = false) {
  if (k.status !== 'inviting') return null;
  if (!force && (!k.invitationDeadline || Date.parse(k.invitationDeadline) > now)) return null;
  const accepted = k.responses.filter((r) => r.response === 'accept')
    .sort((a, b) => (a.respondedAt || '').localeCompare(b.respondedAt || '')).slice(0, 30);
  const stat = `وافق ${juzNum(countOf(k, 'accept'))}، واعتذر ${juzNum(countOf(k, 'decline'))}، ولم يرد ${juzNum(countOf(k, 'none'))}.`;
  if (!accepted.length) {
    return { khatma: { ...k, status: 'cancelled', cancelReason: 'no_participants' }, notes: [summaryNote(k, 'لم يوافق أحد فأُلغيت الختمة. ' + stat)] };
  }
  const onlyCreator = accepted.length === 1 && accepted[0].userId === k.createdBy && k.responses.length > 1;
  if (onlyCreator) {
    return { khatma: { ...k, status: 'awaiting_creator' }, notes: [summaryNote(k, 'لم يوافق أحد غيرك. افتح الختمة واختر: تبدأ بنفسك أو تلغيها. ' + stat)] };
  }
  const participants = assignParticipants(accepted.map(({ userId, name }) => ({ userId, name })), true, rnd);
  const khatma = { ...k, status: 'active', participants };
  const notes = participants.map((p) => {
    const n = startedNote(khatma, p);
    return p.userId === k.createdBy ? { ...n, body: n.body + ' ' + stat } : n;
  });
  if (!participants.some((p) => p.userId === k.createdBy)) notes.push(summaryNote(k, 'بدأت الختمة. ' + stat));
  return { khatma, notes };
}

/** قرار المنشئ حين لم يوافق غيره: البدء منفردًا. */
export function startSolo(k, userId, now = Date.now()) {
  if (k.status !== 'awaiting_creator') return { error: 'bad_state' };
  if (k.createdBy !== userId) return { error: 'not_creator' };
  const me = k.responses.find((r) => r.userId === userId) || { userId, name: k.createdByName };
  const participants = assignParticipants([{ userId: me.userId, name: me.name }], false);
  const khatma = { ...k, status: 'active', participants, startedAt: new Date(now).toISOString() };
  return { khatma, notes: [startedNote(khatma, participants[0])] };
}

/** إلغاء المنشئ للختمة أثناء الدعوة أو انتظار قراره. يُخطَر المدعوّون. */
export function cancel(k, userId) {
  if (k.createdBy !== userId) return { error: 'not_creator' };
  if (k.status !== 'inviting' && k.status !== 'awaiting_creator') return { error: 'bad_state' };
  const khatma = { ...k, status: 'cancelled', cancelReason: 'creator' };
  const notes = k.responses.filter((r) => r.userId !== userId).map((r) => ({
    to: r.userId, kind: 'khatma_cancelled', khatmaId: k.id, title: 'أُلغيت الختمة', body: `ألغى ${k.createdByName} ختمة «${k.title}».`,
  }));
  return { khatma, notes };
}

/** تذكير بالرد لمن لم يجب: عند منتصف المهلة، ثم قبل نهايتها بساعة. يُرجع null إن لا جديد. */
export function reminders(k, now = Date.now()) {
  if (k.status !== 'inviting' || !k.invitationDeadline) return null;
  const end = Date.parse(k.invitationDeadline), start = Date.parse(k.createdAt);
  if (!(end > now) || !(start < end)) return null;
  const late = end - now <= 60 * 60000, half = now >= start + (end - start) / 2;
  let flag = null;
  if (late && !k.remindedLast) flag = 'remindedLast';
  else if (half && !late && !k.remindedHalf) flag = 'remindedHalf';
  if (!flag) return null;
  const pending = k.responses.filter((r) => !r.response);
  const khatma = { ...k, [flag]: true, ...(flag === 'remindedLast' ? { remindedHalf: true } : {}) };
  if (!pending.length) return { khatma, notes: [] };
  const body = flag === 'remindedLast'
    ? `بقيت أقل من ساعة للرد على دعوة ختمة «${k.title}».`
    : `لم تردّ بعد على دعوة ختمة «${k.title}». هل ترغب بالمشاركة؟`;
  return { khatma, notes: pending.map((r) => ({ to: r.userId, kind: 'khatma_invitation', khatmaId: k.id, title: 'تذكير بدعوة الختمة', body })) };
}

/** approvedIds: كل المعتمدين يصلهم إشعار الإنجاز. */
export function complete(k, userId, approvedIds, now = Date.now()) {
  const i = k.participants.findIndex((p) => p.userId === userId);
  if (i < 0) return { error: 'not_assigned' };
  if (k.participants[i].completedAt) return { khatma: k, notes: [] };
  const at = new Date(now).toISOString();
  const participants = k.participants.map((p, j) => (j === i ? { ...p, completedAt: at } : p));
  const done = participants.every((p) => p.completedAt);
  const khatma = { ...k, participants, status: done ? 'complete' : 'active', completedAt: done ? at : null };
  const p = participants[i];
  const title = done ? 'اكتملت الختمة' : 'تم إنجاز جزء من الختمة';
  const body = `أتم ${p.name} ${p.firstJuz === p.lastJuz ? 'الجزء ' + p.firstJuz : 'الأجزاء ' + p.firstJuz + '–' + p.lastJuz} من ختمة «${k.title}».`;
  return { khatma, notes: approvedIds.map((to) => ({ to, kind: done ? 'khatma_complete' : 'khatma_progress', khatmaId: k.id, title, body })) };
}
