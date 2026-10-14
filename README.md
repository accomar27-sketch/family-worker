# شجرة عائلة علي وحسنية — نسخة Firebase

مشروع Firebase: `ali-family-639d2` — المالك: acc.omar27@gmail.com

## ما الموجود
- `public/` الموقع نفسه (يُنشر على Firebase Hosting). لا توجد فيه أي بيانات عائلية.
- `seed/seed.json` بيانات العائلة والصور (خاص — **لا تنشره ولا ترفعه على GitHub**). تُرفع من داخل التطبيق إلى Firestore المحمي.
- `firestore.rules` قواعد الأمان: لا يقرأ شيئًا إلا المعتمدون، ولا يعدّل البيانات إلا المالك.
- `worker/` + `.github/workflows/worker.yml` عامل يعمل كل ١٠ دقائق: تنبيهات «بعد X يوم مناسبة فلان»، وإنهاء دعوات الختمة، وإرسال التنبيهات إلى الجوالات.
- `tests/` اختبارات (`node tests/logic.test.mjs`).

## النشر (مرة واحدة)
1. ثبّت Node.js (النسخة LTS) من nodejs.org.
2. في مجلد المشروع:
   ```
   npm install -g firebase-tools
   firebase login
   firebase deploy --only hosting,firestore:rules
   ```
3. افتح `https://ali-family-639d2.web.app` وادخل بحساب Google (acc.omar27@gmail.com): يُعتمد حسابك مالكًا تلقائيًا.
4. ستظهر شاشة «إعداد أولي»: اختر `seed/seed.json` واضغط «رفع البيانات».
5. أرسل الرابط لأفراد العائلة؛ يدخلون، فيصلك طلب في «اعتماد الأعضاء» لتربط كل واحد باسمه.

## العامل الخلفي (للتنبيهات خارج التطبيق)
1. أنشئ مستودع GitHub **عامًّا** (الأكشنز مجانية بلا حد للعامّ)، وارفع المشروع **بدون** `seed/seed.json` (موجود في `.gitignore`).
2. من Firebase Console ← Project settings ← Service accounts ← Generate new private key. سيُنزَّل ملف JSON.
3. في GitHub: Settings ← Secrets and variables ← Actions ← New repository secret، الاسم `FIREBASE_SERVICE_ACCOUNT` والقيمة محتوى الملف كاملًا. **لا ترسل هذا المفتاح لأحد، ولا لي.**
4. تبويب Actions ← family-worker ← Run workflow للتجربة.

## حدود يجب معرفتها
- التنبيهات خارج التطبيق تتأخر عادةً من ٥ إلى ٢٠ دقيقة (جدولة GitHub غير دقيقة). الفوري يحتاج خطة Blaze مع Cloud Functions لاحقًا.
- GitHub يوقف الجداول التلقائية بعد ٦٠ يومًا بلا أي نشاط في المستودع؛ أعد تشغيلها من تبويب Actions عند الحاجة.
- على الآيفون لا تعمل التنبيهات إلا بعد «إضافة إلى الشاشة الرئيسية» (iOS ١٦.٤+).
- Google ترفض الدخول من المتصفح المدمج في واتساب؛ يفتحونه في Chrome/Safari أو يستخدمون البريد وكلمة المرور.
- تعديل بيانات العائلة (مولود جديد مثلًا) يتم حاليًا بتعديل `seed.json` وإعادة رفعه من «اعتماد الأعضاء ← أدوات المالك». صورة الشجرة المصمَّمة وصفحات الدفتر ثابتة.
- لا نسخ احتياطي تلقائي في الخطة المجانية؛ احتفظ بنسخة من `seed.json`.
