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
        blue: {
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          200: 'rgb(var(--color-accent-200) / <alpha-value>)',
          300: 'rgb(var(--color-accent-300) / <alpha-value>)',
          400: 'rgb(var(--color-accent-400) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
          700: 'rgb(var(--color-accent-700) / <alpha-value>)',
          800: 'rgb(var(--color-accent-800) / <alpha-value>)',
          900: 'rgb(var(--color-accent-900) / <alpha-value>)',
          950: 'rgb(var(--color-accent-950) / <alpha-value>)',
        },
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
          blue: 'rgb(var(--color-accent-600) / <alpha-value>)',
          'blue-bright': 'rgb(var(--color-accent-500) / <alpha-value>)',
          'blue-light': 'rgb(var(--color-accent-400) / <alpha-value>)',
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
        'glow-sm': '0 0 15px rgb(var(--color-accent-500) / 0.25)',
        'glow': '0 0 25px rgb(var(--color-accent-500) / 0.35)',
        'glow-lg': '0 0 45px rgb(var(--color-accent-500) / 0.45)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgb(var(--color-accent-600) / 0.18), transparent 70%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(var(--color-accent-600) / 0.25), rgba(139, 92, 246, 0.12), transparent 70%)',
      }
    },
  },
  plugins: [],
}
