/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Helvetica', 'Arial', 'sans-serif']
    },
    extend: {
      colors: {
        'fuck': 'rgb(200, 200, 200)'
      }
    }
  },
  plugins: [],
}