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

export async function searchConstitution(query: string): Promise<LegalArticle[]> {
    if (!searchIndex) await initSearch();
    if (!articlesData.length) return [];

    // 1. Try FlexSearch first
    let results: LegalArticle[] = [];
    if (searchIndex) {
        const rawResults = searchIndex.search(query, { limit: 5 });
        if (rawResults && Array.isArray(rawResults)) {
            results = rawResults.map((idx: any) => {
                const numericIdx = typeof idx === 'string' ? parseInt(idx, 10) : idx;
                return articlesData[numericIdx];
            }).filter(Boolean);
        }
    }

    // 2. Fallback: Keyword Scoring if valid results are sparse
    if (results.length === 0) {
        const keywords = query.toLowerCase()
            .replace(/[^\w\s]|_/g, "") // Remove punctuation
            .replace(/\s+/g, " ")
            .split(' ')
            .filter(w => w.length > 2 && !STOP_WORDS.has(w));

        if (keywords.length > 0) {
            const scored = articlesData.map(article => {
                let score = 0;
                const searchString = `${article.title} ${article.simplified || ''} ${article.content} ${(article.tags || []).join(' ')}`.toLowerCase();

                keywords.forEach(word => {
                    // Exact word match bonus
                    if (searchString.includes(word)) score += 1;

                    // Specific field bonuses
                    if (article.title.toLowerCase().includes(word)) score += 3;
                    if ((article.tags || []).some(t => t.toLowerCase() === word)) score += 4;
                    if ((article.tags || []).some(t => t.toLowerCase().includes(word))) score += 2;
                });

                return { article, score };
            });

            // Filter for relevance > 0 and sort
            results = scored
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.article)
                .slice(0, 3);
        }
    }

    return results;
}

export function getAllArticles(): LegalArticle[] {
    return articlesData;
}
