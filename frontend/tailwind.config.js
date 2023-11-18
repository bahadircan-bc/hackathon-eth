/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,css,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'lighter': '#4c5140',
        'light': '#393d2f',
        'normal': '#23261d',
        'dark': '#13150d',
        'darker': '#000000',
      },
      backgroundImage: {
        'gradient-custom-l': 'linear-gradient(to left, rgba(76, 81, 64, 1) var(--tw-gradient-from-position), rgba(76, 81, 64, var(--tw-bg-opacity)), rgba(35, 38, 29, var(--tw-bg-opacity)), rgba(200, 174, 182, var(--tw-bg-opacity)), rgba(76, 81, 64, 1) var(--tw-gradient-to-position))',
        'gradient-custom-r': 'linear-gradient(to right, rgba(16, 19, 33, 1) var(--tw-gradient-from-position), rgba(255, 135, 108, var(--tw-bg-opacity)), rgba(248, 38, 88, var(--tw-bg-opacity)), rgba(36, 174, 182, var(--tw-bg-opacity)), rgba(16, 19, 33, 1) var(--tw-gradient-to-position))',
        'gradient-custom-b': 'linear-gradient(to bottom, rgba(16, 19, 33, 1) var(--tw-gradient-from-position), rgba(255, 135, 108, var(--tw-bg-opacity)), rgba(248, 38, 88, var(--tw-bg-opacity)), rgba(36, 174, 182, var(--tw-bg-opacity)), rgba(16, 19, 33, 1) var(--tw-gradient-to-position))',
        'gradient-custom-t': 'linear-gradient(to top, rgba(16, 19, 33, 1) var(--tw-gradient-from-position), rgba(255, 135, 108, var(--tw-bg-opacity)), rgba(248, 38, 88, var(--tw-bg-opacity)), rgba(36, 174, 182, var(--tw-bg-opacity)), rgba(16, 19, 33, 1) var(--tw-gradient-to-position))',
      }
    },
  },
  plugins: [],
}

// lightest = #4c5140
// lighter = #393d2f
// normal = #23261d
// darker = #13150d
// darkest = #000