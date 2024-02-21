import React, { useState } from "react";

import { getRecommendations } from "../../api/recommendation";
import { generatePlaylist } from "../../api/generatePlaylist";
import { AudioProvider } from "../../contexts/AudioProvider";

import CuratorInput from "../../components/CuratorInput";
import TrackCard from "../../components/TrackCard";
import Loader from "../../components/Loader";
import { FaCircleCheck } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthProvider";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import ChoiceLayer from "../../components/ChoiceLayer";

const Curator = () => {
  const { user } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [exported, setExported] = useState(false); // For rendering a final view after sending playlist to Spotify.
  const [recs, setRecs] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  // Get recommendations, reset prompt.
  const onSubmit = async () => {
    setLoading(true);
    const recs = await getRecommendations(prompt);
    // Don't finish the recs if user cancels during generation.
    loading ? setRecs(recs) : setRecs([]);
    setDescription(prompt);
    setPrompt("");
    setLoading(false);
  };

  // Generate the playlist to Spotify, change view to signal playlist creation.
  const onGenerate = async () => {
    setLoading(true);
    const url = await generatePlaylist({
      name: title,
      userId: user.id,
      songs: recs,
      description: description,
    });
    setUrl(url);
    setLoading(false);
    setExported(true);
  };

  // Clear states and return to prompting view.
  const onReset = async () => {
    setRecs([]);
    setTitle("");
    setDescription("");
    setLoading(false);
    setExported(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-2/3 items-end justify-center">
        <div className="pt-20 mb-32">
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
            <AudioProvider>
              {recs.map((recommendation) => {
                return (
                  <TrackCard
                    key={recommendation.uri}
                    artist={recommendation.artist}
                    title={recommendation.title}
                    duration={recommendation.duration}
                    preview={recommendation.preview}
                    uri={recommendation.uri}
                    url={recommendation.url}
                  />
                );
              })}
            </AudioProvider>
          )}
        </div>
        <div className="fixed flex bottom-0 h-20 w-2/3 bg-white items-center justify-center p-[32px] space-x-4">
          {recs.length && !exported > 0 ? (
            <ChoiceLayer
              onGenerate={onGenerate}
              onRegenerate={onSubmit}
              onCancel={onReset}
              onChangeTitle={onChangeTitle}
              disabled={title.length === 0}
            />
          ) : !exported ? (
            <CuratorInput
              onSubmit={onSubmit}
              value={prompt}
              onChangeText={(event) => onChangePrompt(event)}
              disabled={prompt.length === 0}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Curator;
