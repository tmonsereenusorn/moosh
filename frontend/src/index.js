import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import chakraTheme from "./chakraTheme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ChakraProvider theme={chakraTheme}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </BrowserRouter>
);
