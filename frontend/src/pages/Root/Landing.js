import React, { useEffect, useState } from "react";
import NavBar from "../../components/Navbar";
import { ButtonPrimary } from "../../components/ButtonPrimary";

const Landing = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gradientStart via-gradientMiddle/[.8] to-gradientEnd/[.56] overflow-hidden h-screen">
      <NavBar></NavBar>
      <div className="w-screen flex items-center justify-center">
        <div className="w-2/3 h-screen flex items-center justify-center">
          <div className="h-1/2 w-full flex flex-row items-center justify-between">
            <div className="h-full flex flex-col flex-start justify-center">
              <div className="text-red-400 font-bold text-8xl mb-8">moosh</div>
              <div>
                <div className="text-[#4B4B4B] font-bold text-4xl py-1">
                  playlist curator
                </div>
                <div className="text-[#4B4B4B] font-bold text-4xl py-1">
                  music librarian
                </div>
                <div className="text-[#4B4B4B] font-bold text-4xl py-1">
                  spotify librarian
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col flex-start justify-between">
              <div className="text-xl">Make me a playlist</div>
              <ButtonPrimary
                text={"Get Started"}
                onClick={console.log("clicked")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
