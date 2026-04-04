// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (email, password) => api.post('/admin/login/', { email, password }),
    register: (userData) => api.post('/register/', userData),
};

// Admin APIs
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard/'),
    getUsers: () => api.get('/admin/users/'),
    getStats: () => api.get('/admin/stats/'),
    getCurrentUser: () => api.get('/admin/users/me/'),
    updateUserRole: (userId, data) => api.put(`/admin/users/${userId}/role/`, data),
    toggleVerification: (userId) => api.put(`/admin/users/${userId}/verify/`),
    updateUserStatus: (userId, data) => api.put(`/admin/users/${userId}/status/`, data),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}/delete/`),
};

export default api;