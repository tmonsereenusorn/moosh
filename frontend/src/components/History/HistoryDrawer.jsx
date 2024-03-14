import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import HistoryItem from "./HistoryItem";

const historyData = [
  {
    prompt: "this is an example prompt lololololololol yadyaydayda.",
    playlistRef: ""
  },
  {
    prompt: "this is an example prompt lololololololol yadyaydayda."
  }
];

const libraryData = [
  {
    prompt: "this is an example prompt lololololololol.",
    playlistRef: ""
  }
];

const HistoryDrawer = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <div className="absolute left-0 top-0 h-screen w-1/5 bg-gray-100 border-r border-surface/[0.3] z-30 p-4">
      <div className="h-4 mb-4 flex justify-end items-center w-full">
        <FaChevronLeft className="text-surface/[.7] hover:cursor-pointer" onClick={onClose} />
      </div>
      <div className="w-full flex space-x-12 justify-center items-center mb-4">
        <div
          className="font-bold text-surface text-xl hover:cursor-pointer space-y-1 w-1/3 text-center"
          onClick={() => setTab(0)}
        >
          <p>History</p>
          <div className={`w-full rounded-md h-1 bg-secondary${tab === 1 ? "/[0.3]" : ""}`} />
        </div>
        <div
          className="font-bold text-surface text-xl hover:cursor-pointer space-y-1 w-1/3 text-center"
          onClick={() => setTab(1)}
        >
          <p>Library</p>
          <div className={`w-full rounded-md h-1 bg-secondary${tab === 0 ? "/[0.3]" : ""}`} />
        </div>
      </div>
      <div className="overflow-y-auto w-full">
        {tab === 0 ? (
          historyData.map(item => {
            return <HistoryItem prompt={item.prompt} />;
          })
        ) : (
          libraryData.map(item => {
            return <HistoryItem prompt={item.prompt} />;
          })
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;