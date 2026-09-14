'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastContextType {
  showToast: (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    duration?: number
  ) => string | number;
  success: (message: string, duration?: number) => string | number;
  error: (message: string, duration?: number) => string | number;
  warning: (message: string, duration?: number) => string | number;
  info: (message: string, duration?: number) => string | number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      duration?: number
    ) => {
      const actualDuration = duration || (type === 'error' ? 6000 : 4000);

      const options = {
        position: 'top-right' as const,
        autoClose: actualDuration,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
        theme: 'colored' as const,
      };

      switch (type) {
        case 'success':
          return toast.success(message, options);
        case 'error':
          return toast.error(message, options);
        case 'warning':
          return toast.warning(message, options);
        case 'info':
          return toast.info(message, options);
        default:
          return toast(message, options);
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
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="premium-toastify"
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
