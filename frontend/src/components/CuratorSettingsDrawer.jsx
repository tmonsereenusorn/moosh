import React from "react";
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';

const CuratorSettingsDrawer = ({numSongs, setNumSongs}) => {
    return (
        <div className="bg-white rounded-lg p-4 w-full border-2 border-surface">
          <h1 className="text-lg font-semibold text-center">Curator Settings</h1>
          <Text mb={2}>Number of Songs: {numSongs}</Text>
          <Slider defaultValue={numSongs} value={numSongs} onChange={(value) => setNumSongs(value)} min={5} max={50} colorScheme="teal">
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color="teal" />
            </SliderThumb>
          </Slider>
        </div>
    )
}

export default CuratorSettingsDrawer