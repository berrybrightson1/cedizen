'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Scale,
    Library,
    Award,
    ChevronRight,
    Flag,
    Zap,
    Shield,
    Users,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08
        }
    }
};

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is Cedizen?",
            answer: "Ghana's civic empowerment platform combining constitutional education, AI legal guidance, case law archives, and civic participation tools."
        },
        {
            question: "Is it really free?",
            answer: "Yes! 100% free forever. No subscriptions, no paywalls. Constitutional knowledge should be accessible to all."
        },
        {
            question: "How does Pocket Lawyer work?",
            answer: "AI-powered legal assistant that runs on your device. Ask questions about your rights and get instant guidance based on Ghanaian law—completely private."
        },
        {
            question: "Is my data private?",
            answer: "Absolutely. Pocket Lawyer AI runs locally on your device. Your votes are anonymized. No tracking beyond local browser storage."
        },
        {
            question: "What is Civic Voice?",
            answer: "Vote on constitutional issues and join thousands of citizens in democratic discourse. Track public sentiment and make your voice heard."
        },
        {
            question: "Need an account?",
            answer: "No sign-up required! Just visit and start exploring. Your progress saves locally in your browser."
        },
        {
            question: "What's my Civic Score?",
            answer: "Gamification metric rewarding engagement: 10 points per vote, 5 points per article read. Track it on the Achievements page!"
        },
        {
            question: "Who can use this?",
            answer: "Every Ghanaian citizen! Students, professionals, activists, or anyone curious about constitutional rights. No legal background needed."
        }
    ];

    return <div className="flex-1 min-h-full overflow-x-hidden relative bg-white">

        {/* Fullscreen Hero Section */}
        <header className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Clean Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]"></div>

            {/* Geometric Accent Shapes - Minimal */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>




            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className="text-center max-w-7xl mx-auto px-8 md:px-12 relative z-10 w-full"
            >
                {/* Premium Pill Tag */}
                <div className="inline-block px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-12">
                    <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 text-transparent bg-clip-text">
                        Ghana's Civic Empowerment Platform
                    </span>
                </div>

                {/* Brand Name - CEDIZEN */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-9xl lg:text-[13rem] font-black text-white tracking-tighter leading-[0.85] mb-3">
                        CEDIZEN
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-blue-400 text-xs md:text-sm font-black tracking-[0.5em] uppercase">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-400"></div>
                        Citizen Empowerment
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-400"></div>
                    </div>
                </div>

                {/* Tagline */}
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/90 tracking-tight leading-tight mb-10">
                    Sovereignty <span className="text-yellow-400">belongs to You.</span>
                </h2>

                {/* Description */}
                <p className="text-white/70 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                    Ghana's 1992 Constitution, legal intelligence, and civic tools directly in your hands.
                </p>

                {/* Primary CTA - Solid Red */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-700 hover:scale-105 transition-all shadow-xl shadow-red-900/20 mb-8"
                >
                    Enter Dashboard <ArrowRight size={16} />
                </Link>

                {/* Footer Tag */}
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                    GHANA • SOVEREIGN TECH • REBRYCREATIVES PROJECT • 2026
                </p>
            </motion.div>
        </header>

        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto space-y-20 relative z-10 py-20"
        >

            {/* What is Cedizen - Minimal Redesign */}
            <motion.section variants={fadeInUp} className="px-6 md:px-12 py-16 md:py-24 max-w-5xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">
                        What is Cedizen?
                    </h2>
                    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 font-medium max-w-3xl">
                        Ghana's first comprehensive civic ecosystem—combining constitutional education, AI-powered legal guidance, case law archives, civic literacy testing, and public discourse tools. Everything you need to be an informed, empowered citizen.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 border-t border-slate-100 pt-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Shield size={20} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Fully Local & Private</h3>
                        </div>
                        <p className="text-slate-500 leading-relaxed pl-14">
                            AI runs on your device. No data leaves your browser. Your privacy is paramount.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <Zap size={20} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">100% Free Access</h3>
                        </div>
                        <p className="text-slate-500 leading-relaxed pl-14">
                            No subscriptions, no paywalls. Constitutional knowledge should be accessible to all.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                                <Library size={20} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Supreme Court Ready</h3>
                        </div>
                        <p className="text-slate-500 leading-relaxed pl-14">
                            Access summaries of landmark cases and constitutional articles instantly.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Award size={20} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Civic Certification</h3>
                        </div>
                        <p className="text-slate-500 leading-relaxed pl-14">
                            Test your constitutional knowledge and earn verification as a certified Cedizen.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Features Grid */}
            <section className="px-8 md:px-12">
                <motion.div variants={fadeInUp} className="text-center mb-16">
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
                        Everything You Need
                    </h2>
                    <p className="text-slate-500 text-xl font-bold max-w-2xl mx-auto">
                        Four powerful tools to understand, defend, and exercise your constitutional rights.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Pocket Lawyer */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white border-2 border-slate-200 p-12 rounded-[2.5rem] hover:shadow-2xl hover:border-slate-900 transition-all group"
                    >
                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Scale size={32} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Pocket Lawyer</h3>
                        <p className="text-slate-600 text-base font-medium leading-relaxed mb-6">
                            Get instant, private legal guidance from an AI trained on Ghana's constitutional framework and legal precedents. Ask questions, understand your rights, all locally on your device.
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                            <Shield size={14} /> 100% Private & Local
                        </div>
                    </motion.div>

                    {/* Case Library */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white border-2 border-slate-200 p-12 rounded-[2.5rem] hover:shadow-2xl hover:border-emerald-600 transition-all group"
                    >
                        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Library size={32} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Case Library</h3>
                        <p className="text-slate-600 text-base font-medium leading-relaxed mb-6">
                            Instant access to constitutional articles and Supreme Court case summaries. Search, save, and study the legal foundations that shape our nation.
                        </p>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                            <BookOpen size={14} /> Full Archive Access
                        </div>
                    </motion.div>

                    {/* Cedizen Test */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-slate-900 text-white p-12 rounded-[2.5rem] hover:shadow-2xl transition-all group"
                    >
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-slate-900 transition-all">
                            <Award size={32} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight mb-4">Cedizen Test</h3>
                        <p className="text-slate-300 text-base font-medium leading-relaxed mb-6">
                            Challenge yourself with the official constitutional literacy test. Earn your digital civic certification and prove your knowledge of Ghana's supreme law.
                        </p>
                        <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                            <Award size={14} /> Earn Verification
                        </div>
                    </motion.div>

                    {/* Civic Voice */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-12 rounded-[2.5rem] hover:shadow-2xl transition-all group"
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-teal-600 transition-all">
                            <Users size={32} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight mb-4">Civic Voice</h3>
                        <p className="text-teal-50 text-base font-medium leading-relaxed mb-6">
                            Join thousands of citizens voting on constitutional matters. Make your voice heard, track public sentiment, and participate in Ghana's democratic discourse.
                        </p>
                        <div className="flex items-center gap-2 text-white/90 font-black text-xs uppercase tracking-widest">
                            <Zap size={14} /> Live Participation
                        </div>
                    </motion.div>
                </div>

                {/* Final CTA */}
                <motion.div variants={fadeInUp} className="text-center bg-slate-50 rounded-[3rem] p-16">
                    <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        Ready to get started?
                    </h3>
                    <p className="text-slate-600 text-lg font-bold mb-10 max-w-2xl mx-auto">
                        Access all tools instantly. No sign-up, no tracking, no barriers. Your constitutional rights await.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                    >
                        Enter Dashboard <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            {/* FAQ Section */}
            <section className="px-8 md:px-12">
                <motion.div variants={fadeInUp} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Quick Answers
                    </h2>
                    <p className="text-slate-500 text-lg font-bold max-w-xl mx-auto">
                        Common questions about the platform
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 items-start">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all h-fit"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left group"
                            >
                                <span className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors pr-3">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-blue-600' : ''
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-4 pt-1">
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black">#</div>
                    <span className="font-black text-xl tracking-tight text-slate-900">cedizen</span>
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mt-6 md:mt-0">
                    GHANA • SOVEREIGN TECH • REBRYCREATIVES PROJECT • 2026
                </p>
            </footer>
        </motion.div>
    </div>;
}
