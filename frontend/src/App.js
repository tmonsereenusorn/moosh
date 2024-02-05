import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import NavBar from "./components/Navbar";
import { authorize } from "./api/auth";

function App() {
  const [authorized, setAuthorized] = useState(!!Cookies.get('token'));

  useEffect(() => {
    authorize(false).then(() => setAuthorized(!!Cookies.get('token')));
  }, []);

  return (
    <NavBar auth={authorized} />
  );
}

export default App;
