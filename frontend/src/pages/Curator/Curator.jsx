import React, { useEffect, useState } from "react";

import {
  getRecommendationsFromPrompt,
  getRecommendationsFromExistingTracks,
} from "../../api/recommendation";
import { exportPlaylist } from "../../api/exportPlaylist";
import { AudioProvider } from "../../contexts/AudioProvider";

import CuratorInput from "../../components/CuratorInput";
import TrackCard from "../../components/TrackCard";
import Loader from "../../components/Loader";
import { FaCircleCheck, FaChevronRight } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthProvider";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import ChoiceLayer from "../../components/ChoiceLayer";
import HistoryDrawer from "../../components/History/HistoryDrawer";
import {
  addExportedPlaylist,
  addPrompt,
  deletePrompt,
  getPromptsForUser,
  updatePromptSongs,
} from "../../api/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import CuratorSettingsDrawer from "../../components/CuratorSettingsDrawer";

const Curator = () => {
  const { user } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [exported, setExported] = useState(false); // For rendering a final view after sending playlist to Spotify.
  const [recs, setRecs] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTracks, setSelectedTracks] = useState({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numSongs, setNumSongs] = useState(20);

  // For firestore function calls.
  const [playlistIdState, setPlaylistIdState] = useState("");
  const [promptIdState, setPromptIdState] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const toggleSettingsDrawer = () => {
    setIsSettingsOpen((prevIsSettingsOpen) => !prevIsSettingsOpen);
  };

  // Get recommendations, reset prompt.
  const onSubmit = async () => {
    setLoading(true);

    const unselectedCount = Object.values(selectedTracks).filter(
      (isSelected) => !isSelected
    ).length;

    // If there are unselected tracks, fetch new recommendations directly from spotify using kept tracks
    if (unselectedCount > 0) {
      const keptSongs = recs
        .filter((rec) => selectedTracks[rec.id])
        .map((rec) => rec.id);
      const blacklistedSongs = recs.map((track) => track.id);
      const newRecs = await getRecommendationsFromExistingTracks(
        keptSongs,
        unselectedCount,
        blacklistedSongs
      );
      const updatedNewRecs = newRecs.map((track, index) => ({
        ...track,
        isNew: true,
        displayOrder: index, // Assign a new order to make these appear at the top
      }));

      // Filter out unselected tracks, change their state to Old and display them under new Recs
      const filteredRecs = recs
        .filter((rec) => selectedTracks[rec.id])
        .map((track) => ({
          ...track,
          isNew: false,
          displayOrder: newRecs.length + track.displayOrder,
        }));

      setRecs([...updatedNewRecs, ...filteredRecs]);

      // Filter out unselected tracks from selectedTracks and add new tracks.
      const updatedSelections = recs
        .filter((rec) => selectedTracks[rec.id]) // Start with currently selected tracks
        .reduce((acc, track) => {
          acc[track.id] = true; // Retain selection status
          return acc;
        }, {});

      // Mark new tracks as selected in updatedSelections.
      updatedNewRecs.forEach((track) => {
        updatedSelections[track.id] = true;
      });

      // Update prompt's songs in firestore.
      await deletePrompt(promptIdState);
      const promptId = await addPrompt(prompt);
      const songsId = await updatePromptSongs(promptId, updatedSelections);

      // Apply the updated selection status.
      setSelectedTracks(updatedSelections);
    } else {
      // If all tracks are selected or no tracks have been generated yet, fetch a new set of recommendations
      const newRecs = await getRecommendationsFromPrompt(prompt, numSongs);

      const updatedNewRecs = newRecs.map((track, index) => ({
        ...track,
        isNew: false,
        displayOrder: index,
      }));

      const promptId = await addPrompt(prompt);
      const songsId = await updatePromptSongs(promptId, updatedNewRecs);
      setPromptIdState(promptId);
      setRecs(updatedNewRecs);

      const initialSelections = updatedNewRecs.reduce((acc, track) => {
        acc[track.id] = true;
        return acc;
      }, {});

      setSelectedTracks(initialSelections);
    }

    // Firestore updates.
    setDescription(prompt);
    setLoading(false);
  };

  const toggleTrackSelection = (id) => {
    setSelectedTracks((prevSelectedTracks) => ({
      ...prevSelectedTracks,
      [id]: !prevSelectedTracks[id],
    }));
  };

  // Generate the playlist to Spotify, change view to signal playlist creation.
  const onExport = async () => {
    setLoading(true);
    const data = await exportPlaylist({
      name: title,
      userId: user.id,
      songs: recs,
      description: description,
    });
    setPlaylistIdState(data.id);
    // Firestore update.
    await addExportedPlaylist(data.id, promptIdState, title);

    setUrl(data.external_urls.spotify);
    setPrompt("");
    setLoading(false);
    setExported(true);
  };

  // Clear states and return to prompting view.
  const onReset = async () => {
    setRecs([]);
    setSelectedTracks({});
    setTitle("");
    setDescription("");
    setPrompt("");
    setLoading(false);
    setExported(false);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
    const drawer = document.getElementById("drawer");
    drawer?.classList.toggle("-translate-x-full");
  };

  const onHistoryItemClick = (songs) => {
    setRecs(songs);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex w-2/3 items-center justify-center">
        {loading ? (
          <Loader />
        ) : exported ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <FaCircleCheck className="text-secondary text-6xl" />

            <p className="font-bold text-xl text-surface">Listen to</p>
            <p
              className="font-bold text-2xl text-black hover:cursor-pointer hover:underline"
              onClick={() => window.open(url, "_blank")}
            >
              {title}
            </p>
            <ButtonPrimary text={"Do it again!"} onClick={() => onReset()} />
          </div>
        ) : (
          <div className="flex flex-col w-3/4 h-[100vh] pt-14 pb-24">
            {recs.length > 0 && (
              <div className="w-full items-center justify-center p-2">
                <div className="text-2xl font-bold text-surface text-center">
                  {prompt}
                </div>
              </div>
            )}
            <div className="flex-grow overflow-y-auto">
              <AudioProvider>
                {recs.map((recommendation) => {
                  return (
                    <TrackCard
                      key={recommendation.id}
                      artist={recommendation.artist}
                      title={recommendation.title}
                      duration={recommendation.duration}
                      preview={recommendation.preview}
                      uri={recommendation.uri}
                      url={recommendation.url}
                      isSelected={selectedTracks[recommendation.id]}
                      isNew={recommendation.isNew}
                      onToggleSelection={() =>
                        toggleTrackSelection(recommendation.id)
                      }
                    />
                  );
                })}
              </AudioProvider>
            </div>
          </div>
        )}
        {recs.length && !exported > 0 && !loading ? (
          <div
            className={`fixed bottom-0 flex h-24 w-2/3 bg-white items-center justify-center p-[32px] space-x-4`}
          >
            <ChoiceLayer
              onGenerate={onExport}
              onRegenerate={onSubmit}
              onCancel={onReset}
              onChangeTitle={onChangeTitle}
              disabled={title.length === 0}
            />
          </div>
        ) : !exported && !loading ? (
          <>
            <div className="absolute left-2 top-1/2">
              <FaChevronRight
                className="text-surface scale-150 hover:cursor-pointer"
                onClick={toggleDrawer}
              />
            </div>
            <HistoryDrawer
              onClose={toggleDrawer}
              visible={drawerVisible}
              onClickCallback={(songs) => onHistoryItemClick(songs)}
            />
            <div className="fixed inset-0 flex justify-center items-center">
              <div className="w-1/2 flex flex-col items-center space-y-2">
                <div className="w-full flex justify-center items-center">
                  <CuratorInput
                    onSubmit={onSubmit}
                    value={prompt}
                    onChangeText={(event) => onChangePrompt(event)}
                    disabled={prompt.length === 0}
                  />
                  <button
                    aria-label="Curator Settings"
                    className="ml-3"
                    onClick={toggleSettingsDrawer}
                  >
                    <FontAwesomeIcon icon={faCog} />
                  </button>
                </div>
                {isSettingsOpen && (
                  <CuratorSettingsDrawer
                    numSongs={numSongs}
                    setNumSongs={setNumSongs}
                  />
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Curator;
