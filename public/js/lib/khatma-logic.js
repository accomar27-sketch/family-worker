// منطق الختمة — دوال نقية تُستخدم في المتصفح وفي العامل (منقولة من نسخة ريبليت).
// كل دالة تُرجع { khatma, notes } حيث notes رسائل [{to, kind, title, body}] تُحفظ كإشعارات.

export const INVITE_MS = 5 * 60 * 60 * 1000;

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

/** accounts: [{userId,name}] المعتمدون. creator: {userId,name}. */
export function createKhatma({ id, title, note, mode, selectedIds = [], creator, accounts, now = Date.now(), rnd = Math.random }) {
  const t = String(title || '').trim();
  if (!t) throw new Error('invalid_khatma');
  const iso = new Date(now).toISOString();
  let status, responses = [], participants = [], deadline = null, notes = [];
  if (mode === 'poll') {
    responses = accounts.map((a) => ({
      userId: a.userId, name: a.name,
      response: a.userId === creator.userId ? 'accept' : null,
      respondedAt: a.userId === creator.userId ? iso : null,
    }));
    const pending = responses.some((r) => r.response === null);
    status = pending ? 'inviting' : 'active';
    deadline = new Date(now + (pending ? INVITE_MS : 0)).toISOString();
    if (!pending) participants = assignParticipants(responses.filter((r) => r.response === 'accept'), true, rnd);
  } else {
    const chosen = accounts.filter((a) => selectedIds.includes(a.userId));
    if (chosen.length < 1 || chosen.length > 30 || chosen.length !== selectedIds.length) throw new Error('invalid_participants');
    participants = assignParticipants(chosen, false, rnd);
    status = 'active';
  }
  const k = {
    id, title: t, note: (note || '').trim() || null, status, participationMode: mode,
    invitationDeadline: deadline, responses, participants,
    createdBy: creator.userId, createdByName: creator.name, createdAt: iso, completedAt: null,
  };
  if (status === 'inviting') {
    notes = responses.filter((r) => r.userId !== creator.userId).map((r) => ({
      to: r.userId, kind: 'khatma_invitation', khatmaId: id,
      title: 'دعوة للمشاركة في ختمة',
      body: `هل ترغب بالمشاركة في ختمة «${t}»؟ اختر نعم أو لا خلال خمس ساعات.`,
    }));
  } else notes = participants.map((p) => startedNote(k, p));
  return { khatma: k, notes };
}

export function respond(k, userId, answer, now = Date.now()) {
  if (k.status !== 'inviting' || !k.invitationDeadline || Date.parse(k.invitationDeadline) <= now) return { error: 'closed' };
  const i = k.responses.findIndex((r) => r.userId === userId);
  if (i < 0) return { error: 'not_invited' };
  const prev = k.responses[i];
  if (prev.response) return prev.response === answer ? { khatma: k, notes: [] } : { error: 'already_answered' };
  const responses = k.responses.map((r, j) => (j === i ? { ...r, response: answer, respondedAt: new Date(now).toISOString() } : r));
  return { khatma: { ...k, responses }, notes: [] };
}

/** تُنهي دعوة منتهية؛ تُرجع null إن لم يحن وقتها. */
export function finalizeInvitation(k, now = Date.now(), rnd = Math.random) {
  if (k.status !== 'inviting') return null;
  if (!k.invitationDeadline || Date.parse(k.invitationDeadline) > now) return null;
  const accepted = k.responses.filter((r) => r.response === 'accept')
    .sort((a, b) => (a.respondedAt || '').localeCompare(b.respondedAt || '')).slice(0, 30);
  if (!accepted.length) return { khatma: { ...k, status: 'cancelled' }, notes: [] };
  const participants = assignParticipants(accepted.map(({ userId, name }) => ({ userId, name })), true, rnd);
  const khatma = { ...k, status: 'active', participants };
  return { khatma, notes: participants.map((p) => startedNote(khatma, p)) };
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
  const body = `أتم ${p.name} الأجزاء ${p.firstJuz}–${p.lastJuz} من ختمة «${k.title}».`;
  return { khatma, notes: approvedIds.map((to) => ({ to, kind: done ? 'khatma_complete' : 'khatma_progress', khatmaId: k.id, title, body })) };
}
