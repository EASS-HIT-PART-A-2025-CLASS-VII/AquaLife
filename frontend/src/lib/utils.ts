// Utility function to join class names (commonly used in Tailwind CSS projects)
export const cn = (...classes: (string | undefined)[]): string => {
    // Filter out any undefined values and join the rest into a single string
    return classes.filter(Boolean).join(' ');
  };
  