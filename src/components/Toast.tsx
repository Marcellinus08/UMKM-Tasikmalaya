'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-500 dark:bg-emerald-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600'
  }[type];

  const icon = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  }[type];

  return (
    <div className="fixed top-24 right-4 z-[9999] animate-slide-in-right">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md backdrop-blur-sm`}>
        <span className="material-icons text-2xl">{icon}</span>
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
