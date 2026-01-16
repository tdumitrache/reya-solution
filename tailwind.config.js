/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-300": "#4BFF99",

        "error-400": "#FF6991",

        "white-100": "#F9F9FA",
        "white-950": "#8D8D8D",

        "black-100": "#474747",
        "black-400": "#323232",
      },
      fontFamily: {
        sans: ["Satoshi", "system-ui", "sans-serif"],
      },
    },
  },
};
