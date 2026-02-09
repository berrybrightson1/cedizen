'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Scale,
    Library,
    Award,
    ShieldAlert,
    Menu,
    X,
    BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';
import { PanicModal } from './PanicModal';

export function SnackMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPanicOpen, setIsPanicOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Pocket Lawyer', href: '/lawyer', icon: Scale },
        { name: 'Case Library', href: '/library', icon: Library },
        { name: 'Cedizen Test', href: '/quiz', icon: Award },
    ];

    const secondaryNav = [
        { name: 'Public Votes', href: '/votes', icon: BarChart3 },
        { name: 'Achievements', href: '/achievements', icon: Award },
    ];

    return (
        <>
            {/* Fixed Top Bar for Mobile */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 z-[60] lg:hidden">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-lg">#</div>
                    <span className="font-black text-lg tracking-tighter text-slate-900">cedizen</span>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    aria-label="Menu"
                >
                    {isOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer Panel */}
            <aside
                className={clsx(
                    "fixed top-0 right-0 h-[100dvh] w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-6 pt-20">
                    {/* Header */}
                    <header className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">#</div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tighter leading-none">cedizen</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Ghana • V1.0</span>
                        </div>
                    </header>

                    {/* Navigation - Scrollable Area */}
                    <nav className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 pr-2 -mr-2 pb-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm",
                                        isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                        isActive ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                                    )}>
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="tracking-tight">{item.name}</span>
                                </Link>
                            );
                        })}

                        {/* Administration Section */}
                        <div className="mt-6">
                            <div className="px-5 mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Administration</div>
                            <div className="space-y-1">
                                {secondaryNav.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={clsx(
                                                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm",
                                                isActive
                                                    ? "bg-slate-900 text-white shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                isActive ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                                            )}>
                                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            </div>
                                            <span className="tracking-tight">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>


                        {/* Panic Button */}
                        <button
                            onClick={() => {
                                setIsPanicOpen(true);
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white transition-all font-bold text-sm mt-4 active:scale-95 shadow-lg shadow-red-900/20 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <ShieldAlert size={20} fill="white" className="group-hover:animate-pulse" />
                            </div>
                            <span className="tracking-tight">Emergency Panic</span>
                        </button>
                    </nav>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                            Civic Empowerment
                        </p>
                    </div>
                </div>
            </aside>

            <PanicModal isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />
        </>
    );
}
