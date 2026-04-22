"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAuthMutations } from '../../../modules/auth/services/useAuth';

export default function SignUp() {
    const router = useRouter();
    const { register } = useAuthMutations();

    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); 
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        
        if (!formData.email || !formData.password || !formData.fullName) {
            setError('Please fill in all fields');
            return;
        }

        
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        register.mutate(formData, {
            onSuccess: () => {
                router.push('/login');
            },
            onError: (err) => {
                setError(err?.response?.data?.message || 'Registration failed. Try again.');
            }
        });
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

                <motion.div
                    initial={{ opacity: 0.1, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                >
                    {}
                    <div className="mb-10">
                        <h1 className="text-4xl font-black tracking-tighter text-white">
                            Create <span className="text-[#27AE60]">Account</span>
                        </h1>
                        <p className="mt-2 text-emerald-50/40 font-medium">
                            Join the future of secure agricultural logistics.
                        </p>
                    </div>

                    {}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-tight flex items-center gap-3"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full h-14 bg-emerald-900/10 border border-emerald-500/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-emerald-50/20 focus:outline-none focus:border-[#27AE60]/50 focus:bg-emerald-900/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-500/40 group-focus-within:text-[#4ade80] transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your.email@example.com"
                                    className="w-full h-14 bg-emerald-900/10 border border-emerald-500/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-emerald-50/20 focus:outline-none focus:border-[#27AE60]/50 focus:bg-emerald-900/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {}
                        <div className="space-y-2">
                            <div className="flex justify-between items-end pr-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">
                                    Password
                                </label>
                                {}
                                <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${formData.password.length > 0 && formData.password.length < 8 ? 'text-red-400' : 'text-white/40'}`}>
                                    Min. 8 characters
                                </span>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-500/40 group-focus-within:text-[#4ade80] transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className={`w-full h-14 bg-emerald-900/10 border rounded-2xl pl-12 pr-12 text-white placeholder:text-emerald-50/20 focus:outline-none focus:bg-emerald-900/20 transition-all font-medium ${formData.password.length > 0 && formData.password.length < 8 ? 'border-red-500/50' : 'border-emerald-500/10 focus:border-[#27AE60]/50'}`}
                                />
                                {}
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-500/40 hover:text-[#4ade80] transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {}
                        <motion.button
                            type="submit"
                            disabled={register.isPending}
                            whileHover={{ scale: register.isPending ? 1 : 1.02 }}
                            whileTap={{ scale: register.isPending ? 1 : 0.98 }}
                            className="flex items-center justify-center w-full h-14 bg-[#27AE60] hover:bg-[#2ecc71] disabled:bg-emerald-800 disabled:text-emerald-100/50 text-[#04120a] font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_-10px_rgba(39,174,96,0.3)] transition-all duration-300"
                        >
                            {register.isPending ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                "Get Started"
                            )}
                        </motion.button>
                    </form>

                    {}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-emerald-50/30 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#27AE60] font-black hover:underline underline-offset-4 ml-1">
                                LOGIN
                            </Link>
                        </p>
                    </div>

                </motion.div>
            </main>
        </div>
    );
}