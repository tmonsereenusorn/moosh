import React, { useEffect, useState } from "react";
import NavBar from "../../components/Navbar";

const Landing = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gradientStart via-gradientMiddle/[.8] to-gradientEnd/[.56] overflow-hidden h-screen">
      <NavBar />
    </div>
  );
};

export default Landing;
