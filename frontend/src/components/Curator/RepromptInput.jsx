import React from "react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const RepromptInput = ({ value, onSubmit, onChangeText }) => {
  const REPROMPT_OPTIONS = [
    "this playlist isn't quite sad enough, can you make it less upbeat?"
  ];

  return (
    <form className="flex flex-row w-full relative">
      <input
        type="text"
        className="form-input rounded-full border border-1 border-surface w-full sm:h-12 text-xs sm:text-base"
        placeholder={`Reprompt here! (e.g. ${REPROMPT_OPTIONS[Math.floor(Math.random() * REPROMPT_OPTIONS.length)]})`}
        value={value}
        onChange={onChangeText}
        onKeyDown={e => {
          if (e.key === "Enter") onSubmit();
        }}
      />
      <div className="absolute right-2 sm:right-4 flex items-center h-full">
        <button className="w-6 h-6 bg-white rounded-md" onClick={onSubmit}>
          <ArrowUpIcon className="text-surface hover:text-primary sm:scale-125" />
        </button>
      </div>
    </form>
  );
};

export default RepromptInput;
