/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,css,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-custom-l': 'linear-gradient(to left, rgba(16, 19, 33, 1) var(--tw-gradient-from-position), rgba(255, 135, 108, var(--tw-bg-opacity)), rgba(248, 38, 88, var(--tw-bg-opacity)), rgba(36, 174, 182, var(--tw-bg-opacity)), rgba(16, 19, 33, 1) var(--tw-gradient-to-position))',
        'gradient-custom-r': 'linear-gradient(to right, rgba(16, 19, 33, 1) var(--tw-gradient-from-position), rgba(255, 135, 108, var(--tw-bg-opacity)), rgba(248, 38, 88, var(--tw-bg-opacity)), rgba(36, 174, 182, var(--tw-bg-opacity)), rgba(16, 19, 33, 1) var(--tw-gradient-to-position))',
        'gradient-custom-b': 'linear-gradient(to bottom, rgba(16, 19, 33, 1) var(--tw-gradient-from-position), rgba(255, 135, 108, var(--tw-bg-opacity)), rgba(248, 38, 88, var(--tw-bg-opacity)), rgba(36, 174, 182, var(--tw-bg-opacity)), rgba(16, 19, 33, 1) var(--tw-gradient-to-position))',
        'gradient-custom-t': 'linear-gradient(to top, rgba(16, 19, 33, 1) var(--tw-gradient-from-position), rgba(255, 135, 108, var(--tw-bg-opacity)), rgba(248, 38, 88, var(--tw-bg-opacity)), rgba(36, 174, 182, var(--tw-bg-opacity)), rgba(16, 19, 33, 1) var(--tw-gradient-to-position))',
      }
    },
  },
  plugins: [],
}

