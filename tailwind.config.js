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
        "black-600": "#252525",
        "black-700": "#161616",
        "black-900": "#0a0a0a",
      },
      fontFamily: {
        sans: ["Satoshi", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
