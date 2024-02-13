import React, { useEffect, useState } from "react";
import { getRecommendations } from "../../api/recommendation";
import { AudioProvider } from "../../contexts/AudioProvider";

import CuratorInput from "../../components/CuratorInput";
import TrackCard from "../../components/TrackCard";
import Loader from "../../components/LoadingOverlay";
import { useAuth } from "../../contexts/AuthProvider";
import { Button, Input, Stack } from "@chakra-ui/react";
import { generatePlaylist } from "../../api/generatePlaylist";
import { ButtonPrimary } from "../../components/ButtonPrimary";

const Curator = () => {
  const { user } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [exported, setExported] = useState(false); // For rendering a final view after sending playlist to Spotify.
  const [recs, setRecs] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    const recs = await getRecommendations(prompt);
    setRecs(recs);
    setDescription(prompt);
    setPrompt("");
    setLoading(false);
  };

  const onGenerate = async () => {
    setLoading(true);
    console.log("title: " + title);
    const snapshot = await generatePlaylist({
      name: title,
      userId: user.id,
      songs: recs,
    });
    setLoading(false);
    setExported(true);
  };

  const onCancel = async () => {
    setRecs([]);
  };

  const onReset = async () => {
    setRecs([]);
    setTitle("");
    setExported(false);
    setPrompt("");
  };

  useEffect(() => {
    console.log("exported: " + exported);
    console.log("loading: " + loading);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-2/3 items-end justify-center">
        <div className="pt-20 mb-32">
          {loading ? (
            <Loader />
          ) : exported ? (
            <div>
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
        <div className="fixed flex bottom-0 h-20 w-2/3 bg-white border-2 items-center justify-center">
          {recs.length > 0 ? (
            <div className="flex flex-row space-between">
              <Input
                placeholder={"Name your playlist"}
                value={title}
                onChange={(event) => onChangeTitle(event)}
              />
              <ButtonPrimary
                text={"Send to Spotify"}
                onClick={() => onGenerate()}
                size={"md"}
              />
              <ButtonPrimary text={"Cancel"} onClick={() => onCancel()} />
            </div>
          ) : (
            <CuratorInput
              onSubmit={onSubmit}
              value={prompt}
              onChangeText={(event) => onChangePrompt(event)}
              disabled={prompt.length === 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Curator;
