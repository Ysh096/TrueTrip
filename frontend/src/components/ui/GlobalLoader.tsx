'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '@/lib/store';
import { LoadingState } from './States';

export const GlobalLoader = () => {
  const { isGlobalLoading, loadingMessage } = usePlannerStore();

  return (
    <AnimatePresence>
      {isGlobalLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[40px] cursor-wait"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-12 text-center"
          >
            {/* Elegant Spinner */}
            <div className="relative w-24 h-24">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-[3px] border-white/10 border-t-blue-500 rounded-full"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 border-[3px] border-white/5 border-t-sky-400/50 rounded-full"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">✈️</span>
               </div>
            </div>

            <div className="space-y-4">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-xl md:text-2xl font-black tracking-tight"
              >
                {loadingMessage || "Please wait..."}
              </motion.p>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                TrueTrip AI Engine Analyzing
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
