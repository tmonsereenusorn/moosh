import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { ButtonPrimary } from "../../../components/ButtonPrimary";

const ExportedView = ({ url, title, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <FaCircleCheck className="text-secondary text-6xl" />
      <p className="font-bold text-xl text-surface">Listen to</p>
      <p
        className="font-bold text-2xl text-black hover:cursor-pointer hover:underline"
        onClick={() => window.open(url, "_blank")}
      >
        {title}
      </p>
      <ButtonPrimary text={"Do it again!"} onClick={() => onReset()} />
    </div>
  );
};

export default ExportedView;