import { createRequire } from 'node:module'; const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import fs from 'node:fs'; import http from 'node:http'; import path from 'node:path'; import assert from 'node:assert/strict';
const root = path.resolve('public'); const seed = JSON.parse(fs.readFileSync('seed/seed.json', 'utf8'));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html')); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f)); }).listen(0);
const port = srv.address().port;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const pg = await (await b.newContext({ viewport: { width: 420, height: 900 }, serviceWorkers: 'block' })).newPage();
const errs = []; pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/fonts|gstatic|ERR_/.test(m.text())) errs.push(m.text()); });
await pg.route(/fonts\.(googleapis|gstatic)/, (r) => r.abort());
await pg.addInitScript({ path: 'tests/fake-backend.js' });
await pg.goto(`http://localhost:${port}/`);
const vis = (s) => pg.locator(s).first().isVisible();
await pg.waitForSelector('#gate .gcard');
assert.match(await pg.textContent('#gate'), /الدخول بحساب Google/);
// عضو عادي → ينتظر
const owner = { uid: 'own', email: 'acc.omar27@gmail.com', emailVerified: true, name: 'عمر' };
const amina = { uid: 'am', email: 'amina@x.com', emailVerified: true, name: 'أمينة س' };
const tala = { uid: 'tl', email: 'tala@x.com', emailVerified: true, name: 'تالا س' };
await pg.evaluate((u) => window.__fake.login(u), amina);
await pg.waitForSelector('.gok');
assert.equal(await pg.evaluate(() => window.__fake.store.get('users/am').status), 'pending');
// المالك: لا بيانات → شاشة الاستيراد
await pg.evaluate((u) => window.__fake.login(u), owner);
await pg.waitForSelector('#gf');
await pg.evaluate((s) => { for (const [k, v] of Object.entries(s)) window.__fake.store.set(k === 'family' ? 'family/main' : 'assets/' + k, v); }, seed);
await pg.evaluate((u) => window.__fake.login(null) || window.__fake.login(u), owner);
await pg.waitForSelector('#appmain:not([hidden])');
await pg.waitForFunction(() => document.querySelectorAll('.branch').length === 7);
assert.ok(await vis('#apb'), 'tile approvals for owner');
// الاعتماد
await pg.click('#apb'); await pg.waitForSelector('.apr select');
assert.equal(await pg.locator('#apb .bdg').textContent(), '١');
await pg.selectOption('.apr select', 'أمينة'); await pg.click('[data-ok]');
await pg.waitForFunction(() => window.__fake.store.get('users/am').status === 'approved');
assert.equal(await pg.evaluate(() => window.__fake.store.get('directory/am').memberName), 'أمينة');
// عضو ثانٍ معتمد مباشرة
await pg.evaluate((s) => { window.__fake.set('users/tl', { name: 'تالا س', email: 't', status: 'approved', role: 'member', memberName: 'تالا' }); window.__fake.set('directory/tl', { uid: 'tl', name: 'تالا', memberName: 'تالا' }); }, 0);
// ختمة بالدعوة (المالك)
await pg.click('#khb'); await pg.fill('#kht', 'ختمة رمضان'); await pg.click('#khgo');
await pg.waitForSelector('.kcardx');
let ks = await pg.evaluate(() => [...window.__fake.store.entries()].filter(([p]) => p.startsWith('khatmas/')).map(([, d]) => d));
assert.equal(ks.length, 1); assert.equal(ks[0].status, 'inviting');
let nts = await pg.evaluate(() => [...window.__fake.store.entries()].filter(([p]) => p.startsWith('notifications/')).map(([, d]) => d));
assert.equal(nts.filter((n) => n.kind === 'khatma_invitation').length, 2);
// أمينة تقبل
await pg.evaluate((u) => window.__fake.login(u), amina);
await pg.waitForFunction(() => document.querySelector('#ntb .bdg'), null, { timeout: 15000 });
await pg.click('#khb'); await pg.click('[data-a=accept]');
await pg.waitForFunction(() => [...window.__fake.store.values()].some((d) => d.responses && d.responses.find((r) => r.userId === 'am' && r.response === 'accept')));
// انتهاء المهلة → توزيع تلقائي
await pg.evaluate(() => { const [p, d] = [...window.__fake.store.entries()].find(([p]) => p.startsWith('khatmas/')); d.invitationDeadline = new Date(Date.now() - 1000).toISOString(); window.__fake.set(p, d); });
await pg.waitForFunction(() => [...window.__fake.store.values()].some((d) => d.status === 'active' && d.participants.length === 2), null, { timeout: 5000 });
await pg.waitForSelector('[data-done]');
await pg.click('[data-done]');
await pg.waitForFunction(() => [...window.__fake.store.values()].some((d) => d.participants && d.participants.some((p) => p.userId === 'am' && p.completedAt)));
// إشعارات
await pg.click('#ntb'); await pg.waitForSelector('.nit');
assert.ok((await pg.locator('.nit').count()) >= 2);
await pg.click('#pushon'); await pg.waitForSelector('#pushoff');
// موعد عائلي
await pg.click('#gtb'); await pg.click('#gnt');
await pg.waitForFunction(() => [...window.__fake.store.values()].some((d) => d.kind === 'family_gathering'));
// أقسام النسخة الأصلية
for (const [t, p, sel] of [['#famb', '#fam', '.branch'], ['#tlb', '#tl', '.ti'], ['#tmb', '#tm', '.tmr'], ['#ctb', '#ct', '.chip'], ['#hkb', '#hk', '.kc'], ['#slb', '#sl', '.slc']]) {
  await pg.click(t); await pg.waitForSelector(`${p}.open ${sel}`);
}
await pg.click('#cdb'); await pg.click('#cwb'); await pg.waitForSelector('#cv.show');
await pg.click('#cclose');
await pg.click('#pb0'); await pg.waitForFunction(() => document.getElementById('pimg').src.startsWith('data:image/jpeg'));
await pg.click('#hkb'); await pg.click('[data-m=l]'); await pg.click('[data-a=pg]');
await pg.waitForFunction(() => document.querySelector('.hk-card img') && document.querySelector('.hk-card img').src.startsWith('data:image'));
await pg.screenshot({ path: 'tests/shot-home.png', fullPage: false });
await pg.click('#khb'); await pg.screenshot({ path: 'tests/shot-khatma.png' });
await pg.evaluate(() => window.scrollTo(0, 0));
console.log('errors:', errs); assert.equal(errs.length, 0);
console.log('e2e ok'); await b.close(); srv.close();
