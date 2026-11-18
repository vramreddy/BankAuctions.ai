/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          obsidian: '#050814',
          midnight: '#070D1F',
          950: '#050814',
          900: '#0A122A',
          850: '#0E1A3D',
          800: '#142555',
          cyan: '#00E5FF',
          teal: '#00F5D4',
          purple: '#A855F7'
        },
        accent: {
          cyan: '#00E5FF',
          purple: '#A855F7'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};
