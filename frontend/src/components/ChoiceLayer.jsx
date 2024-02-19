import React, { useRef } from "react";
import { FaShareFromSquare, FaCheck } from "react-icons/fa6";
import { GrCycle } from "react-icons/gr";
import { MdOutlineCancel } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger, useDisclosure, Input, FormLabel, FormControl, HStack } from "@chakra-ui/react";

const ChoiceLayer = ({ onGenerate, onCancel, onChangeTitle }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);

  return (
    <div className="w-3/4 flex space-x-8">
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement="top"
      >
        <PopoverTrigger>
          <div className="w-full bg-spotify py-2 px-6 rounded-md hover:cursor-pointer border border-black font-semibold text-white flex justify-center items-center">
            <FaShareFromSquare />
            <p className="w-full text-center">Export to Spotify</p>
          </div>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FormControl isRequired>
            <FormLabel>playlist name.</FormLabel>
            <HStack>
              <Input variant="outline" placeholder="e.g. good playlist" isRequired onChange={onChangeTitle} />
              <div 
                className="rounded-md w-12 h-10 bg-spotify flex justify-center items-center text-white hover:cursor-pointer"
                onClick={() => {
                  onGenerate();
                  onClose();
                }}
              >
                <FaCheck className="text-xl" />
              </div>
            </HStack>
          </FormControl>
        </PopoverContent>
      </Popover>
      <div className="w-full bg-primary py-2 px-6 rounded-md hover:cursor-pointer border border-black font-semibold text-white flex justify-center items-center">
        <GrCycle />
        <p className="w-full text-center">Regenerate</p>
      </div>
      <div
        className="w-full bg-gray-200 py-2 px-6 rounded-md hover:cursor-pointer border border-black font-semibold flex justify-center items-center"
        onClick={() => onCancel()}
      >
        <MdOutlineCancel />
        <p className="w-full text-center">Cancel</p>
      </div>
    </div>
  );
};

export default ChoiceLayer;