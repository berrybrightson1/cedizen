'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { SnackMenu } from '@/components/ui/SnackMenu';
import { clsx } from 'clsx';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLawyerPage = pathname === '/lawyer' || pathname?.startsWith('/lawyer/');
    const isVotesPage = pathname === '/votes' || pathname?.startsWith('/votes/');
    const isQuizPage = pathname === '/quiz' || pathname?.startsWith('/quiz/');
    const isLibraryPage = pathname === '/library' || pathname?.startsWith('/library/');

    const isBreakoutPage = isLawyerPage || isVotesPage || isQuizPage || isLibraryPage;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-0 relative">
                {/* Content Area */}
                <div className={clsx(
                    "flex-1 relative flex flex-col min-h-0",
                    isLawyerPage
                        ? "h-full pt-16 lg:pt-0"
                        : isBreakoutPage
                            ? "h-full bg-slate-50 lg:overflow-y-auto lg:m-6 lg:bg-white lg:rounded-premium lg:shadow-sm lg:border lg:border-slate-200 lg:pb-0 pt-16 lg:pt-0"
                            : "overflow-y-auto m-2 lg:m-6 bg-white rounded-premium shadow-sm border border-slate-200 pb-8 lg:pb-0 pt-16 lg:pt-0"
                )}>
                    {children}
                </div>
            </main>
            {/* Mobile Navigation - Drawer Menu */}
            <div className="lg:hidden">
                <SnackMenu />
            </div>
        </div>
    );
}
