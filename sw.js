/* Service worker: cho phép chơi cả khi không có mạng. Đổi CACHE khi cập nhật tệp. */
const CACHE = 'be-hoc-chu-so-v1';
const FILES = [
  './',
  'index.html',
  'css/style.css',
  'js/data.js',
  'js/app.js',
  'manifest.webmanifest',
  'assets/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Ưu tiên mạng để luôn có bản mới nhất, mất mạng thì dùng bản đã lưu. */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
