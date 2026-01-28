'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Mock validation
            if (email === 'admin@portfolio.com' && password === 'admin123') {
                router.push('/admin');
            } else {
                setError('Invalid credentials. For trial use: admin@portfolio.com / admin123');
            }
        }, 1500);
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] text-white shadow-lg mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        Admin Panel
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2 font-medium">
                        Please sign in to access your dashboard
                    </p>
                </div>

                <Card className="glass-panel overflow-hidden border-white/20 dark:border-white/5 shadow-2xl">
                    <CardBody className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="Email Address"
                                placeholder="admin@portfolio.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                prefix={<Mail className="w-4 h-4" />}
                                className="premium-input"
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    prefix={<Lock className="w-4 h-4" />}
                                    suffix={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                    className="premium-input"
                                    error={error}
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] bg-[var(--bg-surface)] cursor-pointer"
                                    />
                                    <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-semibold transition-colors cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={loading}
                                className="w-full shadow-lg shadow-[var(--primary-500)]/20"
                            >
                                Sign In
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <p className="text-center mt-8 text-sm text-[var(--text-tertiary)]">
                    &copy; {new Date().getFullYear()} Portfolio Admin. All rights reserved.
                </p>
            </motion.div>
        </AuthLayout>
    );
}
