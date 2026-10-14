import { $, esc } from './util.js';
import { OWNER_EMAIL } from '../config.js';

const inApp = () => /FBAN|FBAV|Instagram|Line\/|WhatsApp|; wv\)|Version\/[\d.]+.*Mobile.*Safari.*(?!Chrome)/i.test(navigator.userAgent) && /FBAN|FBAV|Instagram|WhatsApp|; wv\)/i.test(navigator.userAgent);

const ERR = {
  'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.',
  'auth/wrong-password': 'كلمة المرور غير صحيحة.',
  'auth/user-not-found': 'لا يوجد حساب بهذا البريد.',
  'auth/email-already-in-use': 'هذا البريد مسجّل من قبل، سجّل الدخول بدلًا من إنشاء حساب.',
  'auth/weak-password': 'كلمة المرور ضعيفة (٦ أحرف على الأقل).',
  'auth/invalid-email': 'صيغة البريد غير صحيحة.',
  'auth/popup-closed-by-user': 'أُغلقت نافذة الدخول قبل الإكمال.',
  'auth/network-request-failed': 'تعذّر الاتصال بالإنترنت.',
  'auth/too-many-requests': 'محاولات كثيرة، انتظر قليلًا ثم أعد المحاولة.',
  'auth/unauthorized-domain': 'هذا النطاق غير مُصرَّح له في إعدادات Firebase (Authorized domains).',
};
export const errText = (e) => ERR[e && e.code] || 'حدث خطأ غير متوقع، أعد المحاولة.';

function shell(inner) {
  $('gate').hidden = false; $('appmain').hidden = true;
  $('gate').innerHTML = `<div class="gcard"><div class="gico">🌳</div><h1>شجرة عائلة علي وحسنية</h1><div class="orn"><i></i><b></b><i></i></div>${inner}</div>`;
}

export function showLoading() { shell('<p class="gp">جارٍ التحميل…</p>'); }

export function showLogin(B) {
  let mode = 'in';
  const draw = (msg = '') => {
    shell(`
      ${inApp() ? '<div class="gwarn">أنت داخل متصفح مدمج (مثل واتساب). Google لا تسمح بالدخول منه؛ افتح الرابط في Chrome أو Safari، أو استخدم البريد وكلمة المرور أدناه.</div>' : ''}
      <p class="gp">للأعضاء فقط. بعد الدخول يراجع المالك طلبك ويربطه باسمك في العائلة.</p>
      <button class="gbtn google" id="gg"><span>G</span> الدخول بحساب Google</button>
      <div class="gor">أو بالبريد الإلكتروني</div>
      ${mode === 'up' ? '<input id="gn" class="gin" placeholder="اسمك" autocomplete="name">' : ''}
      <input id="ge" class="gin" type="email" dir="ltr" placeholder="البريد الإلكتروني" autocomplete="email">
      <input id="gpw" class="gin" type="password" dir="ltr" placeholder="كلمة المرور" autocomplete="${mode === 'up' ? 'new-password' : 'current-password'}">
      <button class="gbtn main" id="gs">${mode === 'up' ? 'إنشاء حساب' : 'دخول'}</button>
      <div class="gl"><button id="gm" class="glink">${mode === 'up' ? 'لدي حساب — دخول' : 'ليس لدي حساب — إنشاء حساب'}</button>${mode === 'in' ? '<button id="gr" class="glink">نسيت كلمة المرور</button>' : ''}</div>
      <p class="gerr" id="gerr" role="alert">${esc(msg)}</p>`);
    const err = (e) => { $('gerr').textContent = typeof e === 'string' ? e : errText(e); };
    $('gg').onclick = () => B.signInGoogle().catch(err);
    $('gm').onclick = () => { mode = mode === 'in' ? 'up' : 'in'; draw(); };
    if ($('gr')) $('gr').onclick = () => {
      const e = $('ge').value.trim(); if (!e) return err('اكتب بريدك أولًا ثم اضغط «نسيت كلمة المرور».');
      B.resetPassword(e).then(() => err('أرسلنا رابط إعادة التعيين إلى بريدك.'), err);
    };
    $('gs').onclick = () => {
      const e = $('ge').value.trim(), p = $('gpw').value;
      if (!e || !p) return err('اكتب البريد وكلمة المرور.');
      if (mode === 'up') { const n = $('gn').value.trim(); if (!n) return err('اكتب اسمك.'); B.signUpEmail(e, p, n).catch(err); }
      else B.signInEmail(e, p).catch(err);
    };
  };
  draw();
}

export function showPending(B, user) {
  shell(`<p class="gp"><b>أهلًا ${esc(user.name || user.email)}</b></p>
    <div class="gok">⏳ طلبك بانتظار موافقة المالك</div>
    <p class="gp">سيربطك المالك باسمك في العائلة، وبعدها يفتح لك التطبيق تلقائيًا (لا حاجة لإعادة الدخول).</p>
    ${user.email === OWNER_EMAIL && !user.emailVerified ? '<div class="gwarn">هذا بريد المالك لكنه غير موثَّق؛ ادخل عبر Google ليُعتمد حسابك تلقائيًا.</div>' : ''}
    <button class="gbtn" id="go">تسجيل الخروج</button>`);
  $('go').onclick = () => B.signOut();
}
export function showRejected(B) {
  shell(`<div class="gwarn">لم يُعتمد هذا الحساب. إن كان هذا خطأ فتواصل مع المالك.</div><button class="gbtn" id="go">تسجيل الخروج</button>`);
  $('go').onclick = () => B.signOut();
}
export function showMessage(B, html) {
  shell(`${html}<button class="gbtn" id="go">تسجيل الخروج</button>`);
  $('go').onclick = () => B.signOut();
}
export function showImport(B, onFile) {
  shell(`<p class="gp"><b>إعداد أولي (للمالك)</b></p>
    <p class="gp">لم تُرفع بيانات العائلة بعد. اختر ملف <b>seed.json</b> الذي أعطيتك إياه؛ يُحفظ داخل قاعدة البيانات المحمية ولا يُنشر علنًا.</p>
    <input type="file" id="gf" accept=".json,application/json" class="gin">
    <button class="gbtn main" id="gi">رفع البيانات</button>
    <p class="gerr" id="gerr" role="status"></p>
    <button class="gbtn" id="go">تسجيل الخروج</button>`);
  $('go').onclick = () => B.signOut();
  $('gi').onclick = async () => {
    const f = $('gf').files[0]; if (!f) { $('gerr').textContent = 'اختر الملف أولًا.'; return; }
    $('gi').disabled = true;
    try { await onFile(f, (m) => { $('gerr').textContent = m; }); }
    catch (e) { $('gerr').textContent = 'تعذّر الرفع: ' + (e.message || e.code || e); $('gi').disabled = false; }
  };
}
