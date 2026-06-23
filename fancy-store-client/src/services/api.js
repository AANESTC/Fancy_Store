import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5126/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect admin users to admin login, customers to customer login
      const isAdminPath = window.location.pathname.startsWith('/admin');
      window.location.href = user?.role === 'Admin' || isAdminPath ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
