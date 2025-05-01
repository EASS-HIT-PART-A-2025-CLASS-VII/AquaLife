import React from 'react';

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};
