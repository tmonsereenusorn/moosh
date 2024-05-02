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
      />
  );
};

export default TryItCurator;
