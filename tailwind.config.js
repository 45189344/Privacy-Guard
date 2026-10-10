/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          975: '#01040d',
          950: '#020617',
          900: '#050c1e',
          850: '#08132b',
          800: '#0d1b3e',
          700: '#12234e',
          600: '#19306b',
        },
        electric: {
          teal: '#00f5ff',
          cyan: '#00e5ff',
          glow: 'rgba(0, 245, 255, 0.45)',
          deep: '#0891b2',
          light: '#e0fbff',
        },
        emerald: {
          neon: '#00ff87',
          status: '#10b981',
          glow: 'rgba(0, 255, 135, 0.45)',
          deep: '#047857',
          light: '#d1fae5',
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
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
        'glass-lg': '0 20px 50px 0 rgba(0, 0, 0, 0.5), inset 0 1px 2px 0 rgba(255, 255, 255, 0.22)',
        'electric-glow': '0 0 25px -2px rgba(0, 245, 255, 0.5), 0 0 10px 0 rgba(0, 245, 255, 0.3)',
        'emerald-glow': '0 0 25px -2px rgba(0, 255, 135, 0.5), 0 0 10px 0 rgba(16, 185, 129, 0.3)',
        'aurora-glow': '0 0 45px -5px rgba(0, 245, 255, 0.35), 0 0 45px -5px rgba(0, 255, 135, 0.3)',
        'os-dock': '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(0, 245, 255, 0.2)',
        'os-window': '0 25px 65px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(0, 245, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        'teal-glow': '0 0 25px -3px rgba(0, 245, 255, 0.45)',
        'teal-glow-lg': '0 0 50px -5px rgba(0, 245, 255, 0.55)',
      },
      animation: {
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'aurora': 'aurora 10s ease-in-out infinite alternate',
        'scan': 'scan 2s ease-in-out infinite',
      },
      keyframes: {
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-8px) rotateX(2deg)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'aurora': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(25px, -20px) scale(1.1)' },
          '100%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
        'scan': {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
};
