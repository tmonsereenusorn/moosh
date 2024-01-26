import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { codeChallenge, getToken } from "../utility/pkce";

const NavBar = () => {
  // check for cookies on component mount
  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`}
      }
      const data = await axios.get("https://api.spotify.com/v1/me", config);
      console.log(data);
    }

    const accessToken = Cookies.get('token');
    const refreshToken = Cookies.get('refresh_token');
    if (!accessToken) {
      if (refreshToken) {
        getToken(undefined, true);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) getToken(code);
    } else {
      fetchData().catch(console.error);
    }
  }, []);

  const onLogin = () => {
    const accessToken = Cookies.get('token');
    const refreshToken = Cookies.get('refresh_token');
    if (!accessToken) {
      if (refreshToken) {
        getToken(undefined, true);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        getToken(code); // get token using code if it is already in URL
      } else {
        codeChallenge(); // otherwise, begin the PKCE process
      }
    }
  };

  return (
    <div className="w-full h-14 bg-red-400 flex px-6 py-2">
      <p className="font-extrabold text-white text-3xl">moosh.</p>
      <div className="w-full flex justify-end items-center">
        <div
          className="h-8 w-24 items-center justify-center bg-white rounded-md flex hover:cursor-pointer"
          onClick={() => onLogin()}
        >
          <p className="font-bold text-lg text-red-400">login</p>
        </div>
      </div>
    </div>
  )
};

export default NavBar;