'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/api';
import { User, LoginCredentials } from '@/types/auth';
import { useLoading } from './LoadingContext';
import { useToast } from '@/components/providers/ToastProvider';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setGlobalLoading, setLoadingText } = useLoading();
  const { success, error: showToastError } = useToast();

  useEffect(() => {
    // Skip initial check if already on login page
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // If we already have a user, no need to check
    if (user) return;

    try {
      const response = await authApi.getMe();
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
      }
    } catch (err) {
      // Unauthenticated - user stays null
      if (user) setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    setLoadingText('Verifying credentials...');
    setGlobalLoading(true);

    try {
      const response = await authApi.login(credentials);
      const { user: loggedInUser } = response.data.data;

      // Set user immediately from login response
      setUser(loggedInUser);

      setLoadingText('Welcome back! Redirecting...');
      router.push('/admin');

      // Stay loading until roughly when the page should be ready
      setTimeout(() => {
        setGlobalLoading(false);
        success(`Welcome back, ${loggedInUser.name || 'Admin'}!`);
      }, 1500);
    } catch (err: any) {
      setGlobalLoading(false);
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      showToastError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoadingText('Signing out safely...');
    setGlobalLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      router.push('/login');
      setTimeout(() => setGlobalLoading(false), 1000);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
