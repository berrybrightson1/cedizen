'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Phone, MessageSquare, MapPin } from 'lucide-react';

interface PanicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PanicModal({ isOpen, onClose }: PanicModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-[3rem] p-12 md:p-16 max-w-2xl w-full shadow-2xl border border-slate-200 relative overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            title="Close"
                            aria-label="Close"
                            className="absolute top-8 right-8 w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all text-slate-600 hover:text-slate-900"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-lg">
                                <AlertTriangle size={36} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Emergency Legal Aid</h2>
                                <p className="text-slate-500 font-bold mt-2">Immediate constitutional assistance</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="bg-red-50 border border-red-200 p-8 rounded-3xl">
                                <div className="flex items-center gap-3 text-red-600 mb-4">
                                    <Phone size={20} />
                                    <span className="font-black text-sm uppercase tracking-widest">Emergency Hotline</span>
                                </div>
                                <a href="tel:+233302123456" className="text-3xl font-black text-red-600 hover:text-red-700 transition-colors">
                                    +233 (0) 30 212 3456
                                </a>
                                <p className="text-slate-600 mt-3 text-sm font-bold">24/7 Legal Rights Assistance</p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-8 rounded-3xl">
                                <div className="flex items-center gap-3 text-blue-600 mb-4">
                                    <MessageSquare size={20} />
                                    <span className="font-black text-sm uppercase tracking-widest">Text Support</span>
                                </div>
                                <p className="text-slate-700 font-bold text-lg">SMS "RIGHTS" to <span className="text-blue-600 font-black">1234</span></p>
                                <p className="text-slate-600 mt-3 text-sm font-bold">Instant constitutional guidance via text</p>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl">
                                <div className="flex items-center gap-3 text-emerald-600 mb-4">
                                    <MapPin size={20} />
                                    <span className="font-black text-sm uppercase tracking-widest">Nearest Legal Aid Center</span>
                                </div>
                                <p className="text-slate-700 font-bold text-lg">Ghana Legal Aid Commission</p>
                                <p className="text-slate-600 mt-2 text-sm font-bold">Ring Road Central, Accra</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
