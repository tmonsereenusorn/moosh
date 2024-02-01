import React, { useEffect, useState } from "react";
import { authorize } from "../api/auth";
import { fetch_personal_info } from "../api/personal";

const NavBar = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authorize(false).then(() => setAuth(true));
  }, []);

  useEffect(() => {
    if (auth) {
      setLoading(true);
      fetch_personal_info().then(res => console.log(res.data));
      setLoading(false);
    }
  }, [auth]);

  const onLogin = () => {
    authorize(true).then(() => setAuth(true));
  };

  return (
    loading
    ? <div>Loading</div>
    : <div className="w-full h-14 bg-red-400 flex px-6 py-2">
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