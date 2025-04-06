/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pillar: {
          onyx: '#1A191C',
          dark: '#262528',
          orange: '#EF8741',
          mist: '#C1E0D7',
          white: '#FFFFFF',
          gray: '#E7EEEC',
        }
      },
      fontFamily: {
        sans: ['Power Grotesk', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'heading-1': '34px',
        'heading-2': '18px',
        'body': '18px',
      },
      lineHeight: {
        'body': '26px',
      },
      letterSpacing: {
        'body': '1px',
      },
      borderRadius: {
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}