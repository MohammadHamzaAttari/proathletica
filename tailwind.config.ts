import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        graphite: {
          950: '#0A0D12',
          900: '#0E1116',
          800: '#161B22',
          700: '#1F252D',
          600: '#2A323C',
        },
        offwhite: '#F7F7F5',
        'cta-orange': '#FF6B1A',
        'cta-orange-hover': '#FF8C4B',
        'data-lime': '#C6FF3D',
        'trust-blue': '#3D8BFF',
        'savings-green': '#22C55E',
        'star-gold': '#F59E0B',
        'badge-purple': '#A855F7',
        neutral: {
          950: '#0A0D12',
          900: '#0E1116',
          800: '#161B22',
          750: '#1A2030',
          700: '#2A323C',
          600: '#3A4554',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
        },
        emerald: {
          500: '#10b981',
          400: '#34d399',
        },
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px — accessible minimum
        'xs': ['0.75rem', { lineHeight: '1.125rem' }],
        'sm': ['0.875rem', { lineHeight: '1.375rem' }],
        'base': ['1rem', { lineHeight: '1.625rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
      },
      spacing: {
        // 8px grid tokens
        '4.5': '1.125rem',  // 18px
        '13': '3.25rem',    // 52px — WCAG touch target
        '15': '3.75rem',    // 60px
        '18': '4.5rem',     // 72px
      },
      borderRadius: {
        'card': '1.5rem',       // 24px — card container
        'inner': '1rem',        // 16px — inner elements
        'badge': '0.5rem',      // 8px — small badges
        'pill': '9999px',       // pill
        'btn': '0.75rem',       // 12px — buttons
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.4), 0 4px 24px -4px rgba(0,0,0,0.5)',
        'card-hover': '0 12px 48px -4px rgba(0,0,0,0.7), 0 0 0 1px rgba(198,255,61,0.2)',
        'cta': '0 4px 20px -2px rgba(255,107,26,0.45)',
        'cta-hover': '0 8px 32px -2px rgba(255,107,26,0.6)',
        'glow-lime': '0 0 32px rgba(198,255,61,0.3)',
        'glow-blue': '0 0 20px rgba(61,139,255,0.3)',
        'glow-orange': '0 0 28px rgba(255,107,26,0.35)',
        'inner-highlight': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'sidebar': '4px 0 24px -4px rgba(0,0,0,0.5)',
      },
      keyframes: {
        // Card entrance
        cardIn: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // Skeleton shimmer
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        // Badge pulse
        badgePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        // CTA breathe
        ctaBreathe: {
          '0%, 100%': { boxShadow: '0 4px 20px -2px rgba(255,107,26,0.4)' },
          '50%': { boxShadow: '0 4px 32px 0px rgba(255,107,26,0.6)' },
        },
        // Savings flash
        savingsIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        // Count up
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Soft float for rank #1 card
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        cardIn: 'cardIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        badgePulse: 'badgePulse 2s ease-in-out infinite',
        ctaBreathe: 'ctaBreathe 2.5s ease-in-out infinite',
        savingsIn: 'savingsIn 0.3s ease-out forwards',
        countUp: 'countUp 0.6s ease-out forwards',
        float: 'float 4s ease-in-out infinite',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(180deg, #161B22 0%, #0E1116 100%)',
        'lime-gradient': 'linear-gradient(135deg, #C6FF3D 0%, #A8E600 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FF6B1A 0%, #FF8C4B 100%)',
        'image-bg': 'linear-gradient(180deg, #F8F8F8 0%, #EFEFEF 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
    },
  },
  plugins: [typography],
};

export default config;
