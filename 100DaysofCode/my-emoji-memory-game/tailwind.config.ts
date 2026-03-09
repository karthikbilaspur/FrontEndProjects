// tailwind.config.js (or.ts)
/** @type {import('tailwindcss').Config} */
module.exports = {
  //... other config...
  theme: {
    extend: {
      //...
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      })
    }
  ],
}