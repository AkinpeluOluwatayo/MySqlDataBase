"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    User,
    Phone,
    Bell,
    Lock,
    LogOut,
    ChevronRight,
    Loader2,
    X,
    Eye,
    EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { useProfile } from '../../../modules/profile/services/useProfile';
import { useAuthMutations } from '../../../modules/auth/services/useAuth';

const SettingItem = ({ icon: Icon, label, sublabel, color, onClick }) => (
    <motion.button
        whileHover={{ x: 4, backgroundColor: "#F1F5F9" }}
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] transition-all group border border-transparent shadow-sm"
    >
        <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
        >
            <Icon size={18} color={color} />
        </div>

        <div className="flex-1 text-left">
            <h4 className="text-[13px] font-[800] text-[#1E293B] leading-tight uppercase tracking-tight">{label}</h4>
            <p className="text-[11px] text-[#64748B] mt-[1px] font-medium">{sublabel}</p>
        </div>

        <ChevronRight size={16} className="text-[#CBD5E1] group-hover:text-slate-400" />
    </motion.button>
);

const TacticalModal = ({ isOpen, onClose, title, subtitle, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-black/60">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
                >
                    <div className="p-8 sm:p-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    {title}
                                </h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {children}
                    </div>
                </motion.div>
                {}
                <div className="absolute inset-0 z-[-1]" onClick={onClose} />
            </div>
        )}
    </AnimatePresence>
);

