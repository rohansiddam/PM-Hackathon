/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        calm: '#F5F7F5',
        ink: '#182128',
        accent: '#0E7A5F',
        alert: '#D64545',
        focus: '#FFD166'
      }
    }
  },
  plugins: []
};
