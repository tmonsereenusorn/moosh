import React, { useEffect, useState } from "react";
import {
  getRecommendationsFromPrompt,
  getRecommendationsFromExistingTracks,
} from "../../api/recommendation";
import { exportPlaylist } from "../../api/playlist";
import Loader from "../Loader";
import HistoryDrawer from "../History/HistoryDrawer";
import history from "../../api/history";
import kpis from "../../api/kpis";

import PromptView from "./views/PromptView";
import CuratedView from "./views/CuratedView";
import FailedView from "./views/FailedView";
import { ExportedAlert } from "../ExportedAlert";

const CuratorStages = Object.freeze({
  PROMPT: 0,
  CURATED: 1,
  FAILED: 2,
});

const CuratorComponent = ({
  tryItMode,
  prompt,
  setPrompt,
  synopsis,
  setSynopsis,
  reprompt,
  setReprompt,
  loading,
  setLoading,
  recs,
  setRecs,
  selectedTracks,
  setSelectedTracks,
  url,
  setUrl,
  title,
  setTitle,
  description,
  setDescription,
  selectAllButton,
  setSelectAllButton,
  settingsDrawerVisible,
  setSettingsDrawerVisible,
  promptIdState,
  setPromptIdState,
  historyDrawerVisible,
  setHistoryDrawerVisible,
  settings,
  setSettings,
  user = null,
}) => {
  const [sessionId, setSessionId] = useState("");
  const [curatorStage, setCuratorStage] = useState(CuratorStages.PROMPT);

  // KPI specific state.
  const [kpiNumKeystrokes, setKpiNumKeystrokes] = useState(0);
  const [kpiNumToggles, setKpiNumToggles] = useState(0);
  const [kpiNumPreviewPlays, setKpiNumPreviewPlays] = useState(0);
  const [kpiNumLinkClicks, setKpiNumLinkClicks] = useState(0);
  const [kpiNumToggleAlls, setKpiNumToggleAlls] = useState(0);
  const [kpiNumRegenerations, setKpiNumRegenerations] = useState(0);

  const [exportedAlertVisible, setExportedAlertVisible] = useState(false);

  useEffect(() => {
    const sessionWrapper = async (tryItMode) => {
      const id = await kpis.logSession(tryItMode);
      setSessionId(id);
      return id;
    };
    // If there's no visited token, log the session.
    if (!sessionStorage.getItem("visited")) {
      sessionStorage.setItem("visited", true);
      sessionWrapper(tryItMode);
    }
  }, [tryItMode]);

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
  };

  const onChangeReprompt = (event) => {
    setReprompt(event.target.value);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const resetRegenerationKpis = () => {
    setKpiNumToggles(0);
    setKpiNumPreviewPlays(0);
    setKpiNumLinkClicks(0);
    setKpiNumToggleAlls(0);
  };

  // Get recommendations, reset prompt.
  const onSubmit = async (regeneration = false, reprompting = false) => {
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
      const regeneratedSettings = {
        ...settings,
        numSongs: unselectedCount,
      };
      const newRecs = await getRecommendationsFromExistingTracks(
        keptSongs,
        regeneratedSettings,
        blacklistedSongs,
        !tryItMode
      );

      if (newRecs.length === 0) {
        setLoading(false);
        setCuratorStage(CuratorStages.FAILED);
        return;
      }

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

      if (!tryItMode) {
        history.updatePromptRegeneration(prompt, promptIdState, [
          ...updatedNewRecs,
          ...filteredRecs,
        ]);
      }

      // Apply the updated selection status.
      setSelectedTracks(updatedSelections);

      // Log regeneration, returns document ID.
      kpis.logRegeneration(
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
      let synopsis, newRecs, conversation;
      if (reprompting) {
        // If reprompting, fetch current conversation
        const currConversation = await history.getConversationForPrompt(
          promptIdState
        );
        ({
          synopsis,
          recs: newRecs,
          conversation,
        } = await getRecommendationsFromPrompt(
          reprompt,
          settings,
          currConversation,
          !tryItMode
        ));
        setReprompt("");
      } else {
        ({
          synopsis,
          recs: newRecs,
          conversation,
        } = await getRecommendationsFromPrompt(
          prompt,
          settings,
          null,
          !tryItMode
        ));
      }

      if (newRecs.length === 0) {
        setLoading(false);
        setCuratorStage(CuratorStages.FAILED);
        return;
      }

      setSynopsis(synopsis);

      const updatedNewRecs = newRecs.map((track, index) => ({
        ...track,
        isNew: false,
        displayOrder: index,
      }));

      var promptId;
      if (!tryItMode) {
        promptId = await history.addPrompt(prompt, conversation);
        await history.updatePromptSongs(promptId, updatedNewRecs);
        setPromptIdState(promptId);
      }
      setRecs(updatedNewRecs);

      const initialSelections = updatedNewRecs.reduce((acc, track) => {
        acc[track.id] = true;
        return acc;
      }, {});

      setSelectedTracks(initialSelections);

      // Log prompting. Returns document ID.
      kpis.logPrompt(
        kpiNumKeystrokes,
        settings.numSongs,
        prompt.length,
        promptId,
        settings,
        sessionId
      );
    }

    if (!tryItMode) {
      setDescription(prompt);
    }
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

      return newSelectedTracks;
    });
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

    setKpiNumKeystrokes(0);
    setKpiNumPreviewPlays(0);
    setKpiNumToggles(0);
    setKpiNumRegenerations(0);
    resetRegenerationKpis();
  };

  const toggleSettingsDrawer = () => {
    if (historyDrawerVisible) toggleHistoryDrawer();
    setSettingsDrawerVisible((visibility) => !visibility);
    const drawer = document.getElementById("settingsDrawer");
    drawer?.classList.toggle("translate-y-full");
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
            settings={settings}
            setSettings={setSettings}
          />
        );
      case CuratorStages.CURATED:
        return (
          <CuratedView
            recs={recs}
            prompt={prompt}
            synopsis={synopsis}
            reprompt={reprompt}
            onExport={onExport}
            onSubmit={onSubmit}
            onReset={onReset}
            onChangeTitle={onChangeTitle}
            onChangeReprompt={onChangeReprompt}
            title={title}
            selectedTracks={selectedTracks}
            toggleTrackSelection={toggleTrackSelection}
            selectAllButton={selectAllButton}
            toggleSelectAllButton={toggleSelectAllButton}
            getSelectedCount={getSelectedCount}
            getUnselectedCount={getUnselectedCount}
            tryItMode={tryItMode}
            settings={settings}
            setSettings={setSettings}
            previewCallback={() => setKpiNumPreviewPlays((prev) => prev + 1)}
            linkCallback={() => setKpiNumLinkClicks((prev) => prev + 1)}
          />
        );
      case CuratorStages.FAILED:
        return (
          <FailedView
            onSubmit={onSubmit}
            onReset={onReset}
            regenerating={Object.values(selectedTracks).includes(false)}
          />
        );
      default:
        return null;
    }
  };

  // Functions specific to *not* tryItMode
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const displayExportedAlert = async () => {
    setExportedAlertVisible(true);
    await sleep(5000);
    setExportedAlertVisible(false);
  };

  // Force close exported alert.
  const closeExportedAlert = () => {
    setExportedAlertVisible(false);
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
    setPrompt("");
    setLoading(false);
    setCuratorStage(CuratorStages.PROMPT);
    displayExportedAlert();
  };

  const toggleHistoryDrawer = () => {
    if (settingsDrawerVisible) toggleSettingsDrawer();
    setHistoryDrawerVisible((visibility) => !visibility);
    const drawer = document.getElementById("historyDrawer");
    const drawerToggle = document.getElementById("historyDrawerToggle");
    drawer?.classList.toggle("-translate-x-full");
    drawerToggle?.classList.toggle("translate-x-full");
    drawerToggle?.classList.toggle("w-2/3");
  };

  const onHistoryItemClick = (songs, item) => {
    console.log(item);
    setRecs(songs);
    setPrompt(item.prompt);
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        numSongs: songs.length,
      };
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

  return (
    <div className="h-screen flex items-center justify-center overflow-y-hidden">
      <div className="flex w-full items-center justify-center">
        <>
          {!tryItMode && window.innerWidth >= 640 && (
            <>
              <ExportedAlert
                visible={exportedAlertVisible}
                url={url}
                closeCallback={closeExportedAlert}
                title={title}
              />
              <HistoryDrawer
                toggleDrawer={toggleHistoryDrawer}
                visible={historyDrawerVisible}
                onClickCallback={(songs, item) =>
                  onHistoryItemClick(songs, item)
                }
              />
            </>
          )}
          {loading ? <Loader /> : renderSwitch()}
        </>
      </div>
    </div>
  );
};

export default CuratorComponent;
