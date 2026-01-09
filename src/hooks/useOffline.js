import { useState, useEffect } from 'react';

// Offline holatni kuzatish uchun custom hook
export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Internet connection restored');
      setWasOffline(isOffline);
      setIsOffline(false);
    };

    const handleOffline = () => {
      console.log('📡 Internet connection lost');
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOffline]);

  return { isOffline, wasOffline };
};

// Network holatini tekshirish
export const checkNetworkStatus = async () => {
  if (!navigator.onLine) {
    return false;
  }

  try {
    // Server bilan aloqani tekshirish
    const response = await fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    console.warn('Network check failed:', error);
    return false;
  }
};

// Offline ma'lumotlarni saqlash
export const saveOfflineData = (key, data) => {
  try {
    const offlineData = {
      data,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    localStorage.setItem(`offline_${key}`, JSON.stringify(offlineData));
    console.log('💾 Data saved offline:', key);
  } catch (error) {
    console.error('❌ Error saving offline data:', error);
  }
};

// Offline ma'lumotlarni olish
export const getOfflineData = (key) => {
  try {
    const stored = localStorage.getItem(`offline_${key}`);
    if (!stored) return null;

    const offlineData = JSON.parse(stored);
    
    // Ma'lumot 24 soatdan eski bo'lsa, o'chirish
    const isExpired = Date.now() - offlineData.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem(`offline_${key}`);
      return null;
    }

    return offlineData.data;
  } catch (error) {
    console.error('❌ Error getting offline data:', error);
    return null;
  }
};

// Offline ma'lumotlarni tozalash
export const clearOfflineData = (key) => {
  try {
    if (key) {
      localStorage.removeItem(`offline_${key}`);
    } else {
      // Barcha offline ma'lumotlarni tozalash
      Object.keys(localStorage)
        .filter(k => k.startsWith('offline_'))
        .forEach(k => localStorage.removeItem(k));
    }
    console.log('🗑️ Offline data cleared:', key || 'all');
  } catch (error) {
    console.error('❌ Error clearing offline data:', error);
  }
};

// Offline queue - internetisiz paytda so'rovlarni saqlash
class OfflineQueue {
  constructor() {
    this.queue = this.getStoredQueue();
  }

  // Queue ni localStorage dan olish
  getStoredQueue() {
    try {
      const stored = localStorage.getItem('offline_queue');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error getting offline queue:', error);
      return [];
    }
  }

  // Queue ni localStorage ga saqlash
  saveQueue() {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('❌ Error saving offline queue:', error);
    }
  }

  // So'rovni queue ga qo'shish
  add(request) {
    const queueItem = {
      id: Date.now() + Math.random(),
      url: request.url,
      method: request.method || 'GET',
      headers: request.headers || {},
      body: request.body,
      timestamp: Date.now()
    };

    this.queue.push(queueItem);
    this.saveQueue();
    console.log('📤 Request added to offline queue:', queueItem.url);
  }

  // Queue dagi barcha so'rovlarni yuborish
  async processQueue() {
    if (this.queue.length === 0) return;

    console.log('🔄 Processing offline queue:', this.queue.length, 'items');
    const processedItems = [];

    for (const item of this.queue) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        });

        if (response.ok) {
          processedItems.push(item.id);
          console.log('✅ Offline request processed:', item.url);
        }
      } catch (error) {
        console.error('❌ Error processing offline request:', error);
      }
    }

    // Muvaffaqiyatli yuborilgan so'rovlarni o'chirish
    this.queue = this.queue.filter(item => !processedItems.includes(item.id));
    this.saveQueue();

    if (processedItems.length > 0) {
      console.log('🎉 Processed', processedItems.length, 'offline requests');
    }
  }

  // Queue ni tozalash
  clear() {
    this.queue = [];
    this.saveQueue();
    console.log('🗑️ Offline queue cleared');
  }

  // Queue hajmini olish
  size() {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueue();