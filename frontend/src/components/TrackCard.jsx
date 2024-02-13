import React from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { useAudio } from "../contexts/AudioProvider";

const TrackCard = ({ artist, title, duration, preview, uri, url }) => {
  const { setSong, stopSong, previewId, audio } = useAudio();

  return (
    <div className="border border-2 border-surface/[.1] flex py-2 pl-2 pr-4 mb-2 rounded-md">
      <div className="flex justify-center items-center w-12">
        {!!preview ? (
          <div
            className="rounded-full h-8 w-8 bg-[#F87171] flex justify-center items-center hover:cursor-pointer"
            onClick={() => previewId !== uri ? setSong(preview, uri) : stopSong()}
          >
            {previewId !== uri ? <FaPlay className="text-white" /> : <FaStop className="text-white" />}
          </div>
        ) : (
          <div className="rounded-full h-8 w-8 bg-gray-200 flex justify-center items-center">
            <FaPlay className="text-white" />
          </div>
        )}
      </div>
      <div className="w-1/3 px-2">
        <p
          className="font-bold text-md text-black hover:cursor-pointer hover:underline"
          onClick={() => window.open(url, "_blank")}
        >
          {title}
        </p>
        <p className="text-xs text-grey-500">{artist}</p>
      </div>
      <div className="w-2/3 flex justify-end items-center">
        <p className="text-xs text-surface">{duration}</p>
      </div>
    </div>
  );
};

export default TrackCard;