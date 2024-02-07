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
    primary: "#F87171", // For buttons, branded accents
    secondary: "#06bCC1", // For secondary actions, color design accents
    white: "#FFFFFF", // Oh? You know this hold
    dark_accent: "#474056", // I haven't used this yet but
    surface: "#5B5B5B", // Most normal text, adjust with opacities
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
});

export default chakraTheme;
