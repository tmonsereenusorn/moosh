import axios from "axios";
import { db, firebaseAuth } from "./firebase";
import Cookies from "js-cookie";
import {
  collection,
  getDoc,
  getDocs,
  query,
  addDoc,
  doc,
  writeBatch,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { authenticate } from "./auth";
import { SPOTIFY_V1_URL } from "../constants";

/***** SETTERS *****/

// Takes in a prompt. Adds prompt to a user's prompts subcollection. Returns
// prompt doc id.
const addPrompt = async (prompt = "", conversation = "", prompt_id = null) => {
  const uid = firebaseAuth.currentUser?.uid;

  try {
    const promptObj = {
      prompt: prompt,
      timestamp: new Date().toISOString(),
      playlist: null,
      conversation: conversation
    };
    // If a prompt id is provdied, create the document with that ID.
    var promptRef;
    if (prompt_id) {
      await setDoc(doc(db, "users", uid, "prompts", prompt_id), promptObj);
    } else {
      promptRef = await addDoc(
        collection(db, "users", uid, "prompts"),
        promptObj
      );
      return promptRef.id;
    }
  } catch (error) {
    console.error("Error adding prompt to user: ", error);
  }
};

// Takes in a doc id. Updates the songs subcolleciton of the prompt. Returns
// songs colleciton id.
const updatePromptSongs = async (prompt_id = "", songs = []) => {
  const uid = firebaseAuth.currentUser?.uid;

  try {
    const batch = writeBatch(db);
    const songsRef = collection(
      db,
      "users",
      uid,
      "prompts",
      prompt_id.toString(),
      "songs"
    );

    // Put all songs in batch operation and commit together.
    for (var i in songs) {
      const newDocRef = doc(songsRef);
      const song = songs[i];
      const songObj = {
        id: song.id,
        artist: song.artist,
        title: song.title,
        duration: song.duration,
        preview: song.preview,
        uri: song.uri,
        url: song.url,
      };

      batch.set(newDocRef, songObj);
    }
    await batch.commit();
    return songsRef.id;
  } catch (error) {
    console.error("Error adding songs to prompt collection: ", error);
  }
};

// Takes a prompt id. Deletes prompt and all of its songs from database. Call
// then recreate on regeneration.
const deletePrompt = async (prompt_id = "") => {
  const uid = firebaseAuth.currentUser?.uid;

  try {
    const songsRef = collection(
      db,
      "users",
      uid,
      "prompts",
      prompt_id,
      "songs"
    );

    // Batch delete songs and prompt itself.
    const songsSnapshot = await getDocs(songsRef);
    const batch = writeBatch(db);
    songsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const promptRef = doc(db, "users", uid, "prompts", prompt_id);
    batch.delete(promptRef);
    batch.commit();
  } catch (error) {
    console.error("Failed to delete prompt: " + error);
  }
};

// Regenerates a prompt with new songs and the same prompt ID.
const updatePromptRegeneration = async (
  prompt = "",
  prompt_id = "",
  songs = []
) => {
  // Delete prompt
  await deletePrompt(prompt_id);
  // Add new prompt with the same ID
  await addPrompt(prompt, prompt_id);

  // Update songs.
  const songsId = updatePromptSongs(prompt_id, songs);
  return songsId;
};

// Takes playlist id, prompt id. Add an exported playlist a users playlist
// collection and add a reference to the playlist to the corresponding prompt.
// Returns playlist id.
const addExportedPlaylist = async (
  playlist_id = "",
  prompt_id = "",
  title = "",
  image_url = "",
  song_url = ""
) => {
  const uid = firebaseAuth.currentUser?.uid;

  try {
    // Add the playlist id to the user's playlist collection.
    const playlistRef = doc(
      db,
      "users",
      uid,
      "playlists",
      playlist_id.toString()
    );
    const playlistObj = {
      title: title,
      timestamp: new Date().toISOString(),
      image: image_url,
      url: song_url,
    };
    await setDoc(playlistRef, playlistObj);
    // Update the playlist id as a member of the corresponding prompt.
    const promptRef = doc(db, "users", uid, "prompts", prompt_id.toString());
    await updateDoc(promptRef, { playlist: `${playlist_id.toString()}` });
    return playlist_id;
  } catch (error) {
    console.error("Failed to add exported playlist: " + error);
  }
};

/***** GETTERS *****/
// Fetch all playlists in Moosh library from a user's Spotify.
const updateHistory = async () => {};

const getPromptsForUser = (setHistory, uid) => {
  try {
    const promptsRef = collection(db, "users", uid, "prompts");

    return onSnapshot(query(promptsRef), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setHistory(data);
    });
  } catch (error) {
    console.error("Failed to get prompts: " + error);
  }
};

const getSongsForPrompt = async (prompt_id = "") => {
  const uid = firebaseAuth.currentUser?.uid;

  try {
    const songsRef = collection(
      db,
      "users",
      uid,
      "prompts",
      prompt_id,
      "songs"
    );

    const songsSnapshot = await getDocs(songsRef);
    var res = [];
    songsSnapshot.forEach((doc) => {
      const data = doc.data();
      res.push(data);
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch songs for prompt: " + error);
  }
};

const getConversationForPrompt = async (prompt_id = "") => {
  const uid = firebaseAuth.currentUser?.uid;

  try {
    const promptRef = doc(
      db,
      "users",
      uid,
      "prompts",
      prompt_id
    );

    const promptSnapshot = await getDoc(promptRef);

    if (promptSnapshot.exists()) {
      return promptSnapshot.data().conversation;
    } else {
      console.log("No prompt document!");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch songs for prompt: " + error);
  }
}

const getPlaylistsForUser = (setPlaylists, uid) => {
  try {
    const playlistsRef = collection(db, "users", uid, "playlists");

    return onSnapshot(query(playlistsRef), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setPlaylists(data);
    });
  } catch (error) {
    console.error("Failed to get prompts: " + error);
  }
};

// Spotify
export const updatePlaylistDescription = async (playlist_id, description) => {
  await authenticate();
  const token = Cookies.get("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    },
  };

  try {
    await axios.put(
      `${SPOTIFY_V1_URL}/playlists/${playlist_id}`,
      { description: description },
      config
    );
    return 0;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

const updatePlaylistTitle = async (playlist_id, name) => {
  await authenticate();
  const token = Cookies.get("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    },
  };

  const uid = firebaseAuth.currentUser?.uid;

  try {
    await axios.put(
      `${SPOTIFY_V1_URL}/playlists/${playlist_id}`,
      { name: name },
      config
    );

    // Update Firestore after Spotify update success
    const playlistRef = doc(db, "users", uid, "playlists", playlist_id);
    await updateDoc(playlistRef, { title: name });

    return 0;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

const history = {
  addPrompt,
  updatePromptSongs,
  updatePromptRegeneration,
  deletePrompt,
  addExportedPlaylist,
  updateHistory,
  getPromptsForUser,
  getSongsForPrompt,
  getConversationForPrompt,
  getPlaylistsForUser,
  updatePlaylistDescription,
  updatePlaylistTitle,
};

export default history;
