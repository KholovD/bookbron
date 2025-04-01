import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  resetPassword: (email: string) =>
    api.post('/auth/reset-password', { email }),
  
  verifyToken: (token: string) =>
    api.post('/auth/verify-token', { token })
};

export const computersAPI = {
  getAll: () => api.get('/computers'),
  
  getById: (id: string) => api.get(`/computers/${id}`),
  
  create: (data: Omit<Computer, 'id'>) =>
    api.post('/computers', data),
  
  update: (id: string, data: Partial<Computer>) =>
    api.put(`/computers/${id}`, data),
  
  delete: (id: string) => api.delete(`/computers/${id}`),
  
  control: (id: string, action: 'restart' | 'shutdown') =>
    api.post(`/computers/${id}/control`, { action })
};

export const sessionsAPI = {
  getActive: () => api.get('/sessions/active'),
  
  start: (data: { computerId: string; userId: string }) =>
    api.post('/sessions/start', data),
  
  end: (id: string) => api.post(`/sessions/${id}/end`),
  
  getStats: (period: 'daily' | 'weekly' | 'monthly') =>
    api.get(`/sessions/stats?period=${period}`)
};

export const paymentsAPI = {
  create: (data: { sessionId: string; amount: number; method: string }) =>
    api.post('/payments', data),
  
  getHistory: (filters: { startDate?: Date; endDate?: Date }) =>
    api.get('/payments/history', { params: filters }),
  
  generateReceipt: (id: string) =>
    api.get(`/payments/${id}/receipt`, { responseType: 'blob' })
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  
  update: (id: string, data: Partial<InventoryItem>) =>
    api.put(`/inventory/${id}`, data),
  
  getLowStock: () => api.get('/inventory/low-stock')
}; 