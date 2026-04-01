/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
      },
      colors: {
        cta: '#2563EB',
      },
    },
  },
  plugins: [],
};
