import React from 'react';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ type, className, disabled, children }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md text-white font-semibold transition duration-200 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
