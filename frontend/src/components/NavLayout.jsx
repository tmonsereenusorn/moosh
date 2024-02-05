import React from "react";
import NavBar from "./Navbar";

const NavLayout = ({ children, auth }) => {
  return (
    <div>
      <NavBar></NavBar>
      {children}
    </div>
  );
};

export default NavLayout;
