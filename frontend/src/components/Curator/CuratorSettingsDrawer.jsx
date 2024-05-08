import React from "react";
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Checkbox } from '@chakra-ui/react';
import { FaXmark } from "react-icons/fa6";

const SETTINGS = {
  DANCEABILITY: "danceability",
  ENERGY: "energy",
  ACOUSTICNESS: "acousticness"
};

const CuratorSettingsDrawer = ({ toggleDrawer, settings, setSettings }) => {
  const setGpt4 = e => {
    setSettings(prevSettings => {
      return {
        ...prevSettings,
        gpt4: e.target.checked
      }
    })
  }

  const setNumSongs = n => {
    setSettings(prevSettings => {
      return {
        ...prevSettings,
        numSongs: n
      }
    });
  };

  const toggleSetting = (setting, state) => {
    setSettings(prevSettings => {
      return {
        ...prevSettings,
        [setting]: {
          enabled: state,
          threshold: prevSettings[setting]?.threshold
        }
      }
    });
  };

  const setThreshold = (setting, n) => {
    setSettings(prevSettings => {
      return {
        ...prevSettings,
        [setting]: {
          enabled: true,
          threshold: n
        }
      }
    });
  };

  return (
    <div
      id="settingsDrawer"
      className="w-screen h-1/3 transition-transform translate-y-full bg-gray-100 border-t border-surface/[0.3] fixed bottom-0 z-30 py-4 px-8"
    >
      <FaXmark
        className="absolute right-4 top-2 text-surface/[0.6] hover:text-surface h-6 w-6 hover:cursor-pointer"
        onClick={toggleDrawer}
      />
      <p className="text-xl font-semibold text-surface">Curator Settings</p>
      <hr className="bg-surface/[0.6] h-[1px] w-1/4 rounded-md mb-4" />
      <div className="grid grid-cols-2 grid-rows-4 gap-x-8 gap-y-4">
        <div>
          <p className="text-sm font-semibold text-surface">Number of Songs: {settings.numSongs}</p>
          <Slider defaultValue={settings.numSongs} value={settings.numSongs} onChange={setNumSongs} min={5} max={50} colorScheme="teal">
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color="teal" />
            </SliderThumb>
          </Slider>
        </div>
        <div>
          <div className="flex space-x-2 items-center">
            <Checkbox colorScheme="teal" isChecked={settings.danceability?.enabled} onChange={e => toggleSetting(SETTINGS.DANCEABILITY, e.target.checked)} />
            <p className="text-sm font-semibold text-surface">Danceability{settings.danceability?.enabled && <span>: {settings.danceability?.threshold}</span>}</p>
          </div>
          {settings.danceability?.enabled && (
            <Slider defaultValue={5} value={settings.danceability?.threshold} onChange={n => setThreshold(SETTINGS.DANCEABILITY, n)} min={0} max={10}  colorScheme="teal">
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="teal" />
              </SliderThumb>
            </Slider>
          )}
        </div>
        <div>
          <div className="flex space-x-2 items-center">
            <Checkbox colorScheme="teal" isChecked={settings.energy?.enabled} onChange={e => toggleSetting(SETTINGS.ENERGY, e.target.checked)} />
            <p className="text-sm font-semibold text-surface">Energy{settings.energy?.enabled && <span>: {settings.energy?.threshold}</span>}</p>
          </div>
          {settings.energy?.enabled && (
            <Slider defaultValue={5} value={settings.energy?.threshold} onChange={n => setThreshold(SETTINGS.ENERGY, n)} min={0} max={10}  colorScheme="teal">
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="teal" />
              </SliderThumb>
            </Slider>
          )}
        </div>
        <div>
          <div className="flex space-x-2 items-center">
            <Checkbox colorScheme="teal" isChecked={settings.acousticness?.enabled} onChange={e => toggleSetting(SETTINGS.ACOUSTICNESS, e.target.checked)} />
            <p className="text-sm font-semibold text-surface">Acousticness{settings.acousticness?.enabled && <span>: {settings.acousticness?.threshold}</span>}</p>
          </div>
          {settings.acousticness?.enabled && (
            <Slider defaultValue={5} value={settings.acousticness?.threshold} onChange={n => setThreshold(SETTINGS.ACOUSTICNESS, n)} min={0} max={10}  colorScheme="teal">
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="teal" />
              </SliderThumb>
            </Slider>
          )}
        </div>
        <div>
          <div className="flex space-x-2 items-center">
            <Checkbox colorScheme="teal" isChecked={settings.gpt4} onChange={setGpt4} />
            <p className="text-sm font-semibold text-surface">GPT 4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CuratorSettingsDrawer;