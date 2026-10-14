// خلفية وهمية تحاكي واجهة backend.js في الذاكرة — للاختبار فقط.
(function () {
  const store = new Map(); const docL = []; const qL = []; let authCb = null, user = null, seq = 0;
  const clone = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));
  const split = (p) => { const a = p.split('/'); return { col: a.slice(0, -1).join('/'), id: a[a.length - 1] }; };
  const cols = (col) => [...store.entries()].filter(([p]) => split(p).col === col).map(([p, d]) => ({ id: split(p).id, ...clone(d) }));
  const match = (d, w) => (w || []).every(([f, op, v]) => (op === '==' ? d[f] === v : true));
  function save() { try { sessionStorage.setItem('fk', JSON.stringify([...store.entries()])); sessionStorage.setItem('fu', JSON.stringify(user)); } catch (e) {} }
  try { (JSON.parse(sessionStorage.getItem('fk')) || []).forEach(([k, v]) => store.set(k, v)); user = JSON.parse(sessionStorage.getItem('fu')); } catch (e) {}
  function fire() { save(); docL.forEach((l) => l.cb(store.has(l.p) ? { id: split(l.p).id, ...clone(store.get(l.p)) } : null)); qL.forEach((l) => l.cb(cols(l.col).filter((d) => match(d, l.q.where)))); }
  const later = (f) => Promise.resolve().then(f);
  const B = {
    mode: 'fake', store,
    onAuth(cb) { authCb = cb; later(() => cb(user)); return () => {}; },
    async signInGoogle() { throw new Error('use __fake.login'); },
    async signInEmail(e) { B.login({ uid: 'u_' + e, email: e, emailVerified: false, name: e.split('@')[0] }); },
    async signUpEmail(e, p, n) { B.login({ uid: 'u_' + e, email: e, emailVerified: false, name: n }); },
    resetPassword: async () => {}, signOut: async () => { user = null; save(); authCb && authCb(null); },
    login(u) { user = u; save(); authCb && authCb(u); },
    async get(p) { return store.has(p) ? { id: split(p).id, ...clone(store.get(p)) } : null; },
    async set(p, d, o) { store.set(p, o && o.merge ? { ...(store.get(p) || {}), ...clone(d) } : clone(d)); fire(); },
    async update(p, d) { if (!store.has(p)) throw Object.assign(new Error('nf'), { code: 'not-found' }); store.set(p, { ...store.get(p), ...clone(d) }); fire(); },
    async add(col, d) { const id = 'a' + ++seq; store.set(col + '/' + id, clone(d)); fire(); return id; },
    async del(p) { store.delete(p); fire(); },
    watchDoc(p, cb) { const l = { p, cb }; docL.push(l); later(() => cb(store.has(p) ? { id: split(p).id, ...clone(store.get(p)) } : null)); return () => docL.splice(docL.indexOf(l), 1); },
    watchQuery(col, q, cb) { const l = { col, q, cb }; qL.push(l); later(() => cb(cols(col).filter((d) => match(d, q.where)))); return () => qL.splice(qL.indexOf(l), 1); },
    async list(col) { return cols(col); },
    async transact(p, fn) { const cur = store.has(p) ? { id: split(p).id, ...clone(store.get(p)) } : null; const out = fn(cur); if (out && out.data) { store.set(p, clone(out.data)); fire(); } return out; },
    async batch(ops) { ops.forEach((o) => { if (o.op === 'add') store.set(o.col + '/' + 'a' + ++seq, clone(o.data)); else if (o.op === 'update') store.set(o.path, { ...store.get(o.path), ...clone(o.data) }); else store.set(o.path, clone(o.data)); }); fire(); },
    pushSupported: () => true, pushPermission: () => 'default',
    async enablePush(uid) { store.set('devices/tok_' + uid, { uid }); B._on = true; return { ok: true, token: 'tok' }; },
    async disablePush() { B._on = false; }, pushOn: () => !!B._on,
  };
  window.__FAKE_BACKEND__ = B; window.__fake = B;
})();
