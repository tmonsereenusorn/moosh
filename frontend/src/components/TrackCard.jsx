import React, { useEffect } from "react";
import { FaPlay, FaStop, FaSpotify } from "react-icons/fa";
import { Checkbox } from "@chakra-ui/react";
import { useAudio } from "../contexts/AudioProvider";
import Tooltip from "./Tooltip";


const TrackCard = ({
  artist,
  title,
  duration,
  preview,
  uri,
  url,
  isSelected,
  isNew,
  onToggleSelection,
}) => {
  const { setSong, stopSong, previewId } = useAudio();

  useEffect(() => {
    return () => {
      stopSong();
    };
  // eslint-disable-next-line
  }, []);

  return (
    <div
      className={`border border-2 border-surface/[.1] flex py-2 pl-2 pr-4 mb-2 rounded-md 
      ${isNew ? "bg-primary bg-opacity-10" : ""} ${isSelected ? "" : "bg-opacity-30 bg-disabled brightness-75 grayscale"}`}
    >
      <div className="flex justify-center items-center w-12 z-0">
        <Checkbox
          colorScheme="dark_accent"
          isChecked={isSelected}
          onChange={onToggleSelection}
        ></Checkbox>
      </div>
      <div className="flex justify-center items-center w-12">
        {!!preview ? (
          <div
            className="rounded-full h-8 w-8 bg-primary flex justify-center items-center hover:cursor-pointer"
            onClick={() =>
              previewId !== uri ? setSong(preview, uri) : stopSong()
            }
          >
            {previewId !== uri ? (
              <FaPlay className="text-white" />
            ) : (
              <FaStop className="text-white" />
            )}
          </div>
        ) : (
          <Tooltip text="Spotify preview not available">
          <div className="rounded-full h-8 w-8 bg-disabled flex justify-center items-center">
            <FaPlay className="text-white" />
          </div>
          </Tooltip>
        )}
      </div>
      <div className="w-1/3 px-2">
        <p
          className="font-bold text-md text-black hover:cursor-pointer hover:underline"
          onClick={() => window.open(url, "_blank")}
        >
          {title}
        </p>
        <p className="text-xs text-dark_accent">{artist}</p>
      </div>
      <div className="w-2/3">
        <div className="w-full h-1/2 flex justify-end items-start">
          <FaSpotify className="text-surface/[0.3] h-3 w-3" />
        </div>
        <div className="w-full h-1/2 flex justify-end items-start">
          <p className="text-xs text-surface">{duration}</p>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
