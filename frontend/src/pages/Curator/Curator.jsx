import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";

import CuratorComponent from "../../components/CuratorComponent";

const CuratorStages = Object.freeze({
  PROMPT: 0,
  CURATED: 1,
  EXPORTED: 2,
});

const Curator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [recs, setRecs] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState({});
  const [title, setTitle] = useState("");
  const [selectAllButton, setSelectAllButton] = useState(true);
  const [curatorStage, setCuratorStage] = useState(CuratorStages.PROMPT);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const { user } = useAuth();

  // For firestore function calls.
  const [promptIdState, setPromptIdState] = useState("");
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
      tryItMode={false}
      prompt={prompt}
      setPrompt={setPrompt}
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
      isSettingsOpen={isSettingsOpen}
      setIsSettingsOpen={setIsSettingsOpen}
      description={description}
      setDescription={setDescription}
      url={url}
      setUrl={setUrl}
      user={user}
      promptIdState={promptIdState}
      setPromptIdState={setPromptIdState}
      drawerVisible={drawerVisible}
      setDrawerVisible={setDrawerVisible}
      />
  );
};

export default Curator;