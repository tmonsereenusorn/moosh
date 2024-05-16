import React from "react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const CuratorInput = ({ value, onSubmit, onChangeText, disabled }) => {
  const CURATOR_OPTIONS = [
    "make me a happy playlist for a sunny friday afternoon",
    "make me a playlist to get pumped before the gym",
    "make me a playlist that would smell like fresh cut grass",
    "make me a relaxing playlist for a rainy morning with black tea",
    "make me an upbeat Italian playlist",
    "make me a playlist that would taste like mangoes"
  ];

  return (
    <form className="flex flex-row w-full relative">
      <input
        type="text"
        className="form-input rounded-full border border-1 border-surface w-full sm:h-12 text-xs sm:text-base"
        placeholder={`e.g. ${CURATOR_OPTIONS[Math.floor(Math.random() * CURATOR_OPTIONS.length)]}`}
        value={value}
        onChange={onChangeText}
        onKeyDown={e => {
          if (e.key === "Enter" && !disabled) onSubmit();
        }}
      />
      <div className="absolute right-2 sm:right-4 flex items-center h-full">
        <button className="w-6 h-6 bg-white rounded-md" onClick={onSubmit} disabled={disabled}>
          <ArrowUpIcon className="text-surface hover:text-primary sm:scale-125" />
        </button>
      </div>
    </form>
  );
};

export default CuratorInput;