export default function Settings() {
    const router = useRouter();
    const { profile, isLoading, isError, updateProfile, changePassword } = useProfile();
    const { logout } = useAuthMutations();

    const [activeModal, setActiveModal] = useState(null);

    
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        if (profile) {
            setFullName(profile.fullName || '');
            setPhoneNumber(profile.phoneNumber || '');
        }
    }, [profile]);

    const handleLogout = () => {
        const logoutToast = toast.loading("Signing out...");
        logout.mutate(null, {
            onSuccess: () => {
                toast.success("Signed Out Successfully", { id: logoutToast });
                router.replace('/login');
            },
            onError: () => {
                toast.error("Logout Failed", { id: logoutToast });
            }
        });
    };

    const handleSync = async (payload, successMsg) => {
        const tid = toast.loading("Updating profile...");
        updateProfile.mutate(payload, {
            onSuccess: () => {
                toast.success(successMsg, { id: tid });
                setActiveModal(null);
            },
            onError: (err) => {
                const msg = err?.response?.data?.message || "Profile update failed";
                toast.error(msg, { id: tid });
            }
        });
    };

    const handlePassUpdate = async (e) => {
        e.preventDefault();
        if (passData.new !== passData.confirm) {
            toast.error("Passwords do not match.");
            return;
        }
        const tid = toast.loading("Updating password...");
        try {
            await changePassword.mutateAsync({
                currentPassword: passData.current,
                newPassword: passData.new
            });
            toast.success("Password Updated", { id: tid });
            setActiveModal(null);
            setPassData({ current: '', new: '', confirm: '' });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Password Update Failed", { id: tid });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#27AE60]" size={40} />
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">

            {}
            <div className="h-16 bg-white border-b border-slate-100 flex items-center px-6 sticky top-0 z-[1000]">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#27AE60] transition-colors group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Go to Map</span>
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {}
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#27AE60]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                            <div className="relative">
                                <div className="w-20 h-20 rounded-3xl bg-[#27AE60] flex items-center justify-center shadow-xl shadow-emerald-100 mb-6">
                                    <User size={40} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                                    {profile?.fullName || "Farmer"}
                                </h1>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                    {profile?.email || "Account Active"}
                                </p>

                                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100 italic">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-black text-emerald-600 uppercase">Online</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</span>
                                        <span className="text-[9px] font-black text-slate-900 uppercase">Registered Farmer</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveModal('name')}
                                    className="w-full mt-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[2px] shadow-lg transition-all active:scale-[0.98]"
                                >
                                    Update Profile Name
                                </button>
                            </div>
                        </div>

                        {}
                        <div className="hidden lg:block">
                            <button
                                onClick={handleLogout}
                                disabled={logout.isPending}
                                className="w-full flex items-center justify-center gap-3 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest"
                            >
                                {logout.isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                                Sign Out
                            </button>
                        </div>
                    </aside>

                    {}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[32px] p-8 sm:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-[#27AE60] rounded-full" />
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Personal Information</h2>
                                    <p className="text-xs font-medium text-slate-400">Manage your contact details</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-1.5 bg-slate-50/50 rounded-[24px]">
                                    <SettingItem
                                        icon={Phone}
                                        label="Update Phone Number"
                                        sublabel={profile?.phoneNumber || "Add phone number"}
                                        color="#2980B9"
                                        onClick={() => setActiveModal('phone')}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[32px] p-8 sm:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Account Security</h2>
                                    <p className="text-xs font-medium text-slate-400">Manage your credentials</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-1.5 bg-slate-50/50 rounded-[24px]">
                                    <SettingItem
                                        icon={Lock}
                                        label="Update Password"
                                        sublabel="Change your sign-in details"
                                        color="#2980B9"
                                        onClick={() => setActiveModal('password')}
                                    />
                                </div>
                            </div>
                        </section>

                        {}
                        <div className="flex flex-col sm:flex-row items-center justify-between px-6 pt-4 gap-4">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[3px]">
                                SECUREPATH v5.6.0 • Agriculture Network
                            </p>
                            <div className="h-1 w-24 bg-slate-100 rounded-full" />
                        </div>

                        {}
                        <div className="lg:hidden pt-4 pb-8">
                            <button
                                onClick={handleLogout}
                                disabled={logout.isPending}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-red-50 text-red-600 rounded-3xl transition-all font-black text-xs uppercase tracking-[3px] border border-red-100 shadow-sm"
                            >
                                {logout.isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                                Sign Out Account
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {}

            <TacticalModal
                isOpen={activeModal === 'name'}
                onClose={() => setActiveModal(null)}
                title="Update Name"
                subtitle="Personal Profile Settings"
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSync({ fullName }, "Profile Name Updated"); }} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-300">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#27AE60]/20 focus:border-[#27AE60] transition-all"
                                placeholder="Enter full name"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="w-full h-14 bg-[#27AE60] hover:bg-[#2ecc71] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {updateProfile.isPending ? <Loader2 className="animate-spin" size={18} /> : "Save Profile Change"}
                    </button>
                </form>
            </TacticalModal>

            <TacticalModal
                isOpen={activeModal === 'phone'}
                onClose={() => setActiveModal(null)}
                title="Update Phone Number"
                subtitle="Contact Information Settings"
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSync({ phoneNumber }, "Phone Number Updated"); }} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-300">
                                <Phone size={18} />
                            </div>
                            <input
                                type="tel"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#27AE60]/20 focus:border-[#27AE60] transition-all font-mono"
                                placeholder="+234 ..."
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="w-full h-14 bg-[#27AE60] hover:bg-[#2ecc71] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {updateProfile.isPending ? <Loader2 className="animate-spin" size={18} /> : "Save Phone Number"}
                    </button>
                </form>
            </TacticalModal>

            <TacticalModal
                isOpen={activeModal === 'password'}
                onClose={() => setActiveModal(null)}
                title="Update Password"
                subtitle="Account Security Settings"
            >
                <form onSubmit={handlePassUpdate} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPass.current ? "text" : "password"}
                                required
                                value={passData.current}
                                onChange={(e) => setPassData({ ...passData, current: e.target.value })}
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#27AE60]/20 focus:border-[#27AE60] transition-all"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                            >
                                {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPass.new ? "text" : "password"}
                                required
                                value={passData.new}
                                onChange={(e) => setPassData({ ...passData, new: e.target.value })}
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#27AE60]/20 focus:border-[#27AE60] transition-all"
                                placeholder="Min. 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                            >
                                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showPass.confirm ? "text" : "password"}
                                required
                                value={passData.confirm}
                                onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
                                className={`w-full h-14 bg-slate-50 border rounded-2xl px-5 text-sm font-semibold focus:outline-none focus:ring-2 transition-all ${passData.confirm && passData.new !== passData.confirm ? 'border-red-200 focus:ring-red-100' : 'border-slate-100 focus:ring-[#27AE60]/20 focus:border-[#27AE60]'}`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                            >
                                {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={changePassword.isPending}
                        className="w-full h-14 bg-[#27AE60] hover:bg-[#2ecc71] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {changePassword.isPending ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                    </button>
                </form>
            </TacticalModal>
        </div>
    );
}