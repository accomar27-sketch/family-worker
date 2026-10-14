import assert from 'node:assert/strict';
import * as K from '../public/js/lib/khatma-logic.js';
import * as O from '../public/js/lib/occasions.js';
const acc = ['a','b','c','d'].map((x) => ({ userId: x, name: x.toUpperCase() }));
// 30 جزءًا موزعة بلا فجوات
const p = K.assignParticipants(acc, false);
assert.equal(p[0].firstJuz, 1); assert.equal(p.at(-1).lastJuz, 30);
assert.deepEqual(p.map((x) => x.lastJuz - x.firstJuz + 1), [8, 8, 7, 7]);
// poll
let r = K.createKhatma({ id: 'k1', title: ' ختمة ', mode: 'poll', creator: acc[0], accounts: acc, now: 0 });
assert.equal(r.khatma.status, 'inviting'); assert.equal(r.notes.length, 3);
assert.equal(K.finalizeInvitation(r.khatma, 1000), null);
let k = r.khatma;
k = K.respond(k, 'b', 'accept', 1000).khatma; k = K.respond(k, 'c', 'decline', 2000).khatma;
assert.equal(K.respond(k, 'c', 'accept', 3000).error, 'already_answered');
assert.equal(K.respond(k, 'zz', 'accept', 3000).error, 'not_invited');
const f = K.finalizeInvitation(k, K.INVITE_MS + 1);
assert.equal(f.khatma.status, 'active'); assert.equal(f.khatma.participants.length, 2); assert.equal(f.notes.length, 2);
assert.equal(K.respond(f.khatma, 'd', 'accept').error, 'closed');
// لا أحد وافق → إلغاء (المنشئ يوافق تلقائيًا فلا يحدث) ؛ منفرد
const solo = K.createKhatma({ id: 's', title: 't', mode: 'poll', creator: acc[0], accounts: [acc[0]] });
assert.equal(solo.khatma.status, 'active'); assert.equal(solo.khatma.participants[0].lastJuz, 30);
// selected
const sel = K.createKhatma({ id: 'x', title: 't', mode: 'selected', selectedIds: ['a', 'b'], creator: acc[0], accounts: acc });
assert.equal(sel.khatma.participants.length, 2);
assert.throws(() => K.createKhatma({ id: 'x', title: 't', mode: 'selected', selectedIds: ['a', 'q'], creator: acc[0], accounts: acc }));
// complete
let c = K.complete(sel.khatma, 'a', ['a', 'b']); assert.equal(c.khatma.status, 'active'); assert.equal(c.notes.length, 2);
c = K.complete(c.khatma, 'b', ['a', 'b']); assert.equal(c.khatma.status, 'complete');
assert.equal(K.complete(c.khatma, 'z', []).error, 'not_assigned');
// occasions
const fam = { parents: [{ name: 'علي', gender: 'ذكر', birth: '1960-10-21' }, { name: 'حسنية', gender: 'أنثى', birth: '1969-09-25' }], wedding: '1987-07-02',
  members: [{ id: 'omar', name: 'عمر', gender: 'ذكر', birth: '1990-11-08', spouse: 'خلود', spouseBirth: '1991-06-01', wedding: '2019-07-20', children: [] }] };
const occ = O.extractOccasions(fam);
assert.equal(occ.length, 6);
const due = O.dueReminders(occ, '2026-11-01');
assert.deepEqual(due.map((d) => d.offset), [7]);
assert.match(O.messageForOthers(due[0]).title, /بعد ٧ أيام عيد ميلاد عمر/);
console.log('logic ok');
import { planReminders } from '../worker/plan.mjs';
const dir = [{ uid: 'o', name: 'x', memberName: 'عمر' }, { uid: 'a', name: 'y', memberName: 'أمينة' }];
let pl = planReminders({ family: fam, directory: dir, today: '2026-11-01', hour: 9 });
assert.equal(pl.length, 1); assert.deepEqual(pl[0].notes.map((n) => n.to), ['a']);          // صاحب المناسبة لا يصله التنبيه المسبق
pl = planReminders({ family: fam, directory: dir, today: '2026-11-08', hour: 9 });
assert.equal(pl[0].notes.length, 2); assert.match(pl[0].notes.find((n) => n.to === 'o').title, /كل عام/);
assert.equal(planReminders({ family: fam, directory: dir, today: '2026-11-08', hour: 7 }).length, 0);
assert.equal(planReminders({ family: fam, directory: dir, today: '2026-11-08', hour: 9, sent: new Set([pl[0].logKey]) }).length, 0);
console.log('plan ok');
