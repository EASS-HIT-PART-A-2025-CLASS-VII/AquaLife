import React from 'react';

interface ToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ title, description, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-lg text-white min-w-[300px] animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-blue-100 mt-1">{description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-blue-100 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 