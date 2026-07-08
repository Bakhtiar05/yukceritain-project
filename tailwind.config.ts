import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '.community-dark'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        success: '#10B981',
      },
      fontFamily: {
        body: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.03)',
        md: '0 4px 16px rgba(15,23,42,0.08)',
        lg: '0 12px 40px rgba(15,23,42,0.12)',
        xl: '0 20px 60px rgba(15,23,42,0.15)',
        blue: '0 8px 32px rgba(37,99,235,0.25)',
        'blue-lg': '0 16px 48px rgba(37,99,235,0.3)',
        'card': '0 1px 3px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        'card-hover': '0 4px 12px rgba(15,23,42,0.06), 0 20px 48px rgba(15,23,42,0.1)',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '28px',
        '2xl': '32px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
      },
      maxWidth: {
        container: '1280px',
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
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        'blur-reveal': {
          '0%': { opacity: '0', filter: 'blur(12px)', transform: 'translateY(8px)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.95)' },
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
        'heart-bounce': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        'menu-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'feed-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float-1': 'float-1 5s ease-in-out infinite',
        'float-2': 'float-2 6s ease-in-out infinite',
        'float-3': 'float-3 7s ease-in-out infinite',
        'blur-reveal': 'blur-reveal 0.6s ease-out forwards',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        marquee: 'marquee 22s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'gentle-bounce': 'gentle-bounce 3s ease-in-out infinite',
        'fade-enter': 'fade-enter 0.32s ease-out forwards',
        'heart-bounce': 'heart-bounce 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'menu-slide-up': 'menu-slide-up 0.18s ease-out forwards',
        'feed-slide-up': 'feed-slide-up 0.25s ease-out both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
