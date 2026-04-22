"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAuthMutations } from '../../../modules/auth/services/useAuth';

export default function Login() {
    const router = useRouter();
    const { login } = useAuthMutations();

    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        login.mutate(formData, {
            onSuccess: () => {
                
                router.push('/home');
            },
            onError: (err) => {
                setError(err?.response?.data?.message || 'Invalid email or password');
            }
        });
    };

    return (
        <div className="relative min-h-screen w-full bg-[#04120a] flex items-center justify-center font-sans overflow-hidden">
            {}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#27AE60]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#27AE60]/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 w-full max-w-md px-6 py-12">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="group mb-8 flex items-center gap-2 text-emerald-50/50 hover:text-[#4ade80] transition-colors"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                </motion.button>

                <motion.div initial={{ opacity: 0.1, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                        Welcome <span className="text-[#27AE60]">Back</span>
                    </h1>
                    <p className="mb-10 text-emerald-50/40 font-medium">Login to continue your secure journey.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-tight">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-[#4ade80] transition-colors" size={20} />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your.email@example.com"
                                    className="w-full h-14 bg-emerald-900/10 border border-emerald-500/10 rounded-2xl pl-12 text-white focus:outline-none focus:border-[#27AE60]/50 focus:bg-emerald-900/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-[#4ade80] transition-colors" size={20} />
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full h-14 bg-emerald-900/10 border border-emerald-500/10 rounded-2xl pl-12 text-white focus:outline-none focus:border-[#27AE60]/50 focus:bg-emerald-900/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" size="sm" className="text-xs font-bold text-[#2980B9] hover:text-[#4ade80] transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={login.isPending}
                            whileHover={{ scale: login.isPending ? 1 : 1.02 }}
                            whileTap={{ scale: login.isPending ? 1 : 0.98 }}
                            className="flex items-center justify-center w-full h-14 bg-[#27AE60] hover:bg-[#2ecc71] disabled:bg-emerald-800 disabled:text-emerald-100/50 text-[#04120a] font-black uppercase tracking-widest rounded-2xl shadow-lg mt-4 transition-all duration-300"
                        >
                            {login.isPending ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                "Continue"
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm text-emerald-50/30 font-medium">
                            Don't have an account? <Link href="/signup" className="text-[#27AE60] font-black hover:underline ml-1 underline-offset-4">SIGN UP</Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}