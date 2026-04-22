import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client.js';

const INTEL_BASE = '/api/v1/intel';

export const useIntel = () => {
    const queryClient = useQueryClient();

    
    
    const useActiveReports = (params) => {
        return useQuery({
            queryKey: ['active-reports', params],
            queryFn: async () => {
                if (!params?.lat || !params?.lng) return [];
                console.log("🔍 Fetching active intel near:", params);
                try {
                    const { data } = await apiClient.get(`${INTEL_BASE}/active`, {
                        params: {
                            lat: params.lat,
                            lng: params.lng,
                            radiusKm: params.radiusKm || 100,
                            hoursBack: params.hoursBack || 24
                        }
                    });
                    console.log("📡 API Response Data:", data?.data);
                    return data?.data || [];
                } catch (err) {
                    console.error("❌ Intel Fetch Failed:", err);
                    return [];
                }
            },
            enabled: !!params?.lat && !!params?.lng,
            refetchInterval: 30000, 
        });
    };

    
    const broadcastMutation = useMutation({
        mutationFn: async (payload) => {
            
            
            const backendPayload = {
                title: `Tactical Alert`,
                description: payload.description,
                riskLevel: payload.status,
                latitude: payload.latitude,   
                longitude: payload.longitude, 
                
            };
            try {
                const { data } = await apiClient.post(`${INTEL_BASE}/broadcast`, backendPayload);
                return data;
            } catch (error) {
                
                if (error.response?.status === 429) {
                    throw new Error("RATE_LIMIT: Tactical cooldown active. Please wait 30s.");
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['active-reports'] });
        },
    });

    
    const useReportDetails = (id) => {
        return useQuery({
            queryKey: ['intel-report', id],
            queryFn: async () => {
                if (!id) return null;
                const { data } = await apiClient.get(`${INTEL_BASE}/${id}`);
                return data?.data || null;
            },
            enabled: !!id,
        });
    };

    
    const useAllReports = () => {
        return useQuery({
            queryKey: ['all-reports'],
            queryFn: async () => {
                const { data } = await apiClient.get(INTEL_BASE);
                return data?.data || [];
            },
        });
    };

    return {
        useActiveReports,
        useReportDetails,
        useAllReports,
        broadcastIntel: broadcastMutation,
    };
};
