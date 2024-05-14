import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HistoryItem from "./HistoryItem";
import history from "../../api/history";
import { useAuth } from "../../contexts/AuthProvider";

const DAY_OFS = 24 * 60 * 60 * 1000;

const TimeIndexedList = ({
  week,
  month,
  beyond,
  onClickCallback,
  isPlaylist = false,
}) => {
  const onClick = async (item) => {
    if (isPlaylist) {
      window.open(item.url, "_blank");
      return;
    }
    const songs = await history.getSongsForPrompt(item.id);
    onClickCallback(songs, item);
  };

  return (
    <div className="space-y-2">
      {week?.length > 0 && (
        <div>
          <p className="text-surface/[0.8] font-semibold text-md md:text-xs ml-2 mb-1">
            Previous 7 Days
          </p>
          {week?.map((item) => {
            return (
              <HistoryItem
                key={item.id}
                item={item}
                onClick={() => onClick(item)}
                isPlaylist={isPlaylist}
              />
            );
          })}
        </div>
      )}
      {month?.length > 0 && (
        <div>
          <p className="text-surface/[0.8] font-semibold text-md md:text-xs ml-2 mb-1">
            Previous 30 Days
          </p>
          {month?.map((item) => {
            return (
              <HistoryItem
                key={item.id}
                item={item}
                onClick={() => onClick(item)}
                isPlaylist={isPlaylist}
              />
            );
          })}
        </div>
      )}
      {beyond?.length > 0 && (
        <div>
          <p className="text-surface/[0.8] font-semibold text-md md:text-xs ml-2 mb-1">
            Long Ago...
          </p>
          {beyond?.map((item) => {
            return (
              <HistoryItem
                key={item.id}
                item={item}
                onClick={() => onClick(item)}
                isPlaylist={isPlaylist}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const HistoryDrawer = ({ toggleDrawer, visible, onClickCallback }) => {
  const [tab, setTab] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [weekHistory, setWeekHistory] = useState([]);
  const [monthHistory, setMonthHistory] = useState([]);
  const [beyondHistory, setBeyondHistory] = useState([]);
  const [weekPlaylists, setWeekPlaylists] = useState([]);
  const [monthPlaylists, setMonthPlaylists] = useState([]);
  const [beyondPlaylists, setBeyondPlaylists] = useState([]);

  const { uid } = useAuth();

  const toggleTab = () => {
    const historyDoc = document.getElementById("history-bar");
    const libraryDoc = document.getElementById("playlist-bar");
    setTab(tab === 0 ? 1 : 0);
    historyDoc.classList.toggle("bg-secondary/[0.3]");
    historyDoc.classList.toggle("bg-secondary");
    libraryDoc.classList.toggle("bg-secondary/[0.3]");
    libraryDoc.classList.toggle("bg-secondary");
  };

  // Refetches data every time visible state is changed.
  useEffect(() => {
    if (uid) {
      const unsubscribeHistory = history.getPromptsForUser(setHistoryData, uid);
      const unsubscribePlaylists = history.getPlaylistsForUser(
        setPlaylistData,
        uid
      );

      return () => {
        unsubscribeHistory();
        unsubscribePlaylists();
      };
    }
  }, [uid]);

  useEffect(() => {
    const sortedHistory = historyData.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setWeekHistory(
      sortedHistory.filter(
        (item) => new Date(item.timestamp) > new Date().getTime() - 7 * DAY_OFS
      )
    );
    setMonthHistory(
      sortedHistory.filter(
        (item) =>
          new Date(item.timestamp) > new Date().getTime() - 30 * DAY_OFS &&
          new Date(item.timestamp) <= new Date().getTime() - 7 * DAY_OFS
      )
    );
    setBeyondHistory(
      sortedHistory.filter(
        (item) =>
          new Date(item.timestamp) <= new Date().getTime() - 30 * DAY_OFS
      )
    );
  }, [historyData]);

  useEffect(() => {
    const sortedPlaylists = playlistData.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setWeekPlaylists(
      sortedPlaylists.filter(
        (item) => new Date(item.timestamp) > new Date().getTime() - 7 * DAY_OFS
      )
    );
    setMonthPlaylists(
      sortedPlaylists.filter(
        (item) =>
          new Date(item.timestamp) > new Date().getTime() - 30 * DAY_OFS &&
          new Date(item.timestamp) <= new Date().getTime() - 7 * DAY_OFS
      )
    );
    setBeyondPlaylists(
      sortedPlaylists.filter(
        (item) =>
          new Date(item.timestamp) <= new Date().getTime() - 30 * DAY_OFS
      )
    );
  }, [playlistData]);

  return (
    <>
      <div
        id="historyDrawer"
        className="h-screen w-2/3 md:w-1/5 transition-transform -translate-x-full bg-gray-100 border-r border-surface/[0.3] fixed left-0 z-30 py-8 px-2 space-y-2"
      >
        <div className="flex space-x-4 sm:space-x-12 items-center justify-center mb-3">
          <div className="space-y-1 hover:cursor-pointer" onClick={toggleTab}>
            <p className="text-lg sm:text-2xl font-semibold text-surface">
              History
            </p>
            <div
              id="history-bar"
              className="w-full h-1 rounded-md bg-secondary"
            />
          </div>
          <div className="space-y-1 hover:cursor-pointer" onClick={toggleTab}>
            <p className="text-lg sm:text-2xl font-semibold text-surface">
              Playlists
            </p>
            <div
              id="playlist-bar"
              className="w-full h-1 rounded-md bg-secondary/[0.3]"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-full pb-8 pr-1 relative">
          {tab === 0 ? (
            <TimeIndexedList
              week={weekHistory}
              month={monthHistory}
              beyond={beyondHistory}
              onClickCallback={onClickCallback}
            />
          ) : (
            <TimeIndexedList
              week={weekPlaylists}
              month={monthPlaylists}
              beyond={beyondPlaylists}
              onClickCallback={onClickCallback}
              isPlaylist={true}
            />
          )}
        </div>
      </div>
      <div
        id="historyDrawerToggle"
        className="transition-transform absolute left-4 flex w-2/3 md:w-1/5 h-screen justify-left items-center z-30"
      >
        {visible ? (
          <FaChevronLeft
            className="hover:cursor-pointer scale-200 text-black/[0.8] hover:text-primary"
            onClick={toggleDrawer}
          />
        ) : (
          <FaChevronRight
            className="hover:cursor-pointer scale-200 text-black/[0.8] hover:text-primary"
            onClick={toggleDrawer}
          />
        )}
      </div>
    </>
  );
};

export default HistoryDrawer;
