'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled, 
  ...props 
}: ButtonProps) => {
  const baseStyles = "btn-premium relative px-8 py-4 rounded-2xl font-black transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none tracking-tight overflow-hidden";
  
  const variants = {
    primary: "bg-[#2563eb] text-white shadow-[0_20px_40px_-12px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.45)] hover:-translate-y-1",
    secondary: "bg-blue-50/80 backdrop-blur-sm text-blue-700 hover:bg-blue-100/90 hover:text-blue-800",
    outline: "bg-white/50 backdrop-blur-md border-2 border-slate-100 text-slate-600 hover:border-blue-500/30 hover:text-blue-600 hover:bg-white",
    ghost: "text-slate-400 hover:text-blue-600 hover:bg-blue-50/50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine Effect */}
      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none" />
      
      {isLoading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
