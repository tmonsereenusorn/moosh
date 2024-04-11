import React from "react";
import { ScaleLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <ScaleLoader color="#F87171" />
    </div>
  );
};

export default Loader;