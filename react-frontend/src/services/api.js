import axios from 'axios';

// Auto-detect the correct backend URL based on environment
const getBackendURL = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8001/api';
  }
  
  // For Emergent platform - try common patterns
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Pattern 1: Replace port number in hostname
  if (hostname.includes('3001-')) {
    return `${protocol}//${hostname.replace('3001-', '8001-')}/api`;
  }
  
  // Pattern 2: Use different port on same hostname
  if (hostname.includes('.emergent')) {
    return `${protocol}//${hostname.replace(':3001', ':8001')}/api`;
  }
  
  // Fallback: try same hostname with port 8001
  return `${protocol}//${hostname}:8001/api`;
};

const API_BASE_URL = getBackendURL();

// Debug logging to help troubleshoot
console.log('🔧 API Configuration:', {
  'Frontend URL': window.location.href,
  'Backend URL': API_BASE_URL,
  'Hostname': window.location.hostname,
  'Protocol': window.location.protocol
});

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token management
export const getToken = () => localStorage.getItem('jwt_token');
export const setToken = (token) => localStorage.setItem('jwt_token', token);
export const removeToken = () => localStorage.removeItem('jwt_token');

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const willAPI = {
  create: async (willData, userEmail) => {
    const response = await api.post(`/wills?user_email=${encodeURIComponent(userEmail)}`, willData);
    return response.data;
  },
  
  getByUser: async (userEmail) => {
    const response = await api.get(`/wills?user_email=${encodeURIComponent(userEmail)}`);
    return response.data;
  },
  
  update: async (willId, willData) => {
    const response = await api.put(`/wills/${willId}`, willData);
    return response.data;
  }
};

export const userAPI = {
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  getDashboardStats: async (userEmail) => {
    const response = await api.get(`/user/dashboard-stats?user_email=${encodeURIComponent(userEmail)}`);
    return response.data;
  }
};

export const complianceAPI = {
  getRules: async (state, docType = 'will') => {
    const response = await api.get(`/compliance/rules?state=${state}&doc_type=${docType}`);
    return response.data;
  }
};

export const aiAPI = {
  communicate: async (message, recipient = 'autolex', priority = 'normal') => {
    const response = await api.post('/ai-team/communicate', {
      message,
      recipient,
      priority
    });
    return response.data;
  },
  
  getStatus: async () => {
    const response = await api.get('/ai-team/status');
    return response.data;
  }
};

export const notaryAPI = {
  notarize: async (documentId, documentType, userEmail) => {
    const response = await api.post('/gasless-notary/notarize', {
      document_id: documentId,
      document_type: documentType,
      user_email: userEmail
    });
    return response.data;
  }
};

export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;