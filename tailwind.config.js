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
        sans: ['Montserrat', 'Lato', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.15em',
        title: '3px',
      }
    },
  },
  plugins: [],
}
