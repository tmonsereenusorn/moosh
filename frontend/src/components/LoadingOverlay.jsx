import React from "react";
import { Logo } from "./Logo";

const LoadingOverlay = () => {
  return (
    <div className="absolute z-30 top-0 left-0 h-screen w-screen bg-white">
      <div className="flex items-center justify-center w-full h-full">
        <Logo width="5%" height="5%" />
      </div>
    </div>
  );
};

export default LoadingOverlay;