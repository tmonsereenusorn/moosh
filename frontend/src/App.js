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
import LoadingOverlay from "./components/LoadingOverlay";
import theme from "./theme";

function App() {
  const { setAuthorized, loading, setLoading } = useAuth();

  useEffect(() => {
    setLoading(true);
    authorize(false).then(() => {
      setLoading(false);
      setAuthorized(!!Cookies.get("token"));
    });
  // eslint-disable-next-line
  }, []);

  const router = createBrowserRouter([
    { path: "/", Component: Landing },
    { path: "/analysis", Component: Analysis },
    { path: "/curator", Component: Curator }
  ])

  return (
    <ChakraProvider theme={theme}>
      {loading && <LoadingOverlay />}
      <Navbar />
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
