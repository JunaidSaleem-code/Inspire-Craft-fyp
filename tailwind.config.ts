import type { Config } from 'tailwindcss'

const config: Config = {
 
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      margin: {
        nested: '1.5rem',
      },
      colors: {
        artist: {
          dark: '#0a0a0f',
          darker: '#05050a',
          light: '#151520',
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#f093fb',
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'scale-up': 'scale-up 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'scale-up': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-2': ['3rem', { lineHeight: '1.2', fontWeight: '800' }],
        'display-3': ['2.5rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(124, 58, 237, 0.3)',
        'glow-md': '0 0 20px rgba(124, 58, 237, 0.5)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.7)',
        'glow-xl': '0 0 60px rgba(124, 58, 237, 0.9)',
      },
    },
  },
  plugins: [],
}

export default config
