// Service Worker для Plati Market PWA
const CACHE_NAME = 'plati-market-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/products.js',
  '/js/chat.js',
  '/manifest.json',
  '/images/logo.png',
  '/images/icons/menu.svg',
  '/images/icons/search.svg',
  '/images/icons/cart.svg',
  '/images/icons/arrow-back.svg',
  '/images/icons/home.svg',
  '/images/icons/favorite.svg',
  '/images/icons/purchases.svg',
  '/images/icons/chat.svg',
  '/images/icons/logout.svg',
  '/images/icons/send.svg',
  '/images/icons/more.svg',
  '/images/icons/filter.svg',
  '/images/icons/favorite-outline.svg'
];

// Установка Service Worker и кэширование статических ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов и обслуживание из кэша или сети
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный ответ, если он есть
        if (response) {
          return response;
        }
        
        // Иначе делаем запрос к сети
        return fetch(event.request)
          .then(response => {
            // Проверяем, что ответ валидный
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Клонируем ответ, так как он может быть использован только один раз
            const responseToCache = response.clone();
            
            // Кэшируем новый ответ
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            // Если запрос к API, возвращаем заглушку для офлайн-режима
            if (event.request.url.includes('/api/')) {
              return new Response(
                JSON.stringify({ 
                  error: 'Нет подключения к интернету',
                  offline: true 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' } 
                }
              );
            }
          });
      })
  );
});

// Обработка push-уведомлений
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/images/icon-192x192.png',
    badge: '/images/badge.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
