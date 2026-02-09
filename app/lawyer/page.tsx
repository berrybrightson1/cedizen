'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Scale,
    ShieldAlert,
    SendHorizontal,
    History,
    User,
    Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { PanicModal } from '@/components/ui/PanicModal';
import { searchConstitution } from '@/lib/search';

const MessageContent = ({ content, action }: { content: string, action?: { label: string, onClick: () => void } }) => {
    if (content.includes('Based on the 1992 Constitution')) {
        const parts = content.split('\n\n');
        const titlePart = parts[0] || "";
        const legalPart = parts.find((p: string) => p.startsWith('**Legal Position:**'))?.replace('**Legal Position:**', '').trim() || "";
        const simplePart = parts.find((p: string) => p.startsWith('**Simplified Guidance:**'))?.replace('**Simplified Guidance:**', '').trim() || "";

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        Official Clause
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GH-1992 Charter</span>
                </div>

                <div className="space-y-8">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        {titlePart.replace('Based on the 1992 Constitution of Ghana, this relates to ', '')}
                    </h4>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative overflow-hidden group">
                        <div className="flex items-center gap-2 mb-3 text-slate-400">
                            <Scale size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Legal Text</span>
                        </div>
                        <p className="text-slate-600 font-serif leading-relaxed italic relative z-10 text-lg">
                            "{legalPart}"
                        </p>
                    </div>

                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-3 text-blue-600">
                            <Zap size={14} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Plain English</span>
                        </div>
                        <p className="text-slate-900 font-bold text-lg leading-relaxed relative z-10">
                            {simplePart}
                        </p>
                    </div>

                    {action && (
                        <button
                            onClick={action.onClick}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            <Zap size={14} className="text-blue-400 fill-blue-400" /> {action.label}
                        </button>
                    )}
                </div>
            </div>
        );
    }
    return <>{content}</>;
};

export default function PocketLawyerPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isPanicOpen, setIsPanicOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    // Router for redirection
    const router = typeof window !== 'undefined' ? (window as any).next?.router : null;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userQuery = input;
        const newMsg = { id: Date.now(), role: 'user', content: userQuery };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        // Strict Constitutional Search
        setTimeout(async () => {
            const results = await searchConstitution(userQuery);

            let assistantResponse = "";
            let action = null;

            if (results && results.length > 0) {
                const top = results[0];
                assistantResponse = `Based on the 1992 Constitution of Ghana, this relates to **Article ${top.article}**: ${top.title}.\n\n**Legal Position:** ${top.content}\n\n**Simplified Guidance:** ${top.simplified}`;

                // Smart Redirection Logic
                if (top.article === "42" || top.tags.includes('vote')) {
                    action = { label: "Test Your Citizenship Knowledge", onClick: () => window.location.href = '/quiz' };
                } else if (top.tags.includes('court') || top.tags.includes('crime')) {
                    action = { label: "Search Related Cases", onClick: () => window.location.href = '/library' };
                }
            } else {
                assistantResponse = "I couldn't find a direct constitutional provision matching your query. Please try keywords like 'Police', 'Property', 'Education', or 'Equality'. Note: I only answer strictly from the 1992 Constitution.";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: assistantResponse,
                action
            }]);
            setIsTyping(false);
        }, 800);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50/50 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 blur-[120px] -z-10 rounded-full mix-blend-multiply opacity-70" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/50 blur-[120px] -z-10 rounded-full mix-blend-multiply opacity-70" />

            {/* Header Area */}
            <header className="px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between flex-shrink-0 z-20 sticky top-0">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-[1rem] flex items-center justify-center shadow-lg transform rotate-3">
                        <Scale size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Pocket Lawyer</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">GH-1992 Protocol Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPanicOpen(true)}
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 border border-red-100 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-500/10 group"
                    >
                        <ShieldAlert size={16} className="group-hover:animate-pulse" /> Urgent Protection
                    </button>
                    <button
                        title="View Search History"
                        className="hidden md:flex bg-white text-slate-500 p-3 rounded-xl hover:text-slate-900 hover:shadow-md transition-all border border-slate-200"
                    >
                        <History size={18} />
                    </button>
                </div>
            </header>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-20"
                    >
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center mb-8 mx-auto transform hover:scale-110 transition-transform duration-500">
                            <Scale size={40} className="text-slate-900" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">Constitutional<br />Guidance</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-12 text-lg">
                            Consult the Charter. Our engine provides strictly verified citations from the 1992 Constitution of Ghana.
                        </p>
                        <div className="grid grid-cols-1 gap-3 w-full max-w-sm mx-auto">
                            {["Can the police search my phone?", "Land compensation rights", "Right to join a Union"].map((q) => (
                                <button key={q} onClick={() => setInput(q)} className="bg-white border border-slate-200 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:shadow-md transition-all text-center">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={clsx(
                                    "flex gap-4 max-w-3xl",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md",
                                    msg.role === 'user' ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-100"
                                )}>
                                    {msg.role === 'user' ? <User size={18} /> : <Zap size={18} fill="currentColor" />}
                                </div>

                                <div className={clsx(
                                    "p-8 rounded-[2rem] text-base leading-relaxed shadow-sm whitespace-pre-wrap w-full",
                                    msg.role === 'user'
                                        ? "bg-slate-900 text-white rounded-tr-none font-medium text-lg shadow-xl shadow-slate-900/10"
                                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-none font-medium shadow-xl shadow-slate-200/50"
                                )}>
                                    <MessageContent content={msg.content} action={msg.action} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 ml-14">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 inline-flex items-center gap-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-10 pt-0 relative z-20">
                <div className="relative group max-w-4xl mx-auto shadow-2xl rounded-[3rem]">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-amber-100 blur opacity-20 group-focus-within:opacity-50 transition duration-500 rounded-[3rem]" />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Search the 1992 Constitution..."
                        className="w-full bg-white border border-slate-200 py-6 pl-8 md:pl-10 pr-24 rounded-[3rem] text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 transition-all relative z-10"
                    />
                    <button
                        onClick={handleSend}
                        aria-label="Send Message"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white w-12 h-12 rounded-full hover:bg-slate-800 flex items-center justify-center transition-all active:scale-90 shadow-lg z-20"
                    >
                        <SendHorizontal size={20} />
                    </button>
                </div>
                <p className="text-center mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Encrypted Search • Private & Secure
                </p>
            </div>

            <PanicModal isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />
        </div>
    );
}
