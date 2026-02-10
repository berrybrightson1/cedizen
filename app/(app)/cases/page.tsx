'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scale,
    Search,
    Gavel,
    Calendar,
    Info,
    ExternalLink,
    ChevronRight,
    ShieldCheck,
    History,
    FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import { getAllCases, searchCases, JudicialCase } from '@/lib/cases';
import Link from 'next/link';

function CaseCard({ judicialCase, index }: { judicialCase: JudicialCase, index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group"
        >
            <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                            <Gavel size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg leading-tight tracking-tight uppercase">{judicialCase.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{judicialCase.court}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{judicialCase.year}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-1.5 shrink-0">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider italic">Verified Outcome</span>
                    </div>
                </div>

                <div className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                    {judicialCase.summary}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {judicialCase.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group/btn"
                    >
                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} className="text-slate-400" />
                            {isExpanded ? 'Hide Interpretation' : 'View Legal Interpretation'}
                        </span>
                        <ChevronRight size={16} className={clsx("text-slate-400 transition-transform", isExpanded && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm text-slate-700 leading-relaxed font-medium mt-2">
                                    <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-[0.2em] mb-3">Constitutional Basis</h4>
                                    {judicialCase.law_interpretation}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                                <Scale size={14} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Verdict</h4>
                                <p className="text-sm font-black text-slate-900">{judicialCase.outcome}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white text-sm leading-relaxed mt-2 shadow-lg shadow-slate-900/10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                                    <Info size={12} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Why this matters</span>
                            </div>
                            <span className="font-medium opacity-90">{judicialCase.justification}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link
                        href={`/lawyer?case=${judicialCase.id}`}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
                    >
                        Consult Lawyer about this case <ExternalLink size={12} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default function JudicialArchivePage() {
    const [query, setQuery] = useState('');
    const [cases, setCases] = useState<JudicialCase[]>([]);

    useEffect(() => {
        setCases(getAllCases());
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (!val.trim()) {
            setCases(getAllCases());
        } else {
            setCases(searchCases(val));
        }
    };

    return (
        <div className="flex-1 min-h-full p-6 md:p-12 bg-white relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-slate-50 rounded-full blur-[120px] -mr-[20vw] -mt-[10vw] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12 md:mb-20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                            <Scale size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Judicial Archive</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Ghanaian Case Law</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Precedents</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-500 font-bold text-lg max-w-2xl leading-relaxed">
                        Explore landmark judgments that shaped Ghana's democracy. From constitutional supremacy to human rights, find the truth of the court.
                    </p>
                </header>

                <div className="mb-12 sticky top-0 md:top-6 z-30 pt-4 pb-6 bg-white/80 backdrop-blur-xl -mx-4 px-4 rounded-3xl">
                    <div className="relative group max-w-2xl mx-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Search by case title, parties, or year (e.g., Tuffuor v. AG)..."
                            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 transition-all shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>

                {cases.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                        {cases.map((c, i) => (
                            <CaseCard key={c.id} judicialCase={c} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <History size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No precedents found</h3>
                        <p className="text-slate-500 font-bold">Try searching for "NPP", "Vetting", or "Supreme Court".</p>
                    </div>
                )}

                <footer className="pt-20 pb-12 border-t border-slate-50 max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                        <Scale size={12} /> Legal Disclaimer
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        The Cedizen Judicial Archive is for educational purposes.
                        While verified for accuracy, these summaries do not constitute legal advice.
                        Consult a licensed legal practitioner for judicial proceedings.
                    </p>
                </footer>
            </div>
        </div>
    );
}
