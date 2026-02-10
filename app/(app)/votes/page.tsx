'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getAllPublicVotes,
    VoteRecord,
    VoteType,
    getUserInteractions,
    saveInteraction,
    getInteractionStats,
    incrementInteractionStats
} from '@/lib/storage';
import { searchConstitution, getAllArticles, initSearch, LegalArticle } from '@/lib/search';
import {
    ThumbsUp,
    ThumbsDown,
    MoreHorizontal,
    Heart,
    HelpCircle,
    Search,
    Book,
    Filter,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Scale,
    TrendingUp,
    Bookmark
} from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { clsx } from 'clsx';
import { getDeviceId } from '@/lib/id';

export default function VotesPage() {
    const deviceId = getDeviceId();
    const globalVotes = useQuery(api.votes.getVotes, { deviceId });
    const toggleReaction = useMutation(api.votes.toggleReaction);
    const [articles, setArticles] = useState<Record<string, LegalArticle>>({});
    const [filter, setFilter] = useState<'all' | 'stay' | 'go'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedContext, setExpandedContext] = useState<Record<string, boolean>>({});
    const [trending, setTrending] = useState<{ id: string; count: number; title: string }[]>([]);
    const [userScore, setUserScore] = useState(0);

    const toggleContext = (id: string) => {
        setExpandedContext(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleInteraction = async (id: any, type: 'like' | 'dislike' | 'maybe') => {
        await toggleReaction({
            voteId: id,
            type,
            deviceId: getDeviceId()
        });
    };

    useEffect(() => {
        const loadData = async () => {
            await initSearch();
            const allArticles = getAllArticles();
            const lookup: Record<string, LegalArticle> = {};
            allArticles.forEach(a => { lookup[a.id] = a; });
            setArticles(lookup);

            if (globalVotes) {
                // Re-calculate trending with fresh data
                const counts: Record<string, number> = {};
                globalVotes.forEach(v => { counts[v.articleId] = (counts[v.articleId] || 0) + 1; });
                const sorted = Object.entries(counts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([id, count]) => ({ id, count, title: lookup[id]?.title || `Article ${id}` }));
                setTrending(sorted);
            }
        };

        loadData();

        const myActions = 0; // In a full app we'd count device reactions
        const score = Math.min(((globalVotes?.length || 0) * 5) + (myActions * 10), 100);
        setUserScore(score);
    }, [globalVotes]);

    const filteredVotes = (globalVotes || []).filter(v => {
        const matchesFilter = filter === 'all' ? true : v.type === filter;
        const matchesSearch = searchQuery.trim() === '' ||
            v.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.userAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
            articles[v.articleId]?.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
        <div className="flex w-full min-h-screen bg-white">
            {/* Main Content Area - Fixed redundant margins for proper centring */}
            <main className="flex-1 border-r border-slate-100 max-w-2xl mx-auto min-h-screen">

                {/* Sticky Top Bar - Solid White (No Blurs) */}
                <div className="sticky top-0 z-40 bg-white border-b border-slate-100">
                    <div className="px-4 py-3">
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Public Square</h1>
                    </div>

                    <div className="flex w-full">
                        {(['all', 'stay', 'go'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="flex-1 relative py-4 text-sm font-bold transition-colors hover:bg-slate-50 group"
                            >
                                <span className={clsx(
                                    "relative z-10 uppercase tracking-widest text-[10px]",
                                    filter === f ? "text-slate-900" : "text-slate-500"
                                )}>
                                    {f}
                                </span>
                                {filter === f && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar - Integrated like X */}
                <div className="p-4 border-b border-slate-100 bg-white">
                    <div className="relative group">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search discussions..."
                            className="w-full bg-slate-100 border-none py-3 pl-12 pr-4 rounded-full text-sm font-medium focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                </div>

                {/* Feed */}
                <div className="min-h-screen">
                    <AnimatePresence mode="popLayout">
                        {filteredVotes.map((vote, i) => {
                            const article = articles[vote.articleId];
                            return (
                                <motion.div
                                    key={vote._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 border-b border-slate-100 hover:bg-slate-50/30 transition-colors cursor-pointer group"
                                >
                                    <div className="flex gap-3">
                                        {/* Avatar */}
                                        <div className={clsx(
                                            "w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-white shadow-sm font-black text-xs",
                                            vote.type === 'stay' ? "bg-emerald-500" : "bg-slate-900"
                                        )}>
                                            {vote.userAlias.charAt(0)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* User Meta */}
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className="font-black text-slate-900 hover:underline">{vote.userAlias}</span>
                                                <span className="text-slate-500 text-sm">@{vote.userAlias.toLowerCase().replace(/\s/g, '')}</span>
                                                <span className="text-slate-400 text-sm">· {formatTime(vote.timestamp)}</span>
                                                <button
                                                    title="More options"
                                                    className="ml-auto text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-all"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={clsx(
                                                    "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                                    vote.type === 'stay'
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        : "bg-slate-100 text-slate-900 border-slate-200"
                                                )}>
                                                    Voted to {vote.type}
                                                </span>
                                            </div>

                                            {/* Main Comment */}
                                            <p className="text-[15px] text-slate-800 leading-normal mb-3 whitespace-pre-wrap font-medium">
                                                {vote.comment || <span className="italic text-slate-300 font-normal">Passed without commentary.</span>}
                                            </p>

                                            {/* "Quote Tweet" Constitutional Context */}
                                            {article && (
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); toggleContext(vote._id); }}
                                                    className="border border-slate-200 rounded-2xl p-3 mb-3 hover:bg-slate-50 transition-colors group/quote"
                                                >
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-black">
                                                            {article.article}
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">The 1992 Charter</span>
                                                        <span className="text-slate-300">·</span>
                                                        <span className="text-[11px] font-bold text-blue-600">{article.title}</span>
                                                    </div>
                                                    <p className={clsx(
                                                        "text-xs text-slate-600 leading-relaxed font-medium transition-all",
                                                        expandedContext[vote._id] ? "" : "line-clamp-2"
                                                    )}>
                                                        {article.simplified || article.content}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Post Actions - Restored to original only */}
                                            <div className="flex items-center gap-8 text-slate-500 mt-4">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleInteraction(vote._id, 'like'); }}
                                                    title="Agree"
                                                    disabled={!!vote.userReaction}
                                                    className={clsx(
                                                        "flex items-center gap-2 group/action transition-colors",
                                                        vote.userReaction === 'like' ? "text-pink-600" : "hover:text-pink-600"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "p-2 rounded-full transition-colors",
                                                        vote.userReaction === 'like' ? "bg-pink-50" : "group-hover/action:bg-pink-50"
                                                    )}>
                                                        <Heart size={18} fill={vote.userReaction === 'like' ? "currentColor" : "none"} strokeWidth={vote.userReaction === 'like' ? 0 : 2} />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-wider">{vote.stats?.like || 0}</span>
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleInteraction(vote._id, 'dislike'); }}
                                                    title="Dislike"
                                                    disabled={!!vote.userReaction}
                                                    className={clsx(
                                                        "flex items-center gap-2 group/action transition-colors",
                                                        vote.userReaction === 'dislike' ? "text-slate-900" : "hover:text-slate-900"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "p-2 rounded-full transition-colors",
                                                        vote.userReaction === 'dislike' ? "bg-slate-100" : "group-hover/action:bg-slate-100"
                                                    )}>
                                                        <ThumbsDown size={18} fill={vote.userReaction === 'dislike' ? "currentColor" : "none"} strokeWidth={vote.userReaction === 'dislike' ? 0 : 2} />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-wider">{vote.stats?.dislike || 0}</span>
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleInteraction(vote._id, 'maybe'); }}
                                                    title="Maybe"
                                                    disabled={!!vote.userReaction}
                                                    className={clsx(
                                                        "flex items-center gap-2 group/action transition-colors",
                                                        vote.userReaction === 'maybe' ? "text-amber-500" : "hover:text-amber-500"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "p-2 rounded-full transition-colors",
                                                        vote.userReaction === 'maybe' ? "bg-amber-50" : "group-hover/action:bg-amber-50"
                                                    )}>
                                                        <HelpCircle size={18} fill={vote.userReaction === 'maybe' ? "currentColor" : "none"} strokeWidth={vote.userReaction === 'maybe' ? 0 : 2} />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-wider">{vote.stats?.maybe || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {filteredVotes.length === 0 && (
                        <div className="text-center py-20 bg-slate-50/50 m-4 rounded-3xl border border-dashed border-slate-200">
                            <Filter size={40} className="mx-auto mb-4 text-slate-300" />
                            <p className="font-bold text-slate-500">No consensus items found in this category.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar - X Style Trends */}
            <aside className="fixed right-0 top-0 h-screen w-[350px] hidden xl:block p-4 overflow-y-auto bg-white z-20">
                <div className="space-y-4">

                    {/* Trends for you */}
                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Trends for you</h2>
                        </div>
                        <div className="flex flex-col">
                            {trending.length > 0 ? trending.map((t, i) => (
                                <button key={t.id} className="p-4 text-left hover:bg-slate-200/50 transition-colors group">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5"><TrendingUp size={12} /><span>Trending in Civil Society</span></div>
                                        <MoreHorizontal size={14} />
                                    </div>
                                    <div className="font-black text-slate-900 group-hover:underline line-clamp-1 mb-0.5">Article {t.id}: {t.title}</div>
                                    <div className="text-xs text-slate-500 font-medium">{t.count} Citizen votes</div>
                                </button>
                            )) : (
                                <div className="p-8 text-center text-slate-400 text-sm font-bold italic">No active trends found.</div>
                            )}
                            <button className="p-4 text-sm font-bold text-blue-600 hover:bg-slate-200/50 transition-colors text-left border-t border-slate-100">
                                Show more
                            </button>
                        </div>
                    </div>

                    {/* Citizen Profile Card */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">C</div>
                            <div>
                                <div className="font-black text-slate-900">Your Civic Status</div>
                                <div className="text-xs text-slate-500 font-bold">Engaged Activist</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                                    <span>Engagement Score</span>
                                    <span className="text-blue-600">{userScore}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${userScore}%` }}
                                        className="h-full bg-blue-600 rounded-full"
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                                Join active constitutional debates this week to reach "Legislative Expert" status and influence national policy.
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="px-4 py-2 flex flex-wrap gap-x-3 gap-y-1">
                        {["Terms", "Privacy", "Accessibility", "Charter Info"].map(link => (
                            <button key={link} className="text-xs text-slate-500 font-medium hover:underline">{link}</button>
                        ))}
                        <span className="text-xs text-slate-400">© 1992 Cedizen Connect</span>
                    </div>
                </div>
            </aside>
        </div>
    );
}
