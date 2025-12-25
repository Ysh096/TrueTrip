'use client';

import { useState } from 'react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  placeholderText?: string;
}

export function SafeImage({ src, alt, className = '', placeholderText = 'Image' }: SafeImageProps) {
  const isValidSrc = src && typeof src === 'string' && src.trim() !== '';
  const [error, setError] = useState(!isValidSrc);

  if (error || !isValidSrc) {
    return (
      <div className={`bg-slate-100 flex flex-col items-center justify-center border-slate-200/50 min-h-[100px] ${className}`}>
        <span className="text-2xl mb-1 opacity-20">🏞️</span>
        <span className="text-[10px] text-slate-300 font-bold tracking-tighter uppercase">{placeholderText}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover w-full h-full ${className}`}
      onError={() => setError(true)}
    />
  );
}
