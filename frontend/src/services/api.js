import axios from 'axios';

const API_URL = 'https://business-contact-backend.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const auth = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getCurrentUser: () => api.get('/auth/me'),
};

export const businesses = {
    getAll: () => api.get('/businesses'),
    getMyEntries: () => api.get('/businesses/my-entries'),
    create: (businessData) => api.post('/businesses', businessData),
    export: () => api.get('/businesses/export'),
};

export default api;