// تحويل وثيقة العائلة (family/main) إلى الشكل الذي تفهمه واجهة النسخة الأصلية.
const HUES = [350, 150, 200, 290, 30, 260, 320];

export function toLegacy(family, avatars, hikam) {
  const g = (x) => (x === 'أنثى' ? 'f' : 'm');
  const B = family.members.map((m, i) => ({
    n: m.name, g: g(m.gender), b: m.birth,
    s: m.spouse || null, sb: m.spouseBirth, w: m.wedding,
    ...(m.soon ? { soon: 1 } : {}), ...(m.last ? { last: 1 } : {}), ...(m.isMe ? { me: 1 } : {}),
    k: (m.children || []).map((c) => [c.name, g(c.gender), c.birth]),
    h: m.hue != null ? m.hue : HUES[i % HUES.length],
  }));
  const HC = { 'علي': family.parentsCity };
  family.members.forEach((m) => { HC[m.name] = m.city || family.parentsCity; });
  return {
    B, HC,
    P: { a: family.parents[0].birth, m: family.parents[1].birth, w: family.wedding },
    AV: (avatars && avatars.looks) || {},
    HK: (hikam && hikam.items) || [],
  };
}

/** كل الأسماء المعروفة في العائلة (لربط حساب بعضو). */
export function allNames(family) {
  const s = new Set();
  family.parents.forEach((p) => s.add(p.name));
  family.members.forEach((m) => {
    s.add(m.name); if (m.spouse) s.add(m.spouse);
    (m.children || []).forEach((c) => s.add(c.name));
  });
  return [...s];
}

export function households(family) {
  return [
    { id: 'parents', name: 'بيت الوالد والوالدة علي وحسنية' },
    ...family.members.map((m) => ({ id: m.id, name: m.spouse ? `عائلة ${m.name} و${m.spouse}` : `عائلة ${m.name}` })),
  ];
}
