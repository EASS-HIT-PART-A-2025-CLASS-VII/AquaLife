import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to join class names (commonly used in Tailwind CSS projects)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
  