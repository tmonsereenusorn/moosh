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
  const [selectedTracks, setSelectedTracks] = useState({});

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  // Get recommendations, reset prompt.
  const onSubmit = async () => {
    setLoading(true);

    const unselectedCount = Object.values(selectedTracks).filter(
      (isSelected) => !isSelected
    ).length;
    // If there are unselected tracks, fetch new recommendations for those tracks only
    if (unselectedCount > 0) {
      const blacklistedSongs = recs.map((track) => track.id);
      const newRecs = await getRecommendations(
        prompt,
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

      // Apply the updated selection status.
      setSelectedTracks(updatedSelections);
    } else {
      // If all tracks are selected or no tracks have been generated yet, fetch a new set of recommendations
      const newRecs = await getRecommendations(prompt, 20);

      const updatedNewRecs = newRecs.map((track, index) => ({
        ...track,
        isNew: false,
        displayOrder: index,
      }));

      setRecs(updatedNewRecs);

      const initialSelections = updatedNewRecs.reduce((acc, track) => {
        acc[track.id] = true;
        return acc;
      }, {});

      setSelectedTracks(initialSelections);
    }

    setDescription(prompt);
    setLoading(false);
  };

  const toggleTrackSelection = (id) => {
    setSelectedTracks((prevSelectedTracks) => ({
      ...prevSelectedTracks,
      [id]: !prevSelectedTracks[id],
    }));
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
    setPrompt("");
    setLoading(false);
    setExported(true);
  };

  // Clear states and return to prompting view.
  const onReset = async () => {
    setRecs([]);
    setSelectedTracks({});
    setTitle("");
    setDescription("");
    setPrompt("");
    setLoading(false);
    setExported(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex w-2/3 items-center justify-center border-2">
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
          <div className="w-3/4 pt-16 pb-24">
            <AudioProvider>
              {recs.map((recommendation) => {
                return (
                  <TrackCard
                    key={recommendation.id}
                    artist={recommendation.artist}
                    title={recommendation.title}
                    duration={recommendation.duration}
                    preview={recommendation.preview}
                    uri={recommendation.uri}
                    url={recommendation.url}
                    isSelected={selectedTracks[recommendation.id]}
                    isNew={recommendation.isNew}
                    onToggleSelection={() =>
                      toggleTrackSelection(recommendation.id)
                    }
                  />
                );
              })}
            </AudioProvider>
          </div>
        )}
        {recs.length && !exported > 0 && !loading ? (
          <div
            className={`fixed bottom-0 flex h-24 w-2/3 bg-white items-center justify-center p-[32px] space-x-4 border-2`}
          >
            <ChoiceLayer
              onGenerate={onGenerate}
              onRegenerate={onSubmit}
              onCancel={onReset}
              onChangeTitle={onChangeTitle}
              disabled={title.length === 0}
            />
          </div>
        ) : !exported && !loading ? (
          <div className="flex w-1/2 justify-center items-center">
            <CuratorInput
              onSubmit={onSubmit}
              value={prompt}
              onChangeText={(event) => onChangePrompt(event)}
              disabled={prompt.length === 0}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Curator;
