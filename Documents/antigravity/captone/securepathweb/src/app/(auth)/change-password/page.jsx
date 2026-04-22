"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '../../../modules/profile/services/useProfile';

export default function ChangePassword() {
    const router = useRouter();
    const { changePassword, profile } = useProfile();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPass, setShowPass] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (formData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
            return;
        }

        try {
            await changePassword.mutateAsync({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            setMessage({ type: 'success', text: 'Password updated successfully. Redirecting...' });
            setTimeout(() => {
                router.push('/settings');
            }, 2000);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || 'Failed to update password. Please check your current credentials.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center p-6">
            <div className="w-full max-w-md">

                {}
                <div className="flex items-center justify-between mb-8 mt-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-lg font-[900] text-slate-800 uppercase tracking-tight">Security Infrastructure</h1>
                    <div className="w-10" /> {}
                </div>

                {}
                <div className="bg-emerald-600 rounded-[2rem] p-6 mb-8 shadow-xl shadow-emerald-200/50 flex items-center gap-4 border-4 border-white">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm leading-tight">{profile?.fullName || 'Agent'}</h2>
                        <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">{profile?.email || 'SecurePath User'}</p>
                    </div>
                </div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-slate-100"
                >
                    <div className="mb-8">
                        <h3 className="text-[22px] font-[900] text-slate-800 leading-tight">Cipher Key Update</h3>
                        <p className="text-slate-400 text-xs font-semibold mt-1 uppercase tracking-wider">Modify your authentication layer</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-5">

                        {}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Access Key</label>
                            <div className="relative group">
                                <input
                                    type={showPass.current ? "text" : "password"}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => ({ ...p, current: !p.current }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-slate-50 w-full" />

                        {}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Generate New Key</label>
                            <div className="relative group">
                                <input
                                    type={showPass.new ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => ({ ...p, new: !p.new }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Validate Integrity</label>
                            <div className="relative group">
                                <input
                                    type={showPass.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat new key"
                                    className={`w-full h-14 bg-slate-50 border rounded-2xl px-5 text-sm font-semibold focus:outline-none focus:ring-2 transition-all ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                            ? 'border-red-200 focus:ring-red-500/10 focus:border-red-400'
                                            : 'border-slate-100 focus:ring-emerald-500/10 focus:border-emerald-500'
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {}
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.type === 'error' ? 'bg-red-100' : 'bg-emerald-100'
                                    }`}>
                                    <ShieldCheck size={16} />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-tight leading-tight">{message.text}</p>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={changePassword.isPending}
                            className="w-full h-16 bg-slate-900 text-white rounded-3xl font-[900] uppercase tracking-[3px] text-xs shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {changePassword.isPending ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Apply Security Update"
                            )}
                        </button>
                    </form>
                </motion.div>

                <p className="text-center mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[4px]">
                    SecurePath v2.4.0 • Encrypted Protocol
                </p>
            </div>
        </div>
    );
}
