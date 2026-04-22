"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

import { useAuthMutations } from '../../../modules/auth/services/useAuth';

export default function ForgotPassword() {
    const router = useRouter();
    const { forgotPassword } = useAuthMutations();

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleResetRequest = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        forgotPassword.mutate(email, {
            onSuccess: () => {
                setIsSubmitted(true);
                setError('');
            },
            onError: (err) => {
                setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
            }
        });
    };

    const fadeInUp = {
        hidden: { opacity: 0.1, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

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
                    <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                </motion.button>

                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="request"
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.95 }}
                            variants={fadeInUp}
                            className="w-full"
                        >
                            {}
                            <div className="mb-10">
                                <h1 className="text-4xl font-black tracking-tighter text-white">
                                    Forgot <span className="text-[#27AE60]">Password?</span>
                                </h1>
                                <p className="mt-4 text-emerald-50/40 font-medium leading-relaxed">
                                    Don't worry! It happens. Enter your email and we'll send you recovery instructions.
                                </p>
                            </div>

                            {}
                            <form onSubmit={handleResetRequest} className="space-y-6">

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-tight">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-500/40 group-focus-within:text-[#4ade80] transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            disabled={forgotPassword.isPending}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="w-full h-14 bg-emerald-900/10 border border-emerald-500/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-emerald-50/20 focus:outline-none focus:border-[#27AE60]/50 focus:bg-emerald-900/20 transition-all font-medium disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: forgotPassword.isPending ? 1 : 1.02 }}
                                    whileTap={{ scale: forgotPassword.isPending ? 1 : 0.98 }}
                                    disabled={forgotPassword.isPending}
                                    type="submit"
                                    className="flex items-center justify-center w-full h-14 bg-[#27AE60] hover:bg-[#2ecc71] text-[#04120a] font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_-10px_rgba(39,174,96,0.3)] transition-all duration-300 disabled:bg-emerald-800 disabled:text-emerald-100/50"
                                >
                                    {forgotPassword.isPending ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </motion.button>
                            </form>

                            {}
                            <div className="mt-12 text-center">
                                <p className="text-sm text-emerald-50/30 font-medium">
                                    Remember your password?{' '}
                                    <Link href="/login" className="text-[#27AE60] font-black hover:underline underline-offset-4 ml-1">
                                        LOGIN
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-[#27AE60]">
                                    <CheckCircle2 size={48} strokeWidth={1.5} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-white mb-4">Check Your Inbox</h2>
                            <p className="text-emerald-50/40 font-medium mb-10 leading-relaxed">
                                We've sent a password reset link to <br/>
                                <span className="text-white font-bold">{email}</span>
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={() => router.replace('/login')}
                                className="w-full h-14 bg-emerald-900/20 border border-emerald-500/20 text-[#27AE60] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-900/40 transition-all"
                            >
                                Back to Login
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}