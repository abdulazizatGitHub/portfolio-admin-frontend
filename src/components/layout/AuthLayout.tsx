import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] relative overflow-hidden px-4 py-12">
      {/* Global Dynamic Mesh Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[var(--primary-300)]/30 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[var(--secondary-300)]/20 to-transparent blur-[140px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-[var(--primary-200)]/15 to-transparent blur-[80px]" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        {children}
      </div>
    </div>
  );
}

