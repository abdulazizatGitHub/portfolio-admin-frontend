'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/lib/contexts/LoadingContext';
import { PuffLoader } from 'react-spinners';

export function GlobalLoader() {
  const { isLoading, loadingText } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-base)]/80 backdrop-blur-xl"
        >
          <div className="relative flex flex-col items-center">
            <PuffLoader color="var(--primary-500)" size={100} speedMultiplier={1.5} />

            {/* Loading Text */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-col items-center gap-2"
            >
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--primary-400)] to-[var(--secondary-400)] bg-clip-text text-transparent drop-shadow-sm">
                {loadingText}
              </span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-[var(--primary-500)] shadow-[0_0_10px_var(--primary-500)]"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
