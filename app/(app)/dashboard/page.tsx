'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Scale,
    Library,
    Award,
    ChevronRight,
    Star,
    Zap,
    Quote,
    History,
    BookMarked
} from 'lucide-react';
import { motion } from 'framer-motion';
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

export default function Dashboard() {
    const [recentArticles, setRecentArticles] = React.useState<any[]>([]);
    const [savedCount, setSavedCount] = React.useState(0);
    const [stats, setStats] = React.useState({ stay: 0, go: 0 });
    const [dailyArticle, setDailyArticle] = React.useState<any>(null);

    React.useEffect(() => {
        async function initialize() {
            const data = await initSearch() || [];
            const all = data.length > 0 ? data : getAllArticles();

            const historyIds = getHistory();
            const filtered = historyIds.map(id => all.find(a => a.id === id)).filter(Boolean).slice(0, 3);
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

    return <div className="flex-1 min-h-full p-6 md:p-12 overflow-x-hidden relative bg-white">
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-7xl mx-auto space-y-10 relative z-10"
        >
            {/* Welcome Header */}
            <motion.header variants={fadeInUp} className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                    Welcome back, <span className="text-blue-600">Cedizen</span>
                </h1>
                <p className="text-slate-500 text-lg font-bold">
                    Your civic dashboard • Track your learning, explore the Constitution, exercise your voice
                </p>
            </motion.header>

            {/* Daily Constitutional Article */}
            {dailyArticle && (
                <motion.div
                    variants={fadeInUp}
                    className="w-full relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="relative z-10 p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-10 items-start md:items-center">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-200 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 backdrop-blur-md border border-white/10">
                                <Zap size={10} fill="currentColor" /> Today's Wisdom
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                                Article {dailyArticle.article}: <span className="text-blue-400">{dailyArticle.title}</span>
                            </h2>
                            <p className="text-slate-300 font-medium leading-relaxed line-clamp-2 mb-6">
                                "{dailyArticle.content}"
                            </p>
                            <Link
                                href="/library?daily=true"
                                className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all"
                            >
                                Read Full Article <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="hidden md:flex flex-shrink-0 w-48 h-48 bg-white/5 rounded-2xl border border-white/10 items-center justify-center relative rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Quote size={48} className="text-white/20" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={fadeInUp} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <History size={20} className="text-slate-400" />
                        <span className="text-3xl font-black text-slate-900">{recentArticles.length}</span>
                    </div>
                    <p className="text-slate-600 font-bold text-sm">Recent Articles</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-emerald-50 p-6 md:p-8 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-3">
                        <BookMarked size={20} className="text-emerald-600" />
                        <span className="text-3xl font-black text-emerald-900">{savedCount}</span>
                    </div>
                    <p className="text-emerald-700 font-bold text-sm">Saved Items</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-blue-50 p-6 md:p-8 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <Zap size={20} className="text-blue-600" />
                        <span className="text-3xl font-black text-blue-900">{totalVotes}</span>
                    </div>
                    <p className="text-blue-700 font-bold text-sm">Your Votes</p>
                </motion.div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cedizen Test */}
                <Link href="/quiz" className="group">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-slate-900 p-8 md:p-10 flex flex-col justify-between rounded-[2rem] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden h-full"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl -mr-24 -mt-24 pointer-events-none" />
                        <div className="w-14 h-14 bg-white/10 text-white rounded-xl flex items-center justify-center transition-all group-hover:bg-white group-hover:text-slate-900 mb-6">
                            <Award size={28} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-white tracking-tight mb-3">Cedizen Test</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                Test your constitutional knowledge and earn certification
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-white transition-colors flex items-center gap-2">
                                START NOW <ChevronRight size={12} />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Pocket Lawyer */}
                <Link href="/lawyer" className="group">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white border-2 border-slate-200 p-8 md:p-10 flex flex-col justify-between rounded-[2rem] hover:shadow-xl hover:border-slate-900 transition-all h-full"
                    >
                        <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white mb-6">
                            <Scale size={28} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Pocket Lawyer</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                Private AI legal guidance trained on Ghanaian law
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                ASK QUESTIONS <ChevronRight size={12} />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Case Library */}
                <Link href="/library" className="group">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white border-2 border-slate-200 p-8 md:p-10 flex flex-col justify-between rounded-[2rem] hover:shadow-xl hover:border-emerald-600 transition-all h-full"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center transition-all group-hover:bg-emerald-600 group-hover:text-white">
                                <Library size={28} />
                            </div>
                            {savedCount > 0 && (
                                <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> {savedCount}
                                </span>
                            )}
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Case Library</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                Access constitutional articles and case summaries
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                EXPLORE <ChevronRight size={12} />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Civic Voice */}
                <Link href="/votes" className="group">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 md:p-10 flex flex-col justify-between rounded-[2rem] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden h-full"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl -mr-24 -mt-24 pointer-events-none" />
                        <div className="w-14 h-14 bg-white/20 text-white rounded-xl flex items-center justify-center transition-all group-hover:bg-white group-hover:text-teal-600 mb-6 backdrop-blur-sm">
                            <Zap size={28} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-white tracking-tight mb-3">Civic Voice</h3>
                            <p className="text-teal-50 text-sm font-medium leading-relaxed mb-6">
                                Vote on constitutional issues with fellow citizens
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                                PARTICIPATE <ChevronRight size={12} />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    </div>;
}
