'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { LoadingProvider } from '@/lib/contexts/LoadingContext';
import { GlobalLoader } from '@/components/ui/GlobalLoader';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <LoadingProvider>
        <ToastProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <GlobalLoader />
              {children}
            </QueryClientProvider>
          </AuthProvider>
        </ToastProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
