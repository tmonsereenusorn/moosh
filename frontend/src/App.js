import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { authorize } from "./api/auth";

import NavBar from "./components/Navbar";
import NavLayout from "./components/NavLayout";
import Landing from "./pages/Landing/Landing";
import Analysis from "./pages/Analysis/Analysis";
import Curator from "./pages/Curator/Curator";
import theme from "./theme";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <NavLayout>
            <Landing />
          </NavLayout>
        }
      />
      <Route
        path="analysis"
        element={
          <NavLayout>
            <Analysis />
          </NavLayout>
        }
      />
      <Route
        path="curator"
        element={
          <NavLayout>
            <Curator />
          </NavLayout>
        }
      />
    </>
  )
);

function App() {
  const [authorized, setAuthorized] = useState(!!Cookies.get("token"));

  useEffect(() => {
    authorize(false).then(() => setAuthorized(!!Cookies.get("token")));
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router}></RouterProvider>
    </ChakraProvider>
  );
}

export default App;
