import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url ?? '';

        
        
        if (
            typeof window !== 'undefined' &&
            (status === 401 || status === 404) &&
            url.includes('/api/v1/') &&
            !url.includes('/auth/')   
        ) {
            const hadToken = !!localStorage.getItem('token');
            if (hadToken) {
                console.warn(`[apiClient] ${status} on ${url} — clearing stale token`);
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);