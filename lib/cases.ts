import caseData from '@/data/cases.json';

export interface JudicialCase {
    id: string;
    title: string;
    year: string;
    court: string;
    parties: string;
    summary: string;
    law_interpretation: string;
    outcome: string;
    justification: string;
    defense_strategy?: string;
    citizen_takeaway?: string;
    nuance_note?: string;
    tags: string[];
    status: 'Closed' | 'Ongoing';
    trending?: boolean;
}

export function getAllCases(): JudicialCase[] {
    return caseData as JudicialCase[];
}

export function searchCases(query: string): JudicialCase[] {
    const term = query.toLowerCase().trim();
    if (!term) return [];

    const all = getAllCases();

    return all.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.summary.toLowerCase().includes(term) ||
        c.parties.toLowerCase().includes(term) ||
        c.tags.some(t => t.toLowerCase().includes(term)) ||
        c.year.includes(term) ||
        c.status.toLowerCase().includes(term)
    );
}

export function getCaseById(id: string): JudicialCase | undefined {
    return getAllCases().find(c => c.id === id);
}
