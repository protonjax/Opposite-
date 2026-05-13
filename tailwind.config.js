/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#141414',
        border: '#222222',
        green: '#39FF14',
        'green-dim': '#2BC910',
        red: '#FF4444',
        'red-dim': '#CC3333',
        white: '#F5F5F5',
        muted: '#888888',
      },
    },
  },
  plugins: [],
};
