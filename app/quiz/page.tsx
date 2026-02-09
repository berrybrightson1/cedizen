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

        setTimeout(() => {
            if (currentIndex < scenarios.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setFeedback(null);
            } else {
                setIsComplete(true);
            }
        }, 1500);
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
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in h-full max-w-2xl mx-auto">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30"
                >
                    <Trophy size={48} strokeWidth={2.5} />
                </motion.div>

                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Level {level} Complete</h2>
                <div className="flex items-center gap-2 justify-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">CITIZEN SHIELD</span>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] w-full border border-slate-100 mb-12">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Score</span>
                            <span className="text-3xl font-black text-slate-900">{score} PTS</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Civic Rank</span>
                            <span className="text-3xl font-black text-slate-900">{level > 1 ? 'Guardian' : 'Protector'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <button
                        onClick={nextLevel}
                        className="flex-1 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
                    >
                        Next Mission <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={restartGame}
                        className="px-8 py-5 rounded-2xl border border-slate-200 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 text-xs"
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
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Premium Header Area */}
            <div className="p-8 md:p-12 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                        <Scale className="text-blue-600" size={18} />
                    </div>
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mission Protocol</span>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">LEVEL {level}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FUNDAMENTALS</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Lives Display */}
                    <div className="hidden md:flex gap-1.5 mr-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={clsx(
                                "w-2 h-2 rounded-full",
                                i < lives ? "bg-rose-500 shadow-sm shadow-rose-500/20" : "bg-slate-100"
                            )} />
                        ))}
                    </div>

                    <div className="bg-slate-900 px-6 py-3 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center gap-3">
                        <Zap size={14} className="text-blue-400 fill-blue-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">{score} PTS</span>
                    </div>
                </div>
            </div>

            {/* Main Game Surface */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${level}-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={clsx(
                            "w-full bg-white p-12 md:p-20 rounded-[3rem] shadow-premium-lg border-2 transition-all duration-500 text-center relative overflow-hidden",
                            feedback === 'correct' ? "border-emerald-500/20 bg-emerald-50/[0.02]" :
                                feedback === 'wrong' ? "border-rose-500/20 bg-rose-50/[0.02]" : "border-slate-100/50"
                        )}
                    >
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
                            />
                        </div>

                        <p className="text-2xl md:text-3xl font-black text-slate-900 leading-[1.2] mb-10 tracking-tight">
                            "{currentScenario.text}"
                        </p>

                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={clsx(
                                        "inline-flex items-center gap-2 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm",
                                        feedback === 'correct' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                    )}
                                >
                                    {feedback === 'correct' ? <ShieldCheck size={14} /> : <Info size={14} />}
                                    {feedback === 'correct' ? "Legally Valid" : "Unconstitutional"}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>

                {/* Interaction Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-12 pb-12">
                    <button
                        onClick={() => handleAnswer(true)}
                        disabled={!!feedback || lives === 0}
                        className="group relative h-24 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:bg-emerald-50 hover:border-emerald-200 active:scale-95 disabled:opacity-50"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                            <Check size={24} strokeWidth={3} />
                        </div>
                        <span className="text-lg font-black text-slate-900 uppercase tracking-tight">VALID</span>
                    </button>

                    <button
                        onClick={() => handleAnswer(false)}
                        disabled={!!feedback || lives === 0}
                        className="group relative h-24 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:bg-rose-50 hover:border-rose-200 active:scale-95 disabled:opacity-50"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                            <X size={24} strokeWidth={3} />
                        </div>
                        <span className="text-lg font-black text-slate-900 uppercase tracking-tight">VIOLATION</span>
                    </button>
                </div>
            </div>

            {/* Context Footer */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-4 max-w-3xl mx-auto">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Flag size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block text-[8px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">{currentScenario.article}</span>
                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                            {currentScenario.explanation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
