'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    BarChart3,
    Settings,
    Search,
    ChevronDown,
    Scale,
    Library,
    Award,
    Zap,
    Star
} from 'lucide-react';
import { clsx } from 'clsx';

import { QuickSearch } from './QuickSearch';

export function Sidebar() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Pocket Lawyer', href: '/lawyer', icon: Scale },
        { name: 'Judicial Archive', href: '/cases', icon: Star },
        { name: 'Charter Library', href: '/library', icon: Library },
        { name: 'Public Square', href: '/votes', icon: BarChart3 },
        { name: 'Cedizen Test', href: '/quiz', icon: Award, badge: 'NEW' },
    ];

    const secondaryNav = [
        { name: 'Achievements', href: '/achievements', icon: Award },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <>
            <QuickSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <aside className="w-[280px] h-screen hidden lg:flex flex-col p-8 bg-white border-r border-slate-100 relative overflow-hidden">
                <header className="flex items-center gap-4 mb-10 px-2 group">
                    <Link href="/" className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10">#</div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tighter leading-none group-hover:text-blue-600 transition-colors">cedizen</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Ghana • V1.0</span>
                        </div>
                    </Link>
                    <ChevronDown size={14} className="ml-auto text-slate-400 hover:text-slate-900 transition-colors cursor-pointer" />
                </header>

                <div
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl mb-10 shadow-sm cursor-pointer hover:border-slate-300 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <Search size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={2.5} />
                        <span className="text-slate-600 font-bold text-sm tracking-tight group-hover:text-slate-900 transition-colors">Quick Search</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200">⌘ K</span>
                </div>

                <nav className="flex-1 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className={clsx(
                                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                                    isActive ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400 group-hover:text-slate-900"
                                )}>
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="tracking-tight">{item.name}</span>
                                {item.badge && (
                                    <span className={clsx(
                                        "ml-auto text-[9px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase",
                                        isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-600"
                                    )}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    <div className="mt-10 mb-6">
                        <div className="px-5 mb-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Administration</div>
                        <div className="space-y-1">
                            {secondaryNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm",
                                            isActive
                                                ? "bg-slate-900 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                                            isActive
                                                ? "bg-white/10 text-white"
                                                : "bg-slate-100 text-slate-400 group-hover:text-slate-900"
                                        )}>
                                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                        <span className="tracking-tight">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            </aside >
        </>
    );
}
