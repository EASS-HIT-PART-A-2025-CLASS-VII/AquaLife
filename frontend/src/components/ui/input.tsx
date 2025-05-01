import React from 'react';

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ id, type = 'text', placeholder, required }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-marine"
    />
  );
};
