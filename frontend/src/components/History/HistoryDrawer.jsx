import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HistoryItem from "./HistoryItem";
import {
  getPlaylistsForUser,
  getPromptsForUser,
  getSongsForPrompt,
} from "../../api/history";
import { useAuth } from "../../contexts/AuthProvider";

const HistoryDrawer = ({ toggleDrawer, visible, onClickCallback }) => {
  const [tab, setTab] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const { uid } = useAuth();

  const toggleTab = () => {
    const historyDoc = document.getElementById("history-bar");
    const libraryDoc = document.getElementById("library-bar");
    setTab(tab === 0 ? 1 : 0);
    historyDoc.classList.toggle("bg-secondary/[0.3]");
    historyDoc.classList.toggle("bg-secondary");
    libraryDoc.classList.toggle("bg-secondary/[0.3]");
    libraryDoc.classList.toggle("bg-secondary");
  };

  const onClick = async (promptId) => {
    const songs = await getSongsForPrompt(promptId);
    onClickCallback(songs);
  };

  // Refetches data every time visible state is changed.
  useEffect(() => {
    if (uid) {
      const unsubscribeHistory = getPromptsForUser(setHistoryData, uid);
      const unsubscribePlaylists = getPlaylistsForUser(setPlaylistData, uid);

      return () => {
        unsubscribeHistory();
        unsubscribePlaylists();
      };
    }
  }, [uid]);

  return (
    <div className="absolute left-0 top-0 h-screen flex w-1/5 z-30">
      <div
        id="drawer"
        className="h-screen w-full bg-gray-100 border-r border-surface/[0.3] transition-transform -translate-x-full py-4 px-2"
      >
        <div className="w-full flex space-x-12 justify-center items-center mb-4">
          <div
            className="font-bold text-surface text-xl hover:cursor-pointer space-y-1 w-1/3 text-center"
            onClick={toggleTab}
          >
            <p>History</p>
            <div
              id="history-bar"
              className="w-full rounded-md h-1 bg-secondary"
            />
          </div>
          <div
            className="font-bold text-surface text-xl hover:cursor-pointer space-y-1 w-1/3 text-center"
            onClick={toggleTab}
          >
            <p>Playlists</p>
            <div
              id="library-bar"
              className="w-full rounded-md h-1 bg-secondary/[0.3]"
            />
          </div>
        </div>
        <div className="overflow-y-auto w-full">
          {tab === 0
            ? historyData?.map((item) => {
                return (
                  <HistoryItem
                    key={item.id}
                    text={item.prompt}
                    promptId={item.id}
                    onClick={() => onClick(item.id)}
                  />
                );
              })
            : playlistData?.map((item) => {
                return (
                  <HistoryItem
                    key={item.id}
                    text={item.title}
                    promptId={item.id}
                    playlistId={""}
                  />
                );
              })}
        </div>
      </div>
      <div id="drawerToggle" className="h-screen flex items-center justify-center transition-transform -translate-x-72 px-1">
        {visible ? 
          <FaChevronLeft className="hover:cursor-pointer scale-200 text-black/[0.8] hover:text-primary" onClick={toggleDrawer} />
        : 
          <FaChevronRight className="hover:cursor-pointer scale-200 text-black/[0.8] hover:text-primary" onClick={toggleDrawer} />
        }
      </div>
    </div>
  );
};

export default HistoryDrawer;
