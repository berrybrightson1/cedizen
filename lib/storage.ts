'use client';

const SAVED_KEY = 'cedizen_saved_articles';
const HISTORY_KEY = 'cedizen_history';

export function getSavedArticles(): string[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(SAVED_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function toggleSavedArticle(id: string): string[] {
    const saved = getSavedArticles();
    const index = saved.indexOf(id);
    if (index > -1) {
        saved.splice(index, 1);
    } else {
        saved.push(id);
    }
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    return saved;
}

export function addToHistory(id: string) {
    if (typeof window === 'undefined') return;
    const history = getHistory();
    // Move to front if exists, limit to 5
    const filtered = history.filter(item => item !== id);
    const updated = [id, ...filtered].slice(0, 5);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

// --- Interactive Data Layer ---

export type VoteType = 'stay' | 'go';

export interface VoteRecord {
    id: string;
    articleId: string;
    type: VoteType;
    comment: string;
    userAlias: string; // e.g., "Citizen #8291"
    timestamp: number;
}

const VOTES_KEY = 'cedizen_votes'; // User's own votes (map)
const PUBLIC_VOTES_KEY = 'cedizen_public_votes'; // Feed of all votes

export function getVotes(): Record<string, VoteType> {
    if (typeof window === 'undefined') return {};
    const votes = localStorage.getItem(VOTES_KEY);
    return votes ? JSON.parse(votes) : {};
}

// Save user's local vote state
export function saveVote(articleId: string, type: VoteType) {
    if (typeof window === 'undefined') return;
    const votes = getVotes();
    votes[articleId] = type;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

// Get the feed of public votes
export function getAllPublicVotes(): VoteRecord[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(PUBLIC_VOTES_KEY);
    if (!stored) {
        return [];
    }
    return JSON.parse(stored);
}

// Add a new vote to the public feed
export function savePublicVote(record: Omit<VoteRecord, 'id' | 'timestamp' | 'userAlias'>) {
    if (typeof window === 'undefined') return;
    const current = getAllPublicVotes();

    const newRecord: VoteRecord = {
        ...record,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        userAlias: `Citizen #${Math.floor(1000 + Math.random() * 9000)}`
    };

    const updated = [newRecord, ...current].slice(0, 50); // Keep last 50
    localStorage.setItem(PUBLIC_VOTES_KEY, JSON.stringify(updated));
    return newRecord;
}

export function getVoteStats(articleId: string) {
    const votes = getAllPublicVotes();
    const articleVotes = votes.filter(v => v.articleId === articleId);
    const total = articleVotes.length;
    if (total === 0) return { stay: 0, go: 0, total: 0, stayPercent: 0, goPercent: 0 };

    const stay = articleVotes.filter(v => v.type === 'stay').length;
    const go = articleVotes.filter(v => v.type === 'go').length;

    return {
        stay,
        go,
        total,
        stayPercent: Math.round((stay / total) * 100),
        goPercent: Math.round((go / total) * 100)
    };
}

// --- Reactions (Like, Dislike, Maybe) ---

const REACTIONS_KEY = 'cedizen_reactions'; // User's local reactions { voteId: 'like'|'dislike'|'maybe' }

export function getUserInteractions(): Record<string, 'like' | 'dislike' | 'maybe'> {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(REACTIONS_KEY);
    return stored ? JSON.parse(stored) : {};
}

export function saveInteraction(voteId: string, type: 'like' | 'dislike' | 'maybe') {
    if (typeof window === 'undefined') return;
    const current = getUserInteractions();
    current[voteId] = type;
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(current));
    return current;
}

// key: voteId, value: { like: 12, dislike: 4, maybe: 2 }
const REACTION_STATS_KEY = 'cedizen_reaction_stats';

export function getInteractionStats(voteId: string) {
    if (typeof window === 'undefined') return { like: 0, dislike: 0, maybe: 0 };

    // In a real app, we'd fetch from server. Here we'll simulate or retrieve local cache.
    // To make it look "alive", we'll generate consistent random numbers based on voteId if not set.
    const stored = localStorage.getItem(REACTIONS_KEY + '_stats_' + voteId);

    if (stored) return JSON.parse(stored);

    return { like: 0, dislike: 0, maybe: 0 };
}

export function incrementInteractionStats(voteId: string, type: 'like' | 'dislike' | 'maybe') {
    const stats = getInteractionStats(voteId);
    stats[type]++;
    localStorage.setItem(REACTIONS_KEY + '_stats_' + voteId, JSON.stringify(stats));
    return stats;
}
