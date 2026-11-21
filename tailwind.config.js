/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#281B30',
          dark: '#1C1322',
          light: '#352440',
        },
        mauve: {
          DEFAULT: '#49344F',
          dark: '#38283D',
          light: '#5E4366',
        },
        lavender: {
          DEFAULT: '#856B91',
          light: '#A58DB1',
          dark: '#675271',
        },
        lilac: {
          DEFAULT: '#D4BCE0',
          soft: '#E8D9F0',
        },
        pearl: {
          DEFAULT: '#F5EDF7',
          pure: '#FAF5FA',
        },
        orchid: {
          DEFAULT: '#AD42B8',
          electric: '#E65BD6',
          dark: '#8C3495',
        },
        dusty: {
          DEFAULT: '#B879A4',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass-subtle': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-glow': '0 12px 40px 0 rgba(173, 66, 184, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'orchid-glow': '0 0 25px -3px rgba(230, 91, 214, 0.35)',
        'electric-glow': '0 0 35px 5px rgba(230, 91, 214, 0.45)',
        'card-layered': '0 20px 50px rgba(10, 5, 15, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'scan': 'scan 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.3' },
          '50%': { transform: 'translateY(100%)', opacity: '0.9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

