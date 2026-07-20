// sw.js

const CACHE_NAME = 'hub-ma-v1';

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/manifest.webmanifest'
];

// Instala o Service Worker e cria o cache inicial
self.addEventListener('install', (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Armazenando arquivos no cache...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Ativa o Service Worker e remove caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cache) => cache !== CACHE_NAME)
                    .map((cache) => caches.delete(cache))
            );
        }).then(() => self.clients.claim())
    );

    console.log('[SW] Service Worker ativado.');
});

// Intercepta as requisições
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    // Salva no cache para futuras requisições
                    const responseClone = networkResponse.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                    return networkResponse;
                })
                .catch(() => {
                    // Aqui poderá ser retornada uma página offline futuramente
                    return caches.match('/index.html');
                });
        })
    );
});