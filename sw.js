const cacheName = 'news-v1';

const staticAssets = [
  './',
  './scripts/FileSaver.min.js',
  './scripts/ghost.js',
  './scripts/jquery.js',
  './scripts/jscolorjs',
  './scripts/jszip.min.js',
  './scripts/jszip-utils.js',
  './scripts/tools.js',
  './scripts/Vibrant.min.js'
];

self.addEventListener('install', async function () {
  const cache = await caches.open(cacheName);
  cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});