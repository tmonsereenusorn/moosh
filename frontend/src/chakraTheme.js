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
  colors: {
    primary: {
      100: "#F87171",
      200: "#F87171",
      300: "#F87171",
      400: "#F87171",
      500: "#F87171",
      600: "#F87171",
      700: "#F87171",
      800: "#F87171",
      900: "#F87171",
    }, // For buttons, branded accents
    secondary: {
      100: "#06bCC1",
      200: "#06bCC1",
      300: "#06bCC1",
      400: "#06bCC1",
      500: "#06bCC1",
      600: "#06bCC1",
      700: "#06bCC1",
      800: "#06bCC1",
      900: "#06bCC1",
    }, // For secondary actions, color design accents
    white: "#FFFFFF", // Oh? You know this hold
    dark_accent: {
      100: "#5c546e",
      200: "#5c546e",
      300: "#5c546e",
      400: "#5c546e",
      500: "#5c546e",
      600: "#5c546e",
      700: "#5c546e",
      800: "#5c546e",
      900: "#5c546e",
    }, // I haven't used this yet but
    surface: "#5B5B5B", // Most normal text, adjust with opacities
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
});

export default chakraTheme;
