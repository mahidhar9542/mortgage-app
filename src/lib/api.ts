import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

// Refinance-specific API functions
export const refinanceAPI = {
  // Submit a refinance application
  submitRefinance: async (refinanceData: any) => {
    const response = await api.post('/api/leads/refinance', refinanceData);
    return response.data;
  },

  // Get refinance statistics (admin only)
  getRefinanceStats: async () => {
    const response = await api.get('/api/leads/refinance/stats');
    return response.data;
  },

  // Subscribe to rate alerts
  subscribeToRateAlerts: async (email: string) => {
    const response = await api.post('/api/rate-alerts/subscribe', { email });
    return response.data;
  },

  // Get current refinance rates
  getRefinanceRates: async () => {
    const response = await api.get('/api/rates/refinance');
    return response.data;
  }
};

export default api;
