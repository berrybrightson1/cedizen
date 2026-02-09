import Dexie, { type Table } from 'dexie';

export interface ChatMessage {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface CivicStats {
    id?: number;
    score: number;
    level: number;
    lastPlayed: number;
}

export class CedizenDB extends Dexie {
    messages!: Table<ChatMessage>;
    stats!: Table<CivicStats>;

    constructor() {
        super('CedizenDB');
        this.version(1).stores({
            messages: '++id, role, timestamp',
            stats: '++id, lastPlayed'
        });
    }
}

export const db = new CedizenDB();
