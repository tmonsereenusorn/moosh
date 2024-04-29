import React from "react";
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { FaCog } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const CuratorSettingsDrawer = ({ visible, toggleDrawer, numSongs, setNumSongs }) => {
  return (
    <>
      {!visible && (
        <FaCog
          className="absolute bottom-4 right-4 text-surface/[0.6] z-30 w-6 h-6 hover:cursor-pointer hover:text-surface"
          onClick={toggleDrawer}
        />
      )}
      <div
        id="settingsDrawer"
        className="w-screen h-1/3 transition-transform translate-y-full bg-gray-100 border-t border-surface/[0.3] fixed bottom-0 z-30 p-4"
      >
        <FaXmark
          className="absolute right-2 top-2 text-surface/[0.6] hover:text-surface h-6 w-6 hover:cursor-pointer"
          onClick={toggleDrawer}
        />
        <p className="text-xl font-semibold text-surface">Curator Settings</p>
        <hr className="bg-surface/[0.6] h-[1px] w-1/4 rounded-md mb-4" />
        <div className="grid grid-cols-2 grid-rows-3 gap-4">
          <div>
            <p className="text-sm font-semibold text-surface">Number of Songs: {numSongs}</p>
            <Slider defaultValue={numSongs} value={numSongs} onChange={(value) => setNumSongs(value)} min={5} max={50} colorScheme="teal">
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="teal" />
              </SliderThumb>
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}

export default CuratorSettingsDrawer;