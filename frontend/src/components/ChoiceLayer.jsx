import React, { useRef, useState } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import { SpotifyLogo } from "./SpotifyLogo";
import SignUpModal from "./SignUpModal";

const ChoiceLayer = ({
  onGenerate = () => {},
  onRegenerate = () => {},
  onCancel = () => {},
  onChangeTitle = () => {},
  disabled = false,
  unselectedCount,
  selectedCount,
  tryItMode
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [ openModal, setOpenModal ] = useState(false);
  const firstFieldRef = useRef(null);

  return (
    <div className="w-3/4 flex space-x-8">
      {openModal && <SignUpModal closeModal={setOpenModal} modalOpen={openModal} />}
      <Tooltip label={isOpen ? undefined : `Export ${selectedCount} track${selectedCount === 1 ? '' : 's'}`}>
        <div className="w-full bg-secondary py-2 px-6 rounded-md hover:cursor-pointer font-semibold text-white flex justify-center items-center">
          <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement="top"
          >
            <PopoverTrigger>
              <div className="flex items-center">
                <SpotifyLogo className="my-4" />
                <p className="w-full text-center ml-2">Export to Spotify</p>
              </div>
            </PopoverTrigger>
            <PopoverContent className="text-black" p={5}>
              <FormControl isRequired>
                <FormLabel>Playlist Name</FormLabel>
                <HStack>
                  <Input
                    ref={firstFieldRef}
                    variant="outline"
                    placeholder="e.g., Good Playlist"
                    isRequired
                    onChange={onChangeTitle}
                    onKeyDown={(e) => {
                      if (tryItMode) {
                        setOpenModal(true);
                      } else if (e.key === "Enter" && !disabled) {
                        onGenerate();
                        onClose();
                      }
                    }}
                  />
                  <div
                    className={`rounded-md w-12 h-10 ${
                      disabled ? "bg-gray-100" : "bg-secondary hover:cursor-pointer"
                    } flex justify-center items-center text-white`}
                    onClick={() => {
                      if (tryItMode) {
                        setOpenModal(true);
                      } else if (!disabled) {
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
        </div>
      </Tooltip>
      
      <div
        className="w-full bg-primary py-2 px-6 rounded-md hover:cursor-pointer font-semibold text-white flex justify-center items-center"
        onClick={async () => await onRegenerate()}
      >
        <GrCycle />
        <Tooltip label={`Regenerate ${unselectedCount === 0 ? selectedCount : unselectedCount} track${unselectedCount === 1 ? '' : 's'}`}>
          <p className="w-full text-center">Regenerate</p>
        </Tooltip>
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
