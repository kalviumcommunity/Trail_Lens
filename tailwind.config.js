/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a14',
          900: '#080d1a',
          850: '#0b1122',
          800: '#0f172a',
          750: '#131e36',
          700: '#1a2744',
          600: '#233559',
          500: '#334b7a',
        },
        brand: {
          blue: '#2563eb',
          'blue-bright': '#3b82f6',
          'blue-light': '#60a5fa',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(37, 99, 235, 0.25)',
        'glow': '0 0 25px rgba(37, 99, 235, 0.35)',
        'glow-lg': '0 0 45px rgba(37, 99, 235, 0.45)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.18), transparent 70%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.25), rgba(139, 92, 246, 0.12), transparent 70%)',
      }
    },
  },
  plugins: [],
}
