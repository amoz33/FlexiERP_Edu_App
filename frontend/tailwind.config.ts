import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A020',
          50:  '#FBF5E0',
          100: '#F5E8B3',
          200: '#EED87F',
          300: '#E7C84B',
          400: '#D9B232',
          500: '#C9A020',
          600: '#A8841A',
          700: '#876914',
          800: '#664F0E',
          900: '#453508',
        },
        dark: {
          DEFAULT: '#0D0D0D',
          50:  '#1A1A1A',
          100: '#141414',
          200: '#111111',
          300: '#0D0D0D',
        },
        surface: {
          DEFAULT: '#F5F5F3',
          dark: '#1C1C1C',
        }
      },
      fontFamily: {
        palatino: ['"Palatino Linotype"', 'Palatino', '"Book Antiqua"', 'Georgia', 'serif'],
        sans: ['"Palatino Linotype"', 'Palatino', '"Book Antiqua"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'gold': '0 0 0 2px #C9A020',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.35s ease-out forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      }
    },
  },
  plugins: [],
}
export default config
