import React, { useEffect } from "react";
import { authenticateUser, getToken } from "./utility/pkce";

function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        getToken(code); // get token using code if it is already in URL
      } else {
        authenticateUser(); // otherwise, begin the PKCE process
      }
    }
  }, []);

  return (
    <div className="text-red-300 font-bold text-3xl">moosh.</div>
  );
}

export default App;
