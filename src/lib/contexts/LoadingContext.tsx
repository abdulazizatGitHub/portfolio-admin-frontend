'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loadingEmitter } from '@/lib/api/loadingEmitter';

interface LoadingContextType {
  isLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');

  useEffect(() => {
    const unsubscribe = loadingEmitter.subscribe((loading) => {
      setIsApiLoading(loading);
    });
    return unsubscribe;
  }, []);

  const setGlobalLoading = (loading: boolean) => {
    setIsManualLoading(loading);
    if (!loading) setLoadingText('Processing...');
  };

  const isLoading = isApiLoading || isManualLoading;

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setGlobalLoading,
        loadingText,
        setLoadingText,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
