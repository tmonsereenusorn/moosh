import React from "react";
import { PopoverBody, PopoverContent } from "@chakra-ui/react";

const HistoryItemPopover = () => {
  return (
    <PopoverContent bg="gray.100">
      <PopoverBody>
        <div className="space-y-1 text-xs text-surface font-semibold">
          <p className="hover:cursor-pointer hover:bg-gray-200 p-1 rounded-md">share</p>
          <p className="hover:cursor-pointer hover:bg-gray-200 p-1 rounded-md">delete</p>
        </div>
      </PopoverBody>
    </PopoverContent>
  );
};

export default HistoryItemPopover;