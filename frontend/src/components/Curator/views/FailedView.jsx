import React from "react";
import { ButtonPrimary } from "../../../components/ButtonPrimary";

const FailedView = ({ onSubmit, onReset, regenerating }) => {
  console.log(regenerating);
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <p className="font-bold text-2xl text-surface">Sorry, something went wrong.</p>
      <div className="flex space-x-4">
        <ButtonPrimary text={"Try again"} onClick={() => onSubmit(regenerating)} />
        <ButtonPrimary text={"Cancel"} onClick={() => onReset()} />
      </div>
    </div>
  );
};

export default FailedView;