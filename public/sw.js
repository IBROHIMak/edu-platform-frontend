// Service Worker for Cambridge English Platform
// Offline Mode va Caching

const CACHE_NAME = 'cambridge-english-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Cache qilinadigan fayllar
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  OFFLINE_URL,
  // Icons
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// API endpoints cache qilish uchun
const API_CACHE_URLS = [
  '/api/auth/me',
  '/api/users/profile',
  '/api/homework',
  '/api/videos',
  '/api/competitions',
  '/api/rewards'
];

// Install event - Service Worker o'rnatilganda
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Error caching static files:', error);
      })
  );
});

// Activate event - Service Worker faollashganda
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - Network so'rovlarni tutish
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // HTML sahifalar uchun
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Agar network ishlasa, cache qil va qaytir
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Agar network ishlamasa, cache dan ol
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Agar cache da yo'q bo'lsa, offline sahifani ko'rsat
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // API so'rovlar uchun
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Faqat GET so'rovlarni cache qil
          if (request.method === 'GET' && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Network ishlamasa, cache dan ol
          if (request.method === 'GET') {
            return caches.match(request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  // Offline ekanligini bildirish uchun header qo'sh
                  const headers = new Headers(cachedResponse.headers);
                  headers.set('X-Served-From', 'cache');
                  
                  return new Response(cachedResponse.body, {
                    status: cachedResponse.status,
                    statusText: cachedResponse.statusText,
                    headers: headers
                  });
                }
                
                // Agar cache da yo'q bo'lsa, offline data qaytir
                return new Response(
                  JSON.stringify({
                    success: false,
                    message: 'Offline mode - ma\'lumot mavjud emas',
                    offline: true,
                    data: null
                  }),
                  {
                    status: 503,
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Served-From': 'offline'
                    }
                  }
                );
              });
          }
          
          // POST, PUT, DELETE so'rovlar uchun offline xabari
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Internet aloqasi yo\'q. Keyinroq urinib ko\'ring.',
              offline: true
            }),
            {
              status: 503,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        })
    );
    return;
  }

  // Boshqa static fayllar uchun
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((response) => {
            // Agar muvaffaqiyatli bo'lsa, cache qil
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          });
      })
  );
});

// Background Sync - Internet qaytganda ma'lumotlarni sinxronlash
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Offline paytda saqlangan ma'lumotlarni yuborish
      syncOfflineData()
    );
  }
});

// Push notifications uchun
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Yangi xabar bor!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ko\'rish',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Yopish',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Cambridge English', options)
  );
});

// Offline ma'lumotlarni sinxronlash funksiyasi
async function syncOfflineData() {
  try {
    // IndexedDB dan offline ma'lumotlarni ol
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      console.log('📤 Syncing offline data...', offlineData.length, 'items');
      
      for (const item of offlineData) {
        try {
          await fetch(item.url, {
            method: item.method,
            headers: item.headers,
            body: item.body
          });
          
          // Muvaffaqiyatli yuborilgandan keyin o'chir
          await removeOfflineData(item.id);
        } catch (error) {
          console.error('❌ Error syncing item:', error);
        }
      }
      
      console.log('✅ Offline data synced successfully');
    }
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
}

// IndexedDB bilan ishlash funksiyalari
async function getOfflineData() {
  // Bu yerda IndexedDB dan ma'lumotlarni olish logikasi bo'ladi
  return [];
}

async function removeOfflineData(id) {
  // Bu yerda IndexedDB dan ma'lumotni o'chirish logikasi bo'ladi
  console.log('Removing offline data:', id);
}