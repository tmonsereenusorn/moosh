import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { authorize } from "./api/auth";
import { fetch_personal_info } from "./api/personal";
import { useAuth } from "./contexts/AuthProvider";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing/Landing";
import Analysis from "./pages/Analysis/Analysis";
import Curator from "./pages/Curator/Curator";
import theme from "./theme";

function App() {
  const [domLoading, setDomLoading] = useState(true);
  const { authorized, setAuthorized, setUser } = useAuth();

  useEffect(() => {
    // remove loader once DOM has rendered
    const loaderElement = document.querySelector(".loader-container");
    if (loaderElement) {
      setDomLoading(false);
      setTimeout(() => {
        loaderElement.classList.add("fadeOut");
      }, 500);
      setTimeout(() => {
        loaderElement.remove();
      }, 1250);
    }

    authorize(false).then(() => setAuthorized(!!Cookies.get("token")));
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (authorized) {
      fetch_personal_info().then(res => setUser(res?.data));
    }
  }, [authorized, setUser]);

  const router = createBrowserRouter([
    { path: "/", Component: Landing },
    { path: "/analysis", Component: Analysis },
    { path: "/curator", Component: Curator }
  ])

  if(domLoading) return null;

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
