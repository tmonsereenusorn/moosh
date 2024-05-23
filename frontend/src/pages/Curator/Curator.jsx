import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";

import CuratorComponent from "../../components/Curator";

const Curator = () => {
  const [prompt, setPrompt] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [reprompt, setReprompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [recs, setRecs] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState({});
  const [title, setTitle] = useState("");
  const [selectAllButton, setSelectAllButton] = useState(true);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const { user } = useAuth();

  // For firestore function calls.
  const [promptIdState, setPromptIdState] = useState("");
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

  const [settings, setSettings] = useState({
    numSongs: 20,
    gpt4: false,
    danceability: {
      enabled: false,
      threshold: 5,
    },
    energy: {
      enabled: false,
      threshold: 5,
    },
    acousticness: {
      enabled: false,
      threshold: 5,
    },
  });

  return (
    <CuratorComponent
      tryItMode={false}
      prompt={prompt}
      setPrompt={setPrompt}
      synopsis={synopsis}
      setSynopsis={setSynopsis}
      reprompt={reprompt}
      setReprompt={setReprompt}
      loading={loading}
      setLoading={setLoading}
      recs={recs}
      setRecs={setRecs}
      selectedTracks={selectedTracks}
      setSelectedTracks={setSelectedTracks}
      title={title}
      setTitle={setTitle}
      selectAllButton={selectAllButton}
      setSelectAllButton={setSelectAllButton}
      description={description}
      setDescription={setDescription}
      url={url}
      setUrl={setUrl}
      user={user}
      promptIdState={promptIdState}
      setPromptIdState={setPromptIdState}
      historyDrawerVisible={historyDrawerVisible}
      setHistoryDrawerVisible={setHistoryDrawerVisible}
      settingsDrawerVisible={settingsDrawerVisible}
      setSettingsDrawerVisible={setSettingsDrawerVisible}
      settings={settings}
      setSettings={setSettings}
    />
  );
};

export default Curator;
