import { extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans";

const chakraTheme = extendTheme({
  components: {
    Button: {
      // Define your custom button sizes here
      sizes: {
        xl: {
          h: "72px",
          fontSize: "3xl",
          px: "48px",
          borderRadius: "20px",
        },
      },
    },
  },
  // [colorname]-500 is the base color for each group.
  colors: {
    primary: {
      100: "#fbaaaa",
      200: "#fa9c9c",
      300: "#f98d8d",
      400: "#f97f7f",
      500: "#F87171",
      600: "#df6666",
      700: "#c65a5a",
      800: "#ae4f4f",
      900: "#954444",
    }, // For buttons, branded accents
    secondary: {
      100: "#6ad7da",
      200: "#51d0d4",
      300: "#38c9cd",
      400: "#1fc3c7",
      500: "#06bcc1",
      600: "#05a9ae",
      700: "#048487",
      800: "#047174",
      900: "#035e61",
    }, // For secondary actions, color design accents
    white: "#FFFFFF", // Oh? You know this hold
    dark_accent: {
      100: "#474056",
      200: "#474056",
      300: "#474056",
      400: "#474056",
      500: "#474056",
      600: "#474056",
      700: "#474056",
      800: "#474056",
      900: "#474056",
    }, // I haven't used this yet but
    surface: "#5B5B5B", // Most normal text, adjust with opacities
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
});

export default chakraTheme;
