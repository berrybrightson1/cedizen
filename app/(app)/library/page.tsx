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
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    }, [res.id, currentVote]);

    const handleSimplify = () => {
        setIsSimplified(!isSimplified);
        if (!isSimplified) {
            addToHistory(res.id);
        }
    };

    const initiateVote = (type: VoteType) => {
        if (currentVote) return;
        setPendingVote(type);
        setShowVoteModal(true);
    };

    const submitVote = () => {
        if (pendingVote) {
            onVote(res.id, pendingVote);
            savePublicVote({
                articleId: res.id,
                type: pendingVote,
                comment: comment.trim()
            });
        }
        setShowVoteModal(false);
        setShowSuccessModal(true);
        setComment('');
        setPendingVote(null);
        setTimeout(() => setShowSuccessModal(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white border border-slate-200 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden group hover:shadow-xl transition-all shadow-sm"
        >
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <AnimatePresence>
                {showVoteModal && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute bottom-0 left-0 right-0 top-[35%] md:top-[40%] z-20 bg-white border-t border-slate-100 flex flex-col items-center justify-start p-6 md:p-8 pt-6 md:pt-10 text-center"
                    >
                        <div className="w-full max-w-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">Citizen Feedback</h3>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-6">
                                Why should this article {pendingVote === 'stay' ? 'STAY' : 'GO'}?
                            </p>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your reasoning..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 min-h-[100px] mb-6 resize-none"
                            />
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setShowVoteModal(false)} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-400 text-xs hover:text-slate-600 transition-colors">Cancel</button>
                                <button
                                    onClick={submitVote}
                                    className={clsx(
                                        "flex-1 px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] text-white shadow-lg transition-all active:scale-95",
                                        pendingVote === 'stay' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10" : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/10"
                                    )}
                                >
                                    Post Vote
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6 md:gap-8">
                <div className="flex flex-row items-start md:items-center gap-4 md:gap-8">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-600 text-white rounded-xl md:rounded-3xl flex items-center justify-center text-lg md:text-3xl font-black shadow-lg flex-shrink-0 mt-1 md:mt-0">
                        {res.article}
                    </div>
                    <div>
                        <span className="block font-black text-slate-900 uppercase tracking-tighter text-xl md:text-3xl leading-tight md:leading-none">{res.title}</span>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-4">
                            <span className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] md:tracking-[0.3em]">Charter {res.article}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
                            <span className="text-[9px] md:text-[10px] text-blue-600 uppercase font-black tracking-[0.2em] md:tracking-[0.3em]">Official Clause</span>
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
                            "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all border",
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
                            "px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 md:gap-3 shadow-sm border",
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

            <div className={clsx("relative min-h-[140px] transition-opacity duration-300", showVoteModal ? "opacity-0" : "opacity-100")}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSimplified ? 'simple' : 'legal'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={clsx(
                            "text-base md:text-lg leading-relaxed mb-8 md:mb-12",
                            isSimplified ? "text-slate-700 font-medium" : "legal-text text-slate-600"
                        )}
                    >
                        {isSimplified ? res.simplified : res.content}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
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
                                    className="bg-emerald-500 h-full"
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.goPercent}%` }}
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
                                    "flex-1 md:flex-none px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2",
                                    "bg-white text-slate-900 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                                )}
                            >
                                <ThumbsUp size={14} />
                                Stay
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => initiateVote('go')}
                                className={clsx(
                                    "flex-1 md:flex-none px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2",
                                    "bg-slate-900 text-white hover:bg-red-600 shadow-slate-900/10"
                                )}
                            >
                                <ThumbsDown size={14} />
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

        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('filter') === 'saved') {
                setShowOnlySaved(true);
            } else if (params.get('daily')) {
                const today = new Date();
                const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
                const index = seed % initial.length;
                setResults([initial[index]]);
            } else if (params.get('article')) {
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

        if (!finalQuery.trim() && !showOnlySaved) {
            setResults(pool);
            return;
        }

        setIsSearching(true);
        setTimeout(async () => {
            try {
                const searchResults = finalQuery.trim() ? await searchConstitution(finalQuery) : pool;
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

    const handleVote = (id: string, type: VoteType) => {
        saveVote(id, type);
        setVotes(prev => ({ ...prev, [id]: type }));
    };

    useEffect(() => {
        handleSearch();
    }, [showOnlySaved, savedIds]);

    return (
        <div className="flex-1 min-h-full flex flex-col bg-transparent lg:bg-white relative overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none" />
            <div className="absolute top-[20%] -right-[10%] w-[50%] h-[600px] bg-blue-100/10 blur-[120px] rounded-full pointer-events-none" />

            <header className="px-6 md:px-20 py-12 md:py-16 flex-shrink-0 bg-transparent relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-6 md:mb-10">
                        <div className="w-10 h-1 md:w-16 md:h-1.5 bg-blue-600 rounded-full" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-600">The 1992 Charter</span>
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-6 md:mb-8">
                        Case Law <span className="text-blue-600">Connect.</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-xl max-w-2xl leading-relaxed">
                        Access the full 1992 Charter. Use the <span className="text-blue-600">Simplify</span> engine to distill complex legal grammar into plain citizen-English.
                    </p>
                </div>
            </header>

            <div className="px-6 md:px-20 sticky top-0 z-30 bg-white pb-6 md:pb-10 pt-6 md:pt-10 border-b border-slate-200/50 lg:border-slate-100">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
                    <form onSubmit={(e) => handleSearch(e)} className="flex-1 relative">
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
                                className="w-full bg-slate-50 border border-slate-200 p-5 md:p-9 rounded-[3rem] text-lg md:text-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all pl-16 md:pl-32 pr-32 md:pr-40 shadow-sm"
                            />
                            <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Search size={18} className="text-white md:w-6 md:h-6" strokeWidth={2.5} />
                            </div>
                            <button type="submit" className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 px-6 md:px-12 py-3 md:py-5 bg-slate-900 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">Search</button>

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full mt-4 w-full bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-50">
                                    {suggestions.map((sug, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setQuery(sug.title);
                                                setShowSuggestions(false);
                                                handleSearch(undefined, sug.title);
                                            }}
                                            className="w-full px-8 py-5 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 flex items-center gap-4 group"
                                        >
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Scale size={18} /></div>
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
                        className="px-6 md:px-10 py-4 md:py-6 bg-slate-100 border border-slate-200 text-slate-700 rounded-[3rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3 justify-center shadow-sm"
                    >
                        <Library size={20} />
                        Filters
                        <ChevronDown size={16} className={clsx("transition-transform", showFilters && "rotate-180")} />
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="max-w-6xl mx-auto overflow-hidden bg-white rounded-[2rem] mt-4 border border-slate-200/50"
                        >
                            <div className="px-8 py-6 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">View Options</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowOnlySaved(!showOnlySaved)}
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-wider",
                                                showOnlySaved ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 font-black"><Star size={14} fill={showOnlySaved ? "currentColor" : "none"} /><span>Bookmarked Only</span></div>
                                            {showOnlySaved && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-8 bg-slate-100" />

                                <div className="flex flex-col md:flex-row md:items-center gap-4 grow">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Quick Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Human Rights", "Police Powers", "Land & Property", "Voting", "Family Law"].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setQuery(cat);
                                                    handleSearch(undefined, cat);
                                                    setShowFilters(false);
                                                }}
                                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold text-[10px] uppercase hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all shadow-xs"
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
            </div>

            <div className="px-6 md:px-20 py-8 md:py-12">
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
                                    className="text-center py-24 bg-slate-50 rounded-[2.5rem] border border-slate-100"
                                >
                                    <p className="text-slate-900 font-bold text-base mb-1">No constitutional matches.</p>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Adjust search filters or query</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isSearching && (
                            <div className="space-y-12">
                                {[1, 2].map(n => (
                                    <div key={n} className="h-96 bg-slate-50 rounded-[4rem] animate-pulse border border-slate-200" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
