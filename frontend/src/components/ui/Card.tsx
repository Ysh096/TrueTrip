import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  return (
    <div className={`bg-white border border-slate-100 p-8 rounded-3xl shadow-xl shadow-slate-100/50 transition-all ${hover ? 'hover:shadow-2xl hover:shadow-emerald-100/50' : ''} ${className}`}>
      {children}
    </div>
  );
};
