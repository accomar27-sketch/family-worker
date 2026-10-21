// تشغيل يدوي لمرة واحدة: إشعارات ترحيب بمن انضمّ. المتغيرات: WELCOME_PEOPLE ، DRY_RUN ('true' افتراضيًا).
import admin from 'firebase-admin';
import { parsePeople, runWelcome } from './welcome-core.mjs';

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
if (!sa.project_id) { console.error('FIREBASE_SERVICE_ACCOUNT غير مضبوط'); process.exit(1); }
const people = parsePeople(process.env.WELCOME_PEOPLE);
if (!people.length) { console.error('WELCOME_PEOPLE فارغ'); process.exit(1); }
const dryRun = String(process.env.DRY_RUN ?? 'true') !== 'false';

admin.initializeApp({ credential: admin.credential.cert(sa) });
const sum = await runWelcome({ db: admin.firestore(), messaging: admin.messaging(), people, dryRun });
console.log(JSON.stringify(sum));
if (!sum.ok) process.exit(1);
