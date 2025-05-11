/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          DEFAULT: '#1e3a8a',  // Deep ocean blue
          light: '#3b82f6',    // Bright ocean blue
          dark: '#1e40af',     // Dark ocean blue
          surface: '#60a5fa',  // Surface water blue
          deep: '#1e3a8a',     // Deep water blue
        },
        coral: {
          DEFAULT: '#f87171',  // Coral pink
          light: '#fca5a5',    // Light coral
          dark: '#dc2626',     // Dark coral
        },
        sand: {
          DEFAULT: '#fbbf24',  // Sand color
          light: '#fcd34d',    // Light sand
          dark: '#d97706',     // Dark sand
        },
      },
    },
  },
  plugins: [],
} 