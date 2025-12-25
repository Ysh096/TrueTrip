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
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-teal-600",
    secondary: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-emerald-300",
    ghost: "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
