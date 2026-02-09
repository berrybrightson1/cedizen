'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Scale,
    Library,
    Award,
    ShieldAlert
} from 'lucide-react';
import { clsx } from 'clsx';
import { PanicModal } from './PanicModal';

export function SnackMenu() {
    const [isPanicOpen, setIsPanicOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Law', href: '/lawyer', icon: Scale },
        { name: 'Library', href: '/library', icon: Library },
        { name: 'Test', href: '/quiz', icon: Award },
    ];

    return (
        <>
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-4 py-3 rounded-[2.5rem] shadow-2xl flex items-center gap-2 max-w-[95vw] pointer-events-auto z-50">
                <div className="flex items-center gap-4 pr-3 border-r border-white/10">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all active:scale-90",
                                    isActive ? "bg-white text-slate-900 shadow-lg" : "text-white/40 hover:text-white"
                                )}
                            >
                                <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[7px] font-black uppercase tracking-widest mt-1">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <button
                    onClick={() => setIsPanicOpen(true)}
                    className="flex items-center gap-4 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-red-900/20 group ml-2"
                >
                    <ShieldAlert size={20} fill="white" className="group-hover:animate-pulse" />
                    <span className="font-black text-xs uppercase tracking-widest">Panic</span>
                </button>
            </nav>

            <PanicModal isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />
        </>
    );
}
