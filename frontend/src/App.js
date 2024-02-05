import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Landing from "./pages/Root/Landing";
import Analysis from "./pages/Analysis/Analysis";
import Curator from "./pages/Curator/Curator";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Landing />} />
      <Route path="analysis" element={<Analysis />} />
      <Route path="curator" element={<Curator />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
