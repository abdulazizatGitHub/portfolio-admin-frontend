'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => string | number;
  success: (message: string, duration?: number) => string | number;
  error: (message: string, duration?: number) => string | number;
  warning: (message: string, duration?: number) => string | number;
  info: (message: string, duration?: number) => string | number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration?: number) => {
      const icons = {
        success: <CheckCircle2 className="h-5 w-5" />,
        error: <XCircle className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
      };

      const toastOptions = {
        duration: duration || (type === 'error' ? 6000 : 4000),
        className: `toast-${type}`,
        icon: icons[type],
      };

      switch (type) {
        case 'success':
          return toast.success(message, toastOptions);
        case 'error':
          return toast.error(message, toastOptions);
        case 'warning':
          return toast.warning(message, toastOptions);
        case 'info':
          return toast.info(message, toastOptions);
        default:
          return toast(message, toastOptions);
      }
    },
    []
  );

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, 'success', duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => showToast(message, 'error', duration),
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, 'warning', duration),
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => showToast(message, 'info', duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          classNames: {
            success: 'gradient-success text-white',
            error: 'gradient-danger text-white',
            warning: 'gradient-warning text-white',
            info: 'gradient-info text-white',
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

