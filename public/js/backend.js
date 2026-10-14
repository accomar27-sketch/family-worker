// طبقة الوصول إلى Firebase. في الاختبارات يُستبدل بكائن window.__FAKE_BACKEND__ بنفس الواجهة.
import { firebaseConfig, VAPID_KEY } from './config.js';

const V = '10.14.1';
const CDN = `https://www.gstatic.com/firebasejs/${V}`;

async function real() {
  const [appM, authM, fsM] = await Promise.all([
    import(`${CDN}/firebase-app.js`),
    import(`${CDN}/firebase-auth.js`),
    import(`${CDN}/firebase-firestore.js`),
  ]);
  const app = appM.initializeApp(firebaseConfig);
  const auth = authM.getAuth(app);
  const db = fsM.getFirestore(app);
  const ref = (p) => fsM.doc(db, ...p.split('/'));
  const snap = (d) => (d.exists() ? { id: d.id, ...d.data() } : null);

  return {
    mode: 'firebase',
    onAuth(cb) {
      authM.getRedirectResult(auth).catch(() => {});
      return authM.onAuthStateChanged(auth, (u) => cb(u && { uid: u.uid, email: u.email, emailVerified: u.emailVerified, name: u.displayName || '', photo: u.photoURL || '' }));
    },
    async signInGoogle() {
      const p = new authM.GoogleAuthProvider();
      p.setCustomParameters({ prompt: 'select_account' });
      try { await authM.signInWithPopup(auth, p); }
      catch (e) {
        if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported'].includes(e.code)) await authM.signInWithRedirect(auth, p);
        else throw e;
      }
    },
    signInEmail: (e, p) => authM.signInWithEmailAndPassword(auth, e, p),
    async signUpEmail(e, p, name) {
      const c = await authM.createUserWithEmailAndPassword(auth, e, p);
      if (name) await authM.updateProfile(c.user, { displayName: name });
    },
    resetPassword: (e) => authM.sendPasswordResetEmail(auth, e),
    signOut: () => authM.signOut(auth),
    async get(p) { return snap(await fsM.getDoc(ref(p))); },
    set: (p, d, o) => fsM.setDoc(ref(p), d, o || {}),
    update: (p, d) => fsM.updateDoc(ref(p), d),
    async add(col, d) { return (await fsM.addDoc(fsM.collection(db, ...col.split('/')), d)).id; },
    del: (p) => fsM.deleteDoc(ref(p)),
    watchDoc(p, cb, err) { return fsM.onSnapshot(ref(p), (d) => cb(snap(d)), err || console.warn); },
    watchQuery(col, q, cb, err) {
      const c = [fsM.collection(db, ...col.split('/'))];
      (q.where || []).forEach((w) => c.push(fsM.where(...w)));
      (q.orderBy || []).forEach((o) => c.push(fsM.orderBy(...o)));
      if (q.limit) c.push(fsM.limit(q.limit));
      return fsM.onSnapshot(fsM.query(...c), (s) => cb(s.docs.map(snap)), err || console.warn);
    },
    async list(col) { return (await fsM.getDocs(fsM.collection(db, ...col.split('/')))).docs.map(snap); },
    async transact(p, fn) {
      return fsM.runTransaction(db, async (t) => {
        const r = ref(p); const cur = snap(await t.get(r));
        const out = fn(cur);
        if (out && out.data) t.set(r, out.data);
        return out;
      });
    },
    async batch(ops) {
      for (let i = 0; i < ops.length; i += 400) {
        const b = fsM.writeBatch(db);
        ops.slice(i, i + 400).forEach((o) => {
          if (o.op === 'add') b.set(fsM.doc(fsM.collection(db, ...o.col.split('/'))), o.data);
          else if (o.op === 'update') b.update(ref(o.path), o.data);
          else b.set(ref(o.path), o.data, o.merge ? { merge: true } : {});
        });
        await b.commit();
      }
    },
    pushSupported() { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; },
    pushPermission() { return 'Notification' in window ? Notification.permission : 'unsupported'; },
    async enablePush(uid) {
      if (!this.pushSupported()) return { ok: false, reason: 'unsupported' };
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return { ok: false, reason: 'denied' };
      const msgM = await import(`${CDN}/firebase-messaging.js`);
      const reg = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;
      const token = await msgM.getToken(msgM.getMessaging(app), { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
      if (!token) return { ok: false, reason: 'no-token' };
      await fsM.setDoc(fsM.doc(db, 'devices', token), { uid, ua: navigator.userAgent.slice(0, 120), createdAt: new Date().toISOString() });
      try { localStorage.setItem('pushToken', token); } catch (e) {}
      return { ok: true, token };
    },
    async disablePush() {
      let t = null; try { t = localStorage.getItem('pushToken'); } catch (e) {}
      if (t) { await fsM.deleteDoc(fsM.doc(db, 'devices', t)).catch(() => {}); try { localStorage.removeItem('pushToken'); } catch (e) {} }
    },
    pushOn() { try { return !!localStorage.getItem('pushToken') && Notification.permission === 'granted'; } catch (e) { return false; } },
  };
}

export async function getBackend() {
  if (window.__FAKE_BACKEND__) return window.__FAKE_BACKEND__;
  return real();
}
