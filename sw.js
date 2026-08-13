/* ============================================================
   CivioX — Service Worker
   وظيفته الوحيدة: عرض إشعارات الجهاز والاستجابة للنقر عليها.
   أندرويد لا يسمح بـ new Notification من الصفحة إطلاقاً، ويشترط
   ServiceWorkerRegistration.showNotification — ولهذا وُجد هذا الملف.

   لا تخزين مؤقت (cache) هنا عمداً: أي كاش يجعل تحديث الموقع لا يصل
   المستخدم، والمنصة تعتمد على ?v= في الروابط للتحديث.
   ============================================================ */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

/* النقر على الإشعار: يُركّز تبويباً مفتوحاً للمنصة أو يفتح واحداً جديداً */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) {
        try { await c.focus(); } catch { }
        if ('navigate' in c && url) { try { await c.navigate(url); } catch { } }
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(url);
  })());
});
