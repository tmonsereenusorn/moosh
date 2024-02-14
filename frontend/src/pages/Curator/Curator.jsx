import React, { useState } from "react";
import { getRecommendations } from "../../api/recommendation";
import { AudioProvider } from "../../contexts/AudioProvider";

import CuratorInput from "../../components/CuratorInput";
import TrackCard from "../../components/TrackCard";
import Loader from "../../components/Loader";

const Curator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [recs, setRecs] = useState([]);
  const [description, setDescription] = useState("");
  const [playlistName, setPlaylistName] = useState("");

  const onChangeText = (event) => {
    setPrompt(event.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    const recs = await getRecommendations(prompt);
    setRecs(recs);
    setDescription(prompt);
    setPrompt("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-2/3 items-end justify-center">
        <div className="pt-20 mb-32">
          {loading ? (
            <Loader />
          ) : (
            <AudioProvider>
              {recs.map(recommendation => {
                return <TrackCard
                          key={recommendation.uri}
                          artist={recommendation.artist}
                          title={recommendation.title}
                          duration={recommendation.duration}
                          preview={recommendation.preview}
                          uri={recommendation.uri}
                          url={recommendation.url}
                        />
              })}
            </AudioProvider>
          )}
        </div>
        <div className="fixed bottom-0 w-2/3 bg-white">
          <CuratorInput
            onSubmit={onSubmit}
            value={prompt}
            onChangeText={(event) => onChangeText(event)}
            disabled={prompt.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Curator;
