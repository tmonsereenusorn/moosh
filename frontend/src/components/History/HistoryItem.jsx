import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Popover, PopoverTrigger } from "@chakra-ui/react";
import HistoryItemPopover from "./HistoryItemPopover";

const HistoryItem = ({ prompt, timestamp, playlistRef }) => {
  const [active, setActive] = useState(false);

  return (
    <div className="flex w-full items-center px-2 h-8 space-x-2 rounded-md hover:bg-surface/[0.1]" onMouseOver={() => setActive(true)} onMouseLeave={() => setActive(false)}>
      <div className="absolute left-0 right-0 h-8 bg-gradient-to-l from-gray-100 from-0% via-white/[0] via-1% hover:cursor-pointer" />
      <p className="text-sm whitespace-nowrap overflow-x-hidden font-semibold">{prompt}</p>
      {active && (
        <div className="absolute right-2 flex items-center">
          <Popover placement="right">
            <PopoverTrigger>
              <BsThreeDots className="scale-200 hover:text-primary hover:cursor-pointer text-surface" />
            </PopoverTrigger>
            <HistoryItemPopover />
          </Popover>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;