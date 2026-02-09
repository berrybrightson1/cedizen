'use client';

import React, { useState, useEffect } from 'react';
import {
    Check,
    X,
    Award,
    Trophy,
    History,
    Info,
    ShieldCheck,
    Flag,
    ChevronRight,
    Zap,
    Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const ALL_SCENARIOS = [
    {
        text: "The Police demand to search your bag without a warrant or probable cause.",
        correct: false,
        article: "Article 18(2)",
        explanation: "Every person has a right to privacy of their property and correspondence except in accordance with law."
    },
    {
        text: "A citizen is detained for 24 hours without being informed of the reasons for their arrest.",
        correct: false,
        article: "Article 14(2)",
        explanation: "Any person who is arrested shall be informed immediately, in a language he understands, of the reasons for his arrest."
    },
    {
        text: "The High Court orders the release of a person who has been unlawfully detained.",
        correct: true,
        article: "Article 33(1)",
        explanation: "The High Court has the power to issue orders for the enforcement of fundamental human rights."
    },
    {
        text: "A 15-year old child is forced into a marriage by their family elders.",
        correct: false,
        article: "Article 28(1)(b)",
        explanation: "Children have a right to special care and protection, and harmful traditional practices are restricted."
    },
    {
        text: "The President declares a state of emergency without consulting the Council of State.",
        correct: false,
        article: "Article 31(1)",
        explanation: "The President must act in accordance with the advice of the Council of State to declare an emergency."
    },
    {
        text: "A citizen is denied the right to join a political party of their choice.",
        correct: false,
        article: "Article 21(1)(g)",
        explanation: "Every person shall have the right to freedom of assembly including freedom to take part in political and social activities."
    },
    {
        text: "The Electoral Commission denies a qualified citizen the right to register to vote.",
        correct: false,
        article: "Article 42",
        explanation: "Every citizen of 18 years or above and of sound mind has the right to vote and register."
    },
    {
        text: "A person is tried twice for the same criminal offense they were already acquitted of.",
        correct: false,
        article: "Article 19(7)",
        explanation: "No person who has been convicted or acquitted shall again be tried for that offence (Double Jeopardy)."
    },
    {
        text: "A journalist is arrested for expressing a critical opinion about the government.",
        correct: false,
        article: "Article 162(1)",
        explanation: "Freedom and independence of the media are hereby guaranteed."
    },
    {
        text: "The government seizes private land for public use and pays prompt, fair compensation.",
        correct: true,
        article: "Article 20(2)(a)",
        explanation: "Compulsory acquisition of property by the State is valid only with prompt, fair, and adequate compensation."
    },
    // --- Phase 2 Expansion ---
    {
        text: "An employer refuses to pay a worker because they are from a different ethnic tribe.",
        correct: false,
        article: "Article 17(2)",
        explanation: "Discrimination on grounds of ethnic origin, gender, religion, or social status is prohibited."
    },
    {
        text: "A school refuses admission to a student solely because of their religious beliefs.",
        correct: false,
        article: "Article 25(1)",
        explanation: "All persons shall have the right to equal educational opportunities."
    },
    {
        text: "A person living with a disability is denied entry to a public building because of their wheelchair.",
        correct: false,
        article: "Article 29(4)",
        explanation: "Disabled persons shall be protected against all exploitation and discriminatory treatment."
    },
    {
        text: "A family performs a ritual that causes physical injury to a young woman, claiming it is 'tradition'.",
        correct: false,
        article: "Article 26(2)",
        explanation: "All customary practices which dehumanise or are injurious to well-being are prohibited."
    },
    {
        text: "A citizen refuses to help the police identify a person they saw committing a violent crime.",
        correct: false,
        article: "Article 41(k)",
        explanation: "It is the duty of every citizen to cooperate with lawful agencies in the maintenance of law and order."
    },
    {
        text: "A landlord enters a tenant's room without notice or a legal emergency to check the 'condition'.",
        correct: false,
        article: "Article 18(2)",
        explanation: "The right to privacy extends to the home and premises."
    },
    {
        text: "The State provides free adult literacy programs for citizens who missed formal schooling.",
        correct: true,
        article: "Article 25(1)(d)",
        explanation: "The State is encouraged to provide functional literacy as part of educational rights."
    },
    {
        text: "A person is arrested and forced to confess to a crime through physical beating.",
        correct: false,
        article: "Article 15(2)(a)",
        explanation: "No person shall be subjected to torture or cruel treatment, even if arrested."
    },
    {
        text: "A woman is denied a promotion at work purely because her boss says 'men are better leaders'.",
        correct: false,
        article: "Article 17(2)",
        explanation: "Gender-based discrimination is a direct violation of constitutional equality."
    },
    {
        text: "A citizen organizes a peaceful protest in the city square to demand better roads.",
        correct: true,
        article: "Article 21(1)(d)",
        explanation: "Freedom of assembly and freedom to manifest grievance through procession is a right."
    },
    {
        text: "A suspect is held for 72 hours without being brought before a court of law.",
        correct: false,
        article: "Article 14(3)(b)",
        explanation: "Any person arrested must be brought before a court within forty-eight hours."
    },
    {
        text: "The government passes a law that applies a new punishment to a crime committed one year ago.",
        correct: false,
        article: "Article 19(5)",
        explanation: "No person shall be charged with an offense that was not an offense at the time it was committed."
    },
    {
        text: "A person is denied the right to marry someone because of their economic class.",
        correct: false,
        article: "Article 17(2)",
        explanation: "Discrimination based on social or economic status is unconstitutional."
    },
    {
        text: "A worker joins a Trade Union to negotiate for a safer working environment.",
        correct: true,
        article: "Article 24(3)",
        explanation: "Every worker has the right to form or join a trade union for their protection."
    },
    {
        text: "A citizen pays their income tax to the Ghana Revenue Authority as required by law.",
        correct: true,
        article: "Article 41(g)",
        explanation: "It is the duty of every citizen to contribute to the public funds by paying taxes."
    }
];

export default function QuizPage() {
    const [scenarios, setScenarios] = useState<typeof ALL_SCENARIOS>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);

    useEffect(() => {
        // Initialize with a random shuffle of 5 items
        const shuffled = [...ALL_SCENARIOS].sort(() => 0.5 - Math.random()).slice(0, 5);
        setScenarios(shuffled);
    }, [level]);

    const handleAnswer = (answer: boolean) => {
        const correct = scenarios[currentIndex].correct === answer;
        setFeedback(correct ? 'correct' : 'wrong');

        if (correct) {
            setScore(score + 10);
        } else {
            setLives(prev => Math.max(0, prev - 1));
        }
        // Auto-next removed to allow reading explanation
    };

    const handleNext = () => {
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFeedback(null);
        } else {
            setIsComplete(true);
        }
    };

    const nextLevel = () => {
        setLevel(prev => prev + 1);
        setCurrentIndex(0);
        setFeedback(null);
        setIsComplete(false);
    };

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setLives(3);
        setCurrentIndex(0);
        setFeedback(null);
        setIsComplete(false);
    };

    if (isComplete) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 text-center animate-in fade-in zoom-in h-full lg:max-w-2xl mx-auto relative overflow-hidden bg-transparent lg:bg-white">
                {/* Ambient Backgrounds - Mobile Only */}
                <div className="absolute top-0 right-0 w-[100vw] h-[100vw] bg-blue-200/40 blur-[120px] -z-10 rounded-full lg:hidden pointer-events-none" />
                <div className="absolute bottom-40 left-0 w-[100vw] h-[100vw] bg-indigo-100/60 blur-[120px] -z-10 rounded-full lg:hidden pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mb-6 lg:mb-8 shadow-2xl shadow-blue-500/10"
                >
                    <Trophy size={44} strokeWidth={2.5} />
                </motion.div>

                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-2">Level {level} Complete</h2>
                <div className="flex items-center gap-2 justify-center mb-6 lg:mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-white border border-blue-100 px-3 py-1 rounded-full shadow-sm">CITIZEN SHIELD</span>
                </div>

                <div className="bg-white/60 backdrop-blur-md lg:bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[2rem] w-full border border-slate-200/50 lg:border-slate-100 mb-8 lg:mb-12 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 lg:gap-8">
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Score</span>
                            <span className="text-2xl lg:text-3xl font-black text-slate-900">{score} PTS</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Civic Rank</span>
                            <span className="text-2xl lg:text-3xl font-black text-slate-900">{level > 1 ? 'Guardian' : 'Protector'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full px-4 lg:px-0">
                    <button
                        onClick={nextLevel}
                        className="flex-1 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
                    >
                        Next Case <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={restartGame}
                        className="px-8 py-5 rounded-2xl border border-slate-200 bg-white/40 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 text-xs"
                    >
                        Restart
                    </button>
                </div>
            </div>
        );
    }

    const currentScenario = scenarios[currentIndex];
    if (!currentScenario) return null;

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent lg:bg-white relative overflow-y-auto">
            {/* Ambient Backgrounds - Mobile Only */}
            <div className="absolute top-0 right-0 w-[100vw] h-[100vw] bg-emerald-100/30 blur-[130px] -z-10 rounded-full lg:hidden pointer-events-none" />
            <div className="absolute bottom-20 left-40 w-[100vw] h-[100vw] bg-blue-100/40 blur-[130px] -z-10 rounded-full lg:hidden pointer-events-none" />

            {/* 1. Scrollable Mission Header */}
            <div className="px-6 pt-10 pb-4 lg:p-12 text-center z-10">
                <div className="flex flex-col lg:items-center gap-3 justify-center">
                    <div className="mx-auto w-12 h-12 bg-white lg:bg-slate-50 rounded-2xl border border-slate-200 lg:border-slate-100 flex items-center justify-center shadow-sm lg:shadow-none mb-3 lg:mb-0">
                        <Scale className="text-slate-900" size={22} />
                    </div>
                    <div>
                        <span className="block text-[10px] lg:text-[12px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">Mission Protocol active</span>
                        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">Cedizen Test</h1>
                    </div>
                </div>
            </div>

            {/* 2. Sticky HUD Bar (Only this stays fixed) */}
            <div className="px-6 py-4 sticky top-0 z-20 bg-white/60 backdrop-blur-md lg:bg-transparent border-b border-slate-200/50 lg:border-none">
                <div className="max-w-3xl mx-auto flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">Level {level}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Lives Display */}
                        <div className="flex gap-1.5 px-3 py-2 rounded-full bg-slate-100/50 lg:bg-transparent border border-slate-200/30 lg:border-none">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={clsx(
                                    "w-2.5 h-2.5 lg:w-2 lg:h-2 rounded-full transition-all duration-500",
                                    i < lives ? "bg-rose-500 shadow-sm shadow-rose-500/20" : "bg-slate-200 scale-75"
                                )} />
                            ))}
                        </div>

                        <div className="bg-slate-900 px-5 py-2.5 lg:px-6 lg:py-3 rounded-[1.25rem] lg:rounded-2xl shadow-xl shadow-slate-900/10 flex items-center gap-2 lg:gap-3 border border-slate-800">
                            <Zap size={12} className="text-blue-400 fill-blue-400" />
                            <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white">{score} <span className="hidden lg:inline">PTS</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Game Surface */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${level}-${currentIndex}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={clsx(
                            "w-full bg-white p-8 lg:p-20 rounded-[2.5rem] lg:rounded-[3rem] shadow-premium-lg border transition-all duration-500 text-center relative overflow-hidden",
                            feedback === 'correct' ? "border-emerald-500/20 shadow-emerald-500/5" :
                                feedback === 'wrong' ? "border-rose-500/20 shadow-rose-500/5" : "border-slate-100/50"
                        )}
                    >
                        {/* Progress Bar - Tiny & Sleek */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                            <motion.div
                                className="h-full bg-slate-900"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
                            />
                        </div>

                        <p className="text-xl lg:text-3xl font-black text-slate-900 leading-[1.3] mb-8 lg:mb-10 tracking-tight">
                            "{currentScenario.text}"
                        </p>

                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mb-8 lg:mb-10 text-center"
                                >
                                    <div className="inline-block p-1 px-3 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">SIMPLIFIED WHY</div>
                                    <p className="text-slate-600 font-bold text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
                                        {currentScenario.explanation}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="min-h-[40px]">
                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className={clsx(
                                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                                            feedback === 'correct' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                        )}
                                    >
                                        {feedback === 'correct' ? <ShieldCheck size={14} /> : <Info size={14} />}
                                        {feedback === 'correct' ? "Legally Valid" : "Unconstitutional"}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Interaction Area - Mobile Reachable */}
                <div className="w-full mt-8 lg:mt-12 pb-8 lg:pb-12 px-2 lg:px-0">
                    <AnimatePresence mode="wait">
                        {!feedback ? (
                            <motion.div
                                key="quiz-actions"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 w-full"
                            >
                                <button
                                    onClick={() => handleAnswer(true)}
                                    disabled={!!feedback || lives === 0}
                                    className="group relative h-20 lg:h-24 bg-white/60 backdrop-blur-sm lg:bg-white border border-slate-200/50 lg:border-2 lg:border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:bg-emerald-50 hover:border-emerald-200 active:scale-95 disabled:opacity-30 shadow-sm"
                                >
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                        <Check size={22} strokeWidth={3} />
                                    </div>
                                    <span className="text-base lg:text-lg font-black text-slate-900 uppercase tracking-tight">VALID</span>
                                </button>

                                <button
                                    onClick={() => handleAnswer(false)}
                                    disabled={!!feedback || lives === 0}
                                    className="group relative h-20 lg:h-24 bg-white/60 backdrop-blur-sm lg:bg-white border border-slate-200/50 lg:border-2 lg:border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:bg-rose-50 hover:border-rose-200 active:scale-95 disabled:opacity-30 shadow-sm"
                                >
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                                        <X size={22} strokeWidth={3} />
                                    </div>
                                    <span className="text-base lg:text-lg font-black text-slate-900 uppercase tracking-tight">VIOLATION</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="quiz-next"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleNext}
                                className="w-full h-20 lg:h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-slate-900/20 group"
                            >
                                <span className="text-xl lg:text-2xl font-black uppercase tracking-widest">Next Case</span>
                                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Context Footer - Floating and Translucent on Mobile */}
            <div className="p-6 lg:p-8 border-t border-slate-200/30 lg:border-slate-50 bg-white/40 backdrop-blur-lg lg:bg-slate-50/30">
                <div className="flex items-center gap-4 max-w-3xl mx-auto">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200 lg:bg-blue-100 lg:border-none flex items-center justify-center text-slate-600 lg:text-blue-600 shadow-sm lg:shadow-none">
                        <Flag size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block text-[8px] font-black text-blue-600/80 uppercase tracking-[0.3em] mb-0.5">{currentScenario.article}</span>
                        <p className="text-[10px] lg:text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-2 lg:line-clamp-none">
                            {currentScenario.explanation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
