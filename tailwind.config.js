/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        shield: {
          cyan: '#00D4FF',
          violet: '#7C3AED',
          emerald: '#10B981',
          crimson: '#EF4444',
          amber: '#F59E0B',
          navy: '#0A0E1A',
          card: '#0F1628',
        },
      },
      animation: {
        'radar': 'radar 3s linear infinite',
        'pulse-ring': 'pulseRing 2.5s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2.2s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s linear infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'glow': 'glow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-dot': 'bounceDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        scan: {
          '0%': { top: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%,100%': { filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.4))' },
          '50%': { filter: 'drop-shadow(0 0 28px rgba(0,212,255,1)) drop-shadow(0 0 56px rgba(124,58,237,0.5))' },
        },
        bounceDot: {
          '0%,80%,100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
