import React, { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { useAuth } from "../contexts/AuthProvider";
import ProfileMenu from "./ProfileMenu";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const { authorized, user } = useAuth();
  const [bgColor, setBgColor] = useState("bg-gray-100");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/curator") setBgColor("bg-gray-100"); // hide song options on scroll
    else setBgColor("bg-surface/[.1]");
  }, [location.pathname]);

  return (
    <div className={`fixed flex top-0 left-0 w-full h-14 ${bgColor} border-b border-surface/[.3] px-6 py-2 z-10`}>
      <Link to="/">
        <Logo />
      </Link>
      <div className="w-full flex justify-end items-center">
        {authorized && (
          <>
            <ProfileMenu name={user?.display_name || ""} />
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
