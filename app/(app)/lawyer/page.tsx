'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Scale,
    ShieldAlert,
    SendHorizontal,
    History,
    Zap,
    Sparkles,
    ChevronLeft,
    X,
    MessageSquare,
    Trash2
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { PanicModal } from '@/components/ui/PanicModal';
import { searchConstitution } from '@/lib/search';
import { getDeviceId } from '@/lib/id';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from 'next/link';

// --- Components ---

const MessageBubble = ({ role, content, action }: { role: 'user' | 'assistant', content: string, action?: any }) => {
    const isUser = role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={clsx(
                "flex w-full mb-8",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx(
                "max-w-[88%] md:max-w-[80%] flex flex-col",
                isUser ? "items-end" : "items-start"
            )}>
                {/* Role Badge/Icon for Assistant */}
                {!isUser && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                        <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
                            <Scale size={13} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Pocket Lawyer</span>
                    </div>
                )}

                <div className={clsx(
                    "px-6 py-4 md:px-8 md:py-6 text-sm md:text-base leading-relaxed relative",
                    isUser
                        ? "bg-slate-900 text-white rounded-[2rem] rounded-tr-lg shadow-md font-medium"
                        : "bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-slate-700 rounded-[2rem] rounded-tl-lg"
                )}>
                    {content.includes('Based on the 1992 Constitution') ? (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center">
                                        <ShieldAlert size={12} className="text-blue-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Verifiable Citation</span>
                                </div>
                                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">1992 Constitution</span>
                            </div>

                            <div className="font-bold text-slate-900 text-lg md:text-xl tracking-tight">
                                {content.split('\n\n')[0].replace('Based on the 1992 Constitution of Ghana, this relates to ', '')}
                            </div>

                            <div className="whitespace-pre-wrap text-slate-600 font-medium leading-loose">
                                {content.split('\n\n').slice(1).join('\n\n')}
                            </div>
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap font-medium leading-loose">{content}</div>
                    )}

                    {/* Action Button for AI */}
                    {!isUser && action && (
                        <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={action.onClick}
                            className="mt-6 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                        >
                            <Zap size={14} fill="currentColor" /> {action.label}
                        </motion.button>
                    )}
                </div>

                {/* Status Bar */}
                <div className={clsx(
                    "mt-2.5 px-3 flex items-center gap-1.5",
                    isUser ? "flex-row-reverse" : "flex-row"
                )}>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">
                        {isUser ? 'Verified Request' : 'Certified Response'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const LoadingBubble = () => (
    <div className="flex w-full justify-start mb-6">
        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
        </div>
    </div>
);

// --- Main Page ---

export default function PocketLawyerPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isPanicOpen, setIsPanicOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const deviceId = getDeviceId();
    const chatHistory = useQuery(api.chats.getChats, { deviceId });
    const saveChat = useMutation(api.chats.saveChat);
    const deleteChat = useMutation(api.chats.deleteChat);

    // Auto-scroll

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userQuery = input;

        const newMessages = [...messages, { id: Date.now(), role: 'user', content: userQuery }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Simulation
        setTimeout(async () => {
            const results = await searchConstitution(userQuery);
            let assistantResponse = "";
            let action = null;

            if (results && results.length > 0) {
                const top = results[0];
                assistantResponse = `Based on the 1992 Constitution of Ghana, this relates to **Article ${top.article}**: ${top.title}.\n\n${top.simplified}`;

                if (top.article === "42" || top.tags.includes('vote')) {
                    action = { label: "Test Citizenship Knowledge", onClick: () => window.location.href = '/quiz' };
                }
            } else {
                assistantResponse = "I couldn't find a direct match in the 1992 Constitution. Try searching for 'Freedom of speech' or 'Police powers'.";
            }

            const finalMessages = [...newMessages, {
                id: Date.now() + 1,
                role: 'assistant',
                content: assistantResponse,
                action
            }];

            setMessages(finalMessages);
            setIsTyping(false);

            // Sync to Convex
            await saveChat({
                messages: finalMessages,
                deviceId,
                timestamp: Date.now()
            });
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
            {/* Soft Ambient Background */}
            <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-blue-100/40 blur-[100px] -z-10 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] bg-indigo-50/60 blur-[100px] -z-10 rounded-full pointer-events-none" />

            {/* Main Content Area - Airy & Centered Column */}
            <main className="w-full max-w-4xl mx-auto flex flex-col h-full relative">

                {/* 1. Header - Clean & Minimal Sticky */}
                <header className="px-6 py-4 bg-white/40 backdrop-blur-xl border-b border-slate-200/30 flex items-center justify-between sticky top-0 z-40 h-16 md:h-24 shrink-0">
                    <div className="flex items-center gap-1">
                        <Link href="/" className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900">
                            <ChevronLeft size={20} />
                        </Link>
                        <div className="flex flex-row items-center gap-1 md:flex-col md:items-start md:gap-0">
                            <h1 className="hidden md:block text-sm md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Pocket Lawyer</h1>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 md:bg-transparent md:p-0 md:border-0 md:mt-0">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-500">GH-1992 Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsPanicOpen(true)}
                            className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                            <ShieldAlert size={12} />
                            <span className="text-[9px] font-black uppercase tracking-wider">Panic</span>
                        </button>
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                            aria-label="View History"
                            title="Chat History"
                        >
                            <History size={16} />
                        </button>
                    </div>
                </header>

                <AnimatePresence>
                    {isHistoryOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsHistoryOpen(false)}
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-xs md:max-w-md bg-white z-[60] shadow-2xl flex flex-col"
                            >
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-xl tracking-tight">Legal History</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your cloud-synced sessions</p>
                                    </div>
                                    <button onClick={() => setIsHistoryOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatHistory === undefined ? (
                                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full mb-4" />
                                            <div className="h-2 w-24 bg-slate-50 rounded-full" />
                                        </div>
                                    ) : chatHistory.length === 0 ? (
                                        <div className="text-center py-20 px-10">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl mx-auto mb-4 flex items-center justify-center text-slate-300">
                                                <History size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">No session history yet.</p>
                                        </div>
                                    ) : (
                                        chatHistory.map((session: any) => (
                                            <div key={session._id} className="group relative">
                                                <button
                                                    onClick={() => {
                                                        setMessages(session.messages);
                                                        setIsHistoryOpen(false);
                                                    }}
                                                    className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-start gap-4"
                                                >
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                                                        <MessageSquare size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-black text-slate-900 text-xs truncate uppercase tracking-tight mb-1">
                                                            {session.messages[0]?.content || 'Empty Session'}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400">
                                                            {new Date(session.timestamp).toLocaleDateString()} • {session.messages.length} messages
                                                        </p>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Delete this session?')) {
                                                            await deleteChat({ id: session._id });
                                                        }
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-6 border-t border-slate-100">
                                    <button
                                        onClick={() => {
                                            setMessages([]);
                                            setIsHistoryOpen(false);
                                        }}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                                    >
                                        <Zap size={14} fill="currentColor" /> Start New Session
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* 2. Scrollable Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto w-full px-6 pt-10 pb-12 scroll-smooth"
                >
                    {messages.length === 0 ? (
                        // Empty State
                        <div className="h-full flex flex-col items-center justify-center text-center px-6 py-4 animate-in fade-in zoom-in duration-500 overflow-y-auto">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl shadow-sm mb-4 md:mb-6 flex items-center justify-center -rotate-3 border border-slate-100 shrink-0">
                                <Scale size={24} className="text-slate-900 md:size-[28px]" />
                            </div>
                            <h2 className="text-lg md:text-2xl font-black text-slate-900 mb-1 md:mb-2 tracking-tight">How can I help you?</h2>
                            <p className="text-slate-400 text-[13px] md:text-sm max-w-xs mx-auto mb-6 md:mb-8 font-medium leading-relaxed">
                                Ask me anything about your rights under the 1992 Constitution of Ghana.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-sm">
                                {[
                                    "Can police search my phone?",
                                    "What are my voting rights?",
                                    "Is peaceful protest legal?",
                                    "Land ownership laws"
                                ].map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(q)}
                                        title={`Ask ${q}`}
                                        className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-600 text-left transition-all hover:shadow-sm active:scale-95"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Messages
                        <div className="space-y-4 md:space-y-6 pb-4">
                            {messages.map((msg) => (
                                <MessageBubble key={msg.id} {...msg} />
                            ))}
                            {isTyping && <LoadingBubble />}
                        </div>
                    )}
                </div>

                {/* 3. Input Bar - Modern Floating Style */}
                <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent p-4 md:p-12 z-40">
                    <div className="w-full relative group">
                        <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="bg-slate-50 border border-slate-200 p-1.5 md:p-2 pl-4 md:pl-6 rounded-[2rem] flex items-center gap-2 shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your legal question..."
                                className="flex-1 bg-transparent text-sm md:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none py-2 md:py-2.5"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                aria-label="Send Message"
                                title="Send Message"
                                className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
                            >
                                <SendHorizontal size={18} className="ml-0.5" />
                            </button>
                        </div>

                        <p className="text-center mt-2.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest hidden md:block">
                            Private & Encrypted • AI Generated
                        </p>
                    </div>
                </div>
            </main>

            <PanicModal isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />
        </div>
    );
}
