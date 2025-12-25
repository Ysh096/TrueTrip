'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const LoadingState = ({ message }: { message?: string }) => {
  const [step, setStep] = useState(0);
  const steps = [
    '지도를 펼치는 중...',
    '추천 장소를 선별하는 중...',
    '최적의 동선을 계산하는 중...',
    '거의 다 됐어요! ✨'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-20 space-y-8">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-2 border-blue-50 border-t-blue-600 rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center text-2xl"
        >
          📍
        </motion.div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-slate-900 font-bold text-lg">
          {message || steps[step]}
        </p>
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          TrueTrip AI가 당신의 여행을 설계하고 있습니다
        </p>
      </div>
    </div>
  );
};

export const EmptyState = ({ message, onAction }: { message: string, onAction?: () => void }) => (
  <div className="text-center p-12 glass-card space-y-6 max-w-md mx-auto">
    <div className="text-5xl">🏜️</div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-slate-800">이런, 결과가 없네요</h3>
      <p className="text-slate-500 font-medium text-sm leading-relaxed">{message}</p>
    </div>
    {onAction && (
      <button onClick={onAction} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all">
        다시 시도하기
      </button>
    )}
  </div>
);