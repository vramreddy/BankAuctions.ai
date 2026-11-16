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
          obsidian: '#050814', // Deep Astral Obsidian
          midnight: '#070D1F',
          950: '#050814',
          900: '#0A122A',
          850: '#0E1A3D',
          800: '#142555',
          700: '#1C3474',
          600: '#2849A1',
          500: '#3963D6',
          cyan: '#00E5FF',
          teal: '#00F5D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          violet: '#8B5CF6',
          indigo: '#6366F1'
        },
        navy: {
          950: '#030612',
          900: '#070C22',
          850: '#0B1333',
          800: '#101B48',
          700: '#18286A'
        },
        accent: {
          cyan: '#00E5FF',
          teal: '#00F5D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          purple: '#A855F7',
          violet: '#8B5CF6',
          indigo: '#6366F1',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 16px 45px -8px rgba(0, 229, 255, 0.2)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
        'glow-cyan': '0 0 25px -4px rgba(0, 229, 255, 0.45)',
        'glow-teal': '0 0 25px -4px rgba(0, 245, 212, 0.45)',
        'glow-violet': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.45)'
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '32px'
      }
    },
  },
  plugins: [],
}
