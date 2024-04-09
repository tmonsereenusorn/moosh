import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Popover from "../Popover";
import { MdDelete } from "react-icons/md";

const HistoryItem = ({ text, onClick, timestamp, promptId, playlistRef }) => {
  const [active, setActive] = useState(false);

  const onDelete = () => {
    console.log("SOFT DELETING " + promptId);
  };

  const action = (e, func) => {
    e.stopPropagation();
    func();
  };

  return (
    <div
      className="flex w-full items-center px-1 h-8 space-x-2 rounded-md hover:bg-surface/[0.1]"
      onMouseOver={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => onClick()}
    >
      <div className="absolute left-0 right-1 h-8 bg-gradient-to-l from-gray-100 from-0% via-white/[0.01] via-90% hover:cursor-pointer" />
      <p className="flex-grow text-sm whitespace-nowrap overflow-x-hidden font-semibold">
        {text}
      </p>
      <Popover position="right">
        <Popover.Trigger>
          {active && (
            <BsThreeDots className="relative z-30 scale-200 hover:text-primary hover:cursor-pointer text-surface" />
          )}
        </Popover.Trigger>
        <Popover.Content>
          <div
            className="rounded-md p-1 hover:cursor-pointer hover:bg-gray-200 flex space-x-2"
            onClick={(e) => action(e, onDelete)}
          >
            <MdDelete />
            <p className="text-xs">delete</p>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default HistoryItem;
