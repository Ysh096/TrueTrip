import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <div className="space-y-3 w-full">
      {label && <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{label}</label>}
      <input 
        className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 focus:outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400 ${className}`}
        {...props}
      />
    </div>
  );
};
