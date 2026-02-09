'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/ui/Sidebar';
import { getAllPublicVotes, VoteRecord, VoteType, getUserInteractions, saveInteraction, getInteractionStats, incrementInteractionStats } from '@/lib/storage';
import { getAllArticles, LegalArticle } from '@/lib/search';
import {
    ThumbsUp,
    ThumbsDown,
    Filter,
    ChevronDown,
    ChevronUp,
    BookOpen,
    MoreHorizontal,
    Heart,
    HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';

export default function VotesPage() {
    const [votes, setVotes] = useState<VoteRecord[]>([]);
    const [articles, setArticles] = useState<Record<string, LegalArticle>>({});
    const [filter, setFilter] = useState<'all' | 'stay' | 'go'>('all');
    const [expandedContext, setExpandedContext] = useState<Record<string, boolean>>({});
    const [interactions, setInteractions] = useState<Record<string, 'like' | 'dislike' | 'maybe' | null>>({});
    const [stats, setStats] = useState<Record<string, { like: number, dislike: number, maybe: number }>>({});
    const [trending, setTrending] = useState<{ id: string; count: number; title: string }[]>([]);
    const [userScore, setUserScore] = useState(0);

    const toggleContext = (id: string) => {
        setExpandedContext(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleInteraction = (id: string, type: 'like' | 'dislike' | 'maybe') => {
        if (interactions[id]) return; // Locked: already interacted

        // Save and update
        saveInteraction(id, type);
        setInteractions(prev => ({ ...prev, [id]: type }));

        // Update stats
        const newStats = incrementInteractionStats(id, type);
        setStats(prev => ({ ...prev, [id]: newStats }));
    };

    useEffect(() => {
        // Load votes
        const publicVotes = getAllPublicVotes();
        setVotes(publicVotes);

        // Load articles for lookup
        const allArticles = getAllArticles();
        const lookup: Record<string, LegalArticle> = {};
        allArticles.forEach(a => {
            lookup[a.id] = a;

        });
        setArticles(lookup);

        // Load interactions and stats
        setInteractions(getUserInteractions());

        const initialStats: Record<string, any> = {};
        publicVotes.forEach(v => {
            initialStats[v.id] = getInteractionStats(v.id);
        });
        setStats(initialStats);

        // Calculate Trending
        const counts: Record<string, number> = {};
        publicVotes.forEach(v => {
            counts[v.articleId] = (counts[v.articleId] || 0) + 1;
        });
        const sorted = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([id, count]) => ({
                id,
                count,
                title: lookup[id]?.title || `Article ${id}`
            }));
        setTrending(sorted);

        // Calculate User Score (Simple: Votes + Interactions)
        const myVotes = Object.keys(getUserInteractions()).length; // Using interactions as proxy for "engagement" on this page
        // Or better: import getVotes from storage
        // For now, let's use a simple progress: max 100
        const score = Math.min((publicVotes.length * 5) + (myVotes * 10), 100);
        setUserScore(score);
    }, []);

    const filteredVotes = votes.filter(v =>
        filter === 'all' ? true : v.type === filter
    );

    const formatTime = (ms: number) => {
        const seconds = Math.floor((Date.now() - ms) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    return (
        <div className="flex w-full h-full bg-white font-sans text-slate-900">

            <main className="flex-1 flex flex-col items-center bg-white border-r border-slate-100 relative xl:mr-[350px]">

                {/* Header */}
                <div className="w-full max-w-2xl px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-slate-900">Public Square</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{votes.length} Citizen Votes</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Filter Toggles */}
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {(['all', 'stay', 'go'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        filter === f
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="w-full max-w-2xl pb-20">
                    <AnimatePresence mode="popLayout">
                        {filteredVotes.map((vote, i) => {
                            const article = articles[vote.articleId];
                            return (
                                <motion.div
                                    key={vote.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="p-6 border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex gap-4">

                                        {/* Avatar */}
                                        <div className={clsx(
                                            "w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-black text-xs text-white shadow-sm",
                                            vote.type === 'stay' ? "bg-emerald-500" : "bg-red-500"
                                        )}>
                                            {vote.type === 'stay' ? <ThumbsUp size={18} /> : <ThumbsDown size={18} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* Meta */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-900">{vote.userAlias}</span>
                                                <span className="text-slate-400 text-sm">· {formatTime(vote.timestamp)}</span>
                                                <button aria-label="More options" className="ml-auto text-slate-300 hover:text-slate-600 group-hover:opacity-100 opacity-0 transition-all">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>

                                            {/* Context */}

                                            <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                                                Voted <span className={clsx("font-black uppercase", vote.type === 'stay' ? "text-emerald-600" : "text-red-600")}>{vote.type}</span>
                                            </div>

                                            {/* Article Context Card */}
                                            {article && (
                                                <div className="mb-4 mt-1 group/card border border-slate-200 bg-slate-50 rounded-2xl p-4 hover:border-blue-200 transition-colors cursor-pointer" onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleContext(vote.id);
                                                }}>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">Article {article.article}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Constitutional Context</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{article.title}</h4>
                                                    <p className={clsx("text-xs text-slate-500 leading-relaxed transition-all", expandedContext[vote.id] ? "" : "line-clamp-2")}>
                                                        {article.simplified || article.content}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Content */}
                                            <p className="text-slate-900 leading-relaxed text-[15px] whitespace-pre-wrap mb-4">
                                                {vote.comment || <span className="italic text-slate-400">No comment provided.</span>}
                                            </p>

                                            {/* Actions */}
                                            {/* Actions */}
                                            <div className="flex items-center gap-3 mt-4 border-t border-slate-50 pt-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleInteraction(vote.id, 'like');
                                                    }}
                                                    disabled={!!interactions[vote.id]}
                                                    className={clsx(
                                                        "flex items-center gap-2 text-xs font-bold transition-all group/btn px-3 py-2 rounded-lg",
                                                        interactions[vote.id] === 'like'
                                                            ? "bg-pink-50 text-pink-600 cursor-default"
                                                            : interactions[vote.id]
                                                                ? "text-slate-300 cursor-not-allowed" // Disabled state
                                                                : "text-slate-400 hover:text-pink-600 hover:bg-pink-50"
                                                    )}
                                                >
                                                    <Heart size={16} fill={interactions[vote.id] === 'like' ? "currentColor" : "none"} />
                                                    <span>Like</span>
                                                    <span className="opacity-60 font-normal ml-0.5">{stats[vote.id]?.like || 0}</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleInteraction(vote.id, 'dislike');
                                                    }}
                                                    disabled={!!interactions[vote.id]}
                                                    className={clsx(
                                                        "flex items-center gap-2 text-xs font-bold transition-all group/btn px-3 py-2 rounded-lg",
                                                        interactions[vote.id] === 'dislike'
                                                            ? "bg-slate-100 text-slate-900 cursor-default"
                                                            : interactions[vote.id]
                                                                ? "text-slate-300 cursor-not-allowed"
                                                                : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <ThumbsDown size={16} />
                                                    <span>Dislike</span>
                                                    <span className="opacity-60 font-normal ml-0.5">{stats[vote.id]?.dislike || 0}</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleInteraction(vote.id, 'maybe');
                                                    }}
                                                    disabled={!!interactions[vote.id]}
                                                    className={clsx(
                                                        "flex items-center gap-2 text-xs font-bold transition-all group/btn px-3 py-2 rounded-lg",
                                                        interactions[vote.id] === 'maybe'
                                                            ? "bg-amber-50 text-amber-600 cursor-default ring-1 ring-amber-200"
                                                            : interactions[vote.id]
                                                                ? "text-slate-300 cursor-not-allowed"
                                                                : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                                    )}
                                                >
                                                    <HelpCircle size={16} />
                                                    <span>Maybe</span>
                                                    <span className="opacity-60 font-normal ml-0.5">{stats[vote.id]?.maybe || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {filteredVotes.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <Filter size={48} className="mx-auto mb-4 text-slate-300" />
                            <p className="font-bold text-slate-400">No votes found.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar (Trends) */}
            <aside className="fixed right-0 top-0 h-screen w-[350px] hidden xl:block p-8 overflow-y-auto bg-white z-20 border-l border-slate-100">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8">
                    <h2 className="font-black text-lg text-slate-900 mb-6 px-2">Constitutional Trends</h2>
                    <div className="space-y-6">
                        <div className="space-y-6">
                            {trending.length > 0 ? trending.map((t, i) => (
                                <div key={t.id} className="px-2 hover:bg-slate-100 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
                                    <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                                        <span>Trending in Ghana</span>
                                        <span className="text-emerald-500 font-black">#{i + 1}</span>
                                    </div>
                                    <div className="font-bold text-slate-900 mb-0.5 line-clamp-1">{t.title}</div>
                                    <div className="text-xs text-slate-500">{t.count} Citizens voting</div>
                                </div>
                            )) : (
                                <div className="text-slate-400 text-xs font-medium italic px-2">No trends yet. Be the first!</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                    <h2 className="font-black text-lg text-blue-900 mb-2">My Voting Record</h2>
                    <p className="text-blue-700 text-xs font-bold mb-6 leading-relaxed">Your voice matters. Track your civic engagement score.</p>
                    <div className="h-2 w-full bg-blue-100 rounded-full mb-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${userScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-500 rounded-full"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-blue-400 tracking-wider">
                        <span>Beginner</span>
                        <span>Activist</span>
                    </div>
                </div>
            </aside>
        </div>
    );
}
