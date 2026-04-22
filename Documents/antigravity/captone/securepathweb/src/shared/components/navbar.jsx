"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">

                {}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27AE60] shadow-lg shadow-green-600/10 transition-transform group-hover:scale-110">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tighter text-zinc-900 uppercase leading-none">
                            SecurePath
                        </span>
                        <span className="text-[7px] font-bold tracking-[0.3em] text-[#27AE60] uppercase mt-1">
                            Agric Logistics
                        </span>
                    </div>
                </Link>

                {}
                <div className="flex items-center gap-4 md:gap-8">
                    <Link
                        href="/contact"
                        className="hidden text-[10px] font-black tracking-[0.2em] text-zinc-400 transition-colors hover:text-[#27AE60] sm:block"
                    >
                        CONTACT US
                    </Link>

                    <Link
                        href="/login"
                        className="text-[10px] font-black tracking-[0.2em] text-zinc-900 transition-colors hover:text-[#27AE60]"
                    >
                        LOGIN
                    </Link>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/signup"
                            className="flex h-11 items-center justify-center rounded-full bg-[#27AE60] px-8 text-[10px] font-black tracking-[0.2em] text-white shadow-lg shadow-green-600/20 transition-all hover:bg-[#219150]"
                        >
                            SIGN UP
                        </Link>
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}