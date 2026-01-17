/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-green': 'var(--color-emerald-green)',
        'soft-neon-green': 'var(--color-soft-neon-green)',
        'deep-blue': 'var(--color-deep-blue)',
      },
      fontFamily: {
        primary: ['"Press Start 2P"', 'cursive'],
        body: ['"Roboto Mono"', 'monospace'],
        sans: ['"Chakra Petch"', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #059669',
        'neon-green-intense': '0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #39FF14, 0 0 40px #059669',
        'neon-emerald': '0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px rgba(34,197,94,0.4)',
        'neon-emerald-intense': '0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px #22c55e, 0 0 40px rgba(34,197,94,0.6)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-size': '40px 40px',
      },
      keyframes: {
        'neon-flicker': {
          '0%, 100%': {
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #39FF14, 0 0 30px #39FF14, 0 0 40px #39FF14, 0 0 55px #39FF14, 0 0 75px #39FF14',
          },
          '50%': {
            textShadow: '0 0 2px #fff, 0 0 5px #fff, 0 0 8px #fff, 0 0 10px #39FF14, 0 0 15px #39FF14, 0 0 20px #39FF14, 0 0 25px #39FF14, 0 0 35px #39FF14',
          },
        }
      },
      animation: {
        'neon-flicker': 'neon-flicker 1.5s infinite alternate',
      },
    },
  },
  plugins: [],
}