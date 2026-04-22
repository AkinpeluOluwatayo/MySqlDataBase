import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client.js';

const USER_BASE = '/api/v1/users';

export const useProfile = () => {
    const queryClient = useQueryClient();

    
    const profileQuery = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const { data } = await apiClient.get(`${USER_BASE}/me`);
            return data;
        },
        
        staleTime: 1000 * 60 * 5,
    });

    
    const updateMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.patch(`${USER_BASE}/me`, payload);
            return data;
        },
        onSuccess: (updatedData) => {
            
            queryClient.setQueryData({
                queryKey: ['user-profile']
            }, updatedData);
        },
    });

    
    const changePasswordMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await apiClient.patch(`${USER_BASE}/me/password`, payload);
            return data;
        },
    });

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isError: profileQuery.isError,
        refetchProfile: profileQuery.refetch,
        updateProfile: updateMutation,
        changePassword: changePasswordMutation,
    };
};