import React from 'react';

export const Loading: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">{message || 'Loading...'}</p>
    </div>
  );
};