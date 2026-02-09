import React from 'react';
import styles from './GlassModal.module.css';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({ isOpen, onClose, children, className }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.overlay}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={clsx(styles.modal, className)}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
