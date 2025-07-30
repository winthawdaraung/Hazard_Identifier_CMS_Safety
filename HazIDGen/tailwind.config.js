/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cern: {
          blue: '#0053A0',
          lightblue: '#00A8E6',
          orange: '#FF6B00',
          green: '#339933',
          red: '#E63946',
          gray: '#666666'
        }
      }
    },
  },
  plugins: [],
}