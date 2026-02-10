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
import { clsx } from 'clsx';
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

const FloatingCard = ({ icon: Icon, title, description, badge, color, position, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
        }}
        transition={{
            opacity: { duration: 0.8, delay },
            scale: { duration: 0.8, delay },
            y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay + 0.5
            }
        }}
        className={clsx(
            "absolute z-10 hidden lg:flex flex-col p-5 rounded-2xl border bg-white/5 backdrop-blur-md shadow-2xl w-56",
            color === "blue" ? "border-blue-500/20" :
                color === "emerald" ? "border-emerald-500/20" :
                    "border-yellow-500/20",
            position
        )}
    >
        <div className="flex items-center justify-between mb-3">
            <div className={clsx(
                "p-2 rounded-lg",
                color === "blue" ? "bg-blue-500/20 text-blue-400" :
                    color === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-yellow-500/20 text-yellow-400"
            )}>
                <Icon size={18} />
            </div>
            <span className={clsx(
                "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border",
                color === "blue" ? "border-blue-500/30 text-blue-400" :
                    color === "emerald" ? "border-emerald-500/30 text-emerald-400" :
                        "border-yellow-500/30 text-yellow-400"
            )}>
                {badge}
            </span>
        </div>
        <h4 className="text-white text-xs font-bold mb-1">{title}</h4>
        <p className="text-white/40 text-[10px] leading-relaxed">{description}</p>
    </motion.div>
);

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
        <header className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0C10]">
            {/* Super Premium Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0C10] via-slate-900 to-[#0A0C10]"></div>

            {/* Animated Orbits/Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-yellow-500/[0.02] rounded-full blur-[120px]"></div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:60px_60px] md:bg-[length:100px_100px]"></div>

            {/* Floating Smart Cards - Content Filler */}
            <FloatingCard
                icon={Scale}
                title="Pocket Lawyer AI"
                description="Instant legal guidance based on 1992 Constitution."
                badge="V3.0 ACTIVE"
                color="blue"
                position="top-[25%] left-[10%]"
                delay={0.2}
            />
            <FloatingCard
                icon={Library}
                title="Judicial Archive"
                description="1000+ Supreme Court landmark cases summarized."
                badge="GH-CERTIFIED"
                color="emerald"
                position="bottom-[30%] right-[12%]"
                delay={0.4}
            />
            <FloatingCard
                icon={Award}
                title="Civic Score"
                description="Gamified education to reward constitutional literacy."
                badge="SOVEREIGN"
                color="yellow"
                position="top-[40%] right-[15%]"
                delay={0.6}
            />

            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className="text-center max-w-7xl mx-auto px-8 md:px-12 relative z-20 w-full"
            >
                {/* Premium Modern Tag */}
                <div className="inline-block px-0 py-2 mb-10 md:mb-14 border-y border-white/5 relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-3 bg-red-500"></div>
                    <span className="text-[9px] md:text-xs font-black tracking-[0.45em] uppercase bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 text-transparent bg-clip-text px-4">
                        Ghana's Civic Empowerment <br /> Platform
                    </span>
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-3 bg-green-500"></div>
                </div>

                {/* Brand Name - CEDIZEN */}
                <div className="mb-10 md:mb-14">
                    <h1 className="text-6xl md:text-9xl lg:text-[14rem] font-black text-white tracking-tighter leading-[0.8] mb-4 drop-shadow-2xl">
                        CEDIZEN
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-blue-400 text-[10px] md:text-xs font-black tracking-[0.6em] uppercase opacity-80">
                        <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-blue-400"></div>
                        Citizen Empowerment
                        <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-blue-400"></div>
                    </div>
                </div>

                {/* Tagline & Description Container */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        Sovereignty <br /> <span className="text-yellow-400">belongs to You.</span>
                    </h2>
                    <p className="text-white/60 text-base md:text-xl font-medium leading-relaxed">
                        Ghana's 1992 Constitution, legal intelligence, and civic tools directly in your hands.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-8">
                    {/* Primary CTA - Solid Red */}
                    <Link
                        href="/dashboard"
                        className="group relative inline-flex items-center gap-4 bg-red-600 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95"
                    >
                        Enter Dashboard
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Footer Tag */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-px bg-gradient-to-b from-white/20 to-transparent"></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
                            GHANA • SOVEREIGN TECH • REBRYCREATIVES PROJECT • 2026
                        </p>
                    </div>
                </div>
            </motion.div>
        </header>

        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto space-y-20 relative z-10 py-20"
        >

            {/* What is Cedizen - Premium Redesign */}
            <motion.section variants={fadeInUp} className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto relative">
                {/* Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
                        What is Cedizen?
                    </h2>
                    <p className="text-xl md:text-2xl leading-relaxed text-slate-500 font-medium max-w-4xl mx-auto">
                        Ghana's first comprehensive civic ecosystem—combining constitutional education, AI-powered legal guidance, case law archives, and public discourse tools. Everything you need to be an informed, empowered citizen.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    {[
                        {
                            title: "Fully Local & Private",
                            description: "AI runs on your device. No data leaves your browser. Your privacy is protected by default.",
                            icon: Shield,
                            color: "blue"
                        },
                        {
                            title: "100% Free Access",
                            description: "No subscriptions, no paywalls. Constitutional knowledge should be accessible to all without barriers.",
                            icon: Zap,
                            color: "emerald"
                        },
                        {
                            title: "Supreme Court Ready",
                            description: "Access summaries of landmark cases and constitutional articles instantly with local search.",
                            icon: Library,
                            color: "yellow"
                        },
                        {
                            title: "Civic Certification",
                            description: "Test your constitutional knowledge and earn verification as a certified Ghanaian Cedizen.",
                            icon: Award,
                            color: "purple"
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="group p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500"
                        >
                            <div className="flex items-start gap-6">
                                <div className={clsx(
                                    "p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500",
                                    feature.color === "blue" ? "bg-blue-50 text-blue-600" :
                                        feature.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                                            feature.color === "yellow" ? "bg-yellow-50 text-yellow-600" :
                                                "bg-purple-50 text-purple-600"
                                )}>
                                    <feature.icon size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>


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
    </div >;
}
