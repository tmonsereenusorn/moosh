import React from "react";
import { Logo } from "./Logo";
import { useAuth } from "../contexts/AuthProvider";
import { NavLink } from "./NavLink";

const NavBar = () => {
  const { authorized, user } = useAuth();

  return (
    <div className="fixed flex top-0 left-0 w-full h-14 bg-[#5b5b5b]/[.1] border-b border-[#C7C7C7]/[.5] px-6 py-2 z-10">
      <Logo />
      <div className="w-full flex justify-end items-center">
        <NavLink text={"Analysis"} to="analysis" />
        <NavLink text={"Curator"} to="curator" />
        {authorized && (
          <p className="text-lg font-bold">hi, {user.display_name}</p>
        )}
      </div>
    </div>
  );
};

export default NavBar;
