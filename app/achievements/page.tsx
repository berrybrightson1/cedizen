'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, BookOpen, Vote, Trophy, Lock } from 'lucide-react';
import { getHistory, getVotes } from '@/lib/storage';
import clsx from 'clsx';

export default function AchievementsPage() {
    const [stats, setStats] = useState({
        votes: 0,
        read: 0,
        score: 0
    });

    useEffect(() => {
        const votesMap = getVotes();
        const votes = Object.keys(votesMap).length;
        const read = getHistory().length;
        const score = (votes * 10) + (read * 5);
        setStats({ votes, read, score });
    }, []);

    const badges = [
        {
            id: 'first_vote',
            name: 'First Voice',
            description: 'Cast your first vote on an article.',
            icon: Vote,
            unlocked: stats.votes > 0,
            color: 'bg-indigo-500'
        },
        {
            id: 'scholar',
            name: 'Scholar',
            description: 'Read 5 constitutional articles.',
            icon: BookOpen,
            unlocked: stats.read >= 5,
            color: 'bg-emerald-500'
        },
        {
            id: 'activist',
            name: 'Activist',
            description: 'Participate in 10 different votes.',
            icon: Zap,
            unlocked: stats.votes >= 10,
            color: 'bg-amber-500'
        },
        {
            id: 'founder',
            name: 'Founder',
            description: 'Joined during the beta period.',
            icon: Trophy,
            unlocked: true,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="flex-1 min-h-full p-8 md:p-12 overflow-x-hidden relative bg-slate-50">

            {/* Header */}
            <header className="w-full max-w-5xl mx-auto py-12">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                        <Award size={24} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Achievements</h1>
                </div>
                <p className="text-slate-500 font-medium ml-[68px]">Track your impact and civic progression.</p>
            </header>

            <div className="w-full max-w-5xl mx-auto pb-20">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10" />
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Civic Score</h3>
                        <div className="text-5xl font-black text-indigo-600 tracking-tighter relative z-10">
                            {stats.score.toLocaleString()}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10" />
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Articles Read</h3>
                        <div className="text-5xl font-black text-emerald-600 tracking-tighter relative z-10">
                            {stats.read}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-10 -mt-10" />
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Votes Cast</h3>
                        <div className="text-5xl font-black text-amber-600 tracking-tighter relative z-10">
                            {stats.votes}
                        </div>
                    </motion.div>
                </div>

                {/* Badges Grid */}
                <h2 className="text-xl font-black text-slate-900 mb-6 px-2 flex items-center gap-2">
                    <Trophy size={20} className="text-amber-500" />
                    Badges Earned
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className={clsx(
                                "p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden group h-full",
                                badge.unlocked
                                    ? "bg-white border-slate-100 shadow-sm"
                                    : "bg-slate-50 border-slate-100 opacity-60 grayscale"
                            )}
                        >
                            <div className={clsx(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300",
                                badge.unlocked ? badge.color : "bg-slate-200"
                            )}>
                                {badge.unlocked ? <badge.icon size={32} /> : <Lock size={24} />}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">{badge.name}</h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                                {badge.description}
                            </p>
                            {badge.unlocked && (
                                <div className="mt-auto px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Unlocked
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
