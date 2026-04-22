"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

import { useProfile } from '../../../src/modules/profile/services/useProfile';

export default function EditProfile() {
    const router = useRouter();

    const { profile, updateProfile, isLoading } = useProfile();

    const [fullName, setFullName] = useState(profile?.fullName || '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (profile?.fullName) {
            setFullName(profile.fullName);
        }
    }, [profile]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');

        if (fullName.trim().length < 2) {
            setError("Please enter a valid full name.");
            return;
        }

        const loadingToast = toast.loading("Syncing identity...", {
            style: { background: '#04120a', color: '#27AE60', border: '1px solid #27AE60' }
        });

        
        updateProfile.mutate({ fullName: fullName.trim() }, {
            onSuccess: () => {
                toast.success("Full Name Updated", { id: loadingToast });
                router.back();
            },
            onError: (err) => {
                const msg = err?.response?.data?.message || "Could not update profile. Tactical link interrupted.";
                setError(msg);
                toast.error("Update Failed", { id: loadingToast });
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#04120a] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#27AE60]" size={40} />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-[#04120a] flex items-center justify-center font-sans overflow-hidden">

            {}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#27AE60]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#27AE60]/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 w-full max-w-md px-6 py-12">

                {}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="group mb-8 flex items-center gap-2 text-emerald-50/50 hover:text-[#4ade80] transition-colors"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-[11px]">Back</span>
                </motion.button>

                <motion.div
                    initial={{ opacity: 0.1, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                >
                    {}
                    <div className="mb-10">
                        <h1 className="text-4xl font-black tracking-tighter text-white">
                            Edit <span className="text-[#27AE60]">Full Name</span>
                        </h1>
                        <p className="mt-2 text-emerald-50/40 font-medium">
                            Update your personal identification info.
                        </p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-tight">
                                {error}
                            </div>
                        )}

                        {}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-500/40 group-focus-within:text-[#4ade80] transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    disabled={updateProfile.isPending}
                                    className="w-full h-14 bg-emerald-900/10 border border-emerald-500/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-emerald-50/20 focus:outline-none focus:border-[#27AE60]/50 focus:bg-emerald-900/20 transition-all font-medium disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {}
                        <div className="space-y-2 opacity-60">
                            <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500/40 ml-1">
                                Registered Email
                            </label>
                            <div className="w-full h-14 bg-emerald-900/5 border border-emerald-500/5 rounded-2xl flex items-center px-4 text-emerald-50/30 font-medium truncate">
                                {profile?.email}
                            </div>
                        </div>

                        {}
                        <motion.button
                            type="submit"
                            disabled={updateProfile.isPending}
                            whileHover={{ scale: updateProfile.isPending ? 1 : 1.02 }}
                            whileTap={{ scale: updateProfile.isPending ? 1 : 0.98 }}
                            className="flex items-center justify-center w-full h-14 bg-[#27AE60] hover:bg-[#2ecc71] disabled:bg-emerald-800 disabled:text-emerald-100/50 text-[#04120a] font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_-10px_rgba(39,174,96,0.3)] transition-all duration-300 mt-4"
                        >
                            {updateProfile.isPending ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                "Save Changes"
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}