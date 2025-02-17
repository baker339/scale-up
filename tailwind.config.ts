import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}', // If using the src/ directory
    './components/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}', // If using the src/ directory
  ],
  theme: {
    extend: {
      colors: {
        darkPurple: '#1E1B29',
        neonBlue: '#4B8BF5',
        neonMagenta: '#E83F6F',
      },
    },
  },
  plugins: [],
};

export default config;