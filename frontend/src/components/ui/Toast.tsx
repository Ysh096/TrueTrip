'use client';

import { usePlannerStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export function Toast() {
  const { toast, hideToast } = usePlannerStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toast) {
      timer = setTimeout(() => {
        hideToast();
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [toast, hideToast]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`
              pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center gap-3
              ${toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 
                toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                'bg-slate-900 border-slate-800 text-white'}
            `}
          >
            {toast.type === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            {toast.type === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-bold flex-1">{toast.message}</p>
            <button 
              onClick={hideToast}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
