import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'], // condensed feel via tracking
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // New design system per Master Prompt
        graphite: {
          950: '#0E1116', // primary background
          900: '#161B22',
          800: '#1F252D',
        },
        offwhite: '#F7F7F5', // body text, light surfaces
        'cta-orange': '#FF6B1A', // Amazon-adjacent energetic accent for all primary CTAs
        'data-lime': '#C6FF3D', // ratings, badges, stat counters, "Best Overall"
        'trust-blue': '#3D8BFF', // verified, methodology, trust signals
        neutral: {
          950: '#0E1116',
          900: '#161B22',
          800: '#1F252D',
          700: '#2A323C',
          600: '#3A4554',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
        },
        emerald: {
          // Keep some emerald for backward compatibility but de-emphasize
          500: '#10b981',
        },
      },
      fontSize: {
        '2xs': '0.625rem', // for ribbons, microcopy
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cardLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        countUp: 'countUp 1s ease-out forwards',
        cardLift: 'cardLift 0.2s ease-out forwards',
      },
    },
  },
  plugins: [typography],
};

export default config;
