/* خدمة الإشعارات في الخلفية — رسائل بيانات فقط (data-only) فنعرض الإشعار بأنفسنا */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: 'AIzaSyCmptWLoAKyQvPCelZoKMIFB7igSZ4fzI8',
  authDomain: 'ali-family-639d2.firebaseapp.com',
  projectId: 'ali-family-639d2',
  storageBucket: 'ali-family-639d2.firebasestorage.app',
  messagingSenderId: '368223825464',
  appId: '1:368223825464:web:0bd43745527e92b7df40cd',
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  return self.registration.showNotification(d.title || 'عائلة علي وحسنية', {
    body: d.body || '',
    icon: './icon-192.png',
    badge: './icon-192.png',
    dir: 'rtl', lang: 'ar',
    tag: d.tag || undefined,
    data: { url: d.url || './' },
  });
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || './', self.location.origin + self.location.pathname.replace(/[^/]*$/, '')).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ('focus' in c) { c.navigate && c.navigate(url); return c.focus(); } }
    return clients.openWindow(url);
  }));
});
