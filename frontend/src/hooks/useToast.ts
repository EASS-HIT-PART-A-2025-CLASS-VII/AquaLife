import { create } from 'zustand';

export interface Toast {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToastStore {
  toast: Toast | null;
  showToast: (toast: Toast) => void;
  hideToast: () => void;
}

export const useToast = create<ToastStore>((set: (state: Partial<ToastStore>) => void) => ({
  toast: null,
  showToast: (toast: Toast) => set({ toast }),
  hideToast: () => set({ toast: null }),
})); 