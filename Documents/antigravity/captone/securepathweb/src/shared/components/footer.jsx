import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Globe, MessageSquare, Share2, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-zinc-200 bg-white px-6 py-12 md:px-16 lg:px-24">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27AE60]/10 border border-[#27AE60]/20">
                                <ShieldCheck className="h-6 w-6 text-[#27AE60]" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-zinc-900 uppercase">
                                SecurePath
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-zinc-500 font-medium">
                            Protecting the agricultural supply chain with real-time route intelligence and safety protocols for modern transit.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-zinc-400 hover:text-[#27AE60] transition-colors"><Globe size={18} /></Link>
                            <Link href="#" className="text-zinc-400 hover:text-[#27AE60] transition-colors"><MessageSquare size={18} /></Link>
                            <Link href="#" className="text-zinc-400 hover:text-[#27AE60] transition-colors"><Share2 size={18} /></Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-black tracking-[0.2em] text-zinc-900 uppercase">Platform</h4>
                        <ul className="space-y-4 text-sm font-bold text-zinc-500">
                            <li><Link href="/map" className="hover:text-[#27AE60] transition-colors">Live Map</Link></li>
                            <li><Link href="/safety" className="hover:text-[#27AE60] transition-colors">Safe Havens</Link></li>
                            <li><Link href="/reports" className="hover:text-[#27AE60] transition-colors">Incident Reports</Link></li>
                            <li><Link href="/fleet" className="hover:text-[#27AE60] transition-colors">Fleet Management</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-black tracking-[0.2em] text-zinc-900 uppercase">Company</h4>
                        <ul className="space-y-4 text-sm font-bold text-zinc-500">
                            <li><Link href="/about" className="hover:text-[#27AE60] transition-colors">About Us</Link></li>
                            <li><Link href="/partners" className="hover:text-[#27AE60] transition-colors">Partners</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#27AE60] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#27AE60] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-xs font-black tracking-[0.2em] text-zinc-900 uppercase">Get Updates</h4>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-[#27AE60] transition-colors placeholder:text-zinc-400"
                            />
                            <button className="absolute right-2 top-2 bg-[#27AE60] p-1.5 rounded-lg text-white hover:bg-[#219150] transition-colors">
                                <Mail size={16} />
                            </button>
                        </div>
                        <p className="mt-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            Lagos • Nigeria
                        </p>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                        © {currentYear} SecurePath. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <span className="text-[#27AE60] flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27AE60]"></span>
                            </span>
                            System Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}