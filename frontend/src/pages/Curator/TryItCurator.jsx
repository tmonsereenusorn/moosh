import React, { useState } from "react";

import CuratorComponent from "../../components/CuratorComponent";

const CuratorStages = Object.freeze({
  PROMPT: 0,
  CURATED: 1,
  EXPORTED: 2,
});

const TryItCurator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [recs, setRecs] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState({});
  const [curatorStage, setCuratorStage] = useState(CuratorStages.PROMPT);
  const [numSongs, setNumSongs] = useState(20);
  const [title, setTitle] = useState("");
  const [selectAllButton, setSelectAllButton] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <CuratorComponent
      tryItMode={true}
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
      numSongs={numSongs}
      setNumSongs={setNumSongs}
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
      />
  );
};

export default TryItCurator;
