import React, { useEffect } from "react";
import Cookies from "js-cookie";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { authorize } from "./api/auth";
import { useAuth } from "./contexts/AuthProvider";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing/Landing";
import Analysis from "./pages/Analysis/Analysis";
import Curator from "./pages/Curator/Curator";
import theme from "./theme";

function App() {
  const { setAuthorized } = useAuth();

  useEffect(() => {
    authorize(false).then(() => setAuthorized(!!Cookies.get("token")));
  });

  const router = createBrowserRouter([
    { path: "/", Component: Landing },
    { path: "/analysis", Component: Analysis },
    { path: "/curator", Component: Curator }
  ])

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
