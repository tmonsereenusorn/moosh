/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gradientStart: "rgb(106, 241, 255)",
        gradientMiddle: "rgb(235, 168, 126)",
        gradientEnd: "rgba(248, 113, 113)",
        primary: "#F87171", // For buttons, branded accents
        secondary: "#06bCC1", // For secondary actions, color design accents
        disabled: "#e5e7eb",
        white: "#FFFFFF", // Oh? You know this hold
        dark_accent: "#474056", // I haven't used this yet but
        surface: "#5B5B5B", // Most normal text, adjust with opacities
        spotify: "#1DB954",
        newTrack: '#a1fcff', // Custom color for new tracks
      },
    },
  },
  plugins: [],
};
