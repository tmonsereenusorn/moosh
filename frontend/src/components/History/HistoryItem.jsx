import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Popover, PopoverTrigger } from "@chakra-ui/react";
import HistoryItemPopover from "./HistoryItemPopover";
import { deletePrompt } from "../../api/history";

const HistoryItem = ({ text, onClick, timestamp, promptId, playlistRef }) => {
  const [active, setActive] = useState(false);

  // Incomplete action functions.
  const onShare = async () => {
    // Get playlist link and display a share modal?
    console.log("sharing: ");
  };
  const onDelete = async () => {
    console.log("Deleting: " + promptId + " DOESN'T WORK.");
  };

  return (
    <div
      className="flex w-full items-center px-2 h-8 space-x-2 rounded-md hover:bg-surface/[0.1]"
      onMouseOver={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => onClick()}
    >
      <div className="absolute left-0 right-0 h-8 bg-gradient-to-l from-gray-100 from-0% via-white/[0] via-1% hover:cursor-pointer" />
      <p className="text-sm whitespace-nowrap overflow-x-hidden font-semibold">
        {text}
      </p>
      {active && (
        <div className="absolute right-2 flex items-center z-30">
          <Popover placement="right">
            <PopoverTrigger>
              <BsThreeDots
                onClick={(e) => e.stopPropagation()}
                className="scale-200 hover:text-primary hover:cursor-pointer text-surface"
              />
            </PopoverTrigger>
            <HistoryItemPopover onShare={onShare} onDelete={onDelete} />
          </Popover>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;
