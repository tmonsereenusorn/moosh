import React, { useState } from "react";

import CuratorComponent from "../../components/Curator";

const CuratorStages = Object.freeze({
  PROMPT: 0,
  CURATED: 1,
  EXPORTED: 2,
});

const TryItCurator = () => {
  const [prompt, setPrompt] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [recs, setRecs] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState({});
  const [curatorStage, setCuratorStage] = useState(CuratorStages.PROMPT);
  const [title, setTitle] = useState("");
  const [selectAllButton, setSelectAllButton] = useState(true);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
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

  return (
    <CuratorComponent
      tryItMode={true}
      prompt={prompt}
      setPrompt={setPrompt}
      synopsis={synopsis}
      setSynopsis={setSynopsis}
      loading={loading}
      setLoading={setLoading}
      recs={recs}
      setRecs={setRecs}
      selectedTracks={selectedTracks}
      setSelectedTracks={setSelectedTracks}
      curatorStage={curatorStage}
      setCuratorStage={setCuratorStage}
      title={title}
      setTitle={setTitle}
      selectAllButton={selectAllButton}
      setSelectAllButton={setSelectAllButton}
      description={description}
      setDescription={setDescription}
      url={url}
      setUrl={setUrl}
      historyDrawerVisible={historyDrawerVisible}
      setHistoryDrawerVisible={setHistoryDrawerVisible}
      settingsDrawerVisible={settingsDrawerVisible}
      setSettingsDrawerVisible={setSettingsDrawerVisible}
      settings={settings}
      setSettings={setSettings}
    />
  );
};

export default TryItCurator;
