import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'slate';
  className?: string;
}

export const Badge = ({ children, variant = 'emerald', className = '' }: BadgeProps) => {
  const variants = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200"
  };

  return (
    <span className={`text-sm font-medium px-3 py-1 rounded-full border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
