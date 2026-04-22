"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Search, User, Navigation, Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIntel } from '../../../modules/intel/services/useIntel';
import { useIntelSocket } from '../../../modules/intel/services/useIntelSocket';
import { useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

const TacticalMap = dynamic(
    () => import('@/../src/modules/maps/components/TacticalMap'),
    {
        ssr: false,
        loading: () => <div className="h-screen w-full bg-[#04120a] animate-pulse flex items-center justify-center">
            <div className="text-[#27AE60] font-black tracking-[0.5em] uppercase animate-bounce">Initializing GPS...</div>
        </div>
    }
);

export default function Home() {
    const queryClient = useQueryClient();
    const { useActiveReports, broadcastIntel } = useIntel();

    
    const { data: reports = [], isLoading } = useActiveReports({
        lat: 6.5244,
        lng: 3.3792,
        radiusKm: 2000,
        hoursBack: 48
    });

    
    const onReportReceived = useCallback((newReport) => {
        console.log("📡 Real-time intel received:", newReport);

        
        if (window.intelDebounceTimer) clearTimeout(window.intelDebounceTimer);
        window.intelDebounceTimer = setTimeout(() => {
            console.log("⚡ Refreshing active reports (Throttled)");
            queryClient.invalidateQueries({ queryKey: ['active-reports'] });
        }, 500);
    }, [queryClient]);

    const { connected } = useIntelSocket(onReportReceived);

    
    const [routingState, setRoutingState] = useState({
        waypoints: [
            { lat: 9.0820, lng: 8.6753 }, 
        ]
    });

    const handleNewReport = async (newReport) => {
        try {
            await broadcastIntel.mutateAsync(newReport);
            console.log("🚀 Broadcast successful");
        } catch (error) {
            console.error("Broadcast failed:", error);
            toast.error(error.message || "Broadcast failed. Tactical link interrupted.", {
                style: { background: '#04120a', color: '#ef4444', border: '1px solid #ef4444' }
            });
        }
    };

    
    React.useEffect(() => {
        if (!navigator.geolocation) return;

        let watchId;
        const startWatching = (highAccuracy) => {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`📡 Field Telemetry (${highAccuracy ? 'High' : 'Standard'}):`, latitude, longitude);

                    setRoutingState(prev => ({
                        waypoints: [
                            { lat: latitude, lng: longitude }, 
                            ...prev.waypoints.slice(1) 
                        ]
                    }));
                },
                (error) => {
                    console.error("Field Lock interrupted:", { code: error.code, message: error.message });
                    
                    if (highAccuracy && (error.code === 3 || error.code === 2)) {
                        console.warn("Switching to standard accuracy for stable telemetry...");
                        navigator.geolocation.clearWatch(watchId);
                        startWatching(false);
                    }
                },
                {
                    enableHighAccuracy: highAccuracy,
                    maximumAge: 0,
                    timeout: highAccuracy ? 10000 : 25000
                }
            );
        };

        startWatching(true);
        return () => watchId && navigator.geolocation.clearWatch(watchId);
    }, []);

    
    const handleSearch = async (query) => {
        if (!query.trim()) return;

        const loadingToast = toast.loading(`Searching for: ${query}...`, {
            style: { background: '#04120a', color: '#27AE60', border: '1px solid #27AE60' }
        });

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const targetLat = parseFloat(lat);
                const targetLng = parseFloat(lon);

                console.log("📍 Field Objective Locked:", display_name, [targetLat, targetLng]);

                
                setRoutingState(prev => ({
                    waypoints: [
                        prev.waypoints[0], 
                        { lat: targetLat, lng: targetLng } 
                    ]
                }));

                toast.dismiss(loadingToast);
            } else {
                toast.error("Location not found.", { id: loadingToast });
            }
        } catch (error) {
            console.error("Search failed:", error);
            toast.error("System connection failure during search.", { id: loadingToast });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#04120a] font-sans overflow-hidden">

            {}
            <nav className="h-14 md:h-16 bg-[#04120a] border-b border-[#27AE60]/20 px-6 flex items-center justify-between z-[2000] shadow-2xl flex-none">
                <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#27AE60]/10 rounded-xl flex items-center justify-center border border-[#27AE60]/30 group-hover:bg-[#27AE60]/20 transition-all duration-500">
                        <Shield className="text-[#27AE60] w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base md:text-lg font-black text-white tracking-[0.2em] leading-none uppercase">
                            Secure <span className="text-[#27AE60] drop-shadow-[0_0_8px_rgba(39,174,96,0.5)]">Path</span>
                        </span>
                        <span className="text-[7px] font-bold text-white/30 tracking-[0.4em] uppercase mt-1">Field Terminal v5.7.1</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[9px] font-black text-white/40 uppercase tracking-widest hidden md:flex">
                    <span className="text-[#27AE60]/60">● Systems Nominal</span>
                    <span>|</span>
                    <span>Field Intelligence Active</span>
                </div>
            </nav>

            {}
            <div className="flex-1 relative overflow-hidden">

                {}
                <header className="absolute top-4 md:top-6 left-0 w-full z-[1001] px-4 pointer-events-none">
                    <div className="flex items-center justify-between w-full gap-2 md:gap-6">

                        {}
                        <div className="w-14 h-1 md:w-20 flex-none" />

                        {}
                        <div className="flex-1 max-w-[240px] md:max-w-sm relative group pointer-events-auto">
                            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors">
                                <Search size={16} className="md:size-[18px]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tactical Search..."
                                className="w-full h-10 md:h-14 bg-[#04120a]/90 backdrop-blur-md border border-[#27AE60]/20 rounded-xl md:rounded-2xl pl-10 md:pl-12 pr-4 text-[10px] md:text-sm text-white focus:outline-none focus:border-[#27AE60]/60 transition-all shadow-2xl placeholder:text-white/20"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(e.target.value);
                                    }
                                }}
                            />
                        </div>

                        {}
                        <div className="flex items-center gap-2 md:gap-6 flex-none pointer-events-auto">
                            {}
                            <div className={`flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 rounded-xl border border-[#27AE60]/20 bg-[#04120a]/90 backdrop-blur-md shadow-xl`}>
                                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
                                <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest leading-none ${connected ? 'text-emerald-500' : 'text-amber-500/70'}`}>
                                    {connected ? 'Link Active' : 'Connecting...'}
                                </span>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/settings"
                                    className="w-10 h-10 md:w-14 md:h-14 bg-[#04120a]/90 backdrop-blur-xl border border-[#27AE60]/30 rounded-xl md:rounded-2xl flex items-center justify-center text-[#27AE60] hover:bg-[#27AE60] hover:text-[#04120a] transition-all shadow-xl group relative"
                                >
                                    <User size={18} className="md:size-24 group-hover:scale-110 transition-transform" />
                                    <div className="absolute top-[-2px] right-[-2px] w-2 h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full border-2 border-[#04120a] shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                </Link>
                            </motion.div>
                        </div>

                    </div>
                </header>

                {}
                <main className="w-full h-full relative z-0">
                    {isLoading ? (
                        <div className="h-full w-full bg-[#04120a] flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <span className="text-xs font-bold text-emerald-500/50 uppercase tracking-[0.3em]">Calibrating Tactical Display...</span>
                        </div>
                    ) : (
                        <TacticalMap
                            reports={reports}
                            waypoints={routingState.waypoints}
                            onReportSubmit={handleNewReport}
                        />
                    )}
                </main>

                {}
                <div className="absolute bottom-6 left-6 z-[1001] bg-[#04120a]/90 backdrop-blur-md border border-[#27AE60]/20 p-5 rounded-3xl shadow-2xl hidden md:block">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#27AE60] shadow-[0_0_15px_rgba(39,174,96,0.6)]" />
                            <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Safe Route</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                            <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Active Threat</span>
                        </div>
                    </div>
                </div>

            </div>

            <Toaster position="top-right" />
        </div>
    );
}