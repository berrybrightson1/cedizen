'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Library,
    BookOpen,
    Gavel,
    Scale,
    ChevronRight,
    ChevronDown,
    Zap,
    MessageSquareText,
    Info,
    CheckCircle
} from 'lucide-react';
import { searchConstitution, getAllArticles, type LegalArticle } from '@/lib/search';
import {
    getSavedArticles,
    toggleSavedArticle,
    addToHistory,
    getVotes,
    saveVote,
    savePublicVote,
    getVoteStats,
    type VoteType
} from '@/lib/storage';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

function ArticleCard({ res, index, isBookmarked, onToggleBookmark, currentVote, onVote }: {
    res: LegalArticle,
    index: number,
    isBookmarked: boolean,
    onToggleBookmark: (id: string) => void,
    currentVote: VoteType | undefined,
    onVote: (id: string, type: VoteType) => void
}) {
    const [isSimplified, setIsSimplified] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pendingVote, setPendingVote] = useState<VoteType | null>(null);
    const [comment, setComment] = useState('');
    const [stats, setStats] = useState({ stayPercent: 0, goPercent: 0, total: 0 });

    useEffect(() => {
        setStats(getVoteStats(res.id));
    }, [res.id, currentVote]); // Update stats when article or vote status changes

    const handleSimplify = () => {
        setIsSimplified(!isSimplified);
        if (!isSimplified) {
            addToHistory(res.id);
        }
    };

    const initiateVote = (type: VoteType) => {
        if (currentVote) return; // Prevent changing vote
        setPendingVote(type);
        setShowVoteModal(true);
    };

    const submitVote = () => {
        if (pendingVote) {
            // Save local preference
            onVote(res.id, pendingVote);

            // Save to public feed if there's a comment (or even if empty?)
            // User requested: "add a button for users to anonymously say why... turn them into x style posts"
            // So we should save it.
            if (comment.trim()) {
                savePublicVote({
                    articleId: res.id,
                    type: pendingVote,
                    comment: comment.trim()
                });
            } else {
                // If no comment, maybe just save a generic "Voted Stay" or skip public feed?
                // Let's save it to feed with empty comment handled by UI or skip.
                // For now, let's require a comment or add a placeholder.
                // Actually, let's save it even without comment so we see movement.
                savePublicVote({
                    articleId: res.id,
                    type: pendingVote,
                    comment: ""
                });
            }
        }
        setShowVoteModal(false);
        setShowSuccessModal(true);
        setComment('');
        setPendingVote(null);

        // Auto-dismiss success modal
        setTimeout(() => setShowSuccessModal(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white border border-slate-200 p-12 md:p-16 rounded-[3rem] relative overflow-hidden group hover:shadow-xl transition-all"
        >
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Voting Modal Overlay */}
            <AnimatePresence>
                {showVoteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                    >
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Make your voice heard.</h3>
                        <p className="text-slate-500 font-bold mb-6 max-w-md">
                            Why should this article {pendingVote === 'stay' ? 'STAY' : 'GO'}? Your anonymous comment will be added to the public feed.
                        </p>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your reasoning..."
                            className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-medium focus:outline-none focus:border-blue-500 min-h-[100px] mb-6 resize-none"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowVoteModal(false)}
                                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitVote}
                                className={clsx(
                                    "px-8 py-3 rounded-xl font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95",
                                    pendingVote === 'stay' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                                )}
                            >
                                Post Vote
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg">
                        {res.article}
                    </div>
                    <div>
                        <span className="block font-black text-slate-900 uppercase tracking-tighter text-3xl leading-none">{res.title}</span>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Charter {res.article}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-[10px] text-blue-600 uppercase font-black tracking-[0.3em]">Official Clause</span>
                            {currentVote && (
                                <>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className={clsx("text-[10px] uppercase font-black tracking-[0.3em]", currentVote === 'stay' ? "text-emerald-600" : "text-red-600")}>
                                        Voted {currentVote}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onToggleBookmark(res.id)}
                        className={clsx(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all border",
                            isBookmarked
                                ? "text-amber-500 bg-amber-50 border-amber-200 shadow-sm"
                                : "text-slate-400 bg-slate-50 border-slate-200 hover:text-amber-500 hover:border-amber-300"
                        )}
                        title={isBookmarked ? "Remove Bookmark" : "Save Provision"}
                    >
                        <Star size={24} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={handleSimplify}
                        className={clsx(
                            "px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-sm border",
                            isSimplified
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        <Zap size={16} fill={isSimplified ? "currentColor" : "none"} />
                        {isSimplified ? "Reading Plain Citizen" : "Simplify Syntax"}
                    </button>
                </div>
            </div>

            <div className="relative min-h-[140px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSimplified ? 'simple' : 'legal'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={clsx(
                            "text-lg leading-relaxed mb-12",
                            isSimplified ? "text-slate-700 font-medium" : "legal-text text-slate-600"
                        )}
                    >
                        {isSimplified ? res.simplified : res.content}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer with Voting or Stats */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {currentVote ? (
                        <div className="w-full md:w-64 bg-slate-100 rounded-2xl p-4">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                                <span>Community Consensus</span>
                                <span>{stats.total} Votes</span>
                            </div>
                            <div className="flex h-4 rounded-full overflow-hidden w-full bg-white relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.stayPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="bg-emerald-500 h-full"
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.goPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="bg-red-500 h-full"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-black">
                                <span className="text-emerald-600">{stats.stayPercent}% STAY</span>
                                <span className="text-red-600">{stats.goPercent}% GO</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Info size={16} />
                            <span>Vote to see community stats</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {!currentVote && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => initiateVote('stay')}
                                className={clsx(
                                    "flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3",
                                    "bg-white text-slate-900 ring-1 ring-slate-200 hover:ring-emerald-500 hover:text-emerald-600"
                                )}
                            >
                                <ThumbsUp size={18} />
                                Stay
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => initiateVote('go')}
                                className={clsx(
                                    "flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3",
                                    "bg-slate-900 text-white hover:bg-red-600"
                                )}
                            >
                                <ThumbsDown size={18} />
                                Go
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function LibraryPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<LegalArticle[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [showOnlySaved, setShowOnlySaved] = useState(false);
    const [suggestions, setSuggestions] = useState<LegalArticle[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [votes, setVotes] = useState<Record<string, VoteType>>({});

    useEffect(() => {
        const initial = getAllArticles();
        setResults(initial);
        setSavedIds(getSavedArticles());
        setVotes(getVotes());

        // Check for filter param
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('filter') === 'saved') {
                setShowOnlySaved(true);
                const saved = getSavedArticles();
                setResults(initial.filter(a => saved.includes(a.id)));
            } else if (params.get('daily')) {
                // Daily Read: Pick a random article seeded by date
                const today = new Date();
                const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
                const index = seed % initial.length;
                setResults([initial[index]]);
            } else if (params.get('article')) {
                // Deep link to specific article
                const id = params.get('article');
                const target = initial.find(a => a.id === id || a.article === id);
                if (target) setResults([target]);
            }
        }
    }, []);


    const updateSuggestions = async (val: string) => {
        if (!val.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = await searchConstitution(val);
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
        setSelectedIndex(-1);
    };

    const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault();
        const finalQuery = overrideQuery ?? query;

        setShowSuggestions(false);
        if (overrideQuery) setQuery(overrideQuery);

        let pool = getAllArticles();
        if (showOnlySaved) {
            pool = pool.filter(a => savedIds.includes(a.id));
        }

        if (!query.trim()) {
            setResults(pool);
            return;
        }

        setIsSearching(true);
        setTimeout(async () => {
            try {
                const searchResults = await searchConstitution(query);
                // Filter searching results if "showOnlySaved" is on
                const final = showOnlySaved
                    ? searchResults.filter(r => savedIds.includes(r.id))
                    : searchResults;
                setResults(final);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const selected = suggestions[selectedIndex];
            handleSearch(undefined, selected.title);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const toggleBookmark = (id: string) => {
        const updated = toggleSavedArticle(id);
        setSavedIds([...updated]);
    };

    const handleFilterToggle = () => {
        setShowOnlySaved(!showOnlySaved);
    };

    const handleVote = (id: string, type: VoteType) => {
        saveVote(id, type);
        setVotes(prev => ({ ...prev, [id]: type }));
    };

    // Re-run search/filter when showOnlySaved changes
    useEffect(() => {
        handleSearch();
    }, [showOnlySaved, savedIds]);

    return (
        <div className="flex-1 min-h-full flex flex-col bg-white">
            {/* Header Section */}
            <header className="px-8 md:px-20 py-16 flex-shrink-0 bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 text-blue-600 font-black mb-6">
                        <Scale size={18} />
                        <span className="uppercase tracking-[0.5em] text-[9px]">CONSTITUTIONAL ARCHIVE</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">
                        Case Law <span className="text-blue-600">Connect.</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-xl max-w-2xl leading-relaxed">
                        Access the full 1992 Charter. Use the <span className="text-blue-600">Simplify</span> engine to distill complex legal grammar into plain citizen-English.
                    </p>
                </div>
            </header>

            {/* Sticky Search Bar Container */}
            <div className="px-8 md:px-20 sticky top-0 z-30 bg-white/95 backdrop-blur-xl pb-10 pt-10 border-b border-slate-100">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <div className="relative group">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    updateSuggestions(e.target.value);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => query.trim() && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="Try 'Article 14' or 'Police searches'..."
                                className="w-full bg-slate-50 border border-slate-200 p-7 md:p-9 rounded-[3rem] text-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all pl-24 md:pl-32 pr-40 shadow-sm"
                            />
                            <div className="absolute left-8 md:left-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Search size={24} className="text-white" strokeWidth={2.5} />
                            </div>
                            <button
                                type="submit"
                                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 px-10 md:px-12 py-4 md:py-5 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                            >
                                Search
                            </button>

                            {/* Autocomplete Suggestions */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full mt-4 w-full bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-50">
                                    {suggestions.map((sug, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setQuery(sug.title);
                                                setShowSuggestions(false);
                                                handleSearch(new Event('submit') as any);
                                            }}
                                            className="w-full px-8 py-5 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 flex items-center gap-4 group"
                                        >
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Scale size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-bold text-slate-900 block">{sug.title}</span>
                                                <span className="text-xs text-slate-500 uppercase tracking-wider">Article {sug.article}</span>
                                            </div>
                                            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-10 py-6 bg-slate-100 border border-slate-200 text-slate-700 rounded-[3rem] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3 justify-center shadow-sm"
                    >
                        <Library size={20} />
                        Filters
                        <ChevronDown size={16} className={clsx("transition-transform", showFilters && "rotate-180")} />
                    </button>
                </div>
            </div>

            {/* Filters Dropdown */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                    >
                        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">View Options</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowOnlySaved(!showOnlySaved)}
                                        className={clsx(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold",
                                            showOnlySaved
                                                ? "bg-amber-50 border-amber-200 text-amber-600"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Star size={16} fill={showOnlySaved ? "currentColor" : "none"} />
                                            <span>Bookmarked Only</span>
                                        </div>
                                        {showOnlySaved && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Quick Categories</h3>
                                <div className="flex flex-wrap gap-3">
                                    {["Human Rights", "Police Powers", "Land & Property", "Voting", "Family Law"].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setQuery(cat);
                                                handleSearch(undefined, cat);
                                                setShowFilters(false);
                                            }}
                                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold text-xs hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto px-8 md:px-20 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 gap-12">
                        <AnimatePresence mode="popLayout">
                            {results.length > 0 ? (
                                results.map((res, i) => (
                                    <ArticleCard
                                        key={res.id || i}
                                        res={res}
                                        index={i}
                                        isBookmarked={savedIds.includes(res.id)}
                                        onToggleBookmark={toggleBookmark}
                                        currentVote={votes[res.id]}
                                        onVote={handleVote}
                                    />
                                ))
                            ) : !isSearching && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-40 premium-card bg-white/[0.02] border-dashed"
                                >
                                    <Scale className="text-white/5 mx-auto mb-10" size={80} />
                                    <p className="text-white font-black text-2xl mb-4 tracking-tight">No constitutional matches.</p>
                                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Refine your search parameters</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isSearching && (
                            <div className="space-y-12">
                                {[1, 2].map(n => (
                                    <div key={n} className="h-96 bg-white/[0.02] rounded-[4rem] animate-pulse border border-white/5" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
}
