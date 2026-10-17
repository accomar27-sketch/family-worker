// منطق «ذِكرٌ يجمعنا»: قوالب الأذكار، المجموع، الاكتمال، التنبيهات. دوال نقية.
export const TEMPLATES = [
  'أستغفر الله العظيم وأتوب إليه',
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'سبحان الله وبحمده، سبحان الله العظيم',
  'لا إله إلا الله',
  'لا حول ولا قوة إلا بالله',
];
export const GOAL_PRESETS = [1000, 10000, 100000, 1000000];
export const MAX_GOAL = 100000000;

const ARD = '٠١٢٣٤٥٦٧٨٩';
/** رقم بالعربية مع فاصل الآلاف: ٣٤٬٢٠٠ */
export const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '٬').replace(/\d/g, (d) => ARD[d]);

/** يتحقق من نموذج الإنشاء. أخطاء: need_text | bad_goal */
export function cleanNew({ text, goal }) {
  const t = String(text || '').trim();
  if (!TEMPLATES.includes(t)) throw new Error('need_text');
  const g = Number(goal);
  if (!Number.isInteger(g) || g < 10 || g > MAX_GOAL) throw new Error('bad_goal');
  return { text: t, goal: g };
}

export const totalOf = (parts) => parts.reduce((s, p) => s + (Number(p.n) || 0), 0);
/** حالة الذكر: closed (أغلقه المالك) | done (اكتمل) | active */
export function statusOf(c, total) {
  if (c.closedAt) return 'closed';
  if (c.doneAt || total >= c.goal) return 'done';
  return 'active';
}
export const isActive = (c, total) => statusOf(c, total) === 'active';
export const pctOf = (c, total) => Math.max(0, Math.min(100, Math.floor((total / c.goal) * 100)));

/** لا يجوز بدء ذكر جديد وفي القائمة ذكر جارٍ. counters: [{...c, total}] */
export function canStartNew(counters) { return !counters.some((c) => isActive(c, c.total || 0)); }

/** تنبيهات العامل: نصف الهدف ثم الاكتمال (مرة واحدة لكل منهما). */
export function thresholdNotes(c, total) {
  const patch = {}, notes = [];
  if (c.closedAt) return { patch, notes };
  if (total >= c.goal * 0.5 && total < c.goal && !c.notified50) {
    patch.notified50 = true;
    notes.push({ kind: 'dhikr', title: 'ذِكرٌ يجمعنا: بلغنا النصف', body: `بلغنا نصف هدف «${c.text}»: ${fmt(total)} من ${fmt(c.goal)}. بارك الله فيكم، وتقبّل منا ومنكم.` });
  }
  if (total >= c.goal && !c.notified100) {
    patch.notified100 = true; patch.notified50 = true;
    if (!c.doneAt) patch.doneAt = new Date().toISOString();
    notes.push({ kind: 'dhikr', title: 'ذِكرٌ يجمعنا: تمّ الهدف', body: `أتممنا معًا ${fmt(c.goal)} من «${c.text}». الحمد لله، وتقبّل الله منا جميعًا.` });
  }
  return { patch, notes };
}
