import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client.js';

const AUTH_BASE = '/api/v1/auth';

export const useAuthMutations = () => {
    const queryClient = useQueryClient();

    
    const register = useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(`${AUTH_BASE}/register`, data);
            return response.data;
        },
    });

    
    const login = useMutation({
        mutationFn: async (credentials) => {
            const response = await apiClient.post(`${AUTH_BASE}/login`, credentials);
            return response.data;
        },
        onSuccess: (data) => {
            
            const payload = data?.data ?? data;
            if (payload?.token) {
                localStorage.setItem('token', payload.token);
                console.log('✅ Token saved to localStorage');
            }
            console.log('User Logged In:', payload?.user?.fullName);

            
            queryClient.invalidateQueries(['user-profile']);
        },
    });

    
    const logout = useMutation({
        mutationFn: async () => {
            await apiClient.post(`${AUTH_BASE}/logout`);
        },
        onSuccess: () => {
            
            localStorage.removeItem('token');
            
            queryClient.clear();
        },
    });

    
    const forgotPassword = useMutation({
        mutationFn: async (email) => {
            const response = await apiClient.post(`${AUTH_BASE}/forgot-password`, { email });
            return response.data;
        },
    });

    
    const resetPassword = useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(`${AUTH_BASE}/reset-password`, data);
            return response.data;
        },
    });

    return {
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
    };
};