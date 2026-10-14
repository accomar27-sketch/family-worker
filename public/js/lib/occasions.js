// منطق المناسبات العائلية (أعياد الميلاد وذكرى الزواج) — دوال نقية بلا قاعدة بيانات
// لتسهيل الاختبار. تُستخدم من reminders.ts لإرسال «بعد X يوم مناسبة فلان».




const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function extractOccasions(family) {
  const list = [];
  const FEMALE = "أنثى";
  const birthday = (id, name, date, gender) => {
    if (date && DATE_RE.test(date)) {
      list.push({
        key: `b:${id}`,
        kind: "birthday",
        date,
        label: name,
        people: [name],
        female: gender === FEMALE,
      });
    }
  };
  const anniversary = (id, a, b, date) => {
    if (date && DATE_RE.test(date)) {
      list.push({
        key: `w:${id}`,
        kind: "anniversary",
        date,
        label: `${a} و${b}`,
        people: [a, b],
      });
    }
  };

  family.parents.forEach((p, i) => birthday(`parent${i}`, p.name, p.birth, p.gender));
  if (family.parents.length === 2) {
    anniversary("parents", family.parents[0].name, family.parents[1].name, family.wedding);
  }
  for (const m of family.members) {
    birthday(m.id, m.name, m.birth, m.gender);
    if (m.spouse) {
      birthday(`${m.id}:spouse`, m.spouse, m.spouseBirth, m.gender === FEMALE ? "ذكر" : FEMALE);
      anniversary(m.id, m.name, m.spouse, m.wedding);
    }
    m.children.forEach((c, i) => birthday(`${m.id}:c${i}`, c.name, c.birth, c.gender));
  }
  return list;
}

/** تاريخ اليوم (YYYY-MM-DD) في منطقة زمنية معينة. */
export function todayIn(timeZone, now) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function hourIn(timeZone, now) {
  const h = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    hour12: false,
  }).format(now);
  return Number(h) % 24;
}

function utcDays(y, m, d) {
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

/** المناسبة القادمة: عدد الأيام المتبقية وعدد السنين التي ستكتمل. 29 فبراير تُحتسب 28 في غير الكبيسة. */
export function nextOccurrence(date, today) {
  const [by, bm, bd] = date.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  const at = (year) => {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const day = bm === 2 && bd === 29 && !isLeap ? 28 : bd;
    return utcDays(year, bm, day);
  };
  const t0 = utcDays(ty, tm, td);
  let year = ty;
  if (at(year) < t0) year += 1;
  return { days: at(year) - t0, years: year - by, year };
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function arDigits(v) {
  return String(v).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
}

export function yearsPhrase(n) {
  if (n === 1) return "سنة واحدة";
  if (n === 2) return "سنتين";
  if (n >= 3 && n <= 10) return `${arDigits(n)} سنوات`;
  return `${arDigits(n)} سنة`;
}

export function daysPhrase(n) {
  if (n === 0) return "اليوم";
  if (n === 1) return "غدًا";
  if (n === 2) return "بعد يومين";
  if (n <= 10) return `بعد ${arDigits(n)} أيام`;
  return `بعد ${arDigits(n)} يومًا`;
}

const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];
export function monthDay(date) {
  const [, m, d] = date.split("-").map(Number);
  return `${arDigits(d)} ${MONTHS[m - 1]}`;
}


export const DEFAULT_OFFSETS = [7, 1, 0];

export function dueReminders(
  occasions,
  today,
  offsets = DEFAULT_OFFSETS,
) {
  const out = [];
  for (const occasion of occasions) {
    const next = nextOccurrence(occasion.date, today);
    // تجاهل تواريخ مستقبلية خاطئة (ميلاد لم يحدث بعد)
    if (next.years <= 0) continue;
    if (offsets.includes(next.days)) {
      out.push({
        occasion,
        offset: next.days,
        years: next.years,
        year: next.year,
        logKey: `${occasion.key}:${next.year}:${next.days}`,
      });
    }
  }
  return out;
}


/** الرسالة لعضو ليس من أصحاب المناسبة. */
export function messageForOthers(r) {
  const { occasion, offset, years } = r;
  const when = daysPhrase(offset);
  if (occasion.kind === "birthday") {
    const what = `عيد ميلاد ${occasion.label}`;
    const completes = occasion.female ? "وتُتمّ" : "ويُتمّ";
    if (offset === 0) {
      return {
        title: `🎂 اليوم ${what}`,
        body: `اليوم ${what}، ${completes} ${yearsPhrase(years)}. لا تنسَ أن ${occasion.female ? "تهنّئها" : "تهنّئه"}، ومن «بطاقات التهنئة» تجد ما يناسب.`,
      };
    }
    return {
      title: `🎂 ${when} ${what}`,
      body: `${when} (${monthDay(occasion.date)}) ${what}، ${completes} ${yearsPhrase(years)}. جهّز تهنئتك من «بطاقات التهنئة».`,
    };
  }
  const what = `ذكرى زواج ${occasion.label}`;
  if (offset === 0) {
    return {
      title: `💍 اليوم ${what}`,
      body: `اليوم ${what}، وتكتمل ${yearsPhrase(years)} على زواجهما. بارك الله لهما وجمع بينهما في خير.`,
    };
  }
  return {
    title: `💍 ${when} ${what}`,
    body: `${when} (${monthDay(occasion.date)}) ${what}، وتكتمل ${yearsPhrase(years)} على زواجهما. جهّز تهنئتك من «بطاقات التهنئة».`,
  };
}

/** الرسالة لصاحب المناسبة نفسه (تصله يوم المناسبة فقط). */
export function messageForOwner(r) {
  const { occasion, years } = r;
  if (occasion.kind === "birthday") {
    return {
      title: occasion.female ? "🎂 كل عام وأنتِ بخير" : "🎂 كل عام وأنت بخير",
      body: `اليوم عيد ميلادك، وتُتمّ ${yearsPhrase(years)}. أسعد الله أيامك وبارك لك في عمرك، وأهل البيت يحبونك.`,
    };
  }
  return {
    title: "💍 ذكرى زواج سعيدة",
    body: `اليوم ذكرى زواجكما، وتكتمل ${yearsPhrase(years)}. بارك الله لكما ودامت بينكما المودة.`,
  };
}
