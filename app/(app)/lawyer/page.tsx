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
    Info,
    Calendar,
    MessageSquare,
    Trash2,
    Gavel,
    ShieldCheck,
    Briefcase,
    FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { PanicModal } from '@/components/ui/PanicModal';
import { searchConstitution } from '@/lib/search';
import { getDeviceId } from '@/lib/id';
import { searchCases, getCaseById } from '@/lib/cases';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// --- Components ---

const MessageBubble = ({ role, content, action }: { role: 'user' | 'assistant', content: string, action?: { label: string, onClick?: () => void, href?: string } }) => {
    const isUser = role === 'user';

    const handleAction = () => {
        if (action?.onClick) {
            action.onClick();
        } else if (action?.href === 'back') {
            window.history.back();
        } else if (action?.href) {
            window.location.href = action.href;
        }
    };

    // Helper to parse structured legal content
    const parseLegalContent = (text: string) => {
        const sections = {
            outcome: text.match(/\*\*Legal Outcome:\*\*\s*([^\n]+)/)?.[1],
            application: text.match(/\*\*Law Application:\*\*\s*([^\n]+)/)?.[1] || text.match(/\*\*Constitutional Basis:\*\*\s*([^\n]+)/)?.[1],
            defense: text.match(/\*\*Defense Strategy:\*\*\s*([^\n]+)/)?.[1],
            impact: text.match(/\*\*Citizen Impact:\*\*\s*([^\n]+)/)?.[1],
            context: text.match(/\*\*Simplified Context:\*\*\s*([^\n]+)/)?.[1],
            nuance: text.match(/\*\*Expert Nuance:\*\*\s*([^\n]+)/)?.[1],
            summary: text.match(/\*\*Court Summary:\*\*\s*([^\n]+)/)?.[1] || text.split('\n\n').find(p => !p.includes(':'))
        };
        const titleMatch = text.match(/\*\*(Article [^*]+ Consultation)\*\*/i) || text.match(/\*\*([^*]+)\*\*/);
        const title = titleMatch?.[1];

        // Mark as structured if it contains standard legal headers
        const hasStructure = !!(sections.outcome || sections.defense || sections.application || sections.context);

        return { ...sections, title, hasStructure };
    };

    const legalData = !isUser ? parseLegalContent(content) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={clsx(
                "flex w-full mb-10",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx(
                "max-w-[92%] md:max-w-[85%] flex flex-col",
                isUser ? "items-end" : "items-start"
            )}>
                {/* Role Badge */}
                {!isUser && (
                    <div className="flex items-center gap-2 mb-3 ml-1">
                        <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
                            <Scale size={13} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Pocket Lawyer AI</span>
                    </div>
                )}

                <div className={clsx(
                    "relative overflow-hidden transition-all",
                    isUser
                        ? "bg-slate-900 text-white rounded-[1.5rem] rounded-tr-lg px-6 py-4 shadow-md font-medium text-sm md:text-base"
                        : "bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] rounded-tl-lg p-0.5"
                )}>
                    {isUser ? (
                        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
                    ) : legalData?.hasStructure ? (
                        <div className="flex flex-col">
                            {/* Header Section */}
                            <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100/50">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <Sparkles size={14} className="text-blue-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Legal Analysis</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                    {legalData.title || "Consultation Response"}
                                </h3>
                            </div>

                            {/* Main Content Sections */}
                            <div className="p-6 md:p-8 space-y-8">
                                {/* Law Application / Basis */}
                                {legalData.application && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Law Application</span>
                                        </div>
                                        <p className="text-sm md:text-base font-medium text-slate-600 leading-relaxed">
                                            {legalData.application}
                                        </p>
                                    </div>
                                )}

                                {/* Simplified Context - STOOD OUT */}
                                {legalData.context && (
                                    <div className="bg-blue-50/50 border border-blue-100/50 p-6 rounded-3xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles size={16} className="text-blue-600" fill="currentColor" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Simplified Translation</span>
                                        </div>
                                        <p className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                                            {legalData.context}
                                        </p>
                                    </div>
                                )}

                                {/* Outcome or Defense Strategy */}
                                {(legalData.outcome || legalData.defense) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {legalData.outcome && (
                                            <div className="bg-emerald-50/30 border border-emerald-100/30 p-5 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Gavel size={14} className="text-emerald-600" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Court Outcome</span>
                                                </div>
                                                <p className="text-xs md:text-sm font-bold text-slate-900 leading-relaxed italic">
                                                    "{legalData.outcome}"
                                                </p>
                                            </div>
                                        )}
                                        {legalData.defense && (
                                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ShieldCheck size={14} className="text-blue-600" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">Defense Strategy</span>
                                                </div>
                                                <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed">
                                                    {legalData.defense}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Additional Insights */}
                                {(legalData.impact || legalData.nuance) && (
                                    <div className="pt-4 border-t border-slate-100 space-y-4">
                                        {legalData.impact && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 shrink-0 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600">
                                                    <Zap size={14} fill="currentColor" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Your Interest</span>
                                                    <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed">{legalData.impact}</p>
                                                </div>
                                            </div>
                                        )}
                                        {legalData.nuance && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 shrink-0 bg-amber-600/10 rounded-lg flex items-center justify-center text-amber-600">
                                                    <Info size={14} />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Critical Note</span>
                                                    <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed">{legalData.nuance}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Action Button Section */}
                            {action && (
                                <div className="p-6 md:p-8 pt-0">
                                    <button
                                        onClick={handleAction}
                                        className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 uppercase tracking-[0.1em]"
                                    >
                                        {action.href === 'back' ? <ChevronLeft size={16} /> : <Zap size={14} fill="currentColor" />}
                                        {action.label}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="px-6 py-5 md:px-8 md:py-6">
                            <div className="whitespace-pre-wrap font-medium leading-relaxed text-sm md:text-base text-slate-700">{content}</div>
                            {action && (
                                <button
                                    onClick={handleAction}
                                    className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10 uppercase tracking-widest"
                                >
                                    <Zap size={12} fill="currentColor" /> {action.label}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                {!isUser && (
                    <div className="mt-3 px-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                            Certified 1992 Legal Data
                        </span>
                    </div>
                )}
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

// --- Content Component ---

const SUGGESTIONS = [
    "Can police search my phone?",
    "What are my voting rights?",
    "Is peaceful protest legal?",
    "Land ownership laws",
    "Right to legal counsel",
    "Freedom of speech limits",
    "How to report corruption?",
    "Powers of the President",
    "Rights of the accused",
    "Environmental protection laws",
    "Gender equality rights",
    "Chieftaincy and the law"
];

function PocketLawyerContent() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [randomSuggestions, setRandomSuggestions] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPanicOpen, setIsPanicOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const caseId = searchParams.get('case');

    const deviceId = getDeviceId();
    const chatHistory = useQuery(api.chats.getChats, { deviceId });
    const saveChat = useMutation(api.chats.saveChat);
    const deleteChat = useMutation(api.chats.deleteChat);

    // Handle deep linking for case consultation
    useEffect(() => {
        if (caseId && messages.length === 0) {
            const linkedCase = getCaseById(caseId);
            if (linkedCase) {
                let initialContent = `**Legal Consultation:** ${linkedCase.title} (${linkedCase.year}).\n\n**Legal Outcome:** ${linkedCase.outcome}\n\n**Law Application:** ${linkedCase.law_interpretation}\n\n**Defense Strategy:** ${linkedCase.defense_strategy || 'The defense in this case focused on procedural fairness and constitutional supremacy.'}`;

                if (linkedCase.citizen_takeaway) {
                    initialContent += `\n\n**Citizen Impact:** ${linkedCase.citizen_takeaway}`;
                }

                if (linkedCase.nuance_note) {
                    initialContent += `\n\n**Expert Nuance:** ${linkedCase.nuance_note}`;
                }

                initialContent += `\n\n**Court Summary:** ${linkedCase.summary}`;

                const initialMessage = {
                    id: Date.now(),
                    role: 'assistant',
                    content: initialContent,
                    action: {
                        label: "Back to Archive",
                        href: "back"
                    }
                };
                setMessages([initialMessage]);

                // Also save to cloud history immediately - NO FUNCTIONS IN ACTION
                saveChat({
                    messages: [initialMessage],
                    deviceId,
                    timestamp: Date.now()
                });
            }
        }
    }, [caseId, messages.length, saveChat, deviceId]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Randomize suggestions on mount
    useEffect(() => {
        const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
        setRandomSuggestions(shuffled.slice(0, 4));
    }, []);

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
            const caseResults = searchCases(userQuery);

            let assistantResponse = "";
            let action = null;

            if (caseResults.length > 0) {
                const topCase = caseResults[0];
                assistantResponse = `**Legal Consultation:** ${topCase.title} (${topCase.year}).\n\n**Legal Outcome:** ${topCase.outcome}\n\n**Defense Strategy:** ${topCase.defense_strategy || 'No specific defense noted for this landmark case.'}\n\n**Law Application:** ${topCase.justification}\n\n**Court Summary:** ${topCase.summary}`;

                if (results.length > 0) {
                    assistantResponse += `\n\n**Constitutional Basis:** Backed by Article ${results[0].article} of the 1992 Constitution.`;
                }
            } else if (results && results.length > 0) {
                const top = results[0];
                assistantResponse = `**Article ${top.article} Consultation**\n\n**Law Application:** ${top.content}\n\n**Simplified Context:** ${top.simplified}`;

                if (top.article === "42" || top.tags.includes('vote')) {
                    action = { label: "Test Citizenship Knowledge", href: '/quiz' };
                }
            } else {
                assistantResponse = "I couldn't find a direct match in the 1992 Constitution or the Judicial Archive. Try searching for 'Freedom of speech' or 'Police powers'.";
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
            <main className="w-full flex flex-col h-full relative">

                {/* 1. Header - Flush & Minimal Sticky */}
                <header className="px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between sticky top-0 z-40 h-16 md:h-20 shrink-0">
                    <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
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
                                    <button
                                        onClick={() => setIsHistoryOpen(false)}
                                        title="Close History Panel"
                                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                    >
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
                                                    title="Delete History Session"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center"
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
                    className="flex-1 overflow-y-auto w-full scroll-smooth"
                >
                    <div className="max-w-4xl mx-auto px-6 pt-10 pb-12">
                        {messages.length === 0 ? (
                            // Empty State
                            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-4 animate-in fade-in zoom-in duration-500">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl shadow-sm mb-4 md:mb-6 flex items-center justify-center -rotate-3 border border-slate-100 shrink-0">
                                    <Scale size={24} className="text-slate-900 md:size-[28px]" />
                                </div>
                                <h2 className="text-lg md:text-2xl font-black text-slate-900 mb-1 md:mb-2 tracking-tight">How can I help you?</h2>
                                <p className="text-slate-400 text-[13px] md:text-sm max-w-xs mx-auto mb-6 md:mb-8 font-medium leading-relaxed">
                                    Ask me anything about your rights under the 1992 Constitution of Ghana.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-sm">
                                    {randomSuggestions.map((q, i) => (
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
                </div>

                {/* 3. Input Bar - Modern Floating Style */}
                <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent p-4 md:pb-12 z-40">
                    <div className="max-w-4xl mx-auto w-full relative group">
                        <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="bg-slate-50 border border-slate-200 p-1.5 md:p-2 pl-4 md:pl-6 rounded-[2rem] flex items-center gap-2 shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your legal question..."
                                className="flex-1 bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none py-2 md:py-2.5"
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

// --- Export with Suspense ---

export default function PocketLawyerPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center animate-pulse">
                    <Scale size={24} className="text-slate-300" />
                </div>
            </div>
        }>
            <PocketLawyerContent />
        </Suspense>
    );
}
