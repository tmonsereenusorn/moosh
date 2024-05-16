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
  previewCallback,
  linkCallback,
}) => {
  const { setSong, stopSong, previewId } = useAudio();

  useEffect(() => {
    return () => {
      stopSong();
    };
    // eslint-disable-next-line
  }, []);

  const onClickPreview = () => {
    if (previewId !== uri) {
      previewCallback();
      setSong(preview, uri);
    } else {
      stopSong();
    }
  };

  const onClickLink = () => {
    window.open(url, "_blank");
    linkCallback();
  };

  return (
    <div
      className={`border border-2 border-surface/[.1] flex py-2 px-2 mb-2 rounded-md w-full
      ${isNew ? "bg-primary bg-opacity-10" : ""} ${
        isSelected ? "" : "bg-opacity-30 bg-disabled brightness-75 grayscale"
      }`}
    >
      <div className="flex justify-center items-center w-12 z-0 mr-2">
        <Checkbox
          colorScheme="dark_accent"
          isChecked={isSelected}
          onChange={onToggleSelection}
          size="lg"
        ></Checkbox>
      </div>
      <div className="flex justify-center items-center w-12">
        {!!preview ? (
          <div
            className="rounded-full h-8 w-8 bg-primary flex justify-center items-center hover:cursor-pointer"
            onClick={onClickPreview}
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
      <div className="w-full sm:w-1/3 px-2">
        <p
          className="font-bold text-black hover:cursor-pointer hover:underline"
          onClick={onClickLink}
        >
          {title}
        </p>
        <p className="sm:text-sm text-xs text-dark-accent">{artist}</p>
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
