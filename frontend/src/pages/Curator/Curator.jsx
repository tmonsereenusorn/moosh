import React, { useState } from "react";
import {
  getRecommendationsFromPrompt,
  getRecommendationsFromExistingTracks,
} from "../../api/recommendation";
import { exportPlaylist } from "../../api/playlist";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthProvider";
import HistoryDrawer from "../../components/History/HistoryDrawer";
import {
  addExportedPlaylist,
  addPrompt,
  deletePrompt,
  updatePromptSongs,
} from "../../api/history";

import PromptView from "./views/PromptView";
import ExportedView from "./views/ExportedView";
import CuratedView from "./views/CuratedView";

const CuratorStages = Object.freeze({
  PROMPT: 0,
  CURATED: 1,
  EXPORTED: 2,
});

const Curator = () => {
  const { user } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [recs, setRecs] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTracks, setSelectedTracks] = useState({});
  const [selectAllButton, setSelectAllButton] = useState(true);
  const [curatorStage, setCuratorStage] = useState(CuratorStages.PROMPT);
  const [settings, setSettings] = useState({
    numSongs: 20,
    danceability: {
      enabled: false,
      threshold: 5
    },
    energy: {
      enabled: false,
      threshold: 5
    },
    acousticness: {
      enabled: false,
      threshold: 5
    }
  });

  // For firestore function calls.
  const [promptIdState, setPromptIdState] = useState("");
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  // Get recommendations, reset prompt.
  const onSubmit = async () => {
    setLoading(true);

    const unselectedCount = Object.values(selectedTracks).filter(
      (isSelected) => !isSelected
    ).length;

    // If there are unselected tracks, fetch new recommendations directly from spotify using kept tracks
    if (unselectedCount > 0 && unselectedCount !== recs.length) {
      const keptSongs = recs
        .filter((rec) => selectedTracks[rec.id])
        .map((rec) => rec.id);
      const blacklistedSongs = recs.map((track) => track.id);
      const regeneratedSettings = {
        ...settings,
        numSongs: unselectedCount
      };
      const newRecs = await getRecommendationsFromExistingTracks(
        keptSongs,
        regeneratedSettings,
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
      await updatePromptSongs(promptId, updatedSelections);

      // Apply the updated selection status.
      setSelectedTracks(updatedSelections);
    } else {
      // If all tracks are selected or no tracks have been generated yet, fetch a new set of recommendations
      const newRecs = await getRecommendationsFromPrompt(prompt, settings);

      const updatedNewRecs = newRecs.map((track, index) => ({
        ...track,
        isNew: false,
        displayOrder: index,
      }));

      const promptId = await addPrompt(prompt);
      await updatePromptSongs(promptId, updatedNewRecs);
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
    setCuratorStage(CuratorStages.CURATED);
  };

  const toggleTrackSelection = (id) => {
    setSelectedTracks((prevSelectedTracks) => {
      // Update the track selection state
      const newSelectedTracks = {
        ...prevSelectedTracks,
        [id]: !prevSelectedTracks[id]
      };
  
      // Check if all tracks are deselected after the update
      const allDeselected = Object.keys(newSelectedTracks).length > 0 &&
                            Object.values(newSelectedTracks).every(isSelected => !isSelected);
  
      // If all tracks are deselected, update the select all button state
      if (allDeselected) {
        setSelectAllButton(false);
      } else {
        setSelectAllButton(true);
      }
  
      return newSelectedTracks;
    });
  };

  // Generate the playlist to Spotify, change view to signal playlist creation.
  const onExport = async () => {
    setLoading(true);
    const songsToExport = recs.filter((rec) => selectedTracks[rec.id]);
    const data = await exportPlaylist({
      name: title,
      userId: user.id,
      songs: songsToExport,
      description: description,
    });

    // Firestore update.
    await addExportedPlaylist(data.id, promptIdState, title, data?.images[0]?.url, data?.external_urls?.spotify);

    setUrl(data.external_urls.spotify);
    setPrompt("");
    setLoading(false);
    setCuratorStage(CuratorStages.EXPORTED);
  };

  // Clear states and return to prompting view.
  const onReset = async () => {
    setRecs([]);
    setSelectedTracks({});
    setTitle("");
    setDescription("");
    setPrompt("");
    setLoading(false);
    setCuratorStage(CuratorStages.PROMPT);
  };

  const toggleHistoryDrawer = () => {
    if (settingsDrawerVisible) toggleSettingsDrawer();
    setHistoryDrawerVisible(visibility => !visibility);
    const drawer = document.getElementById("historyDrawer");
    const drawerToggle = document.getElementById("historyDrawerToggle");
    drawer?.classList.toggle("-translate-x-full");
    drawerToggle?.classList.toggle("sm:translate-x-72");
    drawerToggle?.classList.toggle("translate-x-56");
  };

  const toggleSettingsDrawer = () => {
    if (historyDrawerVisible) toggleHistoryDrawer();
    setSettingsDrawerVisible(visibility => !visibility);
    const drawer = document.getElementById("settingsDrawer");
    drawer?.classList.toggle("translate-y-full");
  };

  const onHistoryItemClick = (songs, item) => {
    setRecs(songs);
    setPrompt(item.prompt);
    setSettings(prevSettings => {
      return {
        ...prevSettings,
        numSongs: songs.length
      }
    });
    
    // Select all tracks
    const newSelectedTracks = songs.reduce((acc, track) => {
      acc[track.id] = true;
      return acc;
    }, {});

    setSelectedTracks(newSelectedTracks);
    setSelectAllButton(true);
    setCuratorStage(CuratorStages.CURATED);
  };

  const toggleSelectAllButton = () => {
    const allSelected =
      Object.keys(selectedTracks).length > 0 &&
      Object.values(selectedTracks).every((isSelected) => isSelected);

    if (allSelected) {
      // If all are currently selected, deselect all
      const allDeselected = recs.reduce((acc, track) => {
        acc[track.id] = false;
        return acc;
      }, {});
      setSelectedTracks(allDeselected);
      setSelectAllButton(false);
    } else {
      // If not all are selected, select all
      const allSelected = recs.reduce((acc, track) => {
        acc[track.id] = true;
        return acc;
      }, {});
      setSelectedTracks(allSelected);
      setSelectAllButton(true);
    }
  };

  const getUnselectedCount = () => {
    return recs.filter((rec) => !selectedTracks[rec.id]).length;
  };

  const getSelectedCount = () => {
    return recs.filter((rec) => selectedTracks[rec.id]).length;
  };

  const renderSwitch = () => {
    switch (curatorStage) {
      case CuratorStages.PROMPT:
        return (
          <PromptView
            onSubmit={onSubmit}
            prompt={prompt}
            onChangePrompt={onChangePrompt}
            toggleSettingsDrawer={toggleSettingsDrawer}
            settings={settings}
            setSettings={setSettings}
          />
        );
      case CuratorStages.CURATED:
        return (
          <CuratedView
            recs={recs}
            prompt={prompt}
            onExport={onExport}
            onSubmit={onSubmit}
            onReset={onReset}
            onChangeTitle={onChangeTitle}
            title={title}
            selectedTracks={selectedTracks}
            toggleTrackSelection={toggleTrackSelection}
            selectAllButton={selectAllButton}
            toggleSelectAllButton={toggleSelectAllButton}
            getSelectedCount={getSelectedCount}
            getUnselectedCount={getUnselectedCount}
          />
        );
      case CuratorStages.EXPORTED:
        return <ExportedView url={url} title={title} onReset={onReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-y-hidden">
      <div className="flex w-2/3 items-center justify-center">
        <>
          <HistoryDrawer
            toggleDrawer={toggleHistoryDrawer}
            visible={historyDrawerVisible}
            onClickCallback={(songs, item) => onHistoryItemClick(songs, item)}
          />          
          {loading ? (
            <Loader />
          ) : (
            renderSwitch()
          )}
        </>
      </div>
    </div>
  );
};

export default Curator;
