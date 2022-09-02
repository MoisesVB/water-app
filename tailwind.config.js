/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-finite': 'spin 3s linear 0.1',
      }
    },
  },
  plugins: [],
}
