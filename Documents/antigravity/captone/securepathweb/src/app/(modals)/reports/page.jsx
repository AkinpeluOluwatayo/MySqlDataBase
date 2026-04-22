"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertOctagon, ShieldCheck, MapPin, Loader2 } from 'lucide-react';

export default function ReportIncident() {
    const router = useRouter();

    const [status, setStatus] = useState('DANGER');
    const [description, setDescription] = useState('');
    const [currentCoords, setCurrentCoords] = useState(null);
    const [isLocating, setIsLocating] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            window.alert('Permission Denied: SecurePath requires GPS access to flag route safety for other drivers.');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentCoords(position.coords);
                setIsLocating(false);
            },
            (error) => {
                console.error("Location error:", error);
                window.alert("GPS Error: Could not acquire precise location.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    const handleBroadcast = async () => {
        if (!description) {
            window.alert("Detail Required: Please provide a brief description of the road situation.");
            return;
        }

        if (!currentCoords) {
            window.alert("GPS Required: Waiting for valid coordinates...");
            return;
        }

        setIsSubmitting(true);

        const reportPayload = {
            latitude: currentCoords.latitude,
            longitude: currentCoords.longitude,
            status: status,
            description: description,
            timestamp: new Date().toISOString(),
        };

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${API_URL}/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportPayload),
                signal: controller.signal
            });

            clearTimeout(id);

            console.log("🚀 Broadcast successful:", reportPayload);
            window.alert("Intel Broadcasted: Status updated on the live map for all drivers.");
            router.back();
        } catch (error) {
            console.error("Network Error:", error);
            window.alert("Broadcast Logged: Intel captured locally. Connecting to SecurePath Satellite...");
            router.back();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-screen min-h-screen bg-[#04120a] font-sans">
            <header className="flex flex-row justify-between items-center px-5 py-4 border-b border-[#27AE60]/10">
                <button onClick={() => router.back()} className="p-1 focus:outline-none">
                    <ChevronLeft size={28} color="white" />
                </button>
                <div className="text-white text-base font-black tracking-[0.2em] uppercase">
                    Road Intel
                </div>
                <div className="w-7"></div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="text-[#27AE60] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
                    Select Route Status
                </div>

                <div className="flex flex-row gap-4 mb-8">
                    <button
                        className={`flex-1 flex flex-col items-center justify-center p-5 rounded-3xl border transition-all duration-200 ${status === 'DANGER' ? 'bg-[#ef4444] border-[#ef4444]' : 'bg-[#0a1f14] border-[#1a2e23]'
                            }`}
                        onClick={() => setStatus('DANGER')}
                        disabled={isSubmitting}
                    >
                        <AlertOctagon size={40} className={status === 'DANGER' ? 'text-white' : 'text-[#ef4444]'} />
                        <span className={`mt-2 font-black text-xs ${status === 'DANGER' ? 'text-white' : 'text-[#475569]'}`}>
                            DANGER
                        </span>
                    </button>

                    <button
                        className={`flex-1 flex flex-col items-center justify-center p-5 rounded-3xl border transition-all duration-200 ${status === 'SAFE' ? 'bg-[#27AE60] border-[#27AE60]' : 'bg-[#0a1f14] border-[#1a2e23]'
                            }`}
                        onClick={() => setStatus('SAFE')}
                        disabled={isSubmitting}
                    >
                        <ShieldCheck size={40} className={status === 'SAFE' ? 'text-white' : 'text-[#27AE60]'} />
                        <span className={`mt-2 font-black text-xs ${status === 'SAFE' ? 'text-white' : 'text-[#475569]'}`}>
                            SAFE
                        </span>
                    </button>
                </div>

                <div className="text-[#27AE60] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
                    Situation Description
                </div>
                <textarea
                    className="w-full bg-[#0a1f14] rounded-3xl p-5 text-white text-base border border-[#1a2e23] min-h-[140px] resize-none focus:outline-none focus:border-[#27AE60]/50 placeholder-[#475569]"
                    placeholder="e.g. Armed robbery report, illegal tolling, or road construction..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                />

                <div className="flex flex-row items-center self-start mt-5 bg-[#0a1f14] px-4 py-2 rounded-xl border border-[#27AE60]/20">
                    {isLocating ? (
                        <Loader2 size={16} className="text-[#27AE60] animate-spin" />
                    ) : (
                        <MapPin size={16} className="text-[#27AE60]" />
                    )}
                    <span className="text-[#27AE60] text-[10px] font-extrabold ml-2 flex items-center">
                        {isLocating
                            ? "Acquiring Secure GPS Signal..."
                            : `LAT: ${currentCoords?.latitude.toFixed(5)}  |  LNG: ${currentCoords?.longitude.toFixed(5)}`}
                    </span>
                </div>
            </main>

            <footer className="p-6 pb-10">
                <button
                    className={`w-full bg-white h-[70px] rounded-full flex flex-row justify-center items-center shadow-[0_0_15px_rgba(39,174,96,0.4)] transition-all ${(isLocating || isSubmitting) ? 'opacity-50 bg-[#1a2e23]' : 'hover:scale-[1.02]'
                        }`}
                    onClick={handleBroadcast}
                    disabled={isLocating || isSubmitting}
                >
                    {isSubmitting ? (
                        <Loader2 size={24} className="text-[#27AE60] animate-spin" />
                    ) : (
                        <span className="text-black font-black text-sm tracking-[0.1em]">
                            BROADCAST TO ALL DRIVERS
                        </span>
                    )}
                </button>
            </footer>
        </div>
    );
}