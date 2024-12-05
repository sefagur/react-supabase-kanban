/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1e1f22',
          secondary: '#2b2d31',
          accent: '#313338',
          text: '#ffffff',
          muted: '#949ba4',
          hover: '#404249',
          border: '#373a40'
        },
        light: {
          primary: '#ffffff',
          secondary: '#f8f9fa',
          accent: '#e9ecef',
          text: '#2d3436',
          muted: '#636e72',
          hover: '#dee2e6',
          border: '#ced4da'
        },
        brand: {
          primary: '#5865f2',
          secondary: '#4752c4',
          success: '#3ba55c',
          danger: '#ed4245',
          warning: '#faa61a',
          info: '#5865f2'
        }
      },
      boxShadow: {
        'card': '0 2px 5px 0 rgb(0 0 0 / 0.05)',
        'card-hover': '0 5px 15px 0 rgb(0 0 0 / 0.1)',
        'modal': '0 10px 25px -5px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'slide-up': 'slideUp 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
