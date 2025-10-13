// src/components/ui/Card.tsx
import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({ title, className, children, onClick }) => {
  return (
    <div
      className={clsx(
        'bg-white shadow-sm border border-gray-200 rounded-xl p-4',
        className
      )}
      onClick={onClick}
    >
      {title && <h3 className="text-lg font-semibold text-primary-800 mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};