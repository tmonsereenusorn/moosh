import React, { useEffect, useState } from "react";

import {
  getRecommendationsFromPrompt,
  getRecommendationsFromExistingTracks,
} from "../../api/recommendation";
import { exportPlaylist } from "../../api/exportPlaylist";
import { AudioProvider } from "../../contexts/AudioProvider";

import CuratorInput from "../../components/CuratorInput";
import TrackCard from "../../components/TrackCard";
import Loader from "../../components/Loader";
import { FaCircleCheck, FaChevronRight } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthProvider";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import ChoiceLayer from "../../components/ChoiceLayer";
import HistoryDrawer from "../../components/History/HistoryDrawer";
import {
  addExportedPlaylist,
  addPrompt,
  deletePrompt,
  getPromptsForUser,
  updatePromptSongs,
} from "../../api/history";

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

  // For firestore function calls.
  const [playlistIdState, setPlaylistIdState] = useState("");
  const [promptIdState, setPromptIdState] = useState("");
  const [historyData, setHistoryData] = useState([]);

  const onChangePrompt = (event) => {
    setPrompt(event.target.value);
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    sleep(200);
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getPromptsForUser();
    console.log("DATA: " + data);
    setHistoryData(data);
  };

  // Get recommendations, reset prompt.
  const onSubmit = async () => {
    setLoading(true);

    const unselectedCount = Object.values(selectedTracks).filter(
      (isSelected) => !isSelected
    ).length;

    // If there are unselected tracks, fetch new recommendations directly from spotify using kept tracks
    if (unselectedCount > 0) {
      const keptSongs = recs
        .filter((rec) => selectedTracks[rec.id])
        .map((rec) => rec.id);
      const blacklistedSongs = recs.map((track) => track.id);
      const newRecs = await getRecommendationsFromExistingTracks(
        keptSongs,
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

      // Update prompt's songs in firestore.
      await deletePrompt(promptIdState);
      const promptId = await addPrompt(prompt);
      const songsId = await updatePromptSongs(promptId, updatedSelections);

      // Apply the updated selection status.
      setSelectedTracks(updatedSelections);
    } else {
      // If all tracks are selected or no tracks have been generated yet, fetch a new set of recommendations
      const newRecs = await getRecommendationsFromPrompt(prompt, 20);

      const updatedNewRecs = newRecs.map((track, index) => ({
        ...track,
        isNew: false,
        displayOrder: index,
      }));

      const promptId = await addPrompt(prompt);
      const songsId = await updatePromptSongs(promptId, updatedNewRecs);
      setPromptIdState(promptId);
      setRecs(updatedNewRecs);

      const initialSelections = updatedNewRecs.reduce((acc, track) => {
        acc[track.id] = true;
        return acc;
      }, {});

      setSelectedTracks(initialSelections);
    }

    // Firestore updates.
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
  const onExport = async () => {
    setLoading(true);
    const data = await exportPlaylist({
      name: title,
      userId: user.id,
      songs: recs,
      description: description,
    });
    setPlaylistIdState(data.id);
    // Firestore update.
    await addExportedPlaylist(playlistIdState, promptIdState);

    setUrl(data.url);
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

  const toggleDrawer = () => {
    const drawer = document.getElementById("drawer");
    drawer?.classList.toggle("-translate-x-full");
  };

  const testHistory = async () => {
    const testSongs = [
      {
        artist: "George Benson",
        duration: "5m 41s",
        id: "1m3BAsNsQAaSNMD2M6vlKY",
        preview:
          "https://p.scdn.co/mp3-preview/9fdd27aa36c177a509f99abedbb941aadaa915f0?cid=aec032c67a054b5195e97348dea395e5",
        title: "Breezin'",
        uri: "spotify:track:1m3BAsNsQAaSNMD2M6vlKY",
        url: "https://open.spotify.com/track/1m3BAsNsQAaSNMD2M6vlKY",
        isNew: false,
        displayOrder: 0,
      },
      {
        artist: "Global Communication",
        duration: "5m 23s",
        id: "2RV7JBwjOaixnJwsSAUYEG",
        preview: null,
        title: "5 23",
        uri: "spotify:track:2RV7JBwjOaixnJwsSAUYEG",
        url: "https://open.spotify.com/track/2RV7JBwjOaixnJwsSAUYEG",
        isNew: false,
        displayOrder: 1,
      },
      {
        artist: "Spyro Gyra",
        duration: "4m 51s",
        id: "7DaMc5geC3tDco5ejhXqw3",
        preview: null,
        title: "Shaker Song",
        uri: "spotify:track:7DaMc5geC3tDco5ejhXqw3",
        url: "https://open.spotify.com/track/7DaMc5geC3tDco5ejhXqw3",
        isNew: false,
        displayOrder: 2,
      },
      {
        artist: "Frank Ocean",
        duration: "2m 13s",
        id: "4S4Mfvv03M1cHgIOJcbUCL",
        preview:
          "https://p.scdn.co/mp3-preview/a23f4faaefc0b1105bd70e3e46189bcf930dcd42?cid=aec032c67a054b5195e97348dea395e5",
        title: "In My Room",
        uri: "spotify:track:4S4Mfvv03M1cHgIOJcbUCL",
        url: "https://open.spotify.com/track/4S4Mfvv03M1cHgIOJcbUCL",
        isNew: false,
        displayOrder: 3,
      },
      {
        artist: "Air",
        duration: "7m 6s",
        id: "3ZzhV6JIDKWvWR7wiKWD0C",
        preview:
          "https://p.scdn.co/mp3-preview/037b566893a28d0855e119ae60134ee59d22e0ea?cid=aec032c67a054b5195e97348dea395e5",
        title: "La femme d'argent",
        uri: "spotify:track:3ZzhV6JIDKWvWR7wiKWD0C",
        url: "https://open.spotify.com/track/3ZzhV6JIDKWvWR7wiKWD0C",
        isNew: false,
        displayOrder: 4,
      },
      {
        artist: "The Bad Plus",
        duration: "4m 4s",
        id: "73dk1Hmi0bDX9IMYISFuac",
        preview:
          "https://p.scdn.co/mp3-preview/a59a0583acd8aa3527d48cb02621ded9086bccd6?cid=aec032c67a054b5195e97348dea395e5",
        title: "Flim",
        uri: "spotify:track:73dk1Hmi0bDX9IMYISFuac",
        url: "https://open.spotify.com/track/73dk1Hmi0bDX9IMYISFuac",
        isNew: false,
        displayOrder: 5,
      },
      {
        artist: "Aphex Twin",
        duration: "2m 57s",
        id: "4YvnrZMF1VmTAZIJlBhvCg",
        preview: null,
        title: "Flim",
        uri: "spotify:track:4YvnrZMF1VmTAZIJlBhvCg",
        url: "https://open.spotify.com/track/4YvnrZMF1VmTAZIJlBhvCg",
        isNew: false,
        displayOrder: 6,
      },
      {
        artist: "Global Communication",
        duration: "8m 7s",
        id: "4XTkUcapS6M4jok4ExAj8C",
        preview: null,
        title: "8:07",
        uri: "spotify:track:4XTkUcapS6M4jok4ExAj8C",
        url: "https://open.spotify.com/track/4XTkUcapS6M4jok4ExAj8C",
        isNew: false,
        displayOrder: 7,
      },
      {
        artist: "Herbie Hancock",
        duration: "15m 41s",
        id: "4Ce66JznW8QbeyTdSzdGwR",
        preview:
          "https://p.scdn.co/mp3-preview/b377de79d3feccc6b10115659358cec4f0a70375?cid=aec032c67a054b5195e97348dea395e5",
        title: "Chameleon",
        uri: "spotify:track:4Ce66JznW8QbeyTdSzdGwR",
        url: "https://open.spotify.com/track/4Ce66JznW8QbeyTdSzdGwR",
        isNew: false,
        displayOrder: 8,
      },
      {
        artist: "Charles Earland",
        duration: "11m 13s",
        id: "0hY1lriPizkVAlt4XXx1pG",
        preview: null,
        title: "More Today Than Yesterday - Instrumental",
        uri: "spotify:track:0hY1lriPizkVAlt4XXx1pG",
        url: "https://open.spotify.com/track/0hY1lriPizkVAlt4XXx1pG",
        isNew: false,
        displayOrder: 9,
      },
      {
        artist: "Current Joys",
        duration: "3m 14s",
        id: "7sIx70dGj3VBiHWr0KZXfD",
        preview:
          "https://p.scdn.co/mp3-preview/a40c1254500ab382d313fae73aa441b8826fec72?cid=aec032c67a054b5195e97348dea395e5",
        title: "Blondie",
        uri: "spotify:track:7sIx70dGj3VBiHWr0KZXfD",
        url: "https://open.spotify.com/track/7sIx70dGj3VBiHWr0KZXfD",
        isNew: false,
        displayOrder: 10,
      },
      {
        artist: "Bonobo",
        duration: "3m 57s",
        id: "7Cg3F9ZsZ2TYUnlza49NYh",
        preview:
          "https://p.scdn.co/mp3-preview/5d4ca824dabf031ca06a259fae5468f1433a8220?cid=aec032c67a054b5195e97348dea395e5",
        title: "Kong",
        uri: "spotify:track:7Cg3F9ZsZ2TYUnlza49NYh",
        url: "https://open.spotify.com/track/7Cg3F9ZsZ2TYUnlza49NYh",
        isNew: false,
        displayOrder: 11,
      },
      {
        artist: "Burial",
        duration: "4m 2s",
        id: "63FmCXIc4lmEq9fNqGkQ57",
        preview: null,
        title: "Archangel",
        uri: "spotify:track:63FmCXIc4lmEq9fNqGkQ57",
        url: "https://open.spotify.com/track/63FmCXIc4lmEq9fNqGkQ57",
        isNew: false,
        displayOrder: 12,
      },
      {
        artist: "Bill Evans",
        duration: "3m 53s",
        id: "1I9w37PCOuGG1ppYc2TmFS",
        preview: null,
        title: "I Love You",
        uri: "spotify:track:1I9w37PCOuGG1ppYc2TmFS",
        url: "https://open.spotify.com/track/1I9w37PCOuGG1ppYc2TmFS",
        isNew: false,
        displayOrder: 13,
      },
      {
        artist: "Tycho",
        duration: "5m 16s",
        id: "5MSfgtOBZkbxlcwsI9XNpf",
        preview: null,
        title: "A Walk",
        uri: "spotify:track:5MSfgtOBZkbxlcwsI9XNpf",
        url: "https://open.spotify.com/track/5MSfgtOBZkbxlcwsI9XNpf",
        isNew: false,
        displayOrder: 14,
      },
      {
        artist: "Télépopmusik",
        duration: "4m 56s",
        id: "46LwAOzg3UYvxiXyyaFedz",
        preview: null,
        title: "Breathe",
        uri: "spotify:track:46LwAOzg3UYvxiXyyaFedz",
        url: "https://open.spotify.com/track/46LwAOzg3UYvxiXyyaFedz",
        isNew: false,
        displayOrder: 15,
      },
      {
        artist: "A$AP Rocky",
        duration: "3m 42s",
        id: "6J9FgTr3z44Bw6ABeVL415",
        preview:
          "https://p.scdn.co/mp3-preview/1e38e9a8e64667d113d21ef96fece18c6ebde36e?cid=aec032c67a054b5195e97348dea395e5",
        title: "Pharsyde (feat. Joe Fox)",
        uri: "spotify:track:6J9FgTr3z44Bw6ABeVL415",
        url: "https://open.spotify.com/track/6J9FgTr3z44Bw6ABeVL415",
        isNew: false,
        displayOrder: 16,
      },
      {
        artist: "Tame Impala",
        duration: "3m 10s",
        id: "1JpcqmUlzNlK7lpFOkszzv",
        preview: null,
        title: "Beverly Laurel",
        uri: "spotify:track:1JpcqmUlzNlK7lpFOkszzv",
        url: "https://open.spotify.com/track/1JpcqmUlzNlK7lpFOkszzv",
        isNew: false,
        displayOrder: 17,
      },
      {
        artist: "AES DANA",
        duration: "6m 53s",
        id: "7swx5xLemJWVosynhueQ4Z",
        preview: null,
        title: "Anthrazit",
        uri: "spotify:track:7swx5xLemJWVosynhueQ4Z",
        url: "https://open.spotify.com/track/7swx5xLemJWVosynhueQ4Z",
        isNew: false,
        displayOrder: 18,
      },
      {
        artist: "Bill Evans",
        duration: "6m 30s",
        id: "2bnLeDamjX83qXbrgItDT2",
        preview: null,
        title: "I'll Never Smile Again - Album Version - (take 7)",
        uri: "spotify:track:2bnLeDamjX83qXbrgItDT2",
        url: "https://open.spotify.com/track/2bnLeDamjX83qXbrgItDT2",
        isNew: false,
        displayOrder: 19,
      },
    ];
    const prompt = "testing prompt";
    var prompt_id = await addPrompt("THIS PROMPT STAYS");
    console.log("'" + prompt + "'" + " added: " + prompt_id);
    const songs_id = await updatePromptSongs(prompt_id, testSongs);

    console.log("deleting in Curator");
    var delete_id = await addPrompt("THIS PROMPT IS DELETED");
    await deletePrompt(delete_id);

    const dummy_id = "DUMMY ID";
    const playlist_id = addExportedPlaylist(dummy_id, prompt_id);

    const prompts = getPromptsForUser();
    console.log(prompts);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex w-2/3 items-center justify-center">
        <div
          className="fixed top-[30vh] flex w-24 h-12 bg-primary hover:cursor-pointer"
          onClick={() => testHistory()}
        >
          TEST HISTORY
        </div>
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
          <div className="flex flex-col w-3/4 h-[100vh] pt-14 pb-24">
            {recs.length > 0 && (
              <div className="w-full items-center justify-center p-2">
                <div className="text-2xl font-bold text-surface text-center">
                  {prompt}
                </div>
              </div>
            )}
            <div className="flex-grow overflow-y-auto">
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
          </div>
        )}
        {recs.length && !exported > 0 && !loading ? (
          <div
            className={`fixed bottom-0 flex h-24 w-2/3 bg-white items-center justify-center p-[32px] space-x-4`}
          >
            <ChoiceLayer
              onGenerate={onExport}
              onRegenerate={onSubmit}
              onCancel={onReset}
              onChangeTitle={onChangeTitle}
              disabled={title.length === 0}
            />
          </div>
        ) : !exported && !loading ? (
          <>
            <div className="absolute left-2 top-1/2">
              <FaChevronRight
                className="text-surface scale-150 hover:cursor-pointer"
                onClick={toggleDrawer}
              />
            </div>
            <HistoryDrawer onClose={toggleDrawer} historyData={historyData} />
            <div className="fixed bottom-[45vh] w-1/2 justify-center items-center">
              <CuratorInput
                onSubmit={onSubmit}
                value={prompt}
                onChangeText={(event) => onChangePrompt(event)}
                disabled={prompt.length === 0}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Curator;
