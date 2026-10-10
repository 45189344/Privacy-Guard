/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#030712',
          900: '#050b18',
          850: '#081023',
          800: '#0d1833',
          700: '#14234b',
          600: '#1e3368',
        },
        pearl: {
          50: '#fbfcfd',
          100: '#f5f7fa',
          200: '#e9eef5',
          300: '#d5dfec',
          400: '#b8c8dd',
        },
        slate: {
          muted: '#64748b',
          subtle: '#475569',
          border: 'rgba(148, 163, 184, 0.15)',
        },
        teal: {
          accent: '#14b8a6',
          glow: '#2dd4bf',
          deep: '#0f766e',
          light: '#ccfbf1',
        },
        emerald: {
          status: '#10b981',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        amber: {
          status: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
        rose: {
          status: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.25)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-lg': '0 20px 50px 0 rgba(0, 0, 0, 0.35), inset 0 1px 2px 0 rgba(255, 255, 255, 0.25)',
        'teal-glow': '0 0 25px -3px rgba(20, 184, 166, 0.35)',
        'teal-glow-lg': '0 0 50px -5px rgba(45, 212, 191, 0.45)',
      },
      animation: {
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(2deg)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
