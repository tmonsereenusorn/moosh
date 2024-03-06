import React, { useRef } from "react";
import { FaCheck } from "react-icons/fa6";
import { GrCycle } from "react-icons/gr";
import { MdOutlineCancel } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Input,
  FormLabel,
  FormControl,
  HStack,
} from "@chakra-ui/react";
import { SpotifyLogo } from "./SpotifyLogo";

const ChoiceLayer = ({
  onGenerate,
  onRegenerate,
  onCancel,
  onChangeTitle,
  disabled,
}) => {
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
          <div className="w-full bg-secondary py-2 px-6 rounded-md hover:cursor-pointer font-semibold text-white flex justify-center items-center">
            <SpotifyLogo className="my-4" />
            <p className="w-full text-center">Export to Spotify</p>
          </div>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FormControl isRequired>
            <FormLabel>playlist name.</FormLabel>
            <HStack>
              <Input
                variant="outline"
                placeholder="e.g. good playlist"
                isRequired
                onChange={onChangeTitle}
              />
              <div
                className={`rounded-md w-12 h-10 ${
                  disabled ? "bg-gray-100" : "bg-secondary hover:cursor-pointer"
                } flex justify-center items-center text-white`}
                onClick={() => {
                  if (!disabled) {
                    onGenerate();
                    onClose();
                  }
                }}
              >
                <FaCheck className="text-xl" />
              </div>
            </HStack>
          </FormControl>
        </PopoverContent>
      </Popover>
      <div
        className="w-full bg-primary py-2 px-6 rounded-md hover:cursor-pointer font-semibold text-white flex justify-center items-center"
        onClick={async () => await onRegenerate()}
      >
        <GrCycle />
        <p className="w-full text-center">Regenerate</p>
      </div>
      <div
        className="w-full bg-gray-200 py-2 px-6 rounded-md hover:cursor-pointer text-surface font-semibold flex justify-center items-center"
        onClick={() => onCancel()}
      >
        <MdOutlineCancel />
        <p className="w-full text-center">Cancel</p>
      </div>
    </div>
  );
};

export default ChoiceLayer;