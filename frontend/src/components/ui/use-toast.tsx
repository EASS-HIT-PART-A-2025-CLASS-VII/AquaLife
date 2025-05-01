import React from 'react';

interface ToastProps {
  title: string;
  description: string;
}

export const useToast = () => {
  const toast = (props: ToastProps) => {
    console.log('Toast:', props);
  };

  return { toast };
};
