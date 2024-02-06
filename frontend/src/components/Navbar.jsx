import React from "react";
import { Logo } from "./Logo";

const NavBar = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-14 bg-[#5b5b5b]/[.1] border-b border-[#C7C7C7]/[.5] px-6 py-2 z-10">
      <Logo />
      <div className="w-full flex justify-end items-center"></div>
    </div>
  )
};

export default NavBar;
