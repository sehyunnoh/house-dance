import type { APIRoute } from 'astro';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
// A new build id changes the file, so browsers fetch the updated worker and refresh the cache.
const version = Date.now().toString(36);

export const GET: APIRoute = () =>
  new Response(
    `const CACHE = 'house-practice-${version}';
const BASE = ${JSON.stringify(base)};
const SHELL = [BASE + '/', BASE + '/inspire/', BASE + '/levels/0/'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Same-origin GETs only. Pages: network first, fall back to cache when offline.
// Static assets: cache first. Videos (YouTube) are never touched.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(BASE + '/'))),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
`,
    { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } },
  );
