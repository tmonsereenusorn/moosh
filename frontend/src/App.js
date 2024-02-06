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

import NavLayout from "./components/NavLayout";
import Landing from "./pages/Landing/Landing";
import Analysis from "./pages/Analysis/Analysis";
import Curator from "./pages/Curator/Curator";
import theme from "./theme";

function App() {
  const [authorized, setAuthorized] = useState(!!Cookies.get("token"));

  useEffect(() => {
    authorize(false).then(() => setAuthorized(!!Cookies.get("token")));
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <NavLayout auth={authorized}>
              <Landing />
            </NavLayout>
          }
        />
        <Route
          path="analysis"
          element={
            <NavLayout auth={authorized}>
              <Analysis />
            </NavLayout>
          }
        />
        <Route
          path="curator"
          element={
            <NavLayout auth={authorized}>
              <Curator />
            </NavLayout>
          }
        />
      </>
    )
  );

  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router}></RouterProvider>
    </ChakraProvider>
  );
}

export default App;
