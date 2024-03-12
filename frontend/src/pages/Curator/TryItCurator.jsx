import React, { useState } from "react";

import { getRecommendations } from "../../api/recommendation";
import { AudioProvider } from "../../contexts/AudioProvider";

import CuratorInput from "../../components/CuratorInput";
import TrackCard from "../../components/TrackCard";
import Loader from "../../components/Loader";
import ChoiceLayer from "../../components/ChoiceLayer";

const TryItCurator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // For rendering a loading view while waiting for recommendations.
  const [recs, setRecs] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState({});

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
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

    setLoading(false);
  };

  const toggleTrackSelection = (id) => {
    setSelectedTracks((prevSelectedTracks) => ({
      ...prevSelectedTracks,
      [id]: !prevSelectedTracks[id],
    }));
  };

  // Clear states and return to prompting view.
  const onReset = async () => {
    setRecs([]);
    setSelectedTracks({});
    setPrompt("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex w-2/3 items-center justify-center">
        {loading ? (
          <Loader />
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
        {recs.length && !loading ? (
          <div
            className={`fixed bottom-0 flex h-24 w-2/3 bg-white items-center justify-center p-[32px] space-x-4`}
          >
            <ChoiceLayer
              onRegenerate={onSubmit}
              onCancel={onReset}
            />
          </div>
        ) : !loading ? (
            <div className="fixed bottom-[45vh] w-1/2 justify-center items-center">
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

export default TryItCurator;
