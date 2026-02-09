'use client';

import React from 'react';
import { clsx } from 'clsx';

interface PillContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function PillContainer({ children, className }: PillContainerProps) {
    return (
        <div className={clsx(
            "bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-premium-md hover:shadow-premium-lg transition-all duration-300",
            className
        )}>
            {children}
        </div>
    );
}
