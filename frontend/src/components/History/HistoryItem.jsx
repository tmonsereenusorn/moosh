import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import Popover from "../Popover";
import { deletePrompt } from "../../api/history";
import { Tooltip } from "@chakra-ui/react";

const HistoryItem = ({ item, onClick, isPlaylist }) => {
  const [active, setActive] = useState(false);
  const text = isPlaylist ? item.title : item.prompt;

  const onDelete = async () => {
    await deletePrompt(item.id);
  };

  const action = (e, func) => {
    e.stopPropagation();
    func();
  };

  return (
    <div
      className="flex items-center min-h-8 px-2 space-x-2 rounded-md hover:bg-surface/[0.1] bg-gradient-to-l from-gray-100 from-0% via-white/[0.01] via-90% hover:cursor-pointer"
      onMouseOver={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={onClick}
    >
      {!!item.image && (
        <img
          src={item.image}
          alt={`Cover for playlist ${text}.`}
          className="w-10 h-10 my-2 mr-2"
        />
      )}
      <Tooltip label={text}>
        <p className="flex-grow text-sm whitespace-nowrap overflow-x-hidden font-semibold">
          {text}
        </p>
      </Tooltip>
      <Popover position="right">
        <Popover.Trigger>
          {active && !isPlaylist && (
            <BsThreeDots className="relative z-30 scale-200 hover:text-primary hover:cursor-pointer text-surface" />
          )}
        </Popover.Trigger>
        <Popover.Content>
          {!isPlaylist && (
            <div
              className="rounded-md p-1 hover:cursor-pointer hover:bg-gray-200 flex space-x-2"
              onClick={(e) => action(e, onDelete)}
            >
              <MdDelete className="w-4 h-4" />
              <p className="text-xs">delete</p>
            </div>
          )}
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default HistoryItem;
