/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#090909',
          light: '#0D1012',
        },
        ivory: {
          DEFAULT: '#F5F2EA',
          muted: '#E8E3D9',
        },
        gold: {
          DEFAULT: '#D6A64F',
          light: '#E4C070',
          dark: '#C99738',
        },
        cream: '#FAF8F2',
        'warm-ivory': '#F7F4ED',
        charcoal: {
          DEFAULT: '#151515',
          light: '#1E1E1E',
        },
        stone: {
          DEFAULT: '#A9A9A6',
          muted: '#8D8981',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.14)',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(4rem, 8vw, 8.5rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display': ['clamp(3rem, 6vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'section': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'subsection': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.65' }],
        'label': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.18em' }],
        'label-lg': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.15em' }],
        'caption': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.2em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'btn': '4px',
        'btn-lg': '6px',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'draw-line': 'drawLine 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slow-zoom': 'slowZoom 25s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drawLine: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.3)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
        },
      },
      transitionTimingFunction: {
        'lux': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'lux-slow': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(180deg, rgba(9,9,9,0) 0%, rgba(9,9,9,0.15) 35%, rgba(9,9,9,0.45) 70%, rgba(9,9,9,0.85) 100%)',
        'gradient-hero-side': 'linear-gradient(90deg, rgba(9,9,9,0.55) 0%, transparent 45%, transparent 55%, rgba(9,9,9,0.55) 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D6A64F 0%, #E4C070 50%, #D6A64F 100%)',
      },
    },
  },
  plugins: [],
};