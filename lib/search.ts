import FlexSearch from 'flexsearch';

export interface LegalArticle {
    id: string;
    article: string;
    title: string;
    content: string;
    simplified?: string; // Simple English breakdown
    tags: string[];
}

let searchIndex: any = null;
let articlesData: LegalArticle[] = [];

export async function initSearch() {
    if (searchIndex) return;

    try {
        const response = await fetch('/data/constitution.json');
        articlesData = await response.json();

        searchIndex = new (FlexSearch as any).Index({
            tokenize: 'full',
            resolution: 9,
            cache: true,
        });

        articlesData.forEach((article, i) => {
            // Index important fields more heavily by repeating labels
            const searchString = `${article.title} ${article.article} ${article.content} ${article.simplified || ''} ${(article.tags || []).join(' ')} ${article.tags.map(t => t + ' ' + t).join(' ')}`;
            searchIndex.add(i, searchString);
        });
        return articlesData;
    } catch (err) {
        console.error("Search init failed:", err);
        return [];
    }
}

const STOP_WORDS = new Set([
    'the', 'is', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'down',
    'if', 'can', 'cant', 'cannot', 'could', 'would', 'should', 'will', 'shall', 'may', 'might', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'no', 'not', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your',
    'his', 'her', 'its', 'their', 'this', 'that', 'these', 'those', 'who', 'whom', 'whose', 'which', 'what', 'where',
    'when', 'why', 'how', 'all', 'any', 'some', 'one', 'just', 'like', 'note', 'please', 'try', 'keywords', 'question',
    'year', 'years', 'old'
]);

const SYNONYMS: Record<string, string[]> = {
    'protest': ['demo', 'demonstration', 'march', 'procession', 'rally', 'gather', 'gathering'],
    'police': ['officer', 'arrest', 'handcuff', 'jail', 'cell', 'detain'],
    'phone': ['mobile', 'cellphone', 'device', 'messages', 'calls', 'whatsapp'],
    'money': ['pay', 'salary', 'compensation', 'bribe', 'fraud'],
    'church': ['religion', 'worship', 'faith', 'belief', 'pastor'],
    'land': ['property', 'house', 'building', 'home', 'evict'],
};

export async function searchConstitution(query: string): Promise<LegalArticle[]> {
    if (!searchIndex) await initSearch();
    if (!articlesData.length) return [];

    const lowerQuery = query.toLowerCase();

    // 1. Try FlexSearch first
    let results: LegalArticle[] = [];
    if (searchIndex) {
        const rawResults = searchIndex.search(lowerQuery, { limit: 5 });
        if (rawResults && Array.isArray(rawResults)) {
            results = rawResults.map((idx: any) => {
                const numericIdx = typeof idx === 'string' ? parseInt(idx, 10) : idx;
                return articlesData[numericIdx];
            }).filter(Boolean);
        }
    }

    // 2. Keyword Scoring + Synonym Expansion
    const rawKeywords = lowerQuery
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .split(' ')
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    // Expand keywords with synonyms and lightweight stemming
    const expandedKeywords = [...rawKeywords];
    rawKeywords.forEach(word => {
        // Simple stemming for common suffixes
        if (word.endsWith('ing') && word.length > 5) expandedKeywords.push(word.slice(0, -3));
        if (word.endsWith('s') && word.length > 3) expandedKeywords.push(word.slice(0, -1));
        if (word.endsWith('ies') && word.length > 4) expandedKeywords.push(word.slice(0, -3) + 'y');

        if (SYNONYMS[word]) {
            expandedKeywords.push(...SYNONYMS[word]);
        }
        // Reverse synonym check
        Object.keys(SYNONYMS).forEach(key => {
            if (SYNONYMS[key].includes(word)) {
                expandedKeywords.push(key);
            }
        });
    });

    const uniqueKeywords = Array.from(new Set(expandedKeywords));

    if (uniqueKeywords.length > 0) {
        const scored = articlesData.map(article => {
            let score = 0;
            const searchString = `${article.title} ${article.simplified || ''} ${article.content} ${(article.tags || []).join(' ')}`.toLowerCase();

            uniqueKeywords.forEach(word => {
                // Exact word match bonus 
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                if (regex.test(searchString)) score += 3;

                // Title bonus
                if (article.title.toLowerCase().includes(word)) score += 5;

                // Tag bonus - Highest Priority
                if ((article.tags || []).some(t => t.toLowerCase() === word)) score += 10;

                // Partial match fallback
                if (searchString.includes(word)) score += 1;
            });

            return { article, score };
        });

        // Combine and prioritize
        const scoredResults = scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.article);

        // Merge FlexSearch results and Scored results
        const combined = Array.from(new Set([...results, ...scoredResults])).slice(0, 5);
        results = combined;
    }

    return results;
}

export function getAllArticles(): LegalArticle[] {
    return articlesData;
}
