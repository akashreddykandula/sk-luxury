/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#0a2d2d',
          900: '#0d3b2e',
          800: '#0f5132',
          700: '#146b3e',
          600: '#198754',
          500: '#20a06a',
        },
        teal: {
          950: '#0a2626',
          900: '#0d3333',
          800: '#115e59',
          700: '#0f766e',
          600: '#0d9488',
          500: '#14b8a6',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50: '#faf7ed',
          100: '#f4eccc',
          200: '#e9d68a',
          300: '#dcbf5a',
          400: '#d4a832',
          500: '#C9A84C',
          600: '#b8912a',
          700: '#9a7421',
          800: '#7d5d1e',
          900: '#674d1c',
        },
        luxury: {
          bg: '#f8f5f0',
          cream: '#faf8f5',
          ivory: '#fffff0',
          beige: '#f5f0e8',
          dark: '#1a1a1a',
          charcoal: '#2d2d2d',
          muted: '#6b6b6b',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        body: ['"Lato"', '"Open Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0d3b2e 0%, #0f766e 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #f4eccc 50%, #C9A84C 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(13,59,46,0.7) 0%, rgba(13,59,46,0.3) 100%)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': {backgroundPosition: '-200% 0'},
          '100%': {backgroundPosition: '200% 0'},
        },
        float: {
          '0%, 100%': {transform: 'translateY(0)'},
          '50%': {transform: 'translateY(-10px)'},
        },
        'pulse-gold': {
          '0%, 100%': {boxShadow: '0 0 0 0 rgba(201,168,76,0.4)'},
          '50%': {boxShadow: '0 0 0 10px rgba(201,168,76,0)'},
        },
      },
      boxShadow: {
        luxury: '0 4px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
        'luxury-lg': '0 20px 60px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)',
        gold: '0 4px 20px rgba(201,168,76,0.3)',
        card: '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
