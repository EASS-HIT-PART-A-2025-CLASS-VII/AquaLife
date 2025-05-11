import React from 'react';
import { useToast } from '../../hooks/useToast';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useToast();

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        toast.variant === 'destructive'
          ? 'bg-red-500 text-white'
          : 'bg-marine-light text-white'
      }`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="font-bold">{toast.title}</h3>
          <p className="text-sm">{toast.description}</p>
        </div>
        <button
          onClick={hideToast}
          className="ml-4 text-white hover:text-white/80 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}; 