'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Scale,
    Library,
    Award,
    ChevronRight,
    Flag,
    History,
    Star,
    MessageSquareText,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    Send,
    Zap,
    Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, getSavedArticles, getVotes } from '@/lib/storage';
import { getAllArticles, initSearch } from '@/lib/search';
import { clsx } from 'clsx';

const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08
        }
    }
};

export default function Home() {
    const [recentArticles, setRecentArticles] = React.useState<any[]>([]);
    const [savedCount, setSavedCount] = React.useState(0);
    const [stats, setStats] = React.useState({ stay: 0, go: 0 });
    const [dailyArticle, setDailyArticle] = React.useState<any>(null);


    React.useEffect(() => {
        async function initialize() {
            const data = await initSearch() || [];
            const all = data.length > 0 ? data : getAllArticles();

            const historyIds = getHistory();
            const filtered = historyIds.map(id => all.find(a => a.id === id)).filter(Boolean);
            setRecentArticles(filtered);
            setSavedCount(getSavedArticles().length);

            const userVotes = getVotes();
            const stayVotes = Object.values(userVotes).filter(v => v === 'stay').length;
            const goVotes = Object.values(userVotes).filter(v => v === 'go').length;
            setStats({ stay: stayVotes, go: goVotes });

            // Daily Article Logic
            if (all.length > 0) {
                const today = new Date();
                const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
                const index = seed % all.length;
                setDailyArticle(all[index]);
            }
        }
        initialize();
    }, []);

    const totalVotes = stats.stay + stats.go;
    const stayPercent = Math.round((stats.stay / (totalVotes || 1)) * 100);

    return <div className="flex-1 min-h-full p-8 md:p-12 overflow-x-hidden relative bg-white">
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-7xl mx-auto space-y-12 relative z-10"
        >
            {/* Header Section */}
            <header className="py-12">
                <motion.div variants={fadeInUp}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                        <Flag size={12} /> ARTICLE 1 • SUPREMACY
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                        Sovereignty <br />
                        <span className="text-blue-600">belongs to You.</span>
                    </h1>
                    <p className="text-slate-500 text-xl font-bold max-w-2xl leading-relaxed mb-10">
                        Ghana's premier civic ecosystem. Putting the 1992 Constitution and local legal intelligence directly into the hands of every citizen.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/quiz" className="bg-slate-900 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                            START THE TEST <ArrowRight size={14} />
                        </Link>
                        <Link href="/lawyer" className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                            LEGAL GUIDANCE
                        </Link>
                    </div>
                </motion.div>
            </header>

            {/* Daily Insight Hero Section */}
            {
                dailyArticle && (
                    <motion.div
                        variants={fadeInUp}
                        className="w-full relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-start md:items-center">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-200 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6 backdrop-blur-md border border-white/10">
                                    <Zap size={10} fill="currentColor" /> Daily Constitution
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                    Article {dailyArticle.article}: <br />
                                    <span className="text-blue-400">{dailyArticle.title}</span>
                                </h2>
                                <div className="prose prose-invert prose-lg mb-10 max-w-2xl">
                                    <p className="text-slate-300 font-medium leading-relaxed line-clamp-3">
                                        "{dailyArticle.content}"
                                    </p>
                                </div>
                                <Link
                                    href="/library?daily=true"
                                    className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all"
                                >
                                    Read Full Insight <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="hidden md:flex flex-shrink-0 w-64 h-64 bg-white/5 rounded-3xl border border-white/10 items-center justify-center relative rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Quote size={64} className="text-white/20" />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl" />
                            </div>
                        </div>
                    </motion.div>
                )
            }

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Cedizen Test Card - Dark */}
                <Link href="/quiz" className="md:col-span-6 group h-full">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-slate-900 p-12 h-full flex flex-col justify-between rounded-[2.5rem] shadow-2xl relative overflow-hidden group/card"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center transition-all group-hover/card:bg-white group-hover/card:text-slate-900 mb-10">
                            <Award size={32} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white tracking-tight mb-4">Cedizen Test</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                                Complete the official literacy challenge and earn your digital verification.
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover/card:text-white transition-colors flex items-center gap-2">
                                START NOW <ChevronRight size={14} />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Pocket Lawyer Card - Light */}
                <Link href="/lawyer" className="md:col-span-6 group h-full">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white border border-slate-200 p-12 h-full flex flex-col justify-between rounded-[2.5rem] hover:shadow-xl transition-all relative overflow-hidden group/card"
                    >
                        <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center transition-all group-hover/card:bg-slate-900 group-hover/card:text-white mb-10">
                            <Scale size={32} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Pocket Lawyer</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                Private, device-local AI trained on Ghanaian legal frameworks.
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover/card:text-slate-900 transition-colors flex items-center gap-2">
                                CHAT <ChevronRight size={14} />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Case Library Card - Light */}
                <Link href="/library" className="md:col-span-6 group h-full">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white border border-slate-200 p-12 h-full flex flex-col justify-between rounded-[2.5rem] hover:shadow-xl transition-all relative overflow-hidden group/card"
                    >
                        <div className="flex items-start justify-between mb-10">
                            <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center transition-all group-hover/card:bg-slate-900 group-hover/card:text-white">
                                <Library size={32} />
                            </div>
                            {savedCount > 0 && (
                                <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Star size={12} fill="currentColor" /> {savedCount} SAVED
                                </span>
                            )}
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Case Library</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                Instant access to Articles and Supreme Court summaries.
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover/card:text-slate-900 transition-colors flex items-center gap-2">
                                ARCHIVE <ChevronRight size={14} />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Civic Pulse / Public Votes Card - Gradient */}
                <Link href="/votes" className="md:col-span-6 group h-full">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-teal-500 to-emerald-600 p-12 h-full flex flex-col justify-between rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group/card"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all group-hover/card:bg-white group-hover/card:text-teal-600 mb-10 backdrop-blur-sm">
                            <Zap size={32} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white tracking-tight mb-4">Civic Voice</h3>
                            <p className="text-teal-50 text-sm font-medium leading-relaxed mb-8">
                                Join {totalVotes.toLocaleString()} citizens voting on today's issues.
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover/card:text-white transition-colors flex items-center gap-2">
                                VOTE NOW <ChevronRight size={14} />
                            </div>
                        </div>
                    </motion.div>
                </Link>

            </div>

            {/* Footer */}
            <footer className="pt-20 pb-12 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 mt-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black">#</div>
                    <span className="font-black text-xl tracking-tight text-slate-900">cedizen</span>
                </div>

                <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-6 md:mt-0">
                    <Link href="#" className="hover:text-slate-900 transition-colors">Resources</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Community</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link>
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mt-6 md:mt-0">
                    GHANA • SOVEREIGN TECH • 2026
                </p>
            </footer>
        </motion.div>
    </div>;
}
