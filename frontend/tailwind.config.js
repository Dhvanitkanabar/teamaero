/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3AB0FF",
        background: "#F5FAFF",
      },
      borderRadius: {
        'xl': '12px',
      }
    },
  },
  plugins: [],
}

