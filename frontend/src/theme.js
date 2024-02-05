import { extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans";

const theme = extendTheme({
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
    primary: "#F87171",
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
});

export default theme;
