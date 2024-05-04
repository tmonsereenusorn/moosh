import React, { useEffect, useState } from "react";
import {
  getRecommendationsFromPrompt,
  getRecommendationsFromExistingTracks,
} from "../../api/recommendation";
import { exportPlaylist } from "../../api/playlist";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthProvider";
import HistoryDrawer from "../../components/History/HistoryDrawer";
import history from "../../api/history";
import kpis from "../../api/kpis";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numSongs, setNumSongs] = useState(20);
  const [curatorStage, setCuratorStage] = useState(CuratorStages.PROMPT);
  const [sessionId, setSessionId] = useState("");

  // KPI specific state.
  // Prompting
  const [kpiNumKeystrokes, setKpiNumKeystrokes] = useState(0);
  // Regenerations
  const [kpiNumToggles, setKpiNumToggles] = useState(0);
  const [kpiNumPreviewPlays, setKpiNumPreviewPlays] = useState(0);
  const [kpiNumLinkClicks, setKpiNumLinkClicks] = useState(0);
  const [kpiNumToggleAlls, setKpiNumToggleAlls] = useState(0);
  const [kpiNumRegenerations, setKpiNumRegenerations] = useState(0);

  // For firestore function calls.
  const [promptIdState, setPromptIdState] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    // If there's no visited token, log the session.
    if (!sessionStorage.getItem("visited")) {
      sessionStorage.setItem("visited", true);
      const sessionId = kpis.logSession();
      setSessionId(sessionId);
    }
  });

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
    setKpiNumKeystrokes((prev) => prev + 1);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const toggleSettingsDrawer = () => {
    setIsSettingsOpen((prevIsSettingsOpen) => !prevIsSettingsOpen);
  };

  const resetRegenerationKpis = () => {
    setKpiNumToggles(0);
    setKpiNumPreviewPlays(0);
    setKpiNumLinkClicks(0);
    setKpiNumToggleAlls(0);
  };
  // Get recommendations, reset prompt.
  const onSubmit = async (regeneration = false) => {
    setLoading(true);
    const unselectedCount = Object.values(selectedTracks).filter(
      (isSelected) => !isSelected
    ).length;

    // If there are unselected tracks, fetch new recommendations directly from spotify using kept tracks
    if (regeneration) {
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
      history.updatePromptRegeneration(prompt, promptIdState, [
        ...updatedNewRecs,
        ...filteredRecs,
      ]);

      // Apply the updated selection status.
      setSelectedTracks(updatedSelections);

      // Log regeneration.
      const regeneratationLogId = kpis.logRegeneration(
        kpiNumToggles,
        kpiNumToggleAlls,
        kpiNumPreviewPlays,
        kpiNumLinkClicks,
        unselectedCount,
        promptIdState,
        sessionId
      );

      setKpiNumRegenerations((prev) => prev + 1);
      //Reset the KPIs specific to interactions on that version of the playlist.
      resetRegenerationKpis();
    } else {
      // If all tracks are selected or no tracks have been generated yet, fetch a new set of recommendations
      const newRecs = await getRecommendationsFromPrompt(prompt, numSongs);

      const updatedNewRecs = newRecs.map((track, index) => ({
        ...track,
        isNew: false,
        displayOrder: index,
      }));

      const promptId = await history.addPrompt(prompt);

      await history.updatePromptSongs(promptId, updatedNewRecs);
      setPromptIdState(promptId);
      setRecs(updatedNewRecs);

      const initialSelections = updatedNewRecs.reduce((acc, track) => {
        acc[track.id] = true;
        return acc;
      }, {});

      setSelectedTracks(initialSelections);

      // Log prompting.
      const promptLogId = kpis.logPrompt(
        kpiNumKeystrokes,
        numSongs,
        prompt.length,
        promptId,
        sessionId
      );
    }

    setDescription(prompt);
    setLoading(false);
    setCuratorStage(CuratorStages.CURATED);
  };

  const toggleTrackSelection = (id) => {
    // Update regeneration metadata.
    setKpiNumToggles((prev) => prev + 1);

    setSelectedTracks((prevSelectedTracks) => {
      // Update the track selection state
      const newSelectedTracks = {
        ...prevSelectedTracks,
        [id]: !prevSelectedTracks[id],
      };

      // Check if all tracks are deselected after the update
      const allDeselected =
        Object.keys(newSelectedTracks).length > 0 &&
        Object.values(newSelectedTracks).every((isSelected) => !isSelected);

      // If all tracks are deselected, update the select all button state
      if (allDeselected) {
        setSelectAllButton(false);
      } else {
        setSelectAllButton(true);
      }

      setKpiNumToggles((prev) => prev + 1);

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
    const playlistId = data.id;
    await history.addExportedPlaylist(
      data.id,
      promptIdState,
      title,
      data?.images[0]?.url,
      data?.external_urls?.spotify
    );

    kpis.logExport(kpiNumRegenerations, playlistId, promptIdState, sessionId);

    setUrl(data.external_urls.spotify);
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

    setKpiNumKeystrokes(0);
    setKpiNumPreviewPlays(0);
    setKpiNumToggles(0);
    setKpiNumRegenerations(0);
    resetRegenerationKpis();

    setLoading(false);
    setCuratorStage(CuratorStages.PROMPT);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
    const drawer = document.getElementById("drawer");
    const drawerToggle = document.getElementById("drawerToggle");
    drawer?.classList.toggle("-translate-x-full");
    drawerToggle?.classList.toggle("sm:translate-x-72");
    drawerToggle?.classList.toggle("translate-x-56");
  };

  const onHistoryItemClick = (songs) => {
    setRecs(songs);
    setCuratorStage(CuratorStages.CURATED);
  };

  const toggleSelectAllButton = () => {
    setKpiNumToggleAlls((prev) => prev + 1);
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
            isSettingsOpen={isSettingsOpen}
            numSongs={numSongs}
            setNumSongs={setNumSongs}
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
            incrementPreviewClicks={() => {
              setKpiNumPreviewPlays((prev) => prev + 1);
            }}
            incrementLinkClicks={() => {
              setKpiNumLinkClicks((prev) => prev + 1);
            }}
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
            toggleDrawer={toggleDrawer}
            visible={drawerVisible}
            onClickCallback={(songs) => onHistoryItemClick(songs)}
          />
          {loading ? <Loader /> : renderSwitch()}
        </>
      </div>
    </div>
  );
};

export default Curator;
