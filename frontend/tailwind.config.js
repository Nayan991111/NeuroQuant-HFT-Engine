/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your existing custom colors
      colors: {
        NeuroQuant: {
          dark: '#0f172a',
          primary: '#3b82f6',
          accent: '#10b981',
          danger: '#ef4444',
          card: '#1e293b'
        }
      },
      // NEW: Animations for the News Ticker and Live Indicator
      animation: {
        marquee: 'marquee 25s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // NEW: Keyframes for the scrolling effect
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}