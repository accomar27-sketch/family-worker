// تخطيط تنبيهات المناسبات (دالة نقية قابلة للاختبار).
import * as O from '../public/js/lib/occasions.js';

/** directory: [{uid,name,memberName}] ؛ sent: Set من مفاتيح logKey المرسلة سابقًا */
export function planReminders({ family, directory, today, hour, sent = new Set(), minHour = 8 }) {
  if (hour < minHour) return [];
  const out = [];
  const due = O.dueReminders(O.extractOccasions(family), today);
  for (const r of due) {
    if (sent.has(r.logKey)) continue;
    const notes = [];
    for (const d of directory) {
      const who = d.memberName || d.name;
      const isOwner = r.occasion.people.includes(who);
      if (isOwner) {
        if (r.offset !== 0) continue;
        const m = O.messageForOwner(r);
        notes.push({ to: d.uid, kind: 'occasion', title: m.title, body: m.body });
      } else {
        const m = O.messageForOthers(r);
        notes.push({ to: d.uid, kind: 'occasion', title: m.title, body: m.body });
      }
    }
    out.push({ logKey: r.logKey, notes });
  }
  return out;
}
