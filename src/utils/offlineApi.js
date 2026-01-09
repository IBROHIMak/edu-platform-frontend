import { saveOfflineData, getOfflineData, offlineQueue } from '../hooks/useOffline';

// Offline API wrapper - internetisiz paytda cache dan ma'lumot olish
class OfflineAPI {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5002';
  }

  // API so'rovini yuborish (offline support bilan)
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(endpoint, options);

    try {
      // Internetda bo'lsa, oddiy so'rov yuborish
      if (navigator.onLine) {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });

        if (response.ok) {
          const data = await response.json();
          
          // GET so'rovlar uchun ma'lumotni cache qilish
          if (options.method === 'GET' || !options.method) {
            saveOfflineData(cacheKey, data);
          }
          
          return data;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } else {
        // Offline holatda
        if (options.method === 'GET' || !options.method) {
          // GET so'rovlar uchun cache dan olish
          const cachedData = getOfflineData(cacheKey);
          if (cachedData) {
            return {
              ...cachedData,
              _offline: true,
              _cached: true
            };
          } else {
            throw new Error('Ma\'lumot offline rejimda mavjud emas');
          }
        } else {
          // POST, PUT, DELETE so'rovlarni queue ga qo'shish
          offlineQueue.add({
            url,
            method: options.method,
            headers: options.headers,
            body: options.body
          });
          
          return {
            success: true,
            message: 'So\'rov offline queue ga qo\'shildi',
            _offline: true,
            _queued: true
          };
        }
      }
    } catch (error) {
      console.error('API Request Error:', error);
      
      // Xatolik bo'lsa, cache dan olishga harakat qilish
      if (options.method === 'GET' || !options.method) {
        const cachedData = getOfflineData(cacheKey);
        if (cachedData) {
          return {
            ...cachedData,
            _offline: true,
            _cached: true,
            _error: error.message
          };
        }
      }
      
      throw error;
    }
  }

  // Cache key yaratish
  getCacheKey(endpoint, options) {
    const method = options.method || 'GET';
    const params = options.params ? JSON.stringify(options.params) : '';
    return `${method}_${endpoint}_${params}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  // GET so'rov
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  // POST so'rov
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT so'rov
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE so'rov
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // Foydalanuvchi ma'lumotlari
  async getProfile() {
    return this.get('/api/auth/me');
  }

  // Uy vazifalari
  async getHomework() {
    return this.get('/api/homework');
  }

  // Video darslar
  async getVideos() {
    return this.get('/api/videos');
  }

  // Tanlovlar
  async getCompetitions() {
    return this.get('/api/competitions');
  }

  // Mukofotlar
  async getRewards() {
    return this.get('/api/rewards');
  }

  // Xabarlar
  async getMessages() {
    return this.get('/api/messages');
  }

  // Guruhlar
  async getGroups() {
    return this.get('/api/groups');
  }

  // O'quvchilar
  async getStudents() {
    return this.get('/api/students');
  }

  // Reyting
  async getRatings() {
    return this.get('/api/ratings');
  }

  // Uy vazifasini topshirish
  async submitHomework(homeworkId, data) {
    return this.post(`/api/homework/${homeworkId}/submit`, data);
  }

  // Tanlovga qo'shilish
  async joinCompetition(competitionId) {
    return this.post(`/api/competitions/${competitionId}/join`);
  }

  // Mukofotni olish
  async claimReward(rewardId) {
    return this.post(`/api/rewards/${rewardId}/claim`);
  }

  // Xabar yuborish
  async sendMessage(recipientId, message) {
    return this.post('/api/messages', {
      recipientId,
      message
    });
  }

  // Profil yangilash
  async updateProfile(data) {
    return this.put('/api/profile', data);
  }
}

// Singleton instance
export const offlineAPI = new OfflineAPI();

// Offline ma'lumotlarni oldindan yuklash
export const preloadOfflineData = async () => {
  console.log('📦 Preloading data for offline use...');
  
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Muhim ma'lumotlarni oldindan yuklash
    const endpoints = [
      '/api/auth/me',
      '/api/homework',
      '/api/videos',
      '/api/competitions',
      '/api/rewards',
      '/api/messages'
    ];

    const promises = endpoints.map(endpoint => 
      offlineAPI.get(endpoint).catch(error => {
        console.warn(`Failed to preload ${endpoint}:`, error);
        return null;
      })
    );

    await Promise.all(promises);
    console.log('✅ Offline data preloaded successfully');
  } catch (error) {
    console.error('❌ Error preloading offline data:', error);
  }
};

export default offlineAPI;