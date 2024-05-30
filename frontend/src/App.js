import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { authorize, clearAllCookies } from "./api/auth";
import { fetch_personal_info } from "./api/personal";
import { useAuth } from "./contexts/AuthProvider";
import { updateSpotifyURI, firebaseAuth } from "./api/firebase";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing/Landing";
import Analysis from "./pages/Analysis/Analysis";
import Curator from "./pages/Curator/Curator";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import TryItCurator from "./pages/Curator/TryItCurator";
import AdminDashboard from "./pages/Admin/Admin";

function App() {
  const [domLoading, setDomLoading] = useState(true);
  const { authorized, setAuthorized, setUser, setUid } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    firebaseAuth.onAuthStateChanged((auth) => setUid(auth?.uid));
    if (!authorized && location.pathname === "/curator") navigate("/login");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (authorized) {
      fetch_personal_info().then((res) => {
        setUser(res?.data);
        firebaseAuth.onAuthStateChanged(() => {
          updateSpotifyURI(res?.data.uri).then((valid) => {
            if (valid === -1) {
              clearAllCookies();
              authorize(true);
            }
          });
        });
      });
    }
  }, [authorized, setUser]);

  if (domLoading) return null;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="" element={<Landing />} />
        <Route path="analysis" element={<Analysis />} />
        <Route
          path="curator"
          element={<Curator />}
          loader={async () => {
            authorize(false);
          }}
        />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="try-it" element={<TryItCurator />} />
        <Route path="admin" element={<AdminDashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
