import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error formatter
export function formatApiError(error) {
  const detail = error.response?.data?.detail;
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).filter(Boolean).join(' ');
  }
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Recipients APIs
export const recipientsAPI = {
  list: (params) => api.get('/recipients', { params }),
  get: (id) => api.get(`/recipients/${id}`),
  create: (data) => api.post('/recipients', data),
  update: (id, data) => api.put(`/recipients/${id}`, data),
  delete: (id) => api.delete(`/recipients/${id}`),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/recipients/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  exportCSV: () => api.get('/recipients/export/csv', { responseType: 'blob' }),
};

// Templates APIs
export const templatesAPI = {
  list: (params) => api.get('/templates', { params }),
  get: (id) => api.get(`/templates/${id}`),
  create: (data) => api.post('/templates', data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
};

// Credentials APIs
export const credentialsAPI = {
  list: (params) => api.get('/credentials', { params }),
  get: (id) => api.get(`/credentials/${id}`),
  issue: (data) => api.post('/credentials', data),
  revoke: (id) => api.post(`/credentials/${id}/revoke`),
  activate: (id) => api.post(`/credentials/${id}/activate`),
  exportCSV: () => api.get('/credentials/export/csv', { responseType: 'blob' }),
};

// Verification APIs
export const verificationAPI = {
  verify: (code) => api.get(`/verify/${code}`),
};

// Verification Logs APIs
export const logsAPI = {
  list: (params) => api.get('/verification-logs', { params }),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
