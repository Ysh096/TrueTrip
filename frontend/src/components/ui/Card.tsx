import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  const baseClass = hover ? 'surface-card cursor-pointer hover:shadow-md' : 'surface-card';
  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
};