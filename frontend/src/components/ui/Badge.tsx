import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'slate';
  className?: string;
}

export const Badge = ({ children, variant = 'blue', className = '' }: BadgeProps) => {
  const variants = {
    blue: "bg-blue-50/50 text-blue-600 border-blue-100/50 shadow-sm",
    slate: "bg-slate-50/50 text-slate-500 border-slate-100/50 shadow-sm"
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border backdrop-blur-sm transition-all hover:scale-105 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
