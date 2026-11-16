/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "../shared/constants/**/*.js",
    "../shared/schemas/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          obsidian: '#070D1F', // Deep Astral Obsidian
          950: '#070D1F',
          900: '#0B152E',
          850: '#0F1C3F',
          800: '#152552',
          700: '#1E3572',
          600: '#2A4A9E',
          500: '#3B66D4',
          cyan: '#00E5FF',
          teal: '#00F5D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        accent: {
          cyan: '#00E5FF',
          emerald: '#10B981',
          amber: '#F59E0B',
          purple: '#A855F7',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(0, 229, 255, 0.15)',
        'glow-cyan': '0 0 25px -5px rgba(0, 229, 255, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)'
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
