/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#edf2f0',
        foreground: '#333',
        white: '#ffffff',
        orange: {
          DEFAULT: '#f78d20',
          light: '#f48f35',
        },
        green: {
          DEFAULT: '#079d56',
          dark: '#006b3f',
        },
        gray: {
          DEFAULT: '#444',
        },
      },
    },
  },
  plugins: [],
};
