import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EBF4FF',
          100: '#D0E8FF',
          200: '#A8D0F8',
          400: '#5BA4E8',
          500: '#2E86DE',
          600: '#1D6DC0',
          700: '#1457A0',
          900: '#0A2A50',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F0F7FF',
          200: '#E2ECF7',
          300: '#CAD8EB',
          400: '#94A8BE',
          500: '#64778E',
          600: '#445569',
          700: '#2E3E50',
          900: '#0F1C28',
        },
        success: '#27AE60',
      },
      fontFamily: {
        body: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(14,40,80,0.06), 0 1px 2px rgba(14,40,80,0.04)',
        md: '0 4px 16px rgba(14,40,80,0.10)',
        lg: '0 12px 40px rgba(14,40,80,0.14)',
        blue: '0 8px 32px rgba(46,134,222,0.28)',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
      },
      maxWidth: {
        container: '1160px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '280ms',
        slow: '500ms',
      },
      keyframes: {
        'float-1': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-enter': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float-1': 'float-1 4s ease-in-out infinite',
        'float-2': 'float-2 4.5s ease-in-out infinite',
        marquee: 'marquee 22s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'gentle-bounce': 'gentle-bounce 3s ease-in-out infinite',
        'fade-enter': 'fade-enter 0.32s ease-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
