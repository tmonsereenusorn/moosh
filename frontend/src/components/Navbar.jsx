import React from "react";
import { authorize } from "../api/auth";

const NavBar = ({ auth }) => {
  const onLogin = () => {
    authorize(true);
  };

  return (
    <div className="w-full h-14 bg-red-400 flex px-6 py-2">
      <p className="font-extrabold text-white text-3xl">moosh.</p>
      <div className="w-full flex justify-end items-center">
        {!auth && (
          <div
            className="h-8 w-24 items-center justify-center bg-white rounded-md flex hover:cursor-pointer"
            onClick={() => onLogin()}
          >
            <p className="font-bold text-lg text-red-400">login</p>
          </div>
        )}
      </div>
    </div>
  )
};

export default NavBar;
