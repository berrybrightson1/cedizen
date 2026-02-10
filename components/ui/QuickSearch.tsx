'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, Scale, ArrowRight, Command, Gavel } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchConstitution, LegalArticle } from '@/lib/search';
import { searchCases, JudicialCase } from '@/lib/cases';
import { clsx } from 'clsx';

interface QuickSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QuickSearch({ isOpen, onClose }: QuickSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<LegalArticle[]>([]);
    const [caseResults, setCaseResults] = useState<JudicialCase[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
            // Focus input after animation
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            const hits = await searchConstitution(query);
            const caseHits = searchCases(query);
            setResults(hits || []);
            setCaseResults(caseHits || []);
            setSelectedIndex(0);
        };

        const timeoutId = setTimeout(performSearch, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            const totalResults = results.length + caseResults.length;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % (totalResults || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + (totalResults || 1)) % (totalResults || 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex < results.length) {
                    handleSelect(results[selectedIndex]);
                } else {
                    const caseIndex = selectedIndex - results.length;
                    handleCaseSelect(caseResults[caseIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose]);

    const handleSelect = (article: LegalArticle) => {
        onClose();
        router.push(`/library?article=${article.article}`);
    };

    const handleCaseSelect = (judicialCase: JudicialCase) => {
        onClose();
        router.push(`/cases`); // We don't have detail pages yet, so just go to archive
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col border border-slate-200"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100">
                            <Search className="text-slate-400 w-6 h-6" strokeWidth={2.5} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search the Constitution, laws, or rights..."
                                className="flex-1 text-xl text-slate-900 font-bold placeholder:text-slate-300 outline-none bg-transparent h-full"
                            />
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Esc to close</span>
                            </div>
                        </div>

                        {/* Loading / Empty / Results */}
                        <div className="max-h-[60vh] overflow-y-auto p-2 bg-slate-50/50">
                            {query && results.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-slate-400 font-medium">No results found for "<span className="text-slate-900">{query}</span>"</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="space-y-1">
                                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        Constitutional Articles
                                    </div>
                                    {results.map((result, idx) => (
                                        <div
                                            key={result.id}
                                            onClick={() => handleSelect(result)}
                                            className={clsx(
                                                "group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border",
                                                idx === selectedIndex
                                                    ? "bg-white border-slate-200 shadow-md scale-[1.01]"
                                                    : "bg-transparent border-transparent hover:bg-slate-100"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                                idx === selectedIndex ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                                            )}>
                                                <Scale size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        Art. {result.article}
                                                    </span>
                                                    <h4 className="font-bold text-slate-900 truncate">
                                                        {result.title}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-slate-500 line-clamp-1">
                                                    {result.simplified || result.content}
                                                </p>
                                            </div>
                                            <ChevronRight className={clsx(
                                                "w-5 h-5 transition-transform",
                                                idx === selectedIndex ? "text-slate-900 translate-x-1" : "text-slate-300 opacity-0 group-hover:opacity-100"
                                            )} />
                                        </div>
                                    ))}

                                    {caseResults.length > 0 && (
                                        <>
                                            <div className="px-4 py-2 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                Judicial Archive
                                            </div>
                                            {caseResults.map((result, idx) => {
                                                const globalIdx = results.length + idx;
                                                return (
                                                    <div
                                                        key={result.id}
                                                        onClick={() => handleCaseSelect(result)}
                                                        className={clsx(
                                                            "group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border",
                                                            globalIdx === selectedIndex
                                                                ? "bg-white border-slate-200 shadow-md scale-[1.01]"
                                                                : "bg-transparent border-transparent hover:bg-slate-100"
                                                        )}
                                                    >
                                                        <div className={clsx(
                                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                                            globalIdx === selectedIndex ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-400 group-hover:text-blue-600"
                                                        )}>
                                                            <Gavel size={20} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                                    {result.year}
                                                                </span>
                                                                <h4 className="font-bold text-slate-900 truncate uppercase">
                                                                    {result.title}
                                                                </h4>
                                                            </div>
                                                            <p className="text-sm text-slate-500 line-clamp-1">
                                                                {result.summary}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className={clsx(
                                                            "w-5 h-5 transition-transform",
                                                            globalIdx === selectedIndex ? "text-slate-900 translate-x-1" : "text-slate-300 opacity-0 group-hover:opacity-100"
                                                        )} />
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="p-12 text-center opacity-40">
                                    <Command className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                    <p className="text-sm font-bold text-slate-400">Search for "Free Speech", "Voting", "Arrest"...</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-400 flex items-center justify-between">
                            <span>Powered by Cedizen Intelligence Engine</span>
                            <div className="flex gap-4">
                                <span><kbd className="font-sans bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">↓</kbd> Navigate</span>
                                <span><kbd className="font-sans bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">↵</kbd> Select</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
