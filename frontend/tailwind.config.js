/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gradientStart: "rgb(106, 241, 255)",
        gradientMiddle: "rgb(235, 168, 126)",
        gradientEnd: "rgba(248, 113, 113)",
      },
    },
  },
  plugins: [],
};
