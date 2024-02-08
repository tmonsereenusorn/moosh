import React from "react";

const TrackCard = ({ artist, title, duration, preview, uri, url }) => {
  return (
    <div className="border border-2 border-surface/[.1] flex py-2 px-4 mb-2 rounded-md">
      <div className="w-1/3">
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