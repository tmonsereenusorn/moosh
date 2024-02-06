import React from "react";
import { BeatLoader } from "react-spinners";

const LoadingOverlay = () => {
  return (
    <div className="absolute z-30 top-0 left-0 h-screen w-screen bg-white">
      <div className="flex items-center justify-center w-full h-full">
        <BeatLoader color="#F87171" size={25} />
      </div>
    </div>
  );
};

export default LoadingOverlay;