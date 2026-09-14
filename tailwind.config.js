/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        textMain: '#2C2C2C',
        textSecondary: '#5A5A5A',
        accentMain: '#8C6D58',
        accentSecondary: '#B3927B'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Cormorant Garamond', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'Montserrat', 'Lato', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'apple-btn': '12px',
        'apple-card': '20px',
        'apple-badge': '8px',
      },
      transitionTimingFunction: {
        'apple-spring': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'apple-pop': 'cubic-bezier(0.4, 0, 0.2, 1.4)',
      },
      boxShadow: {
        'apple-subtle': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(140, 109, 88, 0.04)',
        'apple-card': '0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(140, 109, 88, 0.06)',
        'apple-card-hover': '0 16px 36px -6px rgba(0, 0, 0, 0.08), 0 8px 20px -4px rgba(140, 109, 88, 0.12)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(140, 109, 88, 0.04)',
      },
      letterSpacing: {
        widest: '0.15em',
        title: '3px',
        'apple-headline': '-0.022em',
        'apple-body': '-0.011em',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
      }
    },
  },
  plugins: [],
}
